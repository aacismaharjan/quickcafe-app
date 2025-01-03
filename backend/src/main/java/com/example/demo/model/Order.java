package com.example.demo.model;

import java.util.*;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "tbl_orders")
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false) // Ensure UUID is unique and cannot be null
    private String uuid; // UUID field
    
    @ManyToOne
    @NotNull(message = "User cannot be null")
    @JoinColumn(name="user_id", nullable = false)
    private User user;

    @NotNull(message = "Order status cannot be null")
    private String orderStatus;

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private List<OrderDetail> orderDetails;


    @NotNull(message = "Payment method cannot be null")
    private PaymentMethod paymentMethod = PaymentMethod.CASH; // Default payment method

    @NotNull(message = "Payment status cannot be null")
    private PaymentStatus paymentStatus;

    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt = new Date();

    @PrePersist
    protected void onCreate() {
        this.uuid = UUID.randomUUID().toString(); // Generate a unique UUID before persisting
    }
}

