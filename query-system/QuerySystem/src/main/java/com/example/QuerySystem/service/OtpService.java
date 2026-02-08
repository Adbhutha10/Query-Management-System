package com.example.QuerySystem.service;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Random;

@Service
public class OtpService {

    public String generateOtp() {
        return String.valueOf(new Random().nextInt(900000) + 100000);
    }

    public LocalDateTime getExpiryTime() {
        return LocalDateTime.now().plusMinutes(5);
    }

    public boolean isOtpValid(String inputOtp, String actualOtp, LocalDateTime expiry) {
        return actualOtp != null &&
                actualOtp.equals(inputOtp) &&
                LocalDateTime.now().isBefore(expiry);
    }
}
