// patientServices
import { API_BASE_URL } from "../config/config.js";
const PATIENT_API = `${API_BASE_URL}/patient`;


//For creating a patient in db
export async function patientSignup(data) {
  try {
    const response = await fetch(`${PATIENT_API}/register`,
      {
        method: "POST",
        headers: {
          "Content-type": "application/json"
        },
        body: JSON.stringify(data)
      }
    );
    const message = await response.text();
    if (!response.ok) {
      throw new Error(message || response.statusText);
    }
    return { success: true, message };
  }
  catch (error) {
    console.error("Error :: patientSignup :: ", error)
    return { success: false, message: error.message }
  }
}

//For logging in patient
export async function patientLogin(data) {
  console.log("patientLogin :: ", data)
  return await fetch(`${PATIENT_API}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });


}

// For getting patient data (name ,id , etc ). Used in booking appointments
export async function getPatientData(token) {
  const response = await fetch(`${PATIENT_API}/me/${encodeURIComponent(token)}`);
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Failed to fetch patient details (${response.status}).`);
  }
  return await response.json();
}

// Fetch appointments for a patient or for a patient record viewed by a doctor.
export async function getPatientAppointments(id, token, user) {
  const response = await fetch(
    `${PATIENT_API}/appointments/${encodeURIComponent(id)}/${encodeURIComponent(user)}/${encodeURIComponent(token)}`
  );
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Failed to fetch appointments (${response.status}).`);
  }
  return await response.json();
}

export async function filterAppointments(condition, name, token) {
  const params = new URLSearchParams({ token });
  if (condition) params.set("condition", condition);
  if (name) params.set("name", name);

  const response = await fetch(`${PATIENT_API}/appointments/filter?${params.toString()}`);
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Failed to filter appointments (${response.status}).`);
  }

  return { appointments: await response.json() };
}
