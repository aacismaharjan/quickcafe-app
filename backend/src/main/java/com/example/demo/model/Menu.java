package com.example.demo.model;

import java.util.*;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Entity
@Table(name = "tbl_menus")
@Data
public class Menu {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    @NotBlank(message = "Menu name cannot be blank")
    @Size(max = 100, message = "Menu name cannot exceed 100 characters")
    private String name;

    @NotBlank(message = "Status is required")
    @Size(max = 50, message = "Status cannot exceed 50 characters")
    private String status = "My Menu";

    private Date created_at = new Date();

    private Boolean is_active = true;

    @ManyToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REFRESH}, fetch=FetchType.EAGER)
    @JoinTable(
            name="tbl_menu_menu_items",
            joinColumns = @JoinColumn(name = "menu_id"),
            inverseJoinColumns  = @JoinColumn(name = "item_id"),
            uniqueConstraints = @UniqueConstraint(columnNames = {"menu_id", "item_id"})
    )
    private Set<MenuItem> items = new HashSet<>();



    // Many-to-many relationship with Ledger

    @JsonIgnore
    @ManyToMany(mappedBy = "menus", cascade= {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REFRESH})
    private List<Ledger> ledgers = new ArrayList<>();  // A menu can be associated with multiple ledgers

    @Override
    public String toString() {
        return "Menu{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", status='" + status + '\'' +
                ", created_at=" + created_at +
                ", is_active=" + is_active +
                '}';
    }
}
