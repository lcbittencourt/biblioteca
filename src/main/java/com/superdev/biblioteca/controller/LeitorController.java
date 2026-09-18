package com.superdev.biblioteca.controller;

import com.superdev.biblioteca.dtos.LeitorAtualizarDto;
import com.superdev.biblioteca.dtos.LeitorCriarDto;
import com.superdev.biblioteca.models.Leitor;
import com.superdev.biblioteca.services.LeitorService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("/leitores")
public class LeitorController {
    private final LeitorService service;

    public LeitorController(LeitorService service){
        this.service = service;
    }

    @GetMapping
    public List<Leitor> listar(){
        return service.listar();
    }

    @PostMapping
    public Leitor criar(@RequestBody @Valid LeitorCriarDto dto){
        return service.criar(dto);
    }

    @PutMapping("/{id}")
    public Leitor atualizar(@PathVariable int id, @RequestBody @Valid LeitorAtualizarDto dto){
        return service.atualizar(id, dto);
    }

    @DeleteMapping("/{id}")
    public Leitor apagar (@PathVariable int id){
        return service.apagar(id);
    }

    @GetMapping("/{id}")
    public Leitor obterPorId(@PathVariable int id){
        return service.obterPorId(id);
    }
}
