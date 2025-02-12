package com.example.demo.repository;

import com.example.demo.model.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByUserIdOrderByCreatedAtDesc(int userId);

    long countByCanteenId(Long canteenId);

    // Count orders by order status with optional canteen ID
    @Query("SELECT COUNT(o) FROM Order o WHERE o.orderStatus = :orderStatus AND (:canteenId IS NULL OR o.canteen.id = :canteenId)")
    long countByOrderStatusAndOptionalCanteenId(@Param("orderStatus") OrderStatus orderStatus, @Param("canteenId") Long canteenId);

    List<Order> findAllByOrderByCreatedAtDesc();

    // Sum total revenue by order status and optional canteen ID
    @Query("SELECT SUM(od.unitPrice * od.quantity) FROM Order o JOIN o.orderDetails od " +
            "WHERE o.orderStatus = :status AND (:canteenId IS NULL OR o.canteen.id = :canteenId)")
    Double sumTotalRevenueByOrderStatusAndOptionalCanteenId(@Param("status") OrderStatus status, @Param("canteenId") Long canteenId);

    // Sum total revenue by payment status and optional canteen ID
    @Query("SELECT SUM(od.unitPrice * od.quantity) FROM Order o JOIN o.orderDetails od " +
            "WHERE o.paymentStatus = :paymentStatus AND (:canteenId IS NULL OR o.canteen.id = :canteenId)")
    Double sumTotalRevenueByPaymentStatusAndOptionalCanteenId(@Param("paymentStatus") PaymentStatus paymentStatus, @Param("canteenId") Long canteenId);

    // Count orders by status and year, grouped by month, including optional canteen ID
    @Query("SELECT EXTRACT(MONTH FROM o.createdAt) AS month, o.orderStatus, COUNT(o) " +
            "FROM Order o WHERE EXTRACT(YEAR FROM o.createdAt) = :year AND o.orderStatus = :status " +
            "AND (:canteenId IS NULL OR o.canteen.id = :canteenId) " +
            "GROUP BY month, o.orderStatus ORDER BY month")
    List<Object[]> countOrdersByStatusAndYearGroupedByMonthAndOptionalCanteenId(@Param("year") int year, @Param("status") OrderStatus status, @Param("canteenId") Long canteenId);

    // Find orders by canteen ID
    List<Order> findByCanteenId(Long canteenId);

    // Find a specific order by ID and canteen ID
    Optional<Order> findByIdAndCanteenId(Long orderId, Long canteenId);
}
