package com.project.back_end.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "appointments")
public class Appointment {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne
  @NotNull(message = "Doctor cannot be null")
  @JoinColumn(name = "doctor_id", nullable = false)
  private Doctor doctor;


  @ManyToOne
  @NotNull(message = "Patient cannot be null")
  @JoinColumn(name = "patient_id", nullable = false)
  private Patient patient;


  @NotNull(message = "Appointment time cannot be null")
  @Future(message = "Appointment time must be in the future")
  @Column(name = "appointment_time", nullable = false)
  private LocalDateTime appointmentTime;


  @NotNull(message = "Status cannot be null")
  @Column(name = "status", nullable = false)
  private int status; // 0 for scheduled, 1 for completed

  // Transient field to calculate the end time of the appointment
  @Transient
  public LocalDateTime getEndTime() {
    return appointmentTime.plusHours(1); // Assuming each appointment lasts 1 hour
  }

  // Transient field to get only the date part of the appointment
  @Transient
  public LocalDate getAppointmentDate() {
    return appointmentTime.toLocalDate();
  }

  // Transient field to get only the time part of the appointment
  @Transient
  public LocalTime getAppointmentTimeOnly() {
    return appointmentTime.toLocalTime();
  }


  // Default constructor required by JPA
  public Appointment() {
  } 

  // Parameterized constructor for convenience
  public Appointment(Doctor doctor, Patient patient, LocalDateTime appointmentTime, int status) {
    this.doctor = doctor;
    this.patient = patient;
    this.appointmentTime = appointmentTime;
    this.status = status;
  }



  // Getters and Setters

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public Doctor getDoctor() {
    return doctor;
  }

  public void setDoctor(Doctor doctor) {
    this.doctor = doctor;
  }

  public Patient getPatient() {
    return patient;
  }

  public void setPatient(Patient patient) {
    this.patient = patient;
  }


  public LocalDateTime getAppointmentTime() {
    return appointmentTime;
  }


  public void setAppointmentTime(LocalDateTime appointmentTime) {
    this.appointmentTime = appointmentTime;
  }


  public int getStatus() {
    return status;
  }

}

