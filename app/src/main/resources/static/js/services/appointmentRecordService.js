// appointmentRecordService.js
import { API_BASE_URL } from "../config/config.js";
const APPOINTMENT_API = `${API_BASE_URL}/appointments`;


//This is for the doctor to get all the patient Appointments
export async function getAllAppointments(date, patientName, token) {
  const params = new URLSearchParams();
  if (patientName && patientName !== "null") {
    params.set("patientName", patientName);
  }
  const query = params.toString();
  const response = await fetch(
    `${APPOINTMENT_API}/${encodeURIComponent(token)}/${encodeURIComponent(date)}${query ? `?${query}` : ""}`
  );
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Failed to fetch appointments (${response.status}).`);
  }

  return await response.json();
}

export async function bookAppointment(appointment, token) {
  try {
    const response = await fetch(`${APPOINTMENT_API}/book/${encodeURIComponent(token)}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(appointment)
    });

    const message = await response.text();
    return {
      success: response.ok,
      message: message || (response.ok ? "Appointment booked successfully." : response.statusText)
    };
  } catch (error) {
    console.error("Error while booking appointment:", error);
    return {
      success: false,
      message: error.message || "Network error. Please try again later."
    };
  }
}

export async function updateAppointment(appointment, token) {
  try {
    const response = await fetch(`${APPOINTMENT_API}/${token}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(appointment)
    });

    const data = await response.json();
    return {
      success: response.ok,
      message: data.message || "Something went wrong"
    };
  } catch (error) {
    console.error("Error while booking appointment:", error);
    return {
      success: false,
      message: "Network error. Please try again later."
    };
  }
}
