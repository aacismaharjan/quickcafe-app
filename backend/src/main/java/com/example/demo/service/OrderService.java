package com.example.demo.service;

import com.example.demo.model.*;
import jakarta.persistence.EntityManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.repository.OrderRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
public class OrderService {

	@Autowired
    private final OrderRepository orderRepository;

    @Autowired
    private final EntityManager entityManager;
	

    @Autowired
    public OrderService(OrderRepository orderRepository, EntityManager entityManager) {
        this.orderRepository = orderRepository;
        this.entityManager = entityManager;
    }

    public List<Order> getAllOrder() {
        return orderRepository.findAllByOrderByCreatedAtDesc();
    }

    public List<Order> getAllOrderByUserId(int userId) {
        try {
            List<Order> orders = orderRepository.findByUserIdOrderByCreatedAtDesc(userId);
            return orders;
        }catch (Exception e){
            System.out.println(e);
        }
        return null;
    }

    public Optional<Order> getOrderById(Long id) {
        return orderRepository.findById(id);
    }


    @Transactional
    public Order createOrder(@org.jetbrains.annotations.NotNull Order order) {
        return orderRepository.save(order);
    }

    @Transactional
    public Order updateOrder(Long id, Order order) {
        if (orderRepository.existsById(id)) {
        	order.setId(id);
            return orderRepository.save(order);
        } else {
            throw new RuntimeException("Order not found");
        }
    }

    @Transactional
    public void deleteOrder(Long id) {
        if (orderRepository.existsById(id)) {
        	orderRepository.deleteById(id);
        } else {
            throw new RuntimeException("Order not found");
        }
    }

    public long getTotalOrders() {
        return orderRepository.count();
    }

    // Get number of pending orders
    public long getPendingOrders() {
        return orderRepository.countByOrderStatus(OrderStatus.IN_PROGRESS);
    }

    // Get number of completed orders
    public long getCompletedOrders() {
        return orderRepository.countByOrderStatus(OrderStatus.COMPLETED);
    }

    // Get number of cancelled orders
    public long getCancelledOrders() {
        return orderRepository.countByOrderStatus(OrderStatus.CANCELED);
    }

    public double getTotalRevenue() {
        Double totalRevenue = orderRepository.sumTotalRevenueByOrderStatus(OrderStatus.COMPLETED);
        return totalRevenue != null ? totalRevenue : 0.0;
    }

    public double getPendingPayment() {
        Double pendingPayment = orderRepository.sumTotalRevenueByPaymentStatus(PaymentStatus.PENDING);
        return pendingPayment != null ? pendingPayment : 0.0;
    }

    public double getPaidAmount() {
        Double paidAmount = orderRepository.sumTotalRevenueByPaymentStatus(PaymentStatus.PAID);
        return paidAmount != null ? paidAmount : 0.0;
    }

    public double getFailedAmount() {
        Double failedAmount = orderRepository.sumTotalRevenueByPaymentStatus(PaymentStatus.FAILED);
        return failedAmount != null ? failedAmount : 0.0;
    }

    // Get monthly distribution of orders by status for a specific year
    public Map<String, Map<Integer, Long>> getMonthlyOrderStatusDistributionByYear(int year) {
        Map<String, Map<Integer, Long>> monthlyDistribution = new HashMap<>();

        for (OrderStatus status : OrderStatus.values()) {
            Map<Integer, Long> monthlyCounts = new HashMap<>();

            // Fetch the count of orders grouped by month and status
            List<Object[]> results = orderRepository.countOrdersByStatusAndYearGroupedByMonth(year, status);

            // Process the results
            for (Object[] result : results) {
                int month = ((Number) result[0]).intValue();
                long count = ((Number) result[2]).longValue();
                monthlyCounts.put(month, count);
            }

            // Store the counts for each status
            monthlyDistribution.put(status.name(), monthlyCounts);
        }

        return monthlyDistribution;
    }

    public Order partiallyUpdateOrder(Long id, Order order) {
        Order existingOrder = orderRepository.findById(id)
                .orElseThrow(()-> new RuntimeException("Order not found"));

        if(order.getPaymentMethod() != null) {
            existingOrder.setPaymentMethod(order.getPaymentMethod());
        }

        if(order.getPaymentStatus() != null) {
            existingOrder.setPaymentStatus(order.getPaymentStatus());
        }

        if(order.getOrderStatus() != null) {
            existingOrder.setOrderStatus(order.getOrderStatus());
        }


        return orderRepository.save(existingOrder);
    }

    public List<Order> getAllOrderByCanteenId(Long canteenId) {
        try {
           List<Order> orders =  orderRepository.findByCanteenId(canteenId);
           return orders;
        }catch (Exception ex) {
            throw new RuntimeException(ex.getMessage());
        }
    }

    public Order getOrderByOrderIdByCanteenId(Long orderId, Long canteenId) {
        try {
            Optional<Order> order = orderRepository.findByIdAndCanteenId(orderId, canteenId);
            if(order.isPresent()) {
                return order.get();
            }
            throw new RuntimeException("Ledger not found.");
        }catch (Exception ex) {
            throw new RuntimeException("Unable to fetch order by canteen id.");
        }
    }


}
