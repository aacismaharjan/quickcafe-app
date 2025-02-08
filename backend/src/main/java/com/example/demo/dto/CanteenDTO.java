package com.example.demo.dto;

public class CanteenDTO {
    private Long id;
    private String name;
    private String imageUrl;
    private String address;
    private String phoneNo;
    private String about;
    private String email;
    private String openingHours;
    private String closingHours;
    private Double latitude;
    private Double longitude;
    private Long ledgerId;  // This will be the ledgerId or null if no active ledger
}
