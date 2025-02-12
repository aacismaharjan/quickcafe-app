package com.example.demo.service;

import com.example.demo.model.*;
import jakarta.persistence.EntityManager;
import org.aspectj.weaver.ast.Or;
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

    public long getTotalOrders(Long canteenId) {
        return orderRepository.countByCanteenId(canteenId);
    }

    // Get number of pending orders
    public long getPendingOrders() {
        return orderRepository.countByOrderStatusAndOptionalCanteenId(OrderStatus.IN_PROGRESS, null);
    }

    public long getPendingOrders(Long canteenId) {
        return orderRepository.countByOrderStatusAndOptionalCanteenId(OrderStatus.IN_PROGRESS, canteenId);
    }

    // Get number of completed orders
    public long getCompletedOrders() {
        return orderRepository.countByOrderStatusAndOptionalCanteenId(OrderStatus.COMPLETED, null);
    }

    // Get number of completed orders
    public long getCompletedOrders(Long canteenId) {
        return orderRepository.countByOrderStatusAndOptionalCanteenId(OrderStatus.COMPLETED, canteenId);
    }

    // Get number of cancelled orders
    public long getCancelledOrders() {
        return orderRepository.countByOrderStatusAndOptionalCanteenId(OrderStatus.CANCELED, null);
    }

    public long getCancelledOrders(Long canteenId) {
        return orderRepository.countByOrderStatusAndOptionalCanteenId(OrderStatus.CANCELED, canteenId);
    }

    public double getTotalRevenue() {
        Double totalRevenue = orderRepository.sumTotalRevenueByOrderStatusAndOptionalCanteenId(OrderStatus.COMPLETED, null);
        return totalRevenue != null ? totalRevenue : 0.0;
    }

    public double getTotalRevenue(Long canteenId) {
        Double totalRevenue = orderRepository.sumTotalRevenueByOrderStatusAndOptionalCanteenId(OrderStatus.COMPLETED, canteenId);
        return totalRevenue != null ? totalRevenue : 0.0;
    }

    public double getPendingPayment() {
        Double pendingPayment = orderRepository.sumTotalRevenueByPaymentStatusAndOptionalCanteenId(PaymentStatus.PENDING, null);
        return pendingPayment != null ? pendingPayment : 0.0;
    }

    public double getPendingPayment(Long canteenId) {
        Double pendingPayment = orderRepository.sumTotalRevenueByPaymentStatusAndOptionalCanteenId(PaymentStatus.PENDING, canteenId);
        return pendingPayment != null ? pendingPayment : 0.0;
    }

    public double getPaidAmount() {
        Double paidAmount = orderRepository.sumTotalRevenueByPaymentStatusAndOptionalCanteenId(PaymentStatus.PAID, null);
        return paidAmount != null ? paidAmount : 0.0;
    }

    public double getPaidAmount(Long canteenId) {
        Double paidAmount = orderRepository.sumTotalRevenueByPaymentStatusAndOptionalCanteenId(PaymentStatus.PAID, canteenId);
        return paidAmount != null ? paidAmount : 0.0;
    }

    public double getFailedAmount() {
        Double failedAmount = orderRepository.sumTotalRevenueByPaymentStatusAndOptionalCanteenId(PaymentStatus.FAILED, null);
        return failedAmount != null ? failedAmount : 0.0;
    }
    public double getFailedAmount(Long canteenId) {
        Double failedAmount = orderRepository.sumTotalRevenueByPaymentStatusAndOptionalCanteenId(PaymentStatus.FAILED, canteenId);
        return failedAmount != null ? failedAmount : 0.0;
    }

    public OrderStats getOrderStats() {
        long totalOrders = this.getTotalOrders();
        long pendingOrders = this.getPendingOrders();
        long completedOrders = this.getCompletedOrders();
        long cancelledOrders = this.getCancelledOrders();

        double totalRevenue = this.getTotalRevenue();
        double pendingPayment = this.getPendingPayment();
        double paidAmount = this.getPaidAmount();
        double failedAmount = this.getFailedAmount();

        return new OrderStats(
                totalOrders,
                pendingOrders,
                completedOrders,
                cancelledOrders,
                totalRevenue,
                pendingPayment,
                paidAmount,
                failedAmount
        );
    }

    public OrderStats getOrderStats(Long canteenId) {
        return new OrderStats(
                this.getTotalOrders(canteenId),
                this.getPendingOrders(canteenId),
                this.getCompletedOrders(canteenId),
                this.getCancelledOrders(canteenId),
                this.getTotalRevenue(canteenId),
                this.getPendingPayment(canteenId),
                this.getPaidAmount(canteenId),
                this.getFailedAmount(canteenId));
    }

    // Get monthly distribution of orders by status for a specific year
    public Map<String, Map<Integer, Long>> getMonthlyOrderStatusDistributionByYear(int year, Long canteenId) {
        Map<String, Map<Integer, Long>> monthlyDistribution = new HashMap<>();

        for (OrderStatus status : OrderStatus.values()) {
            Map<Integer, Long> monthlyCounts = new HashMap<>();

            // Fetch the count of orders grouped by month and status
            List<Object[]> results = orderRepository.countOrdersByStatusAndYearGroupedByMonthAndOptionalCanteenId(year, status, canteenId);

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
