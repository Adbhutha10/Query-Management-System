package com.example.QuerySystem.controller;

import com.example.QuerySystem.entity.Query;
import com.example.QuerySystem.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin
public class AdminController {

    @Autowired
    private AdminService adminService;


    @GetMapping("/queries")
    public List<Query> getAllQueries(
            @RequestParam(required = false) String status) {
        return adminService.getAll(status);
    }

    @PostMapping("/reply")
    public String reply(
            @RequestHeader("X-ADMIN-ID") String adminId,
            @RequestBody Map<String,String> body
    ) {

        adminService.reply(
                body.get("queryId"),
                body.get("reply")
        );
        return "Reply sent successfully";
    }

    @GetMapping("/download/excel")
    public ResponseEntity<InputStreamResource> downloadExcel() {
        return adminService.downloadAllQueries();
    }


}
