import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { Booking, BookingStatus } from "@/data/services";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

interface AddBookingPayload {
  serviceId: string;
  serviceName: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  date: string;
  time: string;
  price: number;
  notes?: string;
  providerId?: string;
  paymentMethod?: "cash" | "visa";
}

interface BookingContextType {
  bookings: Booking[];
  allBookings: Booking[];
  loading: boolean;
  addBooking: (booking: AddBookingPayload) => Promise<boolean>;
  updateStatus: (id: string, status: BookingStatus) => Promise<boolean>;
  fetchMyBookings: () => Promise<void>;
  fetchAllBookings: () => Promise<void>;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);
const getToken = () => localStorage.getItem("a5adamaty_token");

export const BookingProvider = ({ children }: { children: ReactNode }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [allBookings, setAllBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);

  const mapBooking = (b: Record<string, unknown>): Booking => ({
    id: b._id as string,
    serviceId: (b.serviceType as string) || "",
    serviceName: b.serviceName as string,
    customerName: (b.userId as Record<string, string> | null)?.name || (b.customerName as string) || "",
    customerPhone: (b.userId as Record<string, string> | null)?.phone || (b.customerPhone as string) || "",
    customerEmail: (b.userId as Record<string, string> | null)?.email || (b.customerEmail as string) || "",
    date: b.date ? new Date(b.date as string).toLocaleDateString("ar-EG") : "",
    time: b.time as string,
    status: (b.status as string) === "cancelled" ? "canceled" : (b.status as BookingStatus),
    price: b.price as number,
    notes: (b.notes as string) || "",
    isReviewed: (b.isReviewed as boolean) || false,
    providerId: (b.providerId as string) || undefined,
    paymentMethod: (b.paymentMethod as "cash" | "visa") || "cash",
  });

  const fetchMyBookings = useCallback(async () => {
    const token = getToken();
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/bookings/my-bookings`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success && data.bookings) {
        setBookings(data.bookings.map(mapBooking));
      }
    } catch (err) {
      console.error("Error fetching my bookings:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAllBookings = useCallback(async () => {
    const token = getToken();
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/bookings`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success && data.bookings) {
        setAllBookings(data.bookings.map(mapBooking));
      }
    } catch (err) {
      console.error("Error fetching all bookings:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const addBooking = async (booking: AddBookingPayload): Promise<boolean> => {
    const token = getToken();
    if (!token) return false;
    try {
      const serviceTypeMap: Record<string, string> = {
        "1": "ac", "2": "plumbing", "3": "electrical", "4": "cleaning",
      };
      const serviceType = serviceTypeMap[booking.serviceId] || booking.serviceId || "ac";

      const res = await fetch(`${API_BASE}/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          serviceName: booking.serviceName,
          serviceType,
          date: booking.date,
          time: booking.time,
          price: booking.price,
          notes: booking.notes || "",
          customerName: booking.customerName,
          customerPhone: booking.customerPhone,
          customerEmail: booking.customerEmail,
          providerId: booking.providerId || null,
          paymentMethod: booking.paymentMethod || "cash",
        }),
      });
      const data = await res.json();
      if (data.success) {
        await fetchMyBookings();
        return true;
      }
      return false;
    } catch (err) {
      console.error("Error creating booking:", err);
      return false;
    }
  };

  const updateStatus = async (id: string, status: BookingStatus): Promise<boolean> => {
    const token = getToken();
    if (!token) return false;
    try {
      const backendStatus = status === "canceled" ? "cancelled" : status;
      const res = await fetch(`${API_BASE}/bookings/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status: backendStatus }),
      });
      const data = await res.json();
      if (data.success) {
        await fetchMyBookings();
        await fetchAllBookings();
        return true;
      }
      return false;
    } catch (err) {
      console.error("Error updating booking status:", err);
      return false;
    }
  };

  useEffect(() => {
    const token = getToken();
    if (token) fetchMyBookings();
  }, [fetchMyBookings]);

  return (
    <BookingContext.Provider value={{ bookings, allBookings, loading, addBooking, updateStatus, fetchMyBookings, fetchAllBookings }}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBookings = () => {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBookings must be used within BookingProvider");
  return ctx;
};
