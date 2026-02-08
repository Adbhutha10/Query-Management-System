package com.example.QuerySystem.controller;

import com.example.QuerySystem.service.QueryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.QuerySystem.entity.Query;
import java.util.List;

import java.util.Map;

@RestController
@RequestMapping("/api/queries")
@CrossOrigin
public class QueryController {

    @Autowired
    private QueryService queryService;

    @GetMapping("/user/{userId}")
    public List<Query> getUserQueries(@PathVariable String userId) {
        return queryService.getUserQueries(userId);
    }


    @PostMapping("/submit")
    public Map<String, String> submitQuery(@RequestBody Map<String, String> payload) {
        return queryService.submitQuery(payload);
    }
}
