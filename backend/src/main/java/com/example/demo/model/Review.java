package com.example.demo.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Date;

@Entity
@Table(name = "tbl_reviews", uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "order_detail_id", "type"}))
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class Review {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER, cascade = CascadeType.REFRESH)
    @NotNull(message = "User cannot be null")
    @JoinColumn(name="user_id", nullable = false)
    private User user;

    @OneToOne(fetch = FetchType.EAGER, cascade = CascadeType.REFRESH)
    @NotNull(message = "Order Detail cannot be null")
    @JoinColumn(name = "order_detail_id", nullable = false)
    @JsonIgnoreProperties({"review", "menuItem"})
    private OrderDetail orderDetail;

    @ManyToOne(fetch = FetchType.EAGER, cascade = CascadeType.REFRESH)
    @JoinColumn(name="menu_item_id", nullable = false)
    @NotNull(message = "Menu Item cannot be null")
    @JsonIgnoreProperties({"reviews"})
    private MenuItem menuItem;

    @Min(value = 1, message = "Rating must be at least 1")
    @Max(value = 5, message = "Rating must be at most 5")
    private float rating;

    @Size(max = 500, message = "Comment cannot exceed 500 characters")
    private String comment;

    @Size(max = 500, message = "Response cannot exceed 500 characters")
    private String response;

    @NotNull(message = "Review type cannot be null")
    private ReviewType type = ReviewType.ITEM;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "created_at", nullable = false, updatable = false)
    @NotNull(message = "Creation date cannot be null")
    private Date createdAt = new Date();
}

enum ReviewType {
    ITEM,
    CANTEEN
}
