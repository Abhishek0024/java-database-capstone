# Smart Clinic Management System - User Stories

## Admin User Stories

### User Story 1

**Title:**  
_As an Admin, I want to log into the portal with my username and password, so that I can securely manage the platform._

**Acceptance Criteria:**
1. The admin can log in using valid credentials.
2. Invalid login attempts display an appropriate error message.
3. A successful login redirects the admin to the dashboard.

**Priority:** High

**Story Points:** 3

**Notes:**
- JWT authentication should be used for secure access.

---

### User Story 2

**Title:**  
_As an Admin, I want to log out of the portal, so that I can protect system access._

**Acceptance Criteria:**
1. The admin can log out from any authenticated page.
2. The user's session or JWT token is invalidated.
3. The admin is redirected to the login page after logout.

**Priority:** High

**Story Points:** 2

**Notes:**
- Logout should prevent unauthorized access to protected pages.

---

### User Story 3

**Title:**  
_As an Admin, I want to add doctors to the portal, so that they can manage appointments._

**Acceptance Criteria:**
1. The admin can enter all required doctor information.
2. The system validates the entered data.
3. The doctor is successfully added to the system.

**Priority:** High

**Story Points:** 5

**Notes:**
- Doctor email addresses must be unique.

---

### User Story 4

**Title:**  
_As an Admin, I want to delete a doctor's profile from the portal, so that inactive doctors are removed from the system._

**Acceptance Criteria:**
1. The admin can select a doctor profile for deletion.
2. The system requests confirmation before deleting the profile.
3. The doctor profile is permanently removed after confirmation.

**Priority:** Medium

**Story Points:** 3

**Notes:**
- Ensure appointment history is handled according to business rules.

---

### User Story 5

**Title:**  
_As an Admin, I want to run a stored procedure in MySQL CLI to get the number of appointments per month, so that I can track usage statistics._

**Acceptance Criteria:**
1. The stored procedure executes successfully.
2. Monthly appointment statistics are returned.
3. The output displays the appointment count for each month.

**Priority:** Medium

**Story Points:** 5

**Notes:**
- This functionality is intended for reporting and analytics.

---

# Patient User Stories

### User Story 1

**Title:**  
_As a Patient, I want to view a list of doctors without logging in, so that I can explore available doctors before registering._

**Acceptance Criteria:**
1. The doctor list is publicly accessible.
2. Each doctor's name and specialization are displayed.
3. No authentication is required to access the list.

**Priority:** Medium

**Story Points:** 3

**Notes:**
- Only public doctor information should be displayed.

---

### User Story 2

**Title:**  
_As a Patient, I want to sign up using my email and password, so that I can book appointments._

**Acceptance Criteria:**
1. The patient can register using a unique email address.
2. Required fields are validated before account creation.
3. The patient account is successfully created.

**Priority:** High

**Story Points:** 5

**Notes:**
- Passwords must be securely encrypted before storage.

---

### User Story 3

**Title:**  
_As a Patient, I want to log into the portal, so that I can manage my bookings._

**Acceptance Criteria:**
1. The patient can log in using valid credentials.
2. Invalid login attempts display an error message.
3. Successful login redirects the patient to the dashboard.

**Priority:** High

**Story Points:** 3

**Notes:**
- JWT authentication should be used.

---

### User Story 4

**Title:**  
_As a Patient, I want to log out of the portal, so that I can secure my account._

**Acceptance Criteria:**
1. The patient can log out from any authenticated page.
2. The user's session or JWT token is invalidated.
3. The patient is redirected to the login page.

**Priority:** High

**Story Points:** 2

**Notes:**
- Logout should prevent access to protected resources.

---

### User Story 5

**Title:**  
_As a Patient, I want to book an hour-long appointment and view my upcoming appointments, so that I can consult with a doctor and prepare accordingly._

**Acceptance Criteria:**
1. The patient can select an available doctor and appointment slot.
2. The appointment duration is one hour.
3. The booked appointment appears in the patient's upcoming appointments list.

**Priority:** High

**Story Points:** 8

**Notes:**
- The system must prevent double-booking of appointment slots.

---

# Doctor User Stories

### User Story 1

**Title:**  
_As a Doctor, I want to log into the portal, so that I can manage my appointments._

**Acceptance Criteria:**
1. The doctor can log in using valid credentials.
2. Invalid login attempts display an error message.
3. Successful login redirects the doctor to the dashboard.

**Priority:** High

**Story Points:** 3

**Notes:**
- JWT authentication should be used.

---

### User Story 2

**Title:**  
_As a Doctor, I want to log out of the portal, so that I can protect my data._

**Acceptance Criteria:**
1. The doctor can log out from any authenticated page.
2. The user's session or JWT token is invalidated.
3. The doctor is redirected to the login page.

**Priority:** High

**Story Points:** 2

**Notes:**
- Protected pages should not be accessible after logout.

---

### User Story 3

**Title:**  
_As a Doctor, I want to view my appointment calendar, so that I can stay organized._

**Acceptance Criteria:**
1. The doctor can view all upcoming appointments.
2. Appointments are displayed by date and time.
3. The calendar updates when appointments are modified.

**Priority:** High

**Story Points:** 5

**Notes:**
- Only the doctor's own appointments should be visible.

---

### User Story 4

**Title:**  
_As a Doctor, I want to mark my unavailability, so that patients can only book available slots._

**Acceptance Criteria:**
1. The doctor can select unavailable dates and times.
2. Unavailable slots cannot be booked by patients.
3. The availability calendar is updated immediately.

**Priority:** High

**Story Points:** 5

**Notes:**
- Existing appointments should not be affected.

---

### User Story 5

**Title:**  
_As a Doctor, I want to update my profile with my specialization and contact information and view patient details for upcoming appointments, so that patients have up-to-date information and I can be prepared._

**Acceptance Criteria:**
1. The doctor can update specialization and contact details.
2. Updated profile information is visible to patients.
3. The doctor can view patient details for upcoming appointments.

**Priority:** High

**Story Points:** 8

**Notes:**
- Doctors can only access information related to their own appointments.
```