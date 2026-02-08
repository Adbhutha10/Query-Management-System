package com.example.QuerySystem.service;

import com.example.QuerySystem.entity.Query;
import com.sendgrid.*;
import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.Content;
import com.sendgrid.helpers.mail.objects.Email;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
public class EmailService {

    @Value("${SENDGRID_API_KEY:}")
    private String sendGridApiKey;

    private static final String FROM_EMAIL = "central.querysystem@gmail.com";
    private static final String FROM_NAME = "Query Management System";
    private static final String ADMIN_EMAIL = "central.querysystem@gmail.com";

    // 1️⃣ Send OTP to user
    public void sendOtp(String toEmail, String otp) {
        Email from = new Email(FROM_EMAIL, FROM_NAME);
        Email to = new Email(toEmail);
        String subject = "OTP Verification";
        Content content = new Content("text/plain",
                "Your OTP is: " + otp + "\n\nThis OTP is valid for 5 minutes.");

        Mail mail = new Mail(from, subject, to, content);
        sendEmail(mail);
    }

    // 2️⃣ Notify admin when user submits a query
    public void sendAdminNotification(Query query) {
        Email from = new Email(FROM_EMAIL, FROM_NAME);
        Email to = new Email(ADMIN_EMAIL);
        String subject = "New Query Submitted";
        Content content = new Content("text/plain",
                "A new query has been submitted.\n\n" +
                        "Query ID: " + query.getQueryId() + "\n" +
                        "User ID: " + query.getUserId() + "\n" +
                        "Category: " + query.getCategory() + "\n" +
                        "Priority: " + query.getPriority() + "\n\n" +
                        "Query:\n" + query.getOriginalQuery());

        Mail mail = new Mail(from, subject, to, content);
        sendEmail(mail);
    }

    // 3️⃣ Send reply email to user
    public void sendReplyToUser(String toEmail, String queryId, String reply) {
        Email from = new Email(FROM_EMAIL, FROM_NAME);
        Email to = new Email(toEmail);
        String subject = "Reply to Your Query (ID: " + queryId + ")";
        Content content = new Content("text/plain",
                "Your query has been answered.\n\n" +
                        "Query ID: " + queryId + "\n\n" +
                        "Admin Reply:\n" + reply);

        Mail mail = new Mail(from, subject, to, content);
        sendEmail(mail);
    }

    // Helper method to send email via SendGrid
    private void sendEmail(Mail mail) {
        SendGrid sg = new SendGrid(sendGridApiKey);
        Request request = new Request();

        try {
            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());
            Response response = sg.api(request);

            if (response.getStatusCode() >= 400) {
                throw new RuntimeException("SendGrid API error: " + response.getBody());
            }
        } catch (IOException ex) {
            throw new RuntimeException("Failed to send email: " + ex.getMessage(), ex);
        }
    }
}
