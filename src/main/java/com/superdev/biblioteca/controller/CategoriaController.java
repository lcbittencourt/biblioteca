package com.superdev.biblioteca.controller;

import com.superdev.biblioteca.dtos.CategoriaAtualizarDto;
import com.superdev.biblioteca.dtos.CategoriaCriarDto;
import com.superdev.biblioteca.models.Categoria;
import com.superdev.biblioteca.services.CategoriaService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("/categorias")
public class CategoriaController {
    private final CategoriaService service;

    public CategoriaController(CategoriaService service) {
        this.service = service;
    }

    @GetMapping
    public List<Categoria> listar(){
        return service.listar();
    }

    @PostMapping
    public Categoria criar(@RequestBody @Valid CategoriaCriarDto dto) {
        return service.criar(dto);
    }

    @PutMapping("/{id}")
    public Categoria atualizar(@PathVariable int id, @RequestBody @Valid CategoriaAtualizarDto dto) {
        return service.atualizar(id, dto);
    }

    @DeleteMapping("/{id}")
    public Categoria apagar (@PathVariable int id){
        return service.apagar(id);
    }

    @PutMapping("/{id}/reativar")
    public Categoria reativar(@PathVariable int id){
        return service.reativar(id);
    }

    @GetMapping("/{id}")
    public Categoria obterPorId(@PathVariable int id){
        return service.obterPorId(id);
    }
}
