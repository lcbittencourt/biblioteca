package com.superdev.biblioteca.dtos;

import jakarta.validation.constraints.NotNull;

public record EmprestimoRenovarDto(
        @NotNull
        Integer prazoDias
) {}
