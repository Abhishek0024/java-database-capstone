package com.project.back_end.controllers;

import com.project.back_end.models.Prescription;
import com.project.back_end.services.AppointmentService;
import com.project.back_end.services.PrescriptionService;
import com.project.back_end.services.Service;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("${api.path}prescription")
public class PrescriptionController {

    private final PrescriptionService prescriptionService;
    private final AppointmentService appointmentService;
    private final Service service;

    // Constructor injection
    @Autowired
    public PrescriptionController(PrescriptionService prescriptionService,
                                  AppointmentService appointmentService,
                                  Service service) {
        this.prescriptionService = prescriptionService;
        this.appointmentService = appointmentService;
        this.service = service;
    }

    // Save prescription for an appointment
    @PostMapping("/save/{token}")
    public ResponseEntity<?> savePrescription(@Valid @RequestBody Prescription prescription, @PathVariable String token) {
        if (!service.validateToken(token, "doctor")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired token.");
        }

        // Update appointment status (e.g., to "1" meaning 'Completed')
        appointmentService.changeAppointmentStatus(prescription.getAppointmentId(), 1);

        return prescriptionService.savePrescription(prescription);
    }

    // Get prescription by appointment ID
    @GetMapping("/{appointmentId}/{token}")
    public ResponseEntity<?> getPrescription(@PathVariable Long appointmentId, @PathVariable String token) {
        if (!service.validateToken(token, "doctor")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid or expired token.");
        }

        return prescriptionService.getPrescription(appointmentId);
    }
}
