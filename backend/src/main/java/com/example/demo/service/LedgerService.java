package com.example.demo.service;

import com.example.demo.model.Ledger;
import com.example.demo.model.Menu;
import com.example.demo.repository.LedgerRepository;
import jakarta.persistence.EntityManager;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
@Transactional
public class LedgerService {

    private final LedgerRepository ledgerRepository;
    private final EntityManager entityManager;

    @Autowired
    public LedgerService(LedgerRepository ledgerRepository, EntityManager entityManager) {
        this.ledgerRepository = ledgerRepository;
        this.entityManager = entityManager;
    }

    // Get all ledgers
    public List<Ledger> getAllLedgers() {
        return ledgerRepository.findAll();
    }

    // Get a ledger by its ID
    @Transactional
    public Optional<Ledger> getLedgerById(Long id) {

        Ledger ledger = ledgerRepository.findById(id).orElse(null);
        System.out.println(ledger);

        return ledgerRepository.findById(id);
    }

    // Get all ledgers for a specific canteen ID
    public List<Ledger> getLedgersByCanteenId(Long canteenId) {
        return ledgerRepository.findByCanteenId(canteenId);
    }

    // Save a new ledger
    @Transactional
    public Ledger createLedger(Ledger ledger) {
        try {
            if(ledger.getIsActive()) {
                deactivateAllLedgersByCanteenId(ledger.getCanteen().getId());
            }
            return ledgerRepository.save(ledger);
        }catch (Exception ex) {
            throw new RuntimeException("Couldn't create ledger.");
        }
    }

    // Update an existing ledger
    @Transactional
    public Ledger updateLedger(Long id, Ledger updatedLedger) {
        Optional<Ledger> existingLedgerOpt = ledgerRepository.findById(id);

        if (existingLedgerOpt.isPresent()) {
            Ledger existingLedger = existingLedgerOpt.get();
            existingLedger.setName(updatedLedger.getName());
            existingLedger.setDescription(updatedLedger.getDescription());
            existingLedger.setIsActive(updatedLedger.getIsActive());
            existingLedger.setCanteen(updatedLedger.getCanteen());
            existingLedger.setMenus(updatedLedger.getMenus());

            if(updatedLedger.getIsActive()) {
                ledgerRepository.deactivateOtherLedgers(updatedLedger.getCanteen().getId());
            }
            return ledgerRepository.save(existingLedger);
        } else {
            throw new RuntimeException("Ledger with ID " + id + " not found");
        }
    }

    @Transactional
    public void deactivateAllLedgersByCanteenId(Long canteenId) {
        try {
            ledgerRepository.deactivateOtherLedgers(canteenId);
        }catch(Exception ex) {
            throw new RuntimeException("Could not deactivate all ledgers by canteen id=" + canteenId);
        }
    }

    @Transactional
    public Ledger partiallyUpdateLedger(Long id, Ledger ledger) {
        try {
            Ledger existingLedger = ledgerRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Ledger not found"));

            // Update only non-null fields
            if(ledger.getName() != null) {
                existingLedger.setName(ledger.getName());
            }

            if(ledger.getDescription() != null) {
                existingLedger.setDescription(ledger.getDescription());
            }

            if(ledger.getIsActive() != null) {
                existingLedger.setIsActive(ledger.getIsActive());
            }

            if (Boolean.TRUE.equals(ledger.getIsActive())) {
                ledgerRepository.deactivateOtherLedgers(existingLedger.getCanteen().getId());
            }

            existingLedger.setMenus(ledger.getMenus());

            // Save and refresh to make sure entity state is updated
            return ledgerRepository.save(existingLedger);
        }catch(Exception e) {
            throw new RuntimeException(e);
        }
    }

    // Delete a ledger by its ID
    @Transactional
    public void deleteLedger(Long id) {
        if (ledgerRepository.existsById(id)) {
            ledgerRepository.deleteById(id);
        } else {
            throw new RuntimeException("Ledger with ID " + id + " not found");
        }
    }
}
