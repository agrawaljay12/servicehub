export const fetchWithAuth = async (
  url: string,
  options: RequestInit = {}
) => {

  const token = localStorage.getItem("access_token");

  if (!token) {
    window.location.href = "/auth/signin";
    throw new Error("No token found");
  }

 const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
    ...(options.headers as Record<string, string>),
  };

  // ✅ Only set JSON content type if NOT FormData
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    localStorage.clear();
    sessionStorage.clear();

    window.location.href = "/auth/signin";

    throw new Error("Unauthorized");
  }

  return response;
};