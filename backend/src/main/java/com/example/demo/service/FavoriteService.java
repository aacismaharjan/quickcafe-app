package com.example.demo.service;

import com.example.demo.model.MenuItem;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.model.Favorite;
import com.example.demo.model.Order;
import com.example.demo.model.OrderDetail;
import com.example.demo.repository.FavoriteRepository;
import com.example.demo.repository.OrderRepository;

import jakarta.transaction.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class FavoriteService {

    @Autowired
    private FavoriteRepository favoriteRepository;

//    public FavoriteService(FavoriteRepository favoriteRepository) {
//        this.favoriteRepository = favoriteRepository;
//    }

    public List<Favorite> getAllFavorite() {
        return favoriteRepository.findAll();
    }
    
    public List<Favorite> getAllFavoriteByUserId(Integer userId) {
        return favoriteRepository.findByUserId(userId);
    }

    public Optional<Favorite> getFavoriteById(Long id) {
        return favoriteRepository.findById(id);
    }

    @Transactional
    public Favorite createFavorite(Favorite favorite) {
        return favoriteRepository.save(favorite);
    }

    @Transactional
    public Favorite updateFavorite(Long id, Favorite favorite) {
        if (favoriteRepository.existsById(id)) {
        	favorite.setId(id);
            return favoriteRepository.save(favorite);
        } else {
            throw new RuntimeException("Favorite not found");
        }
    }

    @Transactional
    public void deleteFavorite(Long id) {
        if (favoriteRepository.existsById(id)) {
        	favoriteRepository.deleteById(id);
        } else {
            throw new RuntimeException("Favorite not found");
        }
    }

    public void deleteFavoriteByUserIdAndMenuItemId(Integer userId, Long menuItemId) {
        favoriteRepository.deleteByUserIdAndMenuItemId(userId, menuItemId);
    }
}
