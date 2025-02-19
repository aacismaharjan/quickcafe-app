package com.example.demo.model;

import com.fasterxml.jackson.annotation.*;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Cascade;

import java.util.*;

@Entity
@Table(name="tbl_canteens")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
public class Canteen {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Name cannot be blank")
    private String name;

    private String image_url;

    @NotBlank(message = "Address cannot be blank")
    private String address;

    @NotBlank(message = "Phone number cannot be blank")
    private String phone_no;
    private String about;

    @Email(message = "Email should be valid")
    private String email;

    @NotNull(message = "Creation date is required")
    private Date created_at;
    private Boolean is_active = true;
    private String opening_hours  = "08:00 AM";
    private String closing_hours = "10:00 PM";

    @ManyToOne
    @JoinColumn(name="user_id", nullable = true)
    @JsonIgnore
    private User user;

    private Double latitude  = 27.7172;
    private Double longitude = 85.324;


    @JsonIgnore
    @OneToMany(mappedBy = "canteen",  cascade={CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REFRESH})
    private List<Ledger> ledgers;

    @JsonIgnore
    @OneToMany(mappedBy = "canteen",  cascade={CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REFRESH})
    private List<Menu> menus;

    @JsonIgnore
    @OneToMany(mappedBy = "canteen",  cascade={CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REFRESH})
    private List<MenuItem> menuItems;

    @JsonIgnore
    @OneToMany(mappedBy = "canteen",  cascade={CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REFRESH})
    private List<Order> orders;

    @JsonIgnore
    @OneToMany(mappedBy = "canteen", cascade={CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REFRESH})
    private List<Review> reviews;


    @Transient
    @JsonProperty(value = "activeLedger", access = JsonProperty.Access.READ_ONLY)
    @JsonIgnore
    public Ledger getActiveLedger() {
        if (ledgers == null || ledgers.isEmpty()) {
            return null;
        }
        return ledgers.stream()
                .filter(ledger -> ledger.getIsActive() != null && ledger.getIsActive())  // Ensure it's active
                .filter(ledger -> ledger.getCanteen() != null).min(Comparator.comparing(Ledger::getCreatedAt))
                .orElse(null);
    }


    @Transient
    public Long getActiveLedgerId() {
        if(ledgers == null || ledgers.isEmpty()) {
            return null;
        }
        return ledgers.stream()
//                .filter(ledger -> ledger.getIsActive() != null && ledger.getIsActive())
                .filter(ledger -> Boolean.TRUE.equals(ledger.getIsActive()))
                .filter(ledger -> ledger.getCanteen() != null)
                .min(Comparator.comparing(Ledger::getCreatedAt))
                .map(Ledger::getId)
                .orElse(null);
    }

    @Transient
    public ReviewStats getReviewsStat() {
        if (ledgers == null || ledgers.isEmpty()) {
            return new ReviewStats(0.0f, 0);
        }

        float totalRating = 0.0f;
        int reviewerCount = 0;

        // Iterate through all Ledgers
        for (Ledger ledger : ledgers) {
            // Get Menus related to the Ledger
            Set<Menu> menus = ledger.getMenus();
            if (menus != null) {
                // Iterate through all Menus
                for (Menu menu : menus) {
                    // Get MenuItems related to the Menu
                    Set<MenuItem> menuItems = menu.getItems();
                    if (menuItems != null) {
                        // Iterate through all MenuItems
                        for (MenuItem menuItem : menuItems) {
                            // Get Reviews related to the MenuItem
                            List<Review> reviews = menuItem.getReviews();
                            if (reviews != null) {
                                // Iterate through all Reviews
                                for (Review review : reviews) {
                                    totalRating += review.getRating();
                                    reviewerCount++;
                                }
                            }
                        }
                    }
                }
            }
        }

        // Calculate average rating if there are reviews
        float averageRating = reviewerCount > 0 ? totalRating / reviewerCount : 0.0f;
        return new ReviewStats(averageRating, reviewerCount);
    }


    @Transient
    public Integer getUserId() {
        return (this.user != null) ? this.user.getId() : null;
    }

    @Override
    public String toString() {
        return "Canteen{" +
                "longitude=" + longitude +
                ", latitude=" + latitude +
                ", user=" + user +
                ", closing_hours='" + closing_hours + '\'' +
                ", opening_hours='" + opening_hours + '\'' +
                ", is_active=" + is_active +
                ", created_at=" + created_at +
                ", email='" + email + '\'' +
                ", about='" + about + '\'' +
                ", phone_no='" + phone_no + '\'' +
                ", address='" + address + '\'' +
                ", image_url='" + image_url + '\'' +
                ", name='" + name + '\'' +
                ", id=" + id +
                '}';
    }
}
