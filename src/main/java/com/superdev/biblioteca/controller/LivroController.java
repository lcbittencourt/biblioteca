package com.superdev.biblioteca.controller;

import com.superdev.biblioteca.dtos.LivroAtualizarDto;
import com.superdev.biblioteca.dtos.LivroCriarDto;
import com.superdev.biblioteca.models.Livro;
import com.superdev.biblioteca.services.LivroService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("/livros")
public class LivroController {
    private final LivroService service;

    public LivroController(LivroService service){
        this.service = service;
    }

    @GetMapping
    public List<Livro> listar(){
        return service.listar();
    }

    @PostMapping
    public Livro criar(@RequestBody @Valid LivroCriarDto dto){
        return service.criar(dto);
    }

    @PutMapping("/{id}")
    public Livro atualizar(@PathVariable int id, @RequestBody @Valid LivroAtualizarDto dto){
        return service.atualizar(id, dto);
    }

    @DeleteMapping("/{id}")
    public Livro apagar (@PathVariable int id){
        return service.apagar(id);
    }

    @GetMapping("/{id}")
    public Livro obterPorId(@PathVariable int id){
        return service.obterPorId(id);
    }
}
