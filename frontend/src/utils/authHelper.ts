/**
 * Auth Helper Utilities
 * Provides utilities for token management and authorized API calls
 */

/**
 * Get the authorization header with Bearer token for JSON requests
 * @returns Object with Authorization and Content-Type headers
 */
export const getAuthHeader = (): Record<string, string> => {
  const token = localStorage.getItem('access_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
};

/**
 * Get the authorization header for FormData requests (multipart/form-data)
 * Do NOT set Content-Type - let browser handle it automatically with boundary
 * @returns Object with only Authorization header
 */
export const getAuthHeaderForFormData = (): Record<string, string> => {
  const token = localStorage.getItem('access_token');
  const headers: Record<string, string> = {};
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};

/**
 * Check if user is authenticated
 * @returns true if user has valid token and session
 */
export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem('access_token');
  const user = localStorage.getItem('user');
  return !!(token && user);
};

/**
 * Get current user from localStorage
 * @returns User object or null
 */
export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  if (user) {
    try {
      return JSON.parse(user);
    } catch {
      return null;
    }
  }
  return null;
};

/**
 * Check if session has expired
 * @returns true if session has timed out
 */
export const isSessionExpired = (): boolean => {
  const sessionStart = localStorage.getItem('sessionStart');
  const sessionTimeout = localStorage.getItem('sessionTimeout');
  
  if (!sessionStart || !sessionTimeout) {
    return false;
  }
  
  const startTime = parseInt(sessionStart);
  const timeout = parseInt(sessionTimeout);
  const currentTime = new Date().getTime();
  
  return (currentTime - startTime) > timeout;
};

/**
 * Clear all auth data
 */
export const clearAuthData = () => {
  sessionStorage.removeItem('access_token');
  localStorage.removeItem('user');
  localStorage.removeItem('rememberMe');
  localStorage.removeItem('sessionStart');
  localStorage.removeItem('sessionTimeout');
};

/**
 * Refresh session timestamp
 */
export const refreshSession = () => {
  localStorage.setItem('sessionStart', new Date().getTime().toString());
};

// Function to refresh access token using refresh token
export const refreshAccessToken = async () => {
  // No refresh API exists → force logout

  console.warn("No refresh token API. Redirecting to login...");

  sessionStorage.clear();
  localStorage.clear();

  window.location.href = "/auth/signin";

  return null; // important to avoid undefined issues
};