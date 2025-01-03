package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import com.example.demo.model.MenuItem;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MenuItemRepository extends JpaRepository<MenuItem, Long>, JpaSpecificationExecutor<MenuItem> {
//    @Query("SELECT m FROM MenuItem m LEFT JOIN m.orderDetail od LEFT JOIN od.reviews r  WHERE m.id = :id")
//    Optional<MenuItem> findByIdWithReviews(@Param("id") Long id);
//    @Query("SELECT mi FROM MenuItem mi LEFT JOIN FETCH mi.reviews r LEFT JOIN r.orderDetail od WHERE mi.id = :id")
//    Optional<MenuItem> findByIdWithReviews(@Param("id") Long id);
}
