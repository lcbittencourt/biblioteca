package com.superdev.biblioteca.services;

import com.superdev.biblioteca.dtos.AutorAtualizarDto;
import com.superdev.biblioteca.dtos.AutorCriarDto;
import com.superdev.biblioteca.models.Autor;
import com.superdev.biblioteca.repositories.AutorRepository;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class AutorService {
    private final AutorRepository repository;

    public AutorService(AutorRepository repository) {this.repository = repository;}

    public List<Autor> listar() {return repository.findAll();}

    public Autor criar(AutorCriarDto dado){
        var autor = Autor.builder()
                .nome(dado.nome())
                .nacionalidade(dado.nacionalidade())
                .dataNascimento(dado.dataNascimento())
                .generoLiterario(dado.generoLiterario())
                .ativa(true)
                .build();

        return repository.save(autor);
    }

    public Autor atualizar(int id, AutorAtualizarDto dado){
        var autor = repository.findById(id).orElseThrow();

        autor.setNome(dado.nome());
        autor.setNacionalidade(dado.nacionalidade());
        autor.setDataNascimento(dado.dataNascimento());
        autor.setGeneroLiterario(dado.generoLiterario());

        return repository.save(autor);
    }

    public Autor apagar(int id){
        var autor = repository.findById(id).orElseThrow();

        autor.setAtiva(false);
        return repository.save(autor);
    }

    public Autor obterPorId(int id){
        var autor = repository.findById(id).orElseThrow();
        return autor;
    }
}
