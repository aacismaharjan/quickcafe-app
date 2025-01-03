package com.example.demo.repository;

import com.example.demo.model.Category;
import com.example.demo.model.MenuItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long>, JpaSpecificationExecutor<Category> {
//    @Query("SELECT c.items FROM Category c WHERE c.id = :categoryId")
//    List<MenuItem> findAllMenuItemsByCategoryId(@Param("categoryId") Long categoryId);
}
