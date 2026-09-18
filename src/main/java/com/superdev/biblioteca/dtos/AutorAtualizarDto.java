package com.superdev.biblioteca.dtos;

import com.superdev.biblioteca.models.GeneroLiterario;
import com.superdev.biblioteca.models.Nacionalidade;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record AutorAtualizarDto(
       @NotBlank @Size(min = 2, max = 100)
       String nome,

       @NotNull
       Nacionalidade nacionalidade,

       @NotNull
       LocalDate dataNascimento,

       @NotNull
       GeneroLiterario generoLiterario
){}
