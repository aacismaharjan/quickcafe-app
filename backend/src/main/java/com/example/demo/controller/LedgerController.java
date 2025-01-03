package com.example.demo.controller;

import com.example.demo.model.Ledger;
import com.example.demo.model.Menu;
import com.example.demo.service.LedgerService;
import com.example.demo.service.MenuService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/ledgers")
public class LedgerController {

    private final LedgerService ledgerService;
    private final MenuService menuService;

    @Autowired
    public LedgerController(LedgerService ledgerService, MenuService menuService) {
        this.ledgerService = ledgerService;
        this.menuService = menuService;
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
        Optional<Ledger> ledger = ledgerService.getLedgerById(id);
        return ledger.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    // Get all ledgers for a specific canteen ID
    @GetMapping("/canteen/{canteenId}")
    public ResponseEntity<List<Ledger>> getLedgersByCanteenId(@PathVariable Long canteenId) {
        List<Ledger> ledgers = ledgerService.getLedgersByCanteenId(canteenId);
        return new ResponseEntity<>(ledgers, HttpStatus.OK);
    }

    // Save a new ledger
    @PostMapping
    public ResponseEntity<Ledger> createLedger(@RequestBody Ledger ledger) {
        // Fetch the existing menus from the database using their IDs
        List<Menu> existingMenus = ledger.getMenus().stream()
                .map(menuWrapper -> menuWrapper) // Extracting Menu objects
                .map(menu -> {
                    // Assuming you have a MenuService to fetch Menu entities by ID
                    return menuService.getMenuById(menu.getId())
                            .orElseThrow(() -> new RuntimeException("Menu not found with ID: " + menu.getId()));
                })
                .toList();

        // Map the fetched Menu entities to the ledger
        ledger.setMenus(existingMenus);

        // Save the ledger
        Ledger createdLedger = ledgerService.createLedger(ledger);
        return new ResponseEntity<>(createdLedger, HttpStatus.CREATED);
    }

    // Update an existing ledger
    @PutMapping("/{id}")
    public ResponseEntity<Ledger> updateLedger(@PathVariable Long id, @RequestBody Ledger updatedLedger) {
        try {
            Ledger ledger = ledgerService.updateLedger(id, updatedLedger);
            return ResponseEntity.ok(ledger);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
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
