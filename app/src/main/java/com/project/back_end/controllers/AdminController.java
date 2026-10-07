package com.project.back_end.controllers;

import com.project.back_end.models.Admin;
import com.project.back_end.services.Service;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("${api.path}admin")
public class AdminController {

    private final Service service;

    // Constructor-based injection
    @Autowired
    public AdminController(Service service) {
        this.service = service;
    }

    // Admin login endpoint
    @PostMapping("/login")
    public ResponseEntity<?> adminLogin(@Valid @RequestBody Admin admin) {
        return service.validateAdmin(admin.getUsername(), admin.getPassword());
    }
}