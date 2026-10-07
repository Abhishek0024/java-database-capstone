# Smart Clinic Management System - Database Schema Design

## Overview

The application uses two databases:

- **MySQL** stores admins, doctors, patients, appointments, and each doctor's
  available time slots.
- **MongoDB** stores prescriptions in the `prescriptions` collection.

The relational schema is managed by Spring Data JPA/Hibernate. The tables below
describe the fields and relationships represented by the current Java entities.
Exact SQL types and generated constraint names can vary with the database and
Hibernate naming strategy. Bean Validation rules are identified separately
from database constraints.

## MySQL

### Admin

Entity: `Admin`

| Field | Mapped SQL type (typical) | Database mapping / validation |
|---|---|---|
| `id` | `BIGINT` | Primary key; generated identity |
| `username` | `VARCHAR` | Not null and unique |
| `password` | `VARCHAR` | Not null; excluded from JSON responses |

The Admin entity has no full-name or email fields.

### Doctor

Entity: `Doctor`

| Field | Mapped SQL type (typical) | Database mapping / validation |
|---|---|---|
| `id` | `BIGINT` | Primary key; generated identity |
| `name` | `VARCHAR(100)` | Required; length 3-100 |
| `specialty` | `VARCHAR(50)` | Required; length 3-50 |
| `email` | `VARCHAR` | Required; validated as an email address |
| `password` | `VARCHAR` | Required; minimum length 6; excluded from JSON responses |
| `phone` | `VARCHAR` | Required; exactly 10 digits |
| `availableTimes` | Separate collection table | List of available time-slot strings |

The `availableTimes` list is stored in `doctor_available_times`:

| Field | Mapping |
|---|---|
| `doctor_id` | Foreign key to the Doctor primary key; collection-table join column |
| `available_times` | One string value for each time slot |

The application checks for an existing doctor email before saving, but the
Doctor entity does not declare a database-level unique constraint on `email`.
Availability is represented by the time-slot list, not by a Boolean flag.

### Patient

Entity: `Patient`

| Field | Mapped SQL type (typical) | Database mapping / validation |
|---|---|---|
| `id` | `BIGINT` | Primary key; generated identity |
| `name` | `VARCHAR(100)` | Required; length 3-100 |
| `email` | `VARCHAR` | Required; validated as an email address |
| `password` | `VARCHAR` | Required; minimum length 6; excluded from JSON responses |
| `phone` | `VARCHAR` | Required; exactly 10 digits |
| `address` | `VARCHAR(255)` | Required; maximum length 255 |

The application checks for an existing patient email or phone number during
registration. The Patient entity does not declare database-level unique
constraints for those fields. Patient records do not have gender or age fields.

### Appointment

Entity: `Appointment`

| Field | Mapped SQL type (typical) | Database mapping / validation |
|---|---|---|
| `id` | `BIGINT` | Primary key; generated identity |
| `doctor_id` | `BIGINT` | Required foreign key to Doctor |
| `patient_id` | `BIGINT` | Required foreign key to Patient |
| `appointment_time` | `DATETIME` | Required; represented in Java as `LocalDateTime`; must be in the future on validated requests |
| `status` | `INTEGER` | Required; `0` means scheduled and `1` means completed |

Each appointment belongs to one doctor and one patient. A doctor and a patient
can each be associated with multiple appointments. Appointment date and time
are stored together in `appointment_time`; the entity exposes derived date,
time, and end-time values for application use.

## MongoDB

### Collection: `prescriptions`

Entity: `Prescription` (`@Document(collection = "prescriptions")`)

| Field | BSON value (typical) | Validation |
|---|---|---|
| `_id` | String | MongoDB document identifier |
| `patientName` | String | Required; length 3-100 |
| `appointmentId` | Number (`Long`) | Required; identifies the related MySQL appointment |
| `medication` | String | Required; length 3-100 |
| `dosage` | String | Required |
| `doctorNotes` | String | Optional; maximum length 200 |

A prescription currently stores one medication and dosage as fields on the
document. The model does not define embedded doctor or patient objects, arrays
of medicines or tests, or a creation timestamp.

`appointmentId` is a logical reference to an appointment in MySQL; MongoDB does
not enforce a relational foreign key across the two databases. The repository
queries prescriptions by `appointmentId`.

## Relationships and constraints

- `Appointment.doctor` and `Appointment.patient` are JPA many-to-one
  relationships with required join columns.
- `Doctor.availableTimes` is a JPA element collection stored in
  `doctor_available_times`.
- `Admin.username` has an explicit unique database constraint.
- Doctor email and Patient email/phone duplicate checks are performed by
  application code; they are not declared as unique constraints on those
  entities.
- Password fields are excluded from JSON serialization. The entity annotations
  do not themselves establish a password-hashing strategy.

## Database summary

| Database | Data |
|---|---|
| MySQL | Admins, doctors, doctor time slots, patients, appointments |
| MongoDB | Prescriptions |
