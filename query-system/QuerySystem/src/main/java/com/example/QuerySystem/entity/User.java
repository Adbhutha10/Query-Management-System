package com.example.QuerySystem.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Getter
@Setter
public class User {

    @Id
    @Column(name = "user_id")
    private String userId;

    private String name;
    private String age;
    private String gender;
    private String qualification;
    private String college;
    private String place;
    private String state;
    private String mobile;

    @Column(unique = true)
    private String email;

    private String otp;
    private LocalDateTime otpExpiry;

    private boolean active;
    private LocalDateTime createdAt;

    @PrePersist
    public void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
