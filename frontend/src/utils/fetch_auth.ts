import { refreshAccessToken } from "./authHelper";


export const fetchWithAuth = async (url: string, options: any = {}) => {
  let token = sessionStorage.getItem("access_token");

  const makeRequest = async (accessToken: string | null) => {
    return fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });
  };

  let response = await makeRequest(token);

  // 🔥 If token expired → refresh it
  if (response.status === 401) {
    const newToken = await refreshAccessToken();

    response = await makeRequest(newToken);
  }

  return response;
};