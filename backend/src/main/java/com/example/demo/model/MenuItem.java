package com.example.demo.model;

import java.sql.Array;
import java.util.*;


import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "tbl_menu_items")
@Data
public class MenuItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Name cannot be blank")
    @Size(max = 100, message = "Name cannot exceed 100 characters")
    private String name;

    @NotBlank(message = "Description cannot be blank")
    @Size(max = 255, message = "Description cannot exceed 255 characters")
    private String description;

    @NotNull(message = "Price is required")
    @Positive(message = "Price must be positive")
    private double price = 0.0;

    private String image_url = "Cappuccino-Coffee.jpg";

    @NotNull(message = "Preparation time is required")
    @Positive(message = "Preparation time must be positive")
    private int preparation_time_in_min = 0;

    private Date created_at = new Date();

    private Boolean is_active = true;

    @JsonIgnore
    @ManyToMany(mappedBy = "items", cascade= {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REFRESH})
    private List<Menu> menus= new ArrayList<>();


//    @ManyToMany(cascade= {CascadeType.PERSIST, CascadeType.MERGE})
    @ManyToMany(cascade= {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REFRESH})
    @JoinTable(
            name="tbl_category_menuItem",
            joinColumns = @JoinColumn(name="menu_item_id"),
            inverseJoinColumns = @JoinColumn(name="category_id")
    )
    private List<Category> categories;

    @OneToMany(mappedBy = "menuItem", cascade = CascadeType.ALL, orphanRemoval = true,  fetch = FetchType.EAGER)
    @JsonIgnoreProperties({"menuItem"})
    private List<Review> reviews = new ArrayList<>();

    public ReviewStats getReviewsStat() {
        if(reviews.isEmpty()) {
            return new ReviewStats(0.0f, 0);
        }
        float totalRating = 0.0f;
        int reviewerCount = reviews.size();

        for(Review review: reviews) {
            totalRating += review.getRating();
        }

        float averageRating = totalRating / reviewerCount;
        return new ReviewStats(averageRating, reviewerCount);
    }

    @Override
    public String toString() {
        return "MenuItem{" +
                "is_active=" + is_active +
                ", created_at=" + created_at +
                ", preparation_time_in_min=" + preparation_time_in_min +
                ", image_url='" + image_url + '\'' +
                ", price=" + price +
                ", description='" + description + '\'' +
                ", name='" + name + '\'' +
                ", id=" + id +
                '}';
    }
}
