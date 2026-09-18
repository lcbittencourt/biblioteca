package com.superdev.biblioteca.controller;

import com.superdev.biblioteca.dtos.EmprestimoCriarDto;
import com.superdev.biblioteca.dtos.EmprestimoRenovarDto;
import com.superdev.biblioteca.models.Emprestimo;
import com.superdev.biblioteca.services.EmprestimoService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/emprestimos")
public class EmprestimoController {
    private final EmprestimoService service;

    public EmprestimoController(EmprestimoService service){
        this.service = service;
    }

    @GetMapping("/permissao/{leitorId}")
    public boolean verificarPermissao(@PathVariable Integer leitorId){
        return service.verificarPermissao(leitorId);
    }

    @PostMapping
    public Emprestimo retirar(@RequestBody @Valid EmprestimoCriarDto dto){
        return service.retirar(dto);
    }

    @GetMapping("/leitor/{leitorId}/ativos")
    public List<Emprestimo> listarAtivosDoLeitor(@PathVariable Integer leitorId){
        return service.listarAtivosDoLeitor(leitorId);
    }

    @PutMapping("/{id}/devolver")
    public Emprestimo devolver(@PathVariable Integer id){
        return service.devolver(id);
    }

    @PutMapping("/{id}/renovar")
    public Emprestimo renovar(@PathVariable Integer id, @RequestBody @Valid EmprestimoRenovarDto dto){
        return service.renovar(id, dto);
    }
}
