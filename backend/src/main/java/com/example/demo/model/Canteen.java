package com.example.demo.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.Date;

@Entity
@Table(name="tbl_canteens")
@Data
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

}
