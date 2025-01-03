package com.example.demo.controller;

import com.example.demo.model.Canteen;
import com.example.demo.service.CanteenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/canteens")
public class CanteenController {
    private final CanteenService canteenService;

    @Autowired
    public CanteenController(CanteenService canteenService) {
        this.canteenService = canteenService;
    }

    @GetMapping
    public ResponseEntity<List<Canteen>> getAllCanteens() {
        List<Canteen> canteens = canteenService.getAllCanteens();
        return ResponseEntity.ok(canteens);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Canteen> getCanteenById(@PathVariable Long id) {
        Optional<Canteen> canteen = canteenService.getCanteenById(id);
        return canteen.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public Canteen createCanteen (@RequestBody Canteen canteen) {
        return canteenService.createCanteen(canteen);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Canteen> updateCanteen(@PathVariable Long id, @RequestBody Canteen canteen) {
        try {
            Canteen updatedCanteen = canteenService.updateCanteen(id, canteen);
            return ResponseEntity.ok(updatedCanteen);
        }catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCanteen(@PathVariable Long id) {
        try {
            canteenService.deleteCanteen(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
