package com.superdev.biblioteca.repositories;

import com.superdev.biblioteca.models.Emprestimo;
import com.superdev.biblioteca.models.StatusEmprestimo;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface EmprestimoRepository extends JpaRepository<Emprestimo, Integer> {
    List<Emprestimo> findByLeitorIdAndStatus(
            Integer leitorId,
            StatusEmprestimo status
    );

    boolean existsByLeitorIdAndStatusAndDataPrevistaDevolucaoBefore(
            Integer leitorId, StatusEmprestimo status, LocalDate dataPrevistaDevolucaoBefore
    );
}
