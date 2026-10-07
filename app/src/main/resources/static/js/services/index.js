import { openModal } from "../components/modals.js";
import { API_BASE_URL } from "../config/config.js";
import { patientSignup } from "./patientServices.js";

const ADMIN_API = `${API_BASE_URL}/admin/login`;
const DOCTOR_API = `${API_BASE_URL}/doctor/login`;
const PATIENT_API = `${API_BASE_URL}/patient/login`;

document.getElementById("adminLoginBtn")?.addEventListener("click", () => {
  openModal("adminLogin");
});

document.getElementById("doctorLoginBtn")?.addEventListener("click", () => {
  openModal("doctorLogin");
});

document.getElementById("patientLoginBtn")?.addEventListener("click", () => {
  openModal("patientLogin");
});

async function submitLogin(endpoint, credentials, role) {
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials)
    });
    const token = (await response.text()).trim();

    // The login endpoints return JWTs as plain text. Doctor login also
    // responds with status 200 for invalid credentials, so check the body.
    if (!response.ok || token.split(".").length !== 3) {
      alert(token || "Invalid credentials.");
      return;
    }

    localStorage.setItem("token", token);
    selectRole(role);
  } catch (error) {
    console.error(`${role} login error:`, error);
    alert("Unable to reach the server. Please try again.");
  }
}

window.adminLoginHandler = () => submitLogin(ADMIN_API, {
  username: document.getElementById("username").value,
  password: document.getElementById("password").value
}, "admin");

window.doctorLoginHandler = () => submitLogin(DOCTOR_API, {
  email: document.getElementById("email").value,
  password: document.getElementById("password").value
}, "doctor");

window.loginPatient = () => submitLogin(PATIENT_API, {
  email: document.getElementById("email").value,
  password: document.getElementById("password").value
}, "loggedPatient");

window.signupPatient = async function () {
  const data = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    password: document.getElementById("password").value,
    phone: document.getElementById("phone").value,
    address: document.getElementById("address").value
  };
  const result = await patientSignup(data);
  alert(result.message);
  if (result.success) {
    openModal("patientLogin");
  }
};
