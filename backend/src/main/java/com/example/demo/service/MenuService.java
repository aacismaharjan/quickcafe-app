package com.example.demo.service;

import com.example.demo.model.Menu;
import com.example.demo.model.MenuItem;
import com.example.demo.repository.MenuItemRepository;
import com.example.demo.repository.MenuRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MenuService {
    private final MenuRepository menuRepository;
    private final MenuItemRepository menuItemRepository;

    @Autowired
    public MenuService(MenuRepository menuRepository, MenuItemRepository menuItemRepository) {
        this.menuRepository = menuRepository;
        this.menuItemRepository = menuItemRepository;
    }

    public List<Menu> getAllMenus() {
        return this.menuRepository.findAll();
    }

    public Optional<Menu> getMenuById(Long id) {
        return this.menuRepository.findById(id);
    }

    @Transactional
    public Menu createMenu(Menu menu) {
        return this.menuRepository.save(menu);
    }

    @Transactional
    public Menu updateMenu(Long id, Menu menu) {
        if (this.menuRepository.existsById(id)) {
            menu.setId(id);
            return this.menuRepository.save(menu);
        } else {
            throw new RuntimeException("Menu not found");
        }
    }

    @Transactional
    public void deleteMenu(Long id) {
        if (this.menuRepository.existsById(id)) {
            this.menuRepository.deleteById(id);
        } else {
            throw new RuntimeException("Menu not found");
        }
    }

    @Transactional
    public Optional<Menu> addMenuItemToMenu (Long menuId, Long menuItemId) {
        Optional<Menu> menuOptional = menuRepository.findById(menuId);
        Optional<MenuItem> menuItemOptional = menuItemRepository.findById(menuItemId);
        if(menuOptional.isPresent() && menuItemOptional.isPresent()) {
            Menu menu = menuOptional.get();
            MenuItem menuItem = menuItemOptional.get();
            menu.getItems().add(menuItem);
            menuItem.getMenus().add(menu);
            menuItemRepository.save(menuItem);
            return Optional.of(menuRepository.save(menu));
        }
        return Optional.empty();
    }

    @Transactional
    public boolean removeMenuItemFromMenu (Long menuId, Long menuItemId) {
        Optional<Menu> menuOptional = menuRepository.findById(menuId);
        Optional<MenuItem> menuItemOptional = menuItemRepository.findById(menuItemId);

        if(menuOptional.isPresent() && menuItemOptional.isPresent()) {
            Menu menu = menuOptional.get();
            MenuItem menuItem = menuItemOptional.get();

            menu.getItems().remove(menuItem);
            menuItem.getMenus().remove(menu); // remove relationship from both sides
            menuRepository.save(menu);

            return true;
        }

        return false;
    }
}
