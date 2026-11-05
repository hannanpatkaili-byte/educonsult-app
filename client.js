import AsyncStorage from "@react-native-async-storage/async-storage";

// Your live backend's base URL (change the folder name here if you named it differently)
export const API_BASE = "https://drhannanime.com/myapp-api/api";

const TOKEN_KEY = "auth_token";

export async function getToken() {
  return AsyncStorage.getItem(TOKEN_KEY);
}

export async function setToken(token) {
  return AsyncStorage.setItem(TOKEN_KEY, token);
}

export async function clearToken() {
  return AsyncStorage.removeItem(TOKEN_KEY);
}

// Generic request helper. `path` is appended to API_BASE, e.g. "/auth/login.php"
export async function apiRequest(path, { method = "GET", body, auth = false } = {}) {
  const headers = { "Content-Type": "application/json" };

  if (auth) {
    const token = await getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  let data;
  try {
    data = await response.json();
  } catch (e) {
    throw new Error("Server returned an invalid response. Check the API URL and server logs.");
  }

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
}
