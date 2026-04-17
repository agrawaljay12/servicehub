import { refreshAccessToken } from "./authHelper";


export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem("access_token");

  if (!token) {
    window.location.href = "/auth/signin";
    return;
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (response.status === 401) {
    // Token invalid or expired → logout
    await refreshAccessToken();
    return;
  }

  return response;
};