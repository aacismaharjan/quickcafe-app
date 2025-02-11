package com.example.demo.controller;

import com.example.demo.model.Canteen;
import com.example.demo.model.Ledger;
import com.example.demo.model.Menu;
import com.example.demo.model.MenuItem;
import com.example.demo.repository.CanteenRepository;
import com.example.demo.repository.MenuRepository;
import com.example.demo.service.LedgerService;
import com.example.demo.service.MenuService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/ledgers")
public class LedgerController {

    private final MenuRepository menuRepository;
    private final LedgerService ledgerService;
    private final MenuService menuService;
    private final CanteenRepository canteenRepository;

    @Autowired
    public LedgerController(MenuRepository menuRepository, LedgerService ledgerService, MenuService menuService, CanteenRepository canteenRepository) {
        this.menuRepository = menuRepository;
        this.ledgerService = ledgerService;
        this.menuService = menuService;
        this.canteenRepository = canteenRepository;
    }

    // Get all ledgers
    @GetMapping
    public ResponseEntity<List<Ledger>> getAllLedgers() {
        List<Ledger> ledgers = ledgerService.getAllLedgers();
        return new ResponseEntity<>(ledgers, HttpStatus.OK);
    }

    // Get a ledger by its ID
    @GetMapping("/{id}")
    public ResponseEntity<Ledger> getLedgerById(@PathVariable Long id) {
        try {

            Optional<Ledger> ledger = ledgerService.getLedgerById(id);
            return ledger.map(ResponseEntity::ok)
                    .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
        }catch (Exception ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    // Get all ledgers for a specific canteen ID
    @GetMapping("/canteen/{canteenId}")
    public ResponseEntity<List<Ledger>> getLedgersByCanteenId(@PathVariable Long canteenId) {
        List<Ledger> ledgers = ledgerService.getLedgersByCanteenId(canteenId);
        return new ResponseEntity<>(ledgers, HttpStatus.OK);
    }

    // Save a new ledger

    @Transactional
    @PostMapping
    public ResponseEntity<Ledger> createLedger(@RequestBody Ledger ledger) {
       try {
           Ledger createdLedger = ledgerService.createLedger(ledger);
           return new ResponseEntity<>(createdLedger, HttpStatus.CREATED);
       }catch(Exception ex) {
           return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
       }
    }

    @PatchMapping("/{id}")
    public ResponseEntity<Ledger> updateLedgerPartially(@PathVariable Long id, @RequestBody Ledger ledger) {
        try {
            Ledger partiallyUpdatedLedger = ledgerService.partiallyUpdateLedger(id, ledger);
            return new ResponseEntity<>(partiallyUpdatedLedger, HttpStatus.OK);
        }catch(Exception ex) {
            throw new RuntimeException(ex.getMessage());
        }
    }


    // Update an existing ledger
    @PutMapping("/{id}")
    public ResponseEntity<Ledger> updateLedger(@PathVariable Long id, @RequestBody Ledger updatedLedger) {
        try {
            // Fetch the existing menus from the database using their IDs
            Set<Menu> existingMenus = updatedLedger.getMenus().stream()
                    .map(menuWrapper -> menuWrapper) // Extracting Menu objects
                    .map(menu -> {
                        // Assuming you have a MenuService to fetch Menu entities by ID
                        return menuService.getMenuById(menu.getId())
                                .orElseThrow(() -> new RuntimeException("Menu not found with ID: " + menu.getId()));
                    })
                    .collect(Collectors.toSet());

            // Map the fetched Menu entities to the ledger
            updatedLedger.setMenus(existingMenus);

            Ledger ledger = ledgerService.updateLedger(id, updatedLedger);
            return ResponseEntity.ok(ledger);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }



    // Delete a ledger by its ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteLedger(@PathVariable Long id) {
        try {
            ledgerService.deleteLedger(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
}
