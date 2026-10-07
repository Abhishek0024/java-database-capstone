/*
 * Handles admin dashboard functionality for managing doctors.
 */

/* Import Required Modules */

import { openModal } from "../components/modals.js";
import {
  getDoctors,
  filterDoctors,
  saveDoctor
} from "./doctorServices.js";
import { createDoctorCard } from "../components/doctorCard.js";


/* Add Doctor Button */

const addDoctorBtn = document.getElementById("addDocBtn");

if (addDoctorBtn) {
  addDoctorBtn.addEventListener("click", () => {
    openModal("addDoctor");
  });
}


/* Load Doctor Cards */

document.addEventListener("DOMContentLoaded", () => {
  loadDoctorCards();
});


/* Load All Doctors */

async function loadDoctorCards() {

  try {

    const doctors = await getDoctors();

    renderDoctorCards(doctors);

  } catch (error) {

    console.error("Error loading doctors:", error);

  }

}


/* Render Doctor Cards */

function renderDoctorCards(doctors) {

  const contentDiv =
    document.getElementById("content");

  if (!contentDiv) {
    return;
  }

  contentDiv.innerHTML = "";


  if (!doctors || doctors.length === 0) {

    contentDiv.innerHTML =
      "<p>No doctors found.</p>";

    return;

  }


  doctors.forEach((doctor) => {

    const card = createDoctorCard(doctor);

    contentDiv.appendChild(card);

  });

}


/* Search and Filter Event Listeners */

const searchBar =
  document.getElementById("searchBar");

const timeFilter =
  document.getElementById("filterTime");

const specialtyFilter =
  document.getElementById("filterSpecialty");


if (searchBar) {
  searchBar.addEventListener(
    "input",
    filterDoctorsOnChange
  );
}


if (timeFilter) {
  timeFilter.addEventListener(
    "change",
    filterDoctorsOnChange
  );
}


if (specialtyFilter) {
  specialtyFilter.addEventListener(
    "change",
    filterDoctorsOnChange
  );
}


/* Filter Doctors */

async function filterDoctorsOnChange() {

  const name =
    searchBar?.value.trim() || null;

  const time =
    timeFilter?.value || null;

  const specialty =
    specialtyFilter?.value || null;


  try {

    const result =
      await filterDoctors(
        name,
        time,
        specialty
      );


    const doctors =
      result.doctors || [];


    if (doctors.length === 0) {

      const contentDiv =
        document.getElementById("content");

      if (contentDiv) {
        contentDiv.innerHTML =
          "<p>No doctors found with the given filters.</p>";
      }

      return;

    }


    renderDoctorCards(doctors);

  } catch (error) {

    console.error(
      "Error filtering doctors:",
      error
    );

    alert("Unable to filter doctors.");

  }

}


/* Add Doctor */

window.adminAddDoctor = async function () {

  const name =
    document.getElementById("doctorName").value;

  const specialty =
    document.getElementById("specialization").value;

  const email =
    document.getElementById("doctorEmail").value;

  const password =
    document.getElementById("doctorPassword").value;

  const phone =
    document.getElementById("doctorPhone").value;


  /* Get Availability */

  const availableTimes =
    Array.from(
      document.querySelectorAll(
        'input[name="availability"]:checked'
      )
    ).map((checkbox) => checkbox.value);


  /* Get Authentication Token */

  const token =
    localStorage.getItem("token");


  if (!token) {

    alert(
      "Session expired. Please log in again."
    );

    return;

  }


  /* Create Doctor Object */

  const doctor = {
    name,
    specialty,
    email,
    password,
    phone,
    availableTimes
  };


  try {

    /* Save Doctor */

    const result =
      await saveDoctor(
        doctor,
        token
      );


    /* Handle Successful Save */

    if (result.success) {

      alert(
        result.message ||
        "Doctor added successfully."
      );


      /* Close Modal */

      const modal =
        document.getElementById("modal");

      if (modal) {
        modal.style.display = "none";
      }


      /* Refresh Doctor List */

      loadDoctorCards();

    } else {

      alert(
        result.message ||
        "Failed to add doctor."
      );

    }

  } catch (error) {

    console.error(
      "Error adding doctor:",
      error
    );

    alert(
      "Something went wrong while adding the doctor."
    );

  }

};




/*
  This script handles the admin dashboard functionality for managing doctors:
  - Loads all doctor cards
  - Filters doctors by name, time, or specialty
  - Adds a new doctor via modal form


  Attach a click listener to the "Add Doctor" button
  When clicked, it opens a modal form using openModal('addDoctor')


  When the DOM is fully loaded:
    - Call loadDoctorCards() to fetch and display all doctors


  Function: loadDoctorCards
  Purpose: Fetch all doctors and display them as cards

    Call getDoctors() from the service layer
    Clear the current content area
    For each doctor returned:
    - Create a doctor card using createDoctorCard()
    - Append it to the content div

    Handle any fetch errors by logging them


  Attach 'input' and 'change' event listeners to the search bar and filter dropdowns
  On any input change, call filterDoctorsOnChange()


  Function: filterDoctorsOnChange
  Purpose: Filter doctors based on name, available time, and specialty

    Read values from the search bar and filters
    Normalize empty values to null
    Call filterDoctors(name, time, specialty) from the service

    If doctors are found:
    - Render them using createDoctorCard()
    If no doctors match the filter:
    - Show a message: "No doctors found with the given filters."

    Catch and display any errors with an alert


  Function: renderDoctorCards
  Purpose: A helper function to render a list of doctors passed to it

    Clear the content area
    Loop through the doctors and append each card to the content area


  Function: adminAddDoctor
  Purpose: Collect form data and add a new doctor to the system

    Collect input values from the modal form
    - Includes name, email, phone, password, specialty, and available times

    Retrieve the authentication token from localStorage
    - If no token is found, show an alert and stop execution

    Build a doctor object with the form values

    Call saveDoctor(doctor, token) from the service

    If save is successful:
    - Show a success message
    - Close the modal and reload the page

    If saving fails, show an error message
*/
