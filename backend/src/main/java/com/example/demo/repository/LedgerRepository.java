package com.example.demo.repository;

import com.example.demo.model.Ledger;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LedgerRepository extends JpaRepository<Ledger, Long> {

    // Find all ledgers by a specific canteen ID
    List<Ledger> findByCanteenId(Long canteenId);
}
