package com.example.QuerySystem.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
public class Admin {

    @Id
    private String adminId;

    private String email;

    private String otp;
    private LocalDateTime otpExpiry;

    private boolean active;
}
