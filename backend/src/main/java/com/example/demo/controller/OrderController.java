package com.example.demo.controller;

import com.example.demo.model.Menu;
import com.example.demo.model.OrderStats;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.model.MenuItem;
import com.example.demo.model.Order;
import com.example.demo.service.MenuItemService;
import com.example.demo.service.OrderService;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/orders") // Base mapping for the controller
public class OrderController {

    private final OrderService orderService;

    @Autowired
    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping // Maps to GET /order
    public List<Order> getAllOrder() {
        return orderService.getAllOrder();
    }

    // Endpoint to get monthly order status distribution for a specific year
    @GetMapping("/monthly-status-distribution")
    public Map<String, Map<Integer, Long>> getMonthlyOrderStatusDistribution(@RequestParam int year, Long canteenId) {
        return orderService.getMonthlyOrderStatusDistributionByYear(year, canteenId);
    }

    @GetMapping("/stats")
    public OrderStats getOrderStats() {
        return orderService.getOrderStats();
    }



    @GetMapping("/{id}") // Maps to GET /order/{id}
    public ResponseEntity<Order> getOrderById(@PathVariable Long id) {
        Optional<Order> order = orderService.getOrderById(id);
        return order.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping // Maps to POST /order
    public Order createOrder(@RequestBody Order order) {
        return orderService.createOrder(order);
    }

    @PutMapping("/{id}") // Maps to PUT /order/{id}
    public ResponseEntity<Order> updateOrder(@PathVariable Long id, @RequestBody Order order) {
        try {
            Order updateOrder = orderService.updateOrder(id, order);
            return ResponseEntity.ok(updateOrder);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PatchMapping(path="/{id}")
    public ResponseEntity<Order> partiallyUpdateOrder(
            @PathVariable Long id,
            @RequestBody Order order
    ) {
        try {
            Order savedOrder = orderService.partiallyUpdateOrder(id, order);
            return ResponseEntity.ok(savedOrder);
        } catch(Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @DeleteMapping("/{id}") // Maps to DELETE /order/{id}
    public ResponseEntity<Void> deleteOrder(@PathVariable Long id) {
        try {
        	orderService.deleteOrder(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
