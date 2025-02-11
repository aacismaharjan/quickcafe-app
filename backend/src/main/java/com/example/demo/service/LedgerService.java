package com.example.demo.service;

import com.example.demo.model.Canteen;
import com.example.demo.model.Ledger;
import com.example.demo.model.Menu;
import com.example.demo.repository.CanteenRepository;
import com.example.demo.repository.LedgerRepository;
import com.example.demo.repository.MenuRepository;
import jakarta.persistence.EntityManager;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class LedgerService {

    private final MenuService menuService;
    private final MenuRepository menuRepository;
    private final LedgerRepository ledgerRepository;
    private final EntityManager entityManager;
    private final CanteenRepository canteenRepository;

    @Autowired
    public LedgerService(MenuService menuService, MenuRepository menuRepository, LedgerRepository ledgerRepository, EntityManager entityManager, CanteenRepository canteenRepository) {
        this.menuService = menuService;
        this.menuRepository = menuRepository;
        this.ledgerRepository = ledgerRepository;
        this.entityManager = entityManager;

        this.canteenRepository = canteenRepository;
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
            if(ledger.getCanteen() != null && ledger.getCanteen().getId() != null) {
                Canteen existingCanteen = canteenRepository.findById(ledger.getCanteen().getId())
                        .orElseThrow(() -> new RuntimeException("Canteen not found with id: " + ledger.getCanteen().getId()));
                ledger.setCanteen(existingCanteen);
            }

            // Fetch the existing menus from the database using their IDs
            Set<Menu> existingMenus = ledger.getMenus().stream()
                    .map(menuWrapper -> menuWrapper) // Extracting Menu objects
                    .map(menu -> {
                        // Assuming you have a MenuService to fetch Menu entities by ID
                        return menuService.getMenuById(menu.getId())
                                .orElseThrow(() -> new RuntimeException("Menu not found with ID: " + menu.getId()));
                    })
                    .collect(Collectors.toCollection(LinkedHashSet::new));

            ledger.setMenus(existingMenus);

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
            if (ledger.getCanteen() != null && ledger.getCanteen().getId() != null) {
                // Fetch existing Canteen from DB
                Canteen existingCanteen = canteenRepository.findById(ledger.getCanteen().getId())
                        .orElseThrow(() -> new RuntimeException("Canteen not found with id: " + ledger.getCanteen().getId()));

                // Attach the existing Canteen to the Ledger
                ledger.setCanteen(existingCanteen);
            }

            // Fetch the existing menus from the database using their IDs
            Set<Menu> existingMenus = ledger.getMenus().stream()
                    .map(menu -> {
                        if(menu.getId() != null) {
                            return menuRepository.findById(menu.getId()).orElse(menu);
                        }
                        return menu;
                    })
//                    .collect(Collectors.toSet());
                    .collect(Collectors.toCollection(LinkedHashSet::new));

            // Map the fetched Menu entities to the ledger
            ledger.setMenus(existingMenus);
            // Updating..

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


    public Ledger getLedgerByLedgerIdAndCanteenId(Long ledgerId, Long canteenId) {
        try {
            Optional<Ledger> ledger = ledgerRepository.findByIdAndCanteenId(ledgerId, canteenId);
            if(ledger.isPresent()) {
                return ledger.get();
            }
            throw new RuntimeException("Ledger not found.");
        }catch (Exception ex) {
            throw new RuntimeException("Unable to fetch ledger by canteen id.");
        }

    }

    public boolean isLedgerOwnedByCanteen(Long ledgerId, Long canteenId) {
        return ledgerRepository.existsByIdAndCanteenId(ledgerId, canteenId);
    }
}
