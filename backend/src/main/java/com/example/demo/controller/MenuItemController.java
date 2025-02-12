package com.example.demo.controller;

import com.example.demo.model.Canteen;
import com.example.demo.model.Category;
import com.example.demo.repository.CategoryRepository;
import com.example.demo.service.CanteenService;
import com.example.demo.service.CategoryService;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.coyote.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.model.MenuItem;
import com.example.demo.service.MenuItemService;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/menu-items") // Base mapping for the controller
public class MenuItemController {

    private final CanteenService canteenService;
    private final MenuItemService menuItemService;
    private final FileStorageService fileStorageService;
    private final CategoryRepository categoryRepository;

    @Autowired
    public MenuItemController(CanteenService canteenService, MenuItemService menuItemService, FileStorageService fileStorageService,
                              CategoryRepository categoryRepository) {
        this.canteenService = canteenService;
        this.menuItemService = menuItemService;
        this.fileStorageService = fileStorageService;
        this.categoryRepository = categoryRepository;
    }

    @GetMapping
    public ResponseEntity<List<MenuItem>> getAllMenuItems(@RequestParam Map<String, String> queryString) {
    	
    	List<MenuItem> menuItems = menuItemService.getAllMenuItems(queryString);
        return ResponseEntity.ok(menuItems);
    }

    @GetMapping(path="/search")
    public ResponseEntity<Map<String, Object> > getAllMenuItemsWithPagination(@RequestParam Map<String, String> queryString) {
        Map<String, Object> menuItems = menuItemService.getAllMenuItemsWithPagination(queryString);
        return ResponseEntity.ok(menuItems);
    }

    @GetMapping("/{id}") // Maps to GET /menuitems/{id}
    public ResponseEntity<MenuItem> getMenuItemById(@PathVariable Long id) {
        Optional<MenuItem> menuItem = menuItemService.getMenuItemById(id);
        return menuItem.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

//    @PostMapping // Maps to POST /menuitems
//    public MenuItem createMenuItem(@RequestBody MenuItem menuItem) {
//        return menuItemService.createMenuItem(menuItem);
//    }

    @PostMapping(consumes = {MediaType.MULTIPART_FORM_DATA_VALUE, MediaType.APPLICATION_OCTET_STREAM_VALUE},
            produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<MenuItem> createMenuItem(
            @RequestPart("menuItem") String menuItemJson,
            @RequestPart("categories") String categoriesJson,
            @RequestPart("image_file") MultipartFile imageFile
    ) {
        try {
            // Convert the JSON string to a MenuItem object
            ObjectMapper objectMapper = new ObjectMapper();
            MenuItem menuItem = objectMapper.readValue(menuItemJson, MenuItem.class);


            Canteen canteen = canteenService.getCanteenById(menuItem.getCanteen().getId())
                    .orElseThrow(() -> new RuntimeException("Canteen not found with id: " + menuItem.getCanteen().getId()));
            menuItem.setCanteen(canteen);

            // Deserialize categoriesJson into a List<Category> using TypeReference
            List<Category> categories = objectMapper.readValue(categoriesJson, new TypeReference<List<Category>>() {});

            // Save the image and get the file path
            String imagePath = fileStorageService.saveFile(imageFile);

            // Set the image path to the menu item
            menuItem.setImage_url(imagePath);

            // Map and manage categories
            List<Category> managedCategories = categories.stream()
                    .map(category -> {
                        if (category.getId() != null) {
                            return categoryRepository.findById(category.getId()).orElse(category);
                        }
                        return category;
                    })
                    .collect(Collectors.toList());
            menuItem.setCategories(managedCategories);

            // Save the menu item to the database
            MenuItem savedMenuItem = menuItemService.createMenuItem(menuItem);

            return ResponseEntity.ok(savedMenuItem);
        } catch (Exception e) {
            e.printStackTrace(); // Log the exception for debugging
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PutMapping("/{id}") // Maps to PUT /menuitems/{id}
    public ResponseEntity<MenuItem> updateMenuItem(@PathVariable Long id, @RequestBody MenuItem menuItem) {
        try {
            MenuItem updatedMenuItem = menuItemService.updateMenuItem(id, menuItem);
            return ResponseEntity.ok(updatedMenuItem);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

//    @PatchMapping("/{id}") // Maps to PATCH /menuitems/{id}
//    public ResponseEntity<MenuItem> partiallyUpdateMenuItem(
//            @PathVariable Long id,
//            @RequestBody MenuItem menuItem) {
//        try {
//            MenuItem updatedMenuItem = menuItemService.partiallyUpdateMenuItem(id, menuItem);
//            return ResponseEntity.ok(updatedMenuItem);
//        } catch (RuntimeException e) {
//            return ResponseEntity.notFound().build();
//        }
//    }
    @PatchMapping(path="/{id}", consumes={MediaType.MULTIPART_FORM_DATA_VALUE,
            MediaType.APPLICATION_OCTET_STREAM_VALUE},
            produces= MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<MenuItem> partiallyUpdateMenuItem(
            @PathVariable Long id,
            @RequestPart("menuItem") String menuItemJson,
            @RequestPart("categories") String categoriesJson,
            @RequestPart(value = "image_file", required = false) MultipartFile imageFile
    ) {
        try {
            // Convert the JSON String to a MenuItem object
            ObjectMapper objectMapper = new ObjectMapper();
            MenuItem menuItem = objectMapper.readValue(menuItemJson, MenuItem.class);

            // Deserialize categoriesJson into a List<Category> using TypeReference
            List<Category> categories = objectMapper.readValue(categoriesJson, new TypeReference<List<Category>>() {});


            if(imageFile != null) {
                // Save the image and get the file path
                String imagePath = fileStorageService.saveFile(imageFile);

                // Set the image path to the menu item
                menuItem.setImage_url(imagePath);
            }else {
                menuItem.setImage_url(null);
            }

            // Map and manage categories
            List<Category> managedCategories = categories.stream()
                    .map(category -> {
                        if (category.getId() != null) {
                            return categoryRepository.findById(category.getId()).orElse(category);
                        }
                        return category;
                    })
                    .collect(Collectors.toList());
            menuItem.setCategories(managedCategories);


            // Save the menu item to the database
            MenuItem savedMenuItem = menuItemService.partiallyUpdateMenuItem(id, menuItem);

            return ResponseEntity.ok(savedMenuItem);

        } catch(Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/{id}") // Maps to DELETE /menuitems/{id}
    public ResponseEntity<Void> deleteMenuItem(@PathVariable Long id) {
        try {
            menuItemService.deleteMenuItem(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
