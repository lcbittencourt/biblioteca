package com.superdev.biblioteca.services;

import com.superdev.biblioteca.dtos.CategoriaAtualizarDto;
import com.superdev.biblioteca.dtos.CategoriaCriarDto;
import com.superdev.biblioteca.models.Categoria;
import com.superdev.biblioteca.repositories.CategoriaRepository;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
public class CategoriaService {
    private final CategoriaRepository repository;

    public CategoriaService(CategoriaRepository repository){
        this.repository = repository;
    }

    public List<Categoria> listar(){
        return repository.findAll();
    }

    public Categoria criar(CategoriaCriarDto dado){
        var categoria = Categoria.builder()
                .nome(dado.nome())
                .descricao(dado.descricao())
                .ativa(true)
                .build();

        return repository.save(categoria);
    }

    public Categoria atualizar(int id, CategoriaAtualizarDto dado){
        var categoria = repository.findById(id).orElseThrow();

        categoria.setNome(dado.nome());
        categoria.setDescricao(dado.descricao());

        return repository.save(categoria);
    }

    public Categoria apagar(int id){
        var categoria = repository.findById(id).orElseThrow();

        categoria.setAtiva(false);

        return repository.save(categoria);
    }

    public Categoria obterPorId(int id){
        var categoria = repository.findById(id).orElseThrow();

        return categoria;
    }
}
