package com.example.QuerySystem.repository;

import com.example.QuerySystem.entity.Query;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface QueryRepository extends JpaRepository<Query, String> {
    List<Query> findByUserId(String userId);
    List<Query> findByStatus(String status);
}
