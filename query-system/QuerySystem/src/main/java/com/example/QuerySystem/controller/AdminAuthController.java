package com.example.QuerySystem.controller;

import com.example.QuerySystem.service.AdminAuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin/auth")
@CrossOrigin
public class AdminAuthController {

    @Autowired
    private AdminAuthService adminAuthService;

    // ADMIN LOGIN → SEND OTP
    @PostMapping("/login")
    public Map<String, String> login(@RequestBody Map<String, String> body) {
        adminAuthService.login(body.get("email"));
        return Map.of("message", "OTP sent to admin email");
    }

    // VERIFY ADMIN OTP
    @PostMapping("/verify")
    public Map<String, String> verify(@RequestBody Map<String, String> body) {
        String adminId = adminAuthService.verifyOtp(
                body.get("email"),
                body.get("otp")
        );

        return Map.of(
                "message", "Admin login successful",
                "adminId", adminId
        );
    }
}
