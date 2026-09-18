package com.superdev.biblioteca.models;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table
public class Autor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(length = 100, nullable = false, unique = true)
    private String nome;

    @Enumerated(EnumType.STRING)
    @Column(length = 2, nullable = false, unique = false)
    private Nacionalidade nacionalidade;

    @Column(name = "data_nascimento", nullable = false, unique = false)
    private LocalDate dataNascimento;

    @Enumerated(EnumType.STRING)
    @Column(name = "genero_literario", length = 30, nullable = false, unique = false)
    private GeneroLiterario generoLiterario;

    @Column(nullable = false)
    private boolean ativa;
}
