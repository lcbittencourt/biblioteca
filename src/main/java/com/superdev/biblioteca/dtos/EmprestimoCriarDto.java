package com.superdev.biblioteca.dtos;

import jakarta.validation.constraints.NotNull;

public record EmprestimoCriarDto(
        @NotNull
        Integer leitorId,

        @NotNull
        Integer livroId,

        @NotNull
        Integer prazoDias
) {}
