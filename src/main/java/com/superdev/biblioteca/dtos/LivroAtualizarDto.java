package com.superdev.biblioteca.dtos;

import jakarta.validation.constraints.*;

public record LivroAtualizarDto(
        @NotBlank @Size(min = 1, max = 150)
        String titulo,

        @Size(min = 1, max = 150)
        String subtitulo,

        @NotBlank @Size(min = 10, max = 14)
        String isbn,

        @NotNull @Min(1000) @Max(9999)
        Integer anoPublicacao,

        @NotNull @PositiveOrZero
        Integer quantidade,

        @NotNull
        Integer autorId,

        @NotNull
        Integer categoriaId
) {}
