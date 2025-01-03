package com.example.demo.controller;

import com.example.demo.model.Category;
import com.example.demo.model.MenuItem;
import com.example.demo.service.CategoryService;
import org.apache.coyote.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/categories")
public class CategoryController {
    private final CategoryService categoryService;

    @Autowired
    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping
    public ResponseEntity<List<Category>> getAllCategories() {
        List<Category> categories = categoryService.getAllCategories();
        return ResponseEntity.ok(categories);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Category> getCategoryById(@PathVariable Long id) {
        Optional<Category> category = categoryService.getCategoryById(id);
        return category.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public Category createCategory (@RequestBody Category category) {
        return categoryService.createCategory(category);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Category> updateCategory(@PathVariable Long id, @RequestBody Category category) {
        try {
            Category updatedCategory = categoryService.updateCategory(id, category);
            return ResponseEntity.ok(updatedCategory);
        }catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        try {
            categoryService.deleteCategory(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/{categoryId}/menu-items")
    public ResponseEntity<List<MenuItem>> getAllMenuItems(@PathVariable Long categoryId) {
        return ResponseEntity.ok(categoryService.getAllMenuItemsByCategoryId(categoryId));
    }

    @PostMapping("/{categoryId}/menu-items")
    public ResponseEntity<MenuItem> addMenuItems(@PathVariable Long categoryId, @RequestBody Map<String, Long> payload) {
        Long menuItemId = payload.get("menuItemId");
        return categoryService.addMenuItemToCategory(categoryId, menuItemId)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{categoryId}/menu-items/{menuItemId}")
    public ResponseEntity<Void> removeMenuItem(@PathVariable Long categoryId, @PathVariable Long menuItemId) {
        if(categoryService.removeMenuItemFromCategory(categoryId, menuItemId)) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
