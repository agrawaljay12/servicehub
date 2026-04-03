import React, { useEffect, useState } from "react";
import { BOOKING_ENDPOINTS } from "../../config/booking";
import { getAuthHeader } from "../../utils/authHelper";

interface Booking {
  booking_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  service_name: string;
  price: number;
  booking_status: string;
  payment_status: string;
  booking_date: string;
}

const ProviderBookings: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // ✅ Fetch Provider Bookings
  const fetchBookings = async () => {
    try {
      const res = await fetch(
        `${BOOKING_ENDPOINTS.fetch_booking_provider}?status=confirmed`,
        {
          method: "GET",
          headers: getAuthHeader(),
        }
      );

      const data = await res.json();

      if (data.status === 200) {
        setBookings(data.data.bookings);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Update Status
  const updateStatus = async (bookingId: string) => {
    try {
      const url = BOOKING_ENDPOINTS.update_booking_status.replace(
        "{booking_id}",
        bookingId
      );

      const res = await fetch(url, {
        method: "PUT",
        headers: getAuthHeader(),
      });

      const data = await res.json();

      if (data.status === 200) {
        alert("Status updated to completed");

        // refresh list
        fetchBookings();
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  if (loading) {
    return <div className="text-center mt-10">Loading bookings...</div>;
  }

  return (
    <div className="p-4 md:p-6">
      <h2 className="text-2xl font-bold mb-6">Provider Bookings</h2>

      {bookings.length === 0 ? (
        <p>No bookings found</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {bookings.map((booking) => (
            <div
              key={booking.booking_id}
              className="bg-white shadow-lg rounded-2xl p-5 border hover:shadow-xl transition"
            >
              <h3 className="text-lg font-semibold mb-2">
                {booking.service_name}
              </h3>

              <p className="text-sm text-gray-600">
                <strong>Customer:</strong> {booking.customer_name}
              </p>

              <p className="text-sm text-gray-600">
                <strong>Email:</strong> {booking.customer_email}
              </p>

              <p className="text-sm text-gray-600">
                <strong>Phone:</strong> {booking.customer_phone}
              </p>

              <p className="text-sm mt-2">
                <strong>Price:</strong> ₹{booking.price}
              </p>

              <p className="text-sm">
                <strong>Status:</strong>{" "}
                <span
                  className={`font-medium ${
                    booking.booking_status === "confirmed"
                      ? "text-yellow-600"
                      : "text-green-600"
                  }`}
                >
                  {booking.booking_status}
                </span>
              </p>

              <p className="text-xs text-gray-400 mt-2">
                {new Date(booking.booking_date).toLocaleString()}
              </p>

              {/* ✅ Button */}
              {booking.booking_status === "confirmed" && (
                <button
                  onClick={() => updateStatus(booking.booking_id)}
                  className="mt-4 w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
                >
                  Mark as Completed
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProviderBookings;