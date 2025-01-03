package com.example.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.model.OrderDetail;
import com.example.demo.repository.OrderDetailRepository;
import com.example.demo.repository.OrderRepository;

import jakarta.transaction.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class OrderDetailService {

    private final OrderDetailRepository orderDetailRepository;

    @Autowired
    public OrderDetailService(OrderDetailRepository orderDetailRepository) {
        this.orderDetailRepository = orderDetailRepository;
    }

    public List<OrderDetail> getAllOrderDetail() {
        return orderDetailRepository.findAll();
    }

    public Optional<OrderDetail> getOrderDetailById(Long id) {
        return orderDetailRepository.findById(id);
    }

    @Transactional
    public OrderDetail createOrderDetail(OrderDetail orderDetail) {
        return orderDetailRepository.save(orderDetail);
    }

    @Transactional
    public OrderDetail updateOrderDetail(Long id, OrderDetail orderDetail) {
        if (orderDetailRepository.existsById(id)) {
        	orderDetail.setId(id);
            return orderDetailRepository.save(orderDetail);
        } else {
            throw new RuntimeException("Order detail not found");
        }
    }

    @Transactional
    public void deleteOrderDetail(Long id) {
        if (orderDetailRepository.existsById(id)) {
        	orderDetailRepository.deleteById(id);
        } else {
            throw new RuntimeException("Order detail not found");
        }
    }
}
