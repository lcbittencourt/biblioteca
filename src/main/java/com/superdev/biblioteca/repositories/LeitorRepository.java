package com.superdev.biblioteca.repositories;

import com.superdev.biblioteca.models.Leitor;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface LeitorRepository extends JpaRepository<Leitor, Integer> {
    Optional<Leitor> findByCodigo(String codigo);
}
