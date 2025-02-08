package com.example.demo.repository;

import com.example.demo.model.MenuItem;
import com.example.demo.model.OrderStatus;
import com.example.demo.model.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.model.Order;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserIdOrderByCreatedAtDesc(int userId);
    long countByOrderStatus(OrderStatus orderStatus);

    List<Order> findAllByOrderByCreatedAtDesc();

    @Query("SELECT SUM(od.unitPrice * od.quantity) FROM Order o JOIN o.orderDetails od WHERE o.orderStatus = :status")
    Double sumTotalRevenueByOrderStatus(OrderStatus status);

    @Query("SELECT SUM(od.unitPrice * od.quantity) FROM Order o JOIN o.orderDetails od WHERE o.paymentStatus = :paymentStatus")
    Double sumTotalRevenueByPaymentStatus(PaymentStatus paymentStatus);

    @Query("SELECT EXTRACT(MONTH FROM o.createdAt) AS month, o.orderStatus, COUNT(o)" +
            "FROM Order o WHERE EXTRACT(YEAR FROM o.createdAt) = :year AND o.orderStatus = :status " +
            "GROUP BY month, o.orderStatus ORDER BY month")
    List<Object[]> countOrdersByStatusAndYearGroupedByMonth(@Param("year") int year, @Param("status") OrderStatus status);

}
