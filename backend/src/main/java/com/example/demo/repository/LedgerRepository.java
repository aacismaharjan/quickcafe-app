package com.example.demo.repository;

import com.example.demo.model.Canteen;
import com.example.demo.model.Ledger;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface LedgerRepository extends JpaRepository<Ledger, Long> {

    // Find all ledgers by a specific canteen ID
    List<Ledger> findByCanteenId(Long canteenId);

    Optional<Ledger> findByIdAndCanteenId(Long ledgerId, Long canteenId);

    Ledger findTopByCanteenAndIsActiveOrderByCreatedAtAsc(Canteen canteen, boolean isActive);

    @Modifying
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    @Query(
        value = "UPDATE tbl_ledger l SET l.is_active = 0 WHERE l.canteen_id = :canteenId AND l.is_active = 1",
        nativeQuery = true
    )
    void deactivateOtherLedgers(@Param("canteenId") Long canteenId);

    boolean existsByIdAndCanteenId(Long ledgerId, Long canteenId);


}
