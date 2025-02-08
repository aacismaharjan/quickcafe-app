package com.example.demo.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

@Getter
@Setter
public class PasswordResetRequest {

    @NotNull(message = "Email cannot be null")
    @NotEmpty(message = "Email cannot be empty")
    private String email;

    @NotNull(message = "OTP cannot be null")
    @NotEmpty(message = "OTP cannot be empty")
    private String otp;

    @NotNull(message = "New password cannot be null")
    @NotEmpty(message = "New password cannot be empty")
    private String newPassword;

    @NotNull(message = "Confirm password cannot be null")
    @NotEmpty(message = "Confirm password cannot be empty")
    private String confirmPassword;
}
