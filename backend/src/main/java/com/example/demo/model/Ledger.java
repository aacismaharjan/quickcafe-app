package com.example.demo.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Cascade;

import java.util.*;

@Entity
@Table(name = "tbl_ledger")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Ledger {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String description;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "created_at", nullable = false, updatable = false)
    private Date createdAt = new Date();


    @JsonIgnoreProperties({"ledgers", "activeLedger"})
    @ManyToOne( cascade={CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REFRESH})
    @JoinColumn(name = "canteen_id", nullable = false)
    private Canteen canteen;


//    // Many-to-many relationship with Menu
//    @ManyToMany(mappedBy = "ledgers") // mappedBy indicates this is the inverse side
//    private Set<Menu> menus = new HashSet<>(); // A ledger can have multiple menus

    @ManyToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REFRESH}, fetch=FetchType.EAGER)
    @JoinTable(
            name="tbl_ledger_menus",
            joinColumns = @JoinColumn(name = "ledger_id"),
            inverseJoinColumns  = @JoinColumn(name = "menu_id"),
            uniqueConstraints = @UniqueConstraint(columnNames = {"ledger_id", "menu_id"})
    )
    private Set<Menu> menus = new HashSet<>();

    @Override
    public String toString() {
        return "Ledger{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", description='" + description + '\'' +
                ", isActive=" + isActive +
                ", createdAt=" + createdAt +
                '}';
    }
}
