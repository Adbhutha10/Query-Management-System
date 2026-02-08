package com.example.QuerySystem.service;

import com.example.QuerySystem.entity.User;
import com.example.QuerySystem.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Map;
import java.util.Random;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    // ===============================
    // 1️⃣ SIGNUP → CREATE USER + SEND OTP
    // ===============================
    public void signup(Map<String, String> data) {

        String email = data.get("email");

        if (userRepository.findByEmail(email) != null) {
            throw new RuntimeException("Email already registered");
        }

        User user = new User();
        user.setUserId(generateUserId());
        user.setName(data.get("name"));
        user.setAge(data.get("age"));
        user.setGender(data.get("gender"));
        user.setQualification(data.get("qualification"));
        user.setCollege(data.get("college"));
        user.setPlace(data.get("place"));
        user.setState(data.get("state"));
        user.setMobile(data.get("mobile"));
        user.setEmail(email);
        user.setCreatedAt(LocalDateTime.now());
        user.setActive(false);

        String otp = generateOtp();
        user.setOtp(otp);
        user.setOtpExpiry(LocalDateTime.now().plusMinutes(5));

        userRepository.save(user);
        emailService.sendOtp(email, otp);
    }

    // ===============================
    // 2️⃣ VERIFY SIGNUP OTP
    // ===============================
    public void verifySignupOtp(String email, String inputOtp) {

        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new RuntimeException("User not found");
        }

        if (user.getOtp() == null ||
                user.getOtpExpiry().isBefore(LocalDateTime.now()) ||
                !user.getOtp().equals(inputOtp)) {

            throw new RuntimeException("Invalid or expired OTP");
        }

        user.setActive(true);
        user.setOtp(null);
        user.setOtpExpiry(null);
        userRepository.save(user);
    }

    // ===============================
    // 3️⃣ LOGIN → SEND OTP
    // ===============================
    public void login(String email) {

        User user = userRepository.findByEmail(email);

        if (user == null || !user.isActive()) {
            throw new RuntimeException("Account not found or not activated");
        }

        String otp = generateOtp();
        user.setOtp(otp);
        user.setOtpExpiry(LocalDateTime.now().plusMinutes(5));
        userRepository.save(user);

        emailService.sendOtp(email, otp);
    }

    // ===============================
    // 4️⃣ VERIFY LOGIN OTP
    // ===============================
    public String verifyLoginOtp(String email, String inputOtp) {

        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new RuntimeException("User not found");
        }

        if (user.getOtp() == null ||
                user.getOtpExpiry().isBefore(LocalDateTime.now()) ||
                !user.getOtp().equals(inputOtp)) {

            throw new RuntimeException("Invalid or expired OTP");
        }

        user.setOtp(null);
        user.setOtpExpiry(null);
        userRepository.save(user);

        return user.getUserId();
    }

    // ===============================
    // 🔐 USER ID GENERATOR
    // ===============================
    private String generateUserId() {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");
        String timestamp = LocalDateTime.now().format(formatter);
        int rand = new Random().nextInt(90) + 10;
        return "U" + timestamp + rand;
    }

    // ===============================
    // 🔐 OTP GENERATOR
    // ===============================
    private String generateOtp() {
        return String.valueOf(100000 + new Random().nextInt(900000));
    }

    // ===============================
    // 👤 GET USER BY ID
    // ===============================
    public User getUserById(String userId) {
        return userRepository.findById(userId).orElse(null);
    }
}
