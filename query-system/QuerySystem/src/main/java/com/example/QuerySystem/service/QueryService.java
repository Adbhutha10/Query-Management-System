package com.example.QuerySystem.service;

import com.example.QuerySystem.entity.Query;
import com.example.QuerySystem.repository.QueryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

@Service
public class QueryService {

    @Autowired
    private QueryRepository queryRepository;

    @Autowired
    private EmailService emailService;

    // ===============================
    // SUBMIT QUERY
    // ===============================
    public Map<String, String> submitQuery(Map<String, String> payload) {

        Query query = new Query();

        String queryId = LocalDateTime.now()
                .format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"))
                + (int) (Math.random() * 90 + 10);

        query.setQueryId(queryId);
        query.setUserId(payload.get("userId"));
        query.setCategory(payload.get("category"));

        // Auto-determine priority if not provided or set to a default
        String priority = payload.get("priority");
        if (priority == null || priority.isEmpty() || priority.equalsIgnoreCase("low")) {
            priority = determinePriority(payload.get("queryText"));
        }
        query.setPriority(priority);

        query.setOriginalQuery(payload.get("queryText"));
        query.setStatus("NEW");
        query.setAnswered(false);
        query.setRead(false);
        query.setCreatedAt(LocalDateTime.now());

        queryRepository.save(query);

        // notify admin
        emailService.sendAdminNotification(query);

        return Map.of(
                "message", "Query submitted successfully",
                "queryId", queryId);
    }

    private String determinePriority(String text) {
        if (text == null)
            return "LOW";
        String lowerText = text.toLowerCase();

        // High priority keywords
        if (lowerText.contains("urgent") || lowerText.contains("critical") ||
                lowerText.contains("broken") || lowerText.contains("fail") ||
                lowerText.contains("error") || lowerText.contains("emergency") ||
                lowerText.contains("asap") || lowerText.contains("immediately")) {
            return "HIGH";
        }

        // Medium priority keywords
        if (lowerText.contains("issue") || lowerText.contains("problem") ||
                lowerText.contains("help") || lowerText.contains("request") ||
                lowerText.contains("not working") || lowerText.contains("unable")) {
            return "MEDIUM";
        }

        return "LOW";
    }

    // ===============================
    // USER: VIEW OWN QUERIES
    // ===============================
    public List<Query> getUserQueries(String userId) {

        List<Query> queries = queryRepository.findByUserId(userId);

        for (Query q : queries) {
            q.setRead(true);
        }

        queryRepository.saveAll(queries);
        return queries;
    }
}
