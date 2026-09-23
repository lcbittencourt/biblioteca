package com.superdev.biblioteca.controller;

import com.superdev.biblioteca.dtos.AutorAtualizarDto;
import com.superdev.biblioteca.dtos.AutorCriarDto;
import com.superdev.biblioteca.models.Autor;
import com.superdev.biblioteca.services.AutorService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("/autores")
public class AutorController {
    private final AutorService service;

    public AutorController(AutorService service) {this.service = service;}

    @GetMapping
    public List<Autor> listar(){return service.listar();}

    @PostMapping
    public Autor criar(@RequestBody @Valid AutorCriarDto dto) {return service.criar(dto);}

    @PutMapping("/{id}")
    public Autor atualizar(@PathVariable int id, @RequestBody @Valid AutorAtualizarDto dto){return service.atualizar(id, dto);}

    @DeleteMapping("/{id}")
    public Autor apagar (@PathVariable int id){return service.apagar(id);}

    @PutMapping("/{id}/reativar")
    public Autor reativar(@PathVariable int id){return service.reativar(id);}

    @GetMapping("/{id}")
    public Autor obterPorId(@PathVariable int id){return service.obterPorId(id);}
}
