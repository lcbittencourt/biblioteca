package com.superdev.biblioteca.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CategoriaCriarDto(
        @NotBlank @Size(min = 2, max = 60)
        String nome,

        @Size(max = 250)
        String descricao
) {}
