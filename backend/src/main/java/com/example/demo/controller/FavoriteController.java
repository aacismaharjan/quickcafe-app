package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.model.Favorite;
import com.example.demo.model.MenuItem;
import com.example.demo.service.FavoriteService;
import com.example.demo.service.MenuItemService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/favorites") // Base mapping for the controller
public class FavoriteController {

    private final FavoriteService favoriteService;

    public FavoriteController(FavoriteService favoriteService) {
        this.favoriteService = favoriteService;
    }

    @GetMapping // Maps to GET /favorites
    public List<Favorite> getAllFavorite() {
        return favoriteService.getAllFavorite();
    }

    @GetMapping("/{id}") // Maps to GET /favorites/{id}
    public ResponseEntity<Favorite> getFavoriteById(@PathVariable Long id) {
        Optional<Favorite> favorite = favoriteService.getFavoriteById(id);
        return favorite.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping // Maps to POST /favorites
    public Favorite createFavorite(@RequestBody Favorite favorite) {
        return favoriteService.createFavorite(favorite);
    }

    @PutMapping("/{id}") // Maps to PUT /favorites/{id}
    public ResponseEntity<Favorite> updateFavorite(@PathVariable Long id, @RequestBody Favorite favorite) {
        try {
            Favorite updatedFavorite = favoriteService.updateFavorite(id, favorite);
            return ResponseEntity.ok(updatedFavorite);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}") // Maps to DELETE /favorites/{id}
    public ResponseEntity<Void> deleteFavorite(@PathVariable Long id) {
        try {
        	favoriteService.deleteFavorite(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
