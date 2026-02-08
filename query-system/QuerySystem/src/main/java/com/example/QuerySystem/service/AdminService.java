package com.example.QuerySystem.service;

import com.example.QuerySystem.entity.Query;
import com.example.QuerySystem.entity.User;
import com.example.QuerySystem.repository.QueryRepository;
import com.example.QuerySystem.repository.UserRepository;
import com.example.QuerySystem.util.ExcelGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class AdminService {

    @Autowired
    private QueryRepository queryRepo;

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private EmailService emailService;

    // ===============================
    // 1️⃣ Get all queries (filter by status)
    // ===============================
    public List<Query> getAll(String status) {
        return status == null
                ? queryRepo.findAll()
                : queryRepo.findByStatus(status);
    }

    // ===============================
    // 2️⃣ Admin reply to query
    // ===============================
    public void reply(String queryId, String reply) {

        Query q = queryRepo.findById(queryId)
                .orElseThrow(() -> new RuntimeException("Query not found"));

        q.setAdminReply(reply);
        q.setAnswered(true);
        q.setStatus("RESOLVED");
        q.setRead(false);
        q.setRepliedAt(LocalDateTime.now());

        queryRepo.save(q);

        User user = userRepo.findById(q.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        emailService.sendReplyToUser(
                user.getEmail(),
                q.getQueryId(),
                reply
        );
    }

    // ===============================
    // 3️⃣ Download all queries as Excel
    // ===============================
    public ResponseEntity<InputStreamResource> downloadAllQueries() {

        List<Query> queries = queryRepo.findAll();
        ByteArrayInputStream excelFile =
                ExcelGenerator.queriesToExcel(queries);

        HttpHeaders headers = new HttpHeaders();
        headers.add(
                "Content-Disposition",
                "attachment; filename=queries.xlsx"
        );

        return ResponseEntity.ok()
                .headers(headers)
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(new InputStreamResource(excelFile));
    }
}
