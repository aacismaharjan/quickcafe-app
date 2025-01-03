package com.example.demo.service;

import com.example.demo.model.Category;
import com.example.demo.model.MenuItem;
import com.example.demo.repository.CategoryRepository;
import com.example.demo.repository.MenuItemRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.DoubleStream;

@Service
public class CategoryService {
    private final CategoryRepository categoryRepository;
    private final MenuItemRepository menuItemRepository;

    @Autowired
    public CategoryService(CategoryRepository categoryRepository, MenuItemRepository menuItemRepository) {
        this.categoryRepository = categoryRepository;
        this.menuItemRepository = menuItemRepository;
    }

    public List<Category> getAllCategories() {
        return this.categoryRepository.findAll();
    }

    public Optional<Category> getCategoryById(Long id) {
        return this.categoryRepository.findById(id);
    }

    @Transactional
    public Category createCategory(Category canteen) {
        return this.categoryRepository.save(canteen);
    }

    @Transactional
    public Category updateCategory(Long id, Category canteen) {
        if(this.categoryRepository.existsById(id)) {
            canteen.setId(id);
            return this.categoryRepository.save(canteen);
        }else {
            throw new RuntimeException("Category not found");
        }
    }

    @Transactional
    public void deleteCategory(Long id) {
        if(this.categoryRepository.existsById(id)) {
            this.categoryRepository.deleteById(id);
        }else {
            throw new RuntimeException("Category not found");
        }
    }

    public Optional<MenuItem> addMenuItemToCategory(Long categoryId, Long menuItemId) {
        Optional<Category> categoryOptional = categoryRepository.findById(categoryId);
        Optional<MenuItem> menuItemOptional = menuItemRepository.findById(menuItemId);

        if(categoryOptional.isPresent() && menuItemOptional.isPresent()) {
            Category category = categoryOptional.get();
            MenuItem menuItem = menuItemOptional.get();

            category.getItems().add(menuItem);
            menuItem.getCategories().add(category);
            menuItemRepository.save(menuItem);
            categoryRepository.save(category);
            return Optional.of(menuItem);
        }

        return Optional.empty();
    }

    public boolean removeMenuItemFromCategory(Long categoryId, Long menuItemId) {
        Optional<Category> categoryOptional = categoryRepository.findById(categoryId);
        Optional<MenuItem> menuItemOptional = menuItemRepository.findById(menuItemId);

        if(categoryOptional.isPresent() && menuItemOptional.isPresent()) {
            Category category = categoryOptional.get();
            MenuItem menuItem = menuItemOptional.get();

            category.getItems().remove(menuItem);
            menuItem.getCategories().remove(category);
            categoryRepository.save(category);

            return true;
        }

        return false;
    }

    public List<MenuItem> getAllMenuItemsByCategoryId(Long categoryId) {
        Optional<Category> categoryOptional = categoryRepository.findById(categoryId);

        if (categoryOptional.isPresent()) {
//           categoryRepository.findAllMenuItemsByCategoryId(categoryId);
            Category category = categoryOptional.get();
            return category.getItems();
        }

        return new ArrayList<MenuItem>();
    }
}
