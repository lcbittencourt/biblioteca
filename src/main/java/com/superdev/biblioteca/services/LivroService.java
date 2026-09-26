package com.superdev.biblioteca.services;

import com.superdev.biblioteca.dtos.LivroAtualizarDto;
import com.superdev.biblioteca.dtos.LivroCriarDto;
import com.superdev.biblioteca.models.Autor;
import com.superdev.biblioteca.models.Categoria;
import com.superdev.biblioteca.models.Livro;
import com.superdev.biblioteca.repositories.AutorRepository;
import com.superdev.biblioteca.repositories.CategoriaRepository;
import com.superdev.biblioteca.repositories.LivroRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LivroService {
    private final LivroRepository repository;
    private final AutorRepository autorRepository;
    private final CategoriaRepository categoriaRepository;

    public LivroService(
            LivroRepository repository,
            AutorRepository autorRepository,
            CategoriaRepository categoriaRepository
    ){
        this.repository = repository;
        this.autorRepository = autorRepository;
        this.categoriaRepository = categoriaRepository;
    }

    public List<Livro> listar(){
        return repository.findAll();
    }

    public Livro criar(LivroCriarDto dado){
        Autor autor = autorRepository.findById(dado.autorId())
                .orElseThrow(() -> new RuntimeException("Autor não encontrado"));
        Categoria categoria = categoriaRepository.findById(dado.categoriaId())
                .orElseThrow(() -> new RuntimeException("Categoria não encontrada"));

        var livro = Livro.builder()
                .titulo(dado.titulo())
                .subtitulo(dado.subtitulo())
                .isbn(dado.isbn())
                .anoPublicacao(dado.anoPublicacao())
                .quantidade(dado.quantidade())
                .autor(autor)
                .categoria(categoria)
                .ativo(true)
                .build();

        return repository.save(livro);
    }

    public Livro atualizar(int id, LivroAtualizarDto dado){
        var livro = repository.findById(id).orElseThrow();
        Autor autor = autorRepository.findById(dado.autorId())
                .orElseThrow(() -> new RuntimeException("Autor não encontrado"));
        Categoria categoria = categoriaRepository.findById(dado.categoriaId())
                .orElseThrow(() -> new RuntimeException("Categoria não encontrada"));

        livro.setTitulo(dado.titulo());
        livro.setSubtitulo(dado.subtitulo());
        livro.setIsbn(dado.isbn());
        livro.setAnoPublicacao(dado.anoPublicacao());
        livro.setQuantidade(dado.quantidade());
        livro.setAutor(autor);
        livro.setCategoria(categoria);

        return repository.save(livro);
    }

    public Livro apagar(int id){
        var livro = repository.findById(id).orElseThrow();

        livro.setAtivo(false);

        return repository.save(livro);
    }

    public Livro reativar(int id){
        var livro = repository.findById(id).orElseThrow();

        livro.setAtivo(true);
        return repository.save(livro);
    }

    public Livro obterPorId(int id){
        var livro = repository.findById(id).orElseThrow();

        return livro;
    }
}
