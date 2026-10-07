// render.js

function selectRole(role) {
  const normalizedRole = role.toLowerCase() === "loggedpatient"
    ? "loggedPatient"
    : role.toLowerCase();
  setRole(normalizedRole);
  const token = localStorage.getItem('token');

  if (normalizedRole === "admin") {
    if (token) {
      window.location.href = `/adminDashboard/${token}`;
    }
  } else if (normalizedRole === "doctor") {
    if (token) {
      window.location.href = `/doctorDashboard/${token}`;
    }
  } else if (normalizedRole === "patient") {
    window.location.href = "/pages/patientDashboard.html";
  } else if (normalizedRole === "loggedPatient") {
    window.location.href = "/pages/loggedPatientDashboard.html";
  }
}


function renderContent() {
  const role = getRole();
  if (!role) {
    window.location.href = "/"; // if no role, send to role selection page
    return;
  }
}
