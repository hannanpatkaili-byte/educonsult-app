import { apiRequest, getToken, API_BASE } from "./client";

export async function createPrescription(payload) {
  return apiRequest("/prescriptions/create.php", {
    method: "POST",
    auth: true,
    body: payload,
  });
}

export async function getMyPrescriptions() {
  return apiRequest("/prescriptions/my.php", { auth: true });
}

// Returns a URL that can be opened in a WebView to view/print the prescription
export async function getPrescriptionViewUrl(id) {
  const token = await getToken();
  return `${API_BASE}/prescriptions/view.php?id=${id}&token=${token}`;
}
