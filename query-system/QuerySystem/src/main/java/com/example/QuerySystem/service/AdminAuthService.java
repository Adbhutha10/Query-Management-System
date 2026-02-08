package com.example.QuerySystem.service;

import com.example.QuerySystem.entity.Admin;
import com.example.QuerySystem.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AdminAuthService {

    private static final String ADMIN_EMAIL = "adbhuthab@gmail.com";

    @Autowired
    private AdminRepository adminRepo;

    @Autowired
    private OtpService otpService;

    @Autowired
    private EmailService emailService;

    // STEP 1: ADMIN LOGIN → SEND OTP
    public void login(String email) {

        if (!ADMIN_EMAIL.equalsIgnoreCase(email)) {
            throw new RuntimeException("Unauthorized admin email");
        }

        Admin admin = adminRepo.findByEmail(email)
                .orElseGet(() -> {
                    Admin a = new Admin();
                    a.setAdminId("ADMIN" + System.currentTimeMillis());
                    a.setEmail(email);
                    return a;
                });

        String otp = otpService.generateOtp();
        admin.setOtp(otp);
        admin.setOtpExpiry(otpService.getExpiryTime());
        admin.setActive(false);

        adminRepo.save(admin);
        emailService.sendOtp(email, otp);
    }

    // STEP 2: VERIFY ADMIN OTP
    public String verifyOtp(String email, String otp) {

        Admin admin = adminRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        if (!otpService.isOtpValid(otp, admin.getOtp(), admin.getOtpExpiry())) {
            throw new RuntimeException("Invalid or expired OTP");
        }

        admin.setActive(true);
        adminRepo.save(admin);

        return admin.getAdminId();
    }
}
