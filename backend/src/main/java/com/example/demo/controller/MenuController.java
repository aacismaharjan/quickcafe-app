package com.example.demo.controller;

import com.example.demo.model.Canteen;
import com.example.demo.model.Category;
import com.example.demo.model.Menu;
import com.example.demo.model.MenuItem;
import com.example.demo.repository.MenuItemRepository;
import com.example.demo.service.CanteenService;
import com.example.demo.service.MenuItemService;
import com.example.demo.service.MenuService;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/menus")
public class MenuController {
    private final MenuService menuService;
    private final MenuItemService menuItemService;
    private final MenuItemRepository menuItemRepository;
    private final CanteenService canteenService;

    @Autowired
    public MenuController(MenuService menuService, MenuItemService menuItemService, MenuItemRepository menuItemRepository, CanteenService canteenService) {
        this.menuService = menuService;
        this.menuItemService = menuItemService;
        this.menuItemRepository = menuItemRepository;
        this.canteenService = canteenService;
    }

    @GetMapping
    public ResponseEntity<List<Menu>> getAllMenus() {
        List<Menu> menus = menuService.getAllMenus();
        return ResponseEntity.ok(menus);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Menu> getMenuById(@PathVariable Long id) {
        Optional<Menu> menu = menuService.getMenuById(id);
        return menu.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public Menu createMenu(@RequestBody Menu menu) {
        Set<MenuItem> existingItems = menu.getItems().stream()
                .map(MenuItem::getId)
                .map(itemId -> menuItemService.getMenuItemById(itemId)
                        .orElseThrow(() -> new RuntimeException("Item not found with ID: " + itemId)))
                .collect(Collectors.toCollection(LinkedHashSet::new));


        Canteen canteen = canteenService.getCanteenById(menu.getCanteen().getId())
                .orElseThrow(() -> new RuntimeException("Canteen not found with id: " + menu.getCanteen().getId()));
        menu.setCanteen(canteen);


        menu.setItems(existingItems);
        return menuService.createMenu(menu);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Menu> updateMenu(@PathVariable Long id, @RequestBody Menu menu) {
        try {
            Set<MenuItem> existingItems = menu.getItems().stream()
                    .map(MenuItem::getId)
                    .map(itemId -> menuItemService.getMenuItemById(itemId)
                            .orElseThrow(() -> new RuntimeException("Item not found with ID: " + itemId)))
                    .collect(Collectors.toCollection(LinkedHashSet::new));

            menu.setItems(existingItems);
            Menu updatedMenu = menuService.updateMenu(id, menu);
            return ResponseEntity.ok(updatedMenu);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PatchMapping(path="/{id}", consumes={MediaType.APPLICATION_JSON_VALUE},
            produces= MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Menu> partiallyUpdateMenu(
            @PathVariable Long id,
            @RequestBody Menu menu
    ) {
        try {
            Set<MenuItem> managedMenuItems = menu.getItems().stream()
                    .map(menuItem -> {
                        if (menuItem.getId() != null) {
                            return menuItemRepository.findById(menuItem.getId()).orElse(menuItem);
                        }
                        return menuItem;
                    })
                    .collect(Collectors.toCollection(LinkedHashSet::new));
            menu.setItems(managedMenuItems);

            // Save the menu to the database
            Menu savedMenu = menuService.partiallyUpdateMenu(id, menu);

            return ResponseEntity.ok(savedMenu);

        } catch(Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMenu(@PathVariable Long id) {
        try {
            menuService.deleteMenu(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Endpoint to add a MenuItem to a Menu
    @PostMapping("/{menuId}/items")
    public ResponseEntity<Menu> addMenuItem(@PathVariable Long menuId, @RequestBody Map<String, Long> payload) {
        Long menuItemId = payload.get("menuItemId");
        return menuService.addMenuItemToMenu(menuId, menuItemId)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Endpoint to remove a MenuItem from a Menu
    @DeleteMapping("/{menuId}/items/{menuItemId}")
    public ResponseEntity<Void> removeMenuItem(@PathVariable Long menuId, @PathVariable Long menuItemId) {
        if (menuService.removeMenuItemFromMenu(menuId, menuItemId)) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
