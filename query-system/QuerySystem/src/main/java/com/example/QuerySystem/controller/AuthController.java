package com.example.QuerySystem.controller;

import com.example.QuerySystem.service.AuthService;
import com.example.QuerySystem.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody Map<String, String> request) {
        authService.signup(request);
        return ResponseEntity.ok(Map.of(
                "message", "OTP sent to email for verification"
        ));
    }

    @PostMapping("/verify-signup-otp")
    public ResponseEntity<?> verifySignupOtp(@RequestBody Map<String, String> request) {
        authService.verifySignupOtp(
                request.get("email"),
                request.get("otp")
        );
        return ResponseEntity.ok(Map.of(
                "message", "Account verified successfully"
        ));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {
        authService.login(request.get("email"));
        return ResponseEntity.ok(Map.of(
                "message", "OTP sent to email for login"
        ));
    }

    @PostMapping("/verify-login-otp")
    public ResponseEntity<?> verifyLoginOtp(@RequestBody Map<String, String> request) {

        String userId = authService.verifyLoginOtp(
                request.get("email"),
                request.get("otp")
        );

        return ResponseEntity.ok(Map.of(
                "message", "Login successful",
                "userId", userId
        ));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getUserById(@PathVariable String userId) {
        User user = authService.getUserById(userId);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(user);
    }
}
