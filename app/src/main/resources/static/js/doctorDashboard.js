/*
 * Handles doctor dashboard appointment management.
 */

/* Import Required Modules */

import { getAllAppointments } from "./services/appointmentRecordService.js";
import { createPatientRow } from "./components/patientRows.js";


/* Global Variables */

const patientTableBody =
  document.getElementById("patientTableBody");

let selectedDate =
  getLocalDate();

const token =
  localStorage.getItem("token");

let patientName = null;

function getLocalDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}


/* Search Bar */

const searchBar =
  document.getElementById("searchBar");

if (searchBar) {

  searchBar.addEventListener("input", () => {

    const value =
      searchBar.value.trim();

    patientName =
      value || null;

    loadAppointments();

  });

}


/* Today's Appointments Button */

const todayButton =
  document.getElementById("todayButton");

if (todayButton) {

  todayButton.addEventListener("click", () => {

    selectedDate =
      getLocalDate();

    const datePicker =
      document.getElementById("datePicker");

    if (datePicker) {
      datePicker.value = selectedDate;
    }

    loadAppointments();

  });

}


/* Date Picker */

const datePicker =
  document.getElementById("datePicker");

if (datePicker) {

  datePicker.addEventListener("change", () => {

    selectedDate =
      datePicker.value;

    loadAppointments();

  });

}


/* Load Appointments */

async function loadAppointments() {

  try {

    const appointments =
      await getAllAppointments(
        selectedDate,
        patientName,
        token
      );


    /* Clear Existing Rows */

    if (patientTableBody) {
      patientTableBody.innerHTML = "";
    }


    /* No Appointments */

    if (
      !appointments ||
      appointments.length === 0
    ) {

      if (patientTableBody) {

        patientTableBody.innerHTML = `
          <tr>
            <td colspan="5">
              No Appointments found for today.
            </td>
          </tr>
        `;

      }

      return;
    }


    /* Render Appointments */

    appointments.forEach((appointment) => {

      const patient = {
        id: appointment.patientId,
        name: appointment.patientName,
        phone: appointment.patientPhone,
        email: appointment.patientEmail
      };


      const row =
        createPatientRow(
          patient,
          appointment.id,
          appointment.doctorId
        );


      if (row && patientTableBody) {
        patientTableBody.appendChild(row);
      }

    });

  } catch (error) {

    console.error(
      "Error loading appointments:",
      error
    );


    if (patientTableBody) {
      const row = document.createElement("tr");
      const message = document.createElement("td");
      message.colSpan = 5;
      message.textContent = `Error loading appointments: ${error.message}`;
      row.appendChild(message);
      patientTableBody.replaceChildren(row);

    }

  }

}


/* Initial Page Load */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    if (typeof renderContent === "function") {
      renderContent();
    }

    const today =
      getLocalDate();

    selectedDate = today;

    if (datePicker) {
      datePicker.value = today;
    }

    loadAppointments();

  }
);





/*
  Import getAllAppointments to fetch appointments from the backend
  Import createPatientRow to generate a table row for each patient appointment


  Get the table body where patient rows will be added
  Initialize selectedDate with today's date in 'YYYY-MM-DD' format
  Get the saved token from localStorage (used for authenticated API calls)
  Initialize patientName to null (used for filtering by name)


  Add an 'input' event listener to the search bar
  On each keystroke:
    - Trim and check the input value
    - If not empty, use it as the patientName for filtering
    - Else, reset patientName to "null" (as expected by backend)
    - Reload the appointments list with the updated filter


  Add a click listener to the "Today" button
  When clicked:
    - Set selectedDate to today's date
    - Update the date picker UI to match
    - Reload the appointments for today


  Add a change event listener to the date picker
  When the date changes:
    - Update selectedDate with the new value
    - Reload the appointments for that specific date


  Function: loadAppointments
  Purpose: Fetch and display appointments based on selected date and optional patient name

  Step 1: Call getAllAppointments with selectedDate, patientName, and token
  Step 2: Clear the table body content before rendering new rows

  Step 3: If no appointments are returned:
    - Display a message row: "No Appointments found for today."

  Step 4: If appointments exist:
    - Loop through each appointment and construct a 'patient' object with id, name, phone, and email
    - Call createPatientRow to generate a table row for the appointment
    - Append each row to the table body

  Step 5: Catch and handle any errors during fetch:
    - Show a message row: "Error loading appointments. Try again later."


  When the page is fully loaded (DOMContentLoaded):
    - Call renderContent() (assumes it sets up the UI layout)
    - Call loadAppointments() to display today's appointments by default
*/
