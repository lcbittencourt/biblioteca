package com.superdev.biblioteca.repositories;

import com.superdev.biblioteca.models.Autor;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AutorRepository extends JpaRepository<Autor, Integer> {
}
