package com.superdev.biblioteca.repositories;

import com.superdev.biblioteca.models.Livro;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LivroRepository extends JpaRepository<Livro, Integer> {
}
