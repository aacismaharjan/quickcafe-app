package com.example.demo.model;

import java.util.*;

import com.fasterxml.jackson.annotation.*;
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

    @ManyToOne( cascade={CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REFRESH})
    @JoinColumn(name = "canteen_id", nullable = false)
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private Canteen canteen;

    @NotNull(message = "Order status cannot be null")
    private OrderStatus orderStatus;

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private List<OrderDetail> orderDetails;


    @NotNull(message = "Payment method cannot be null")
    private PaymentMethod paymentMethod;// Default payment method

    @NotNull(message = "Payment status cannot be null")
    private PaymentStatus paymentStatus;

    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt = new Date();

    @PrePersist
    protected void onCreate() {
        this.uuid = UUID.randomUUID().toString(); // Generate a unique UUID before persisting
    }

//    @JsonIgnore
//    public Canteen getCanteen() {
//            return canteen;
//    }
}

