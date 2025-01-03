package com.example.demo.controller;

import com.example.demo.model.Favorite;
import com.example.demo.service.FavoriteService;
import com.example.demo.utils.AuthUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.model.User;
import com.example.demo.service.UserService;

import java.util.List;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private FavoriteService favoriteService;

    @Autowired
    private AuthUtil authUtil;


    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/{id}")
    public User getUserById(@PathVariable Integer id) {
        return userService.getUserById(id);
    }

    @GetMapping("/{userId}/favorites")
    public List<Favorite> getAllFavoriteByUserId(@PathVariable Integer userId) {
        return favoriteService.getAllFavoriteByUserId(userId);
    }

    @PostMapping("/{userId}/favorites")
    public ResponseEntity<Favorite> addMenuItemToFavorite(@PathVariable Integer userId, @RequestBody Favorite favorite) {
        try {
            favorite.setUser(userService.getUserById(userId));
            return ResponseEntity.ok(favoriteService.createFavorite(favorite));
        }catch(Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{userId}/favorites/{menuItemId}")
    public ResponseEntity<Void> removeMenuItemFromFavorite(@PathVariable Integer userId, @PathVariable Long menuItemId) {
        favoriteService.deleteFavoriteByUserIdAndMenuItemId(userId, menuItemId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping
    public User createUser(@RequestBody User user) {
        return userService.createUser(user);
    }

    @PutMapping("/{id}")
    public User updateUser(@PathVariable Integer id, @RequestBody User user) {
        return userService.updateUser(id, user);
    }

    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable Integer id) {
        userService.deleteUser(id);
    }
}
