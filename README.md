# Smart Clinic Management System

A web application for managing clinic appointments and prescriptions. Patients
can find doctors and book appointments; doctors can review appointments and
record prescriptions; administrators can manage doctors.

## Features

- Patient registration and login, doctor search, appointment booking, and
  appointment history.
- Doctor login, daily appointment views, and prescription management.
- Admin login and doctor management.
- MySQL storage for admins, doctors, patients, doctor availability, and
  appointments.
- MongoDB storage for prescriptions.

## Technology

- Java 17 and Spring Boot 3.4.4
- Spring MVC, Thymeleaf, Spring Data JPA, and Hibernate
- MySQL and MongoDB
- HTML, CSS, and JavaScript
- Maven

## Prerequisites

For running the application directly:

- JDK 17
- MySQL server
- MongoDB server

Docker is optional. The included Dockerfile builds and runs the application,
but does not start or provision either database.

## Database setup

1. Create the MySQL database. The default name configured by the application is
   `cms`:

   ```sql
   CREATE DATABASE cms;
   ```

2. Configure the database connection. The application defaults to
   `jdbc:mysql://localhost:3306/cms` and username `root`; set `DB_URL`,
   `DB_USERNAME`, and `DB_PASSWORD` environment variables to override the
   MySQL connection settings.

3. Configure the MongoDB connection in
   `app/src/main/resources/application.properties` to match your MongoDB
   instance and credentials. The configured database is used for the
   `prescriptions` collection.

4. Start the app once so Hibernate can create/update the MySQL tables
   (`spring.jpa.hibernate.ddl-auto=update`).

5. Optionally load the sample MySQL data from the scripts in `SQL/`. Run them
   after the tables are created, in this order:

   - `Insert_into_admin_table.sql`
   - `Insert_into_doctor_table.sql`
   - `Insert_into_patient_table.sql`
   - `Insert_into_doctor_available_times_table.sql`
   - `Insert_into_appointment_table.sql`

   The appointment seed file contains dates in 2025, which are historical; use
   future dates when testing appointment booking.

6. To load the sample prescriptions, run
   `SQL/Insert_into_prescriptions_collection_in_MongoDB.sql` in `mongosh`.

The SQL and MongoDB seed files contain sample credentials and data for local
development only. Do not use them in a deployed environment.

## Run locally

From the repository root, use the Maven wrapper for your operating system:

**Windows PowerShell**

```powershell
cd app
.\mvnw.cmd spring-boot:run
```

**macOS/Linux**

```bash
cd app
./mvnw spring-boot:run
```

Alternatively, if Maven is installed, run `mvn spring-boot:run` from `app/`.
The application listens on port `8080`. Visit
<http://localhost:8080/> to open the role-selection page.

## Run with Docker

Build the image from the repository root:

```bash
docker build -t smart-clinic .
```

Run it with access to the MySQL and MongoDB servers. Inside a container,
`localhost` refers to the container, not your host machine; on Docker Desktop
for Windows or macOS, use `host.docker.internal` to reach database servers
running on the host:

```bash
docker run --rm -p 8080:8080 \
  -e DB_URL=jdbc:mysql://host.docker.internal:3306/cms \
  -e DB_USERNAME=root \
  -e DB_PASSWORD=your-mysql-password \
  smart-clinic \
  --spring.data.mongodb.uri="mongodb://your-user:your-password@host.docker.internal:27017/prescriptions?authSource=admin"
```

Replace the example database credentials and URI with values for your local
services. Ensure MySQL and MongoDB accept connections from Docker. The MongoDB
URI is passed as a Spring Boot command-line property because the current
application configuration does not define a MongoDB URI environment-variable
override.

## Main pages

| Page | URL |
|---|---|
| Role selection and login | `/` |
| Patient dashboard | `/pages/patientDashboard.html` |
| Patient appointment history | `/pages/patientAppointments.html` |
| Admin dashboard | `/adminDashboard/{adminToken}` |
| Doctor dashboard | `/doctorDashboard/{doctorToken}` |

The patient dashboard is a static page. Admin and doctor dashboard routes
validate the supplied role token before rendering the dashboard.

## REST API

The default API base URL is `http://localhost:8080`. Login endpoints return a
JWT as plain text. Protected endpoints require the token returned by the
appropriate role's login endpoint.

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/doctor` | List all doctors |
| `GET` | `/doctor/filter?name={name}&speciality={specialty}&time={AM\|PM}` | Filter doctors; each query parameter is optional |
| `GET` | `/doctor/availability/{user}/{doctorId}/{date}/{token}` | Get a doctor's available slots for an ISO date |
| `POST` | `/patient/register` | Register a patient |
| `POST` | `/patient/login` | Log in a patient |
| `GET` | `/patient/me/{token}` | Get the logged-in patient's details |
| `GET` | `/patient/appointments/{patientId}/{user}/{token}` | Get appointments for a patient record |
| `GET` | `/patient/appointments/filter?token={token}` | Get all appointments for the patient identified by the token |
| `GET` | `/patient/appointments/filter?token={token}&condition={past\|future}&name={doctorName}` | Filter the patient's appointments; `condition` and `name` are optional |
| `POST` | `/appointments/book/{token}` | Book an appointment using a patient token |
| `PUT` | `/appointments/update/{token}/{appointmentId}/{patientId}` | Update an appointment using a patient token |
| `DELETE` | `/appointments/cancel/{token}/{appointmentId}/{patientId}` | Cancel an appointment using a patient token |
| `POST` | `/doctor/login` | Log in a doctor |
| `GET` | `/appointments/{token}/{date}` | Get a doctor's appointments for an ISO date (`YYYY-MM-DD`); optional `patientName` query |
| `POST` | `/admin/login` | Log in an admin |
| `POST` | `/doctor/register/{token}` | Register a doctor using an admin token |
| `PUT` | `/doctor/update/{token}/{doctorId}` | Update a doctor using an admin token |
| `DELETE` | `/doctor/delete/{token}/{doctorId}` | Delete a doctor and associated appointments using an admin token |
| `GET` | `/prescription/{appointmentId}/{token}` | Get a prescription using a doctor token |
| `POST` | `/prescription/save/{token}` | Save a prescription using a doctor token |

The specialty filter uses `speciality` (British spelling), matching the API
parameter. The time filter accepts `AM` or `PM`. Appointment status is `0` for
scheduled and `1` for completed. Prescription retrieval currently requires a
doctor token; there is no patient-facing prescription API endpoint.

### cURL examples

List doctors:

```bash
curl -X GET "http://localhost:8080/doctor"
```

Filter doctors by specialty and morning availability:

```bash
curl -X GET "http://localhost:8080/doctor/filter?speciality=Cardiologist&time=AM"
```

Log in a patient and retrieve that patient's appointments (replace the example
credentials):

```bash
TOKEN=$(curl -sS -X POST "http://localhost:8080/patient/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"patient@example.com","password":"your-password"}')

curl -G "http://localhost:8080/patient/appointments/filter" \
  --data-urlencode "token=$TOKEN"
```

## Database schema documentation

See [schema-design.md](schema-design.md) for the current MySQL and MongoDB
entity fields, relationships, and constraints.

## Tests

Run the backend tests from `app/`:

```bash
./mvnw test
```

On Windows, use `.\mvnw.cmd test`.
