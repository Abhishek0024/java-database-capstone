package com.project.back_end.controllers;

import com.project.back_end.DTO.AppointmentDTO;
import com.project.back_end.DTO.Login;
import com.project.back_end.models.Patient;
import com.project.back_end.services.PatientService;
import com.project.back_end.services.Service;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/patient")
public class PatientController {

    private final PatientService patientService;
    private final Service service;

    // Constructor-based injection
    @Autowired
    public PatientController(PatientService patientService, Service service) {
        this.patientService = patientService;
        this.service = service;
    }

    // Get patient details using token
    @GetMapping("/me/{token}")
    public ResponseEntity<?> getPatient(@PathVariable String token) {
        if (!service.validateToken(token, "patient")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired token.");
        }

        Patient patient = patientService.getPatientDetails(token);
        if (patient == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Patient not found.");
        }

        return ResponseEntity.ok(patient);
    }

    // Register a new patient
    @PostMapping("/register")
    public ResponseEntity<?> createPatient(@Valid @RequestBody Patient patient) {
        if (!service.validatePatient(patient)) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Patient already exists with given email or phone.");
        }

        int result = patientService.createPatient(patient);
        return switch (result) {
            case 1 -> ResponseEntity.status(HttpStatus.CREATED).body("Patient registered successfully.");
            case 0 -> ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error saving patient.");
            default -> ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Unexpected error.");
        };
    }

    // Login patient
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Login login) {
        return service.validatePatientLogin(login.getEmail(), login.getPassword());
    }

    // 6. Get appointments for patient
    @GetMapping("/appointments/{patientId}/{user}/{token}")
    public ResponseEntity<?> getPatientAppointments(@PathVariable Long patientId,
                                                    @PathVariable String user,
                                                    @PathVariable String token) {
        if (!service.validateToken(token, user)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired token.");
        }

        List<AppointmentDTO> appointments = patientService.getPatientAppointment(patientId);
        return ResponseEntity.ok(appointments);
    }

    // Filter appointments (past/future/doctor name)
    @GetMapping("/appointments/filter")
    public ResponseEntity<?> filterPatientAppointment(@RequestParam(required = false) String condition,
                                                      @RequestParam(required = false) String name,
                                                      @RequestParam String token) {
        if (!service.validateToken(token, "patient")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired token.");
        }

        List<AppointmentDTO> filtered = service.filterPatient(token, condition, name);
        return ResponseEntity.ok(filtered);
    }
}


