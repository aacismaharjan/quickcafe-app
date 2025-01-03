package com.example.demo.service;

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

    @Autowired
    public ReviewService(ReviewRepository reviewRepository, EntityManager entityManager) {
        this.reviewRepository = reviewRepository;
        this.entityManager = entityManager;
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
        Review savedReview =  reviewRepository.save(review);
        entityManager.refresh(savedReview);
        return savedReview;
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
}
