package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.model.MenuItem;
import com.example.demo.model.Order;
import com.example.demo.model.OrderDetail;
import com.example.demo.service.MenuItemService;
import com.example.demo.service.OrderDetailService;
import com.example.demo.service.OrderService;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/v1/order-details") // Base mapping for the controller
public class OrderDetailController {

    private final OrderDetailService orderDetailService;

    @Autowired
    public OrderDetailController(OrderDetailService orderDetailService) {
        this.orderDetailService = orderDetailService;
    }

    @GetMapping // Maps to GET /order-details
    public List<OrderDetail> getAllOrderDetail() {
        return orderDetailService.getAllOrderDetail();
    }

    @GetMapping("/{id}") // Maps to GET /order-details/{id}
    public ResponseEntity<OrderDetail> getOrderDetailById(@PathVariable Long id) {
        Optional<OrderDetail> orderDetail = orderDetailService.getOrderDetailById(id);
        return orderDetail.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping // Maps to POST /order-details
    public OrderDetail createOrderDetail(@RequestBody OrderDetail orderDetail) {
        return orderDetailService.createOrderDetail(orderDetail);
    }

    @PutMapping("/{id}") // Maps to PUT /order-details/{id}
    public ResponseEntity<OrderDetail> updateOrderDetail(@PathVariable Long id, @RequestBody OrderDetail orderDetail) {
        try {
            OrderDetail updateOrderDetail = orderDetailService.updateOrderDetail(id, orderDetail);
            return ResponseEntity.ok(updateOrderDetail);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}") // Maps to DELETE /order-details/{id}
    public ResponseEntity<Void> deleteOrderDetail(@PathVariable Long id) {
        try {
        	orderDetailService.deleteOrderDetail(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
