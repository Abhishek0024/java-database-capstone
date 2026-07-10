# Schema Architecture

## Section 1: Architecture Summary

This Spring Boot application employs a hybrid architectural pattern, utilizing both traditional Model-View-Controller (MVC) components and modern RESTful APIs to handle different modules. The system features a server-side rendered frontend using Thymeleaf templates to serve the Admin and Doctor dashboards, providing a robust interface for core administrative and medical personnel functions. Concurrently, REST APIs power all other system modules, including Appointments, Patient Dashboard, and Patient Records, enabling a more flexible, decoupled client-server interaction via JSON APIs.

At the core of the application, all incoming requests—whether from the Thymeleaf MVC controllers or the REST controllers—are routed through a unified, centralized Service Layer. This layer encapsulates the core business logic and delegates data operations to the appropriate repository components. To manage its persistent data, the application leverages a polyglot persistence strategy using two distinct database systems. A relational MySQL database, accessed via JPA entities, manages structured data for patients, doctors, appointments, and admins. Meanwhile, a NoSQL MongoDB database, accessed via document models, is used specifically for managing prescription records, accommodating the more flexible data structure required for medical prescriptions.

## Section 2: Flow of Data and Control

1. Users or client applications access the Dashboards (Admin and Doctor) or REST Modules (Appointments, Patient Dashboard, Patient Record).
2. The requests are routed to the corresponding Thymeleaf Controllers (for dashboards) or REST Controllers (via JSON API for REST modules).
3. Both types of controllers delegate the business logic execution to a centralized Service Layer.
4. The Service Layer interacts with data access components, specifically MySQL Repositories for relational data and a MongoDB Repository for document data.
5. The repositories access their respective underlying data stores: the MySQL Database and the MongoDB Database.
6. Data retrieved from or written to the databases is mapped to the application's domain models (MySQL Models and MongoDB Models).
7. The MySQL Models consist of JPA Entities like Patient, Doctor, Appointment, and Admin, while the MongoDB Models consist of Document objects like Prescription.
