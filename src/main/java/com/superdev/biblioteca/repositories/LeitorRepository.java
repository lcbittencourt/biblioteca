package com.superdev.biblioteca.repositories;

import com.superdev.biblioteca.models.Leitor;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LeitorRepository extends JpaRepository<Leitor, Integer> {
}
