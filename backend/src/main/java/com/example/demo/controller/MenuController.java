package com.example.demo.controller;

import com.example.demo.model.Menu;
import com.example.demo.model.MenuItem;
import com.example.demo.service.MenuItemService;
import com.example.demo.service.MenuService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/menus")
public class MenuController {
    private final MenuService menuService;
    private final MenuItemService menuItemService;

    @Autowired
    public MenuController(MenuService menuService, MenuItemService menuItemService) {
        this.menuService = menuService;
        this.menuItemService = menuItemService;
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
        List<MenuItem> existingItems = menu.getItems().stream()
                .map(item -> item.getId())
                .map(itemId -> menuItemService.getMenuItemById(itemId)
                        .orElseThrow(() -> new RuntimeException("Item not found with ID: " + itemId)))
                .toList();

        menu.setItems(existingItems);
        return menuService.createMenu(menu);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Menu> updateMenu(@PathVariable Long id, @RequestBody Menu menu) {
        try {
            List<MenuItem> existingItems = menu.getItems().stream()
                    .map(item -> item.getId())
                    .map(itemId -> menuItemService.getMenuItemById(itemId)
                            .orElseThrow(() -> new RuntimeException("Item not found with ID: " + itemId)))
                    .toList();

            menu.setItems(existingItems);
            Menu updatedMenu = menuService.updateMenu(id, menu);
            return ResponseEntity.ok(updatedMenu);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
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
