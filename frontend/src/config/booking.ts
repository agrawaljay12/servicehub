// booking.ts
const API_BASE_URL = "http://127.0.0.1:8000/api/v1";

export const BOOKING_ENDPOINTS = {
  create: `${API_BASE_URL}/booking/create`,
  verify: `${API_BASE_URL}/booking/verify`,
  current_user_bookings: `${API_BASE_URL}/booking/fetch/current_user`
};