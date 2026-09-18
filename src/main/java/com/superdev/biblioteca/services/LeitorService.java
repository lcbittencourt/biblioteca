package com.superdev.biblioteca.services;

import com.superdev.biblioteca.dtos.LeitorAtualizarDto;
import com.superdev.biblioteca.dtos.LeitorCriarDto;
import com.superdev.biblioteca.models.Leitor;
import com.superdev.biblioteca.repositories.LeitorRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LeitorService {
    private  final LeitorRepository repository;

    public LeitorService(LeitorRepository repository){
        this.repository = repository;
    }

    public List<Leitor> listar(){
        return repository.findAll();
    }

    public Leitor criar(LeitorCriarDto dado){
        var leitor = Leitor.builder()
                .nome(dado.nome())
                .cpf(dado.cpf())
                .dataNascimento(dado.dataNascimento())
                .numeroTelefone(dado.numeroTelefone())
                .rua(dado.rua())
                .numeroCasa(dado.numeroCasa())
                .complemento(dado.complemento())
                .bairro(dado.bairro())
                .cidade(dado.cidade())
                .estado(dado.estado())
                .cep(dado.cep())
                .ativo(true)
                .build();

        return repository.save(leitor);
    }

    public Leitor atualizar(int id, LeitorAtualizarDto dado){
        var leitor = repository.findById(id).orElseThrow();

        leitor.setNome(dado.nome());
        leitor.setCpf(dado.cpf());
        leitor.setDataNascimento(dado.dataNascimento());
        leitor.setNumeroTelefone(dado.numeroTelefone());
        leitor.setRua(dado.rua());
        leitor.setNumeroCasa(dado.numeroCasa());
        leitor.setComplemento(dado.complemento());
        leitor.setBairro(dado.bairro());
        leitor.setCidade(dado.cidade());
        leitor.setEstado(dado.estado());
        leitor.setCep(dado.cep());

        return repository.save(leitor);
    }

    public Leitor apagar(int id){
        var leitor = repository.findById(id).orElseThrow();

        leitor.setAtivo(false);
        return repository.save(leitor);
    }

    public Leitor obterPorId(int id){
        var leitor = repository.findById(id).orElseThrow();

        return leitor;
    }
}
