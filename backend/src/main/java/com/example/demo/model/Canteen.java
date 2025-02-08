package com.example.demo.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Comparator;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Entity
@Table(name="tbl_canteens")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Canteen {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Name cannot be blank")
    private String name;

    private String image_url = "Canteen-Logo.jpg";

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
    @JoinColumn(name="user_id", nullable = false)
    private User user;

    private Double latitude  = 27.7172;
    private Double longitude = 85.324;


    @JsonIgnoreProperties("canteen")
    @OneToMany(mappedBy = "canteen",  cascade={CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REFRESH})
    private List<Ledger> ledgers;


    @Transient
    @JsonProperty(value = "activeLedger", access = JsonProperty.Access.READ_ONLY)
    public Ledger getActiveLedger() {
        if (ledgers == null || ledgers.isEmpty()) {
            return null;
        }
        // Ensure it's active
        // Prevent null canteen
        // Oldest first
        return ledgers.stream()
                .filter(ledger -> ledger.getIsActive() != null && ledger.getIsActive())  // Ensure it's active
                .filter(ledger -> ledger.getCanteen() != null).min(Comparator.comparing(Ledger::getCreatedAt))
                .orElse(null);
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
