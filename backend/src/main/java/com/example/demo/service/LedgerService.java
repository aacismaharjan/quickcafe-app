package com.example.demo.service;

import com.example.demo.model.Ledger;
import com.example.demo.repository.LedgerRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class LedgerService {

    private final LedgerRepository ledgerRepository;

    @Autowired
    public LedgerService(LedgerRepository ledgerRepository) {
        this.ledgerRepository = ledgerRepository;
    }

    // Get all ledgers
    public List<Ledger> getAllLedgers() {
        return ledgerRepository.findAll();
    }

    // Get a ledger by its ID
    public Optional<Ledger> getLedgerById(Long id) {
        return ledgerRepository.findById(id);
    }

    // Get all ledgers for a specific canteen ID
    public List<Ledger> getLedgersByCanteenId(Long canteenId) {
        return ledgerRepository.findByCanteenId(canteenId);
    }

    // Save a new ledger
    @Transactional
    public Ledger createLedger(Ledger ledger) {
        return ledgerRepository.save(ledger);
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
            return ledgerRepository.save(existingLedger);
        } else {
            throw new RuntimeException("Ledger with ID " + id + " not found");
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
