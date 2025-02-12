package com.example.demo.service;

import com.example.demo.model.Canteen;
import com.example.demo.model.Menu;
import com.example.demo.model.Review;
import com.example.demo.repository.ReviewRepository;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.validation.Valid;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final EntityManager entityManager;
    private final CanteenService canteenService;

    @Autowired
    public ReviewService(ReviewRepository reviewRepository, EntityManager entityManager, CanteenService canteenService) {
        this.reviewRepository = reviewRepository;
        this.entityManager = entityManager;
        this.canteenService = canteenService;
    }

    // Retrieve all reviews
    public List<Review> getAllReviews() {
        return reviewRepository.findAll();
    }

    // Retrieve a review by ID
    public Optional<Review> getReviewById(Long id) {
        return reviewRepository.findById(id);
    }

    // Save a new review
    @Transactional
    public Review saveReview(@Valid Review review) {
        try {
            Canteen canteen = canteenService.getCanteenById(review.getCanteen().getId())
                    .orElseThrow(() -> new RuntimeException("Canteen not found with id: " + review.getCanteen().getId()));;
            review.setCanteen(canteen);
            Review savedReview =  reviewRepository.save(review);
            entityManager.refresh(savedReview);
            return savedReview;
        }catch (Exception ex) {
            throw new RuntimeException(ex.getMessage());
        }
    }

    // Update an existing review
    @Transactional
    public Review updateReview(Long id, @Valid Review updatedReview) {
        if (!reviewRepository.existsById(id)) {
            throw new IllegalArgumentException("Review not found with ID: " + id);
        }
        updatedReview.setId(id); // Set the ID to ensure it's updated
        Review savedReview = reviewRepository.save(updatedReview);
        entityManager.refresh(savedReview);
        return savedReview;
    }

    // Delete a review by ID
    @Transactional
    public void deleteReview(Long id) {
        if (!reviewRepository.existsById(id)) {
            throw new IllegalArgumentException("Review not found with ID: " + id);
        }
        reviewRepository.deleteById(id);
    }

    // Find reviews by user ID
    public List<Review> getReviewsByUserId(Long userId) {
        return reviewRepository.findByUserId(userId);
    }


    // Find reviews by rating
    public List<Review> getReviewsByRating(int rating) {
        return reviewRepository.findByRating(rating);
    }

    public List<Review> getAllReviewByCanteenId(Long canteenId) {
        try {
            List<Review> reviews = reviewRepository.findByCanteenId(canteenId);
            return reviews;
        }catch (Exception ex) {
            throw new RuntimeException(ex.getMessage());
        }
    }
}
