package com.example.demo.controller;

import com.example.demo.model.*;
import com.example.demo.service.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;


@RestController
@RequestMapping("/api/v1/canteens")
public class CanteenController {
    private final CanteenService canteenService;
    private final LedgerService ledgerService;
    private final MenuService menuService;
    private final MenuItemService menuItemService;
    private final ReviewService reviewService;

    private final FileStorageService fileStorageService;
    private final OrderService orderService;

    @Autowired
    public CanteenController(CanteenService canteenService, LedgerService ledgerService, MenuService menuService, MenuItemService menuItemService, ReviewService reviewService, FileStorageService fileStorageService, OrderService orderService) {
        this.canteenService = canteenService;
        this.ledgerService = ledgerService;
        this.menuService = menuService;
        this.menuItemService = menuItemService;
        this.reviewService = reviewService;
        this.fileStorageService = fileStorageService;
        this.orderService = orderService;
    }

    @GetMapping
    public ResponseEntity<List<Canteen>> getAllCanteens() {
        List<Canteen> canteens = canteenService.getAllCanteens();
        return ResponseEntity.ok(canteens);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Canteen> getCanteenById(@PathVariable Long id) {
        Optional<Canteen> canteen = canteenService.getCanteenById(id);
        return canteen.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public Canteen createCanteen (@RequestBody Canteen canteen) {
        return canteenService.createCanteen(canteen);
    }

    @PatchMapping(value = "/{id}", consumes = {MediaType.MULTIPART_FORM_DATA_VALUE, MediaType.APPLICATION_OCTET_STREAM_VALUE},
            produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Canteen> updateCanteen(
            @PathVariable Long id,
            @RequestPart("canteenJson") String canteenJson,
            @RequestPart(value = "image_url", required = false) MultipartFile imageFile) {
        try {
            // Convert JSON string to Canteen object
            ObjectMapper objectMapper = new ObjectMapper();
            Canteen canteen = objectMapper.readValue(canteenJson, Canteen.class);

            // If an image is uploaded, save and update the image URL
            if (imageFile != null && !imageFile.isEmpty()) {
                String imagePath = fileStorageService.saveFile(imageFile, "canteen");
                canteen.setImage_url(imagePath);
            }

            // Update the canteen details
            Canteen updatedCanteen = canteenService.updateCanteen(id, canteen);
            return ResponseEntity.ok(updatedCanteen);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCanteen(@PathVariable Long id) {
        try {
            canteenService.deleteCanteen(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/{canteenId}/ledgers")
    public ResponseEntity<List<Ledger>> getAllLedgersByCanteen(@PathVariable Long canteenId) {
       try {
           List<Ledger> ledgers = ledgerService.getLedgersByCanteenId(canteenId);
           return ResponseEntity.ok(ledgers);
       }catch (Exception ex) {
           throw new RuntimeException(ex.getMessage());
       }
    }

    @GetMapping("/{canteenId}/ledgers/{ledgerId}")
    public ResponseEntity<Ledger> getLedgerByLedgerIdAndCanteenId(@PathVariable Long canteenId, @PathVariable Long ledgerId) {
        try {
          Ledger ledger = ledgerService.getLedgerByLedgerIdAndCanteenId(ledgerId, canteenId);
            return ResponseEntity.ok(ledger);
        }catch (Exception ex) {
            throw new RuntimeException(ex.getMessage());
        }
    }

    @PostMapping("/{canteenId}/ledgers")
    public ResponseEntity<Ledger> createLedgerByCanteenId(@PathVariable Long canteenId, @RequestBody Ledger ledger) {
        try {
            Canteen canteen = canteenService.getCanteenById(canteenId)
                    .orElseThrow(() -> new RuntimeException("Canteen not found with id: " + canteenId));
            ledger.setCanteen(canteen);
            Ledger createdLedger = ledgerService.createLedger(ledger);
            return new ResponseEntity<>(createdLedger, HttpStatus.CREATED);
        } catch(Exception ex) {
            throw new RuntimeException(ex.getMessage());
        }
    }

    @PatchMapping("/{canteenId}/ledgers/{ledgerId}")
    public ResponseEntity<Ledger> updateLedgerPartiallyByCanteenId(@PathVariable Long canteenId, @PathVariable Long ledgerId, @RequestBody Ledger ledger) {
        try {
            Canteen canteen = canteenService.getCanteenById(canteenId)
                    .orElseThrow(() -> new RuntimeException("Canteen not found with id: " + canteenId));
            ledger.setCanteen(canteen);

            Ledger partiallyUpdatedLedger = ledgerService.partiallyUpdateLedger(ledgerId, ledger);
            return new ResponseEntity<>(partiallyUpdatedLedger, HttpStatus.OK);
        }catch(Exception ex) {
            throw new RuntimeException(ex.getMessage());
        }
    }

    @DeleteMapping("/{canteenId}/ledgers/{ledgerId}")
    public ResponseEntity<Void> deleteLedgerByCanteenId(@PathVariable Long canteenId, @PathVariable Long ledgerId) {
        try {
            if (!ledgerService.isLedgerOwnedByCanteen(ledgerId, canteenId)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build(); // 403 Forbidden
            }
            ledgerService.deleteLedger(ledgerId);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @GetMapping("/{canteenId}/orders")
    public ResponseEntity<List<Order>> getAllOrderByCanteenId(@PathVariable Long canteenId) {
        try {
            List<Order> orders = orderService.getAllOrderByCanteenId(canteenId);
            return ResponseEntity.ok(orders);
        }catch (Exception ex) {
            throw new RuntimeException(ex.getMessage());
        }
    }

    @GetMapping("/{canteenId}/orders/{orderId}")
    public ResponseEntity<Order> getOrderByOrderIdAndCanteenId(@PathVariable Long canteenId, @PathVariable Long orderId) {
        try {
            Order order = orderService.getOrderByOrderIdByCanteenId(orderId, canteenId);
            return ResponseEntity.ok(order);
        }catch (Exception ex) {
            throw new RuntimeException(ex.getMessage());
        }
    }

    @PatchMapping("/{canteenId}/orders/{orderId}")
    public ResponseEntity<Order> updateOrderPartiallyByCanteenId(@PathVariable Long canteenId, @PathVariable Long orderId, @RequestBody Order order) {
        try {
            Canteen canteen = canteenService.getCanteenById(canteenId)
                    .orElseThrow(() -> new RuntimeException("Canteen not found with id: " + canteenId));
            order.setCanteen(canteen);

            Order partiallyUpdatedOrder = orderService.partiallyUpdateOrder(orderId, order);
            return new ResponseEntity<>(partiallyUpdatedOrder, HttpStatus.OK);
        }catch(Exception ex) {
            throw new RuntimeException(ex.getMessage());
        }
    }

    @GetMapping("/{canteenId}/menus")
    public ResponseEntity<List<Menu>> getAllMenuByCanteenId(@PathVariable Long canteenId) {
        try {
//            List<Menu> menus = menuService.getAllOrderByCanteenId(canteenId);
            List<Menu> menus = menuService.getAllMenuByCanteenId(canteenId);
            return ResponseEntity.ok(menus);
        }catch (Exception ex) {
            throw new RuntimeException(ex.getMessage());
        }
    }

    @GetMapping("/{canteenId}/menu-items")
    public ResponseEntity<List<MenuItem>> getAllMenuItemByCanteenId(@PathVariable Long canteenId) {
        try {
            List<MenuItem> menuItems = menuItemService.getAllMenuItemByCanteenId(canteenId);
            return ResponseEntity.ok(menuItems);
        }catch(Exception ex) {
            throw new RuntimeException(ex.getMessage());
        }
    }

    @GetMapping("/{canteenId}/reviews")
    public ResponseEntity<List<Review>> getAllReviewByCanteenId(@PathVariable Long canteenId) {
        try {
            List<Review> reviews = reviewService.getAllReviewByCanteenId(canteenId);
            return ResponseEntity.ok(reviews);
        }catch(Exception ex) {
            throw new RuntimeException(ex.getMessage());
        }
    }

}
