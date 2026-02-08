package com.example.QuerySystem.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "queries")
@Getter
@Setter
public class Query {

    @Id
    private String queryId;

    private String userId;

    @Column(columnDefinition = "TEXT")
    private String originalQuery;

    @Column(columnDefinition = "TEXT")
    private String processedQuery;

    private String category;
    private String priority;

    private String status;   // NEW / PENDING / RESOLVED

    private boolean answered;


    @Column(name = "is_read")
    private boolean isRead;

    @Column(columnDefinition = "TEXT")
    private String adminReply;

    private LocalDateTime createdAt;
    private LocalDateTime repliedAt;

    @PrePersist
    public void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.status = "NEW";
        this.answered = false;
        this.isRead = false;
    }
}
