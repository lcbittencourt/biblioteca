package com.superdev.biblioteca.services;

import com.superdev.biblioteca.dtos.EmprestimoRenovarDto;
import com.superdev.biblioteca.models.Emprestimo;
import com.superdev.biblioteca.models.StatusEmprestimo;
import com.superdev.biblioteca.repositories.EmprestimoRepository;
import com.superdev.biblioteca.repositories.LeitorRepository;
import com.superdev.biblioteca.repositories.LivroRepository;
import com.superdev.biblioteca.dtos.EmprestimoCriarDto;
import com.superdev.biblioteca.models.Leitor;
import com.superdev.biblioteca.models.Livro;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class EmprestimoService {
    private final EmprestimoRepository emprestimoRepository;
    private final LeitorRepository leitorRepository;
    private final LivroRepository livroRepository;

    public EmprestimoService(
            EmprestimoRepository emprestimoRepository,
            LeitorRepository leitorRepository,
            LivroRepository livroRepository
    ){
        this.emprestimoRepository = emprestimoRepository;
        this.leitorRepository = leitorRepository;
        this.livroRepository = livroRepository;
    }

    public boolean verificarPermissao(Integer leitorId){
        Leitor leitor = buscarLeitor(leitorId);
        if(!leitor.isAtivo()) {
            return false;
        }

        return !emprestimoRepository
                .existsByLeitorIdAndStatusAndDataPrevistaDevolucaoBefore(
                        leitorId,
                        StatusEmprestimo.ATIVO,
                        LocalDate.now()
                );
    }

    @Transactional
    public Emprestimo retirar(EmprestimoCriarDto dado){
        validarPrazo(dado.prazoDias());

        Leitor leitor = buscarLeitor(dado.leitorId());

        if (!verificarPermissao(leitor.getId())){
            throw new IllegalStateException(
                    "Leitor proibido de realizar empréstimo"
            );
        }

        Livro livro = livroRepository.findById(dado.livroId()).orElseThrow(() ->
                new RuntimeException("Livro não encontrado"));

        if (!livro.isAtivo() || livro.getQuantidade() <= 0){
            throw new IllegalStateException(
                    "Livro indisponível para empréstimo"
            );
        }

        LocalDate dataAtual = LocalDate.now();

        Emprestimo emprestimo = Emprestimo.builder()
                .leitor(leitor)
                .livro(livro)
                .dataEmprestimo(dataAtual)
                .dataPrevistaDevolucao(dataAtual.plusDays(dado.prazoDias()))
                .status(StatusEmprestimo.ATIVO)
                .build();

        livro.setQuantidade(livro.getQuantidade() - 1);
        livroRepository.save(livro);

        return emprestimoRepository.save(emprestimo);
    }

    public List<Emprestimo> listarAtivosDoLeitor(
            Integer leitorId
    ){
        buscarLeitor(leitorId);

        return emprestimoRepository.findByLeitorIdAndStatus(
                leitorId,
                StatusEmprestimo.ATIVO
        );
    }

    @Transactional
    public Emprestimo devolver(Integer emprestimoId){
        Emprestimo emprestimo = buscarEmprestimo(emprestimoId);

        if (emprestimo.getStatus() == StatusEmprestimo.DEVOLVIDO){
            throw new IllegalStateException(
                    "O livro já foi devolvido"
            );
        }

        emprestimo.setStatus(StatusEmprestimo.DEVOLVIDO);
        emprestimo.setDataDevolucao(LocalDate.now());

        Livro livro = emprestimo.getLivro();
        livro.setQuantidade(livro.getQuantidade() + 1);
        livroRepository.save(livro);

        return emprestimoRepository.save(emprestimo);
    }

    public Emprestimo renovar(
            Integer emprestimoId,
            EmprestimoRenovarDto dado
    ){
        validarPrazo(dado.prazoDias());

        Emprestimo emprestimo = buscarEmprestimo(emprestimoId);

        if (emprestimo.getStatus() != StatusEmprestimo.ATIVO){
            throw new IllegalStateException(
                    "Somente empréstimos ativos podem ser renovados"
            );
        }

        emprestimo.setDataPrevistaDevolucao(
                LocalDate.now().plusDays(dado.prazoDias())
        );

        return emprestimoRepository.save(emprestimo);
    }

    private Leitor buscarLeitor(Integer id){
        return leitorRepository.findById(id).orElseThrow(() ->
                new RuntimeException(
                        "Leitor não encontrado"
                ));
    }

    private Emprestimo buscarEmprestimo(Integer id){
        return emprestimoRepository.findById(id).orElseThrow(() ->
                new RuntimeException(
                        "Empréstimo não encontrado"
                ));
    }

    private void validarPrazo(Integer prazoDias){
        if (!List.of(30, 45, 60).contains(prazoDias)){
            throw new IllegalArgumentException(
                    "O prazo deve ser de 30, 45 ou 60 dias"
            );
        }
    }
}
