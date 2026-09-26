package com.superdev.biblioteca.dtos;

import jakarta.validation.constraints.*;

import java.time.LocalDate;

public record LeitorCriarDto(
        @NotBlank @Size(min = 2, max = 100)
        String nome,

        @NotBlank @Pattern(regexp = "\\d{11}", message = "O CPF deve conter exatamente 11 números")
        String cpf,

        @NotNull @Past
        LocalDate dataNascimento,

        @NotBlank @Size(min = 5, max = 100)
        String email,

        @NotBlank @Size(min = 13, max = 14)
        String numeroTelefone,

        @NotBlank @Size(min = 1, max = 200)
        String rua,

        @NotBlank @Size(min = 1, max = 5)
        String numeroCasa,

        @Size(min = 0, max = 50)
        String complemento,

        @NotBlank @Size(min = 1, max = 100)
        String bairro,

        @NotBlank @Size(min = 1, max = 100)
        String cidade,

        @NotBlank @Size(min = 2, max = 2)
        String estado,

        @NotBlank @Size(min = 8, max = 9)
        String cep
) {}
