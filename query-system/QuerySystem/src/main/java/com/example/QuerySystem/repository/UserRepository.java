package com.example.QuerySystem.repository;

import com.example.QuerySystem.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, String> {

    User findByEmail(String email);
    User findByMobile(String mobile);
}
