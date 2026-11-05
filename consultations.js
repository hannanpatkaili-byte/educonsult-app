import { apiRequest } from "./client";

export async function getDoctors({ specialization } = {}) {
  const qs = specialization ? `?specialization=${encodeURIComponent(specialization)}` : "";
  return apiRequest(`/consultations/doctors.php${qs}`, { auth: true });
}

export async function bookConsultation({ doctorId, scheduledAt, mode, reason }) {
  return apiRequest("/consultations/index.php", {
    method: "POST",
    auth: true,
    body: { doctor_id: doctorId, scheduled_at: scheduledAt, mode, reason },
  });
}

export async function getMyConsultations() {
  return apiRequest("/consultations/index.php", { auth: true });
}

export async function updateConsultation(id, payload) {
  return apiRequest("/consultations/update.php", {
    method: "PUT",
    auth: true,
    body: { id, ...payload },
  });
}
