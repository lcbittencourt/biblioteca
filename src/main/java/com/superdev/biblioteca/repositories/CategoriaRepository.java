package com.superdev.biblioteca.repositories;

import com.superdev.biblioteca.models.Categoria;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoriaRepository  extends JpaRepository<Categoria, Integer> {
}
