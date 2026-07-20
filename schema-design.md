# Smart Clinic Management System - Database Schema Design

## Overview

The Smart Clinic Management System uses a hybrid database architecture:

- **MySQL** is used to store structured and relational data such as admins, doctors, patients, and appointments.
- **MongoDB** is used to store flexible document-based data such as prescriptions, where the number of medicines and additional notes may vary between patients.

---

# MySQL Database Design

## Table: Admin

| Column Name | Data Type | Constraints |
|-------------|-----------|------------|
| admin_id | INT | PRIMARY KEY, AUTO_INCREMENT |
| username | VARCHAR(50) | NOT NULL, UNIQUE |
| password | VARCHAR(255) | NOT NULL |
| full_name | VARCHAR(100) | NOT NULL |
| email | VARCHAR(100) | NOT NULL, UNIQUE |

---

## Table: Doctors

| Column Name | Data Type | Constraints |
|-------------|-----------|------------|
| doctor_id | INT | PRIMARY KEY, AUTO_INCREMENT |
| full_name | VARCHAR(100) | NOT NULL |
| specialization | VARCHAR(100) | NOT NULL |
| phone | VARCHAR(15) | NOT NULL |
| email | VARCHAR(100) | NOT NULL, UNIQUE |
| availability | BOOLEAN | DEFAULT TRUE |

---

## Table: Patients

| Column Name | Data Type | Constraints |
|-------------|-----------|------------|
| patient_id | INT | PRIMARY KEY, AUTO_INCREMENT |
| full_name | VARCHAR(100) | NOT NULL |
| gender | VARCHAR(10) | NOT NULL |
| age | INT | NOT NULL |
| phone | VARCHAR(15) | NOT NULL |
| email | VARCHAR(100) | UNIQUE |
| password | VARCHAR(255) | NOT NULL |

---

## Table: Appointments

| Column Name | Data Type | Constraints |
|-------------|-----------|------------|
| appointment_id | INT | PRIMARY KEY, AUTO_INCREMENT |
| patient_id | INT | NOT NULL, FOREIGN KEY REFERENCES Patients(patient_id) |
| doctor_id | INT | NOT NULL, FOREIGN KEY REFERENCES Doctors(doctor_id) |
| appointment_date | DATE | NOT NULL |
| appointment_time | TIME | NOT NULL |
| status | VARCHAR(20) | NOT NULL |

---

# Entity Relationships

- One Doctor can have many Appointments.
- One Patient can have many Appointments.
- Each Appointment belongs to one Doctor and one Patient.
- Admin manages Doctors, Patients, and Appointments.

---

# MongoDB Collection Design

## Collection: prescriptions

### Sample Document

```json
{
  "_id": "66a12345bcde987654321000",

  "appointmentId": 101,

  "doctor": {
    "doctorId": 5,
    "name": "Dr. Raj Sharma",
    "specialization": "Cardiologist"
  },

  "patient": {
    "patientId": 12,
    "name": "Amit Kumar",
    "age": 35
  },

  "medicines": [
    {
      "name": "Paracetamol",
      "dosage": "500 mg",
      "frequency": "Twice a day",
      "duration": "5 days"
    },
    {
      "name": "Vitamin D",
      "dosage": "1000 IU",
      "frequency": "Once a day",
      "duration": "30 days"
    }
  ],

  "tests": [
    "Blood Test",
    "ECG"
  ],

  "doctorNotes": "Take medicines after meals and return for follow-up after one week.",

  "createdAt": "2026-07-20T10:30:00Z"
}
```

---

# Design Justification

## MySQL

MySQL is used because:

- It provides strong consistency for relational data.
- Foreign keys maintain relationships between doctors, patients, and appointments.
- Constraints such as PRIMARY KEY, UNIQUE, and NOT NULL help maintain data integrity.
- It is suitable for structured healthcare records.

## MongoDB

MongoDB is used because:

- Prescriptions vary from patient to patient.
- Each prescription may contain a different number of medicines.
- Arrays and nested documents make prescription storage flexible.
- Future fields such as medical reports, attachments, or follow-up notes can be added without changing the schema.

---

# Database Summary

| Database | Stores |
|----------|--------|
| MySQL | Admins, Doctors, Patients, Appointments |
| MongoDB | Prescriptions |