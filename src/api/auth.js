import { apiRequest, setToken, clearToken } from "./client";

export async function register(payload) {
  const data = await apiRequest("/auth/register.php", { method: "POST", body: payload });
  if (data.token) await setToken(data.token);
  return data;
}

export async function login(email, password) {
  const data = await apiRequest("/auth/login.php", { method: "POST", body: { email, password } });
  if (data.token) await setToken(data.token);
  return data;
}

export async function getMe() {
  return apiRequest("/auth/me.php", { auth: true });
}

export async function logout() {
  await clearToken();
}
