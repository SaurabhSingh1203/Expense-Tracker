import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../utils/axios";
import { Link, useNavigate } from "react-router-dom";
import { PDFDownloadLink } from "@react-pdf/renderer"; // <-- Added import

import {
  FaTicketAlt,
  FaTimesCircle,
  FaCalendarAlt,
  FaRupeeSign,
  FaClock,
} from "react-icons/fa";

import TicketPDF from "./TicketPDF";

const UserDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchBookings();
  }, [user, navigate]);

  const fetchBookings = async () => {
    try {
      const { data } = await api.get("/bookings/my");
      setBookings(data);
    } catch (error) {
      console.error("Error fetching bookings", error);
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (id) => {
    if (
      window.confirm("Are you sure you want to cancel this booking request?")
    ) {
      try {
        await api.delete(`/bookings/${id}`);
        fetchBookings();
      } catch (error) {
        alert(error.response?.data?.message || "Error cancelling booking");
      }
    }
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] bg-[#F8FAFC]">
        <div className="w-12 h-12 border-4 border-rose-100 border-t-rose-500 rounded-full animate-spin mb-4"></div>
        <p className="text-slate-500 font-medium">Loading your tickets...</p>
      </div>
    );

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900 pb-20">
      {/* Clean, Typography-Driven Header */}
      <div className="bg-white border-b border-slate-200 pt-16 pb-12 mb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left">
          <div className="w-24 h-24 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center text-4xl font-black shrink-0 shadow-sm">
            {user?.name.charAt(0)}
          </div>

          <div className="pt-2">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold uppercase tracking-wider mb-3">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Active Account
            </span>
            <h1 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">
              Hello, {user?.name}
            </h1>
            <p className="text-slate-500 text-lg max-w-2xl">
              Welcome to your personal dashboard. Manage your upcoming
              experiences and booking history all in one place.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
          <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <FaTicketAlt className="text-rose-500" /> My Tickets
          </h2>
          <span className="bg-slate-900 text-white text-sm font-semibold px-4 py-1.5 rounded-full shadow-sm">
            {bookings.length} {bookings.length === 1 ? "Booking" : "Bookings"}
          </span>
        </div>

        {bookings.length === 0 ? (
          /* Minimalist Empty State */
          <div className="bg-white rounded-3xl border border-slate-200 p-16 text-center flex flex-col items-center shadow-sm">
            <div className="bg-slate-50 p-6 rounded-full mb-6">
              <FaTicketAlt className="text-5xl text-slate-300" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-3">
              No tickets found
            </h3>
            <p className="text-slate-500 mb-8 max-w-md mx-auto leading-relaxed">
              Looks like you haven't booked any OurEvents yet. Discover amazing
              local experiences waiting for you!
            </p>
            <Link
              to="/"
              className="bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white font-semibold py-3.5 px-8 rounded-full transition-colors duration-200"
            >
              Explore Events
            </Link>
          </div>
        ) : (
          /* Clean Bookings Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl hover:border-slate-300 transition-all duration-300 flex flex-col h-full group"
              >
                <div className="p-6 md:p-8 flex-grow">
                  {booking.eventId ? (
                    <>
                      <div className="flex justify-between items-start mb-6 gap-4">
                        <h3 className="text-xl font-bold text-slate-900 leading-snug group-hover:text-rose-600 transition-colors line-clamp-2">
                          {booking.eventId.title}
                        </h3>
                        <div className="flex flex-col gap-2 items-end shrink-0">
                          <span
                            className={`px-3 py-1 text-[10px] sm:text-xs font-bold rounded-md uppercase tracking-wider ${
                              booking.status === "confirmed"
                                ? "bg-emerald-50 text-emerald-600"
                                : booking.status === "cancelled"
                                  ? "bg-rose-50 text-rose-600"
                                  : "bg-orange-50 text-orange-600"
                            }`}
                          >
                            {booking.status}
                          </span>
                          {booking.status !== "cancelled" && (
                            <span
                              className={`px-3 py-1 text-[10px] sm:text-xs font-bold rounded-md uppercase tracking-wider ${
                                booking.paymentStatus === "paid"
                                  ? "bg-blue-50 text-blue-600"
                                  : "bg-slate-100 text-slate-600"
                              }`}
                            >
                              {booking.paymentStatus.replace("_", " ")}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-start text-slate-500 text-sm">
                          <FaCalendarAlt className="mt-1 mr-3 text-rose-400 flex-shrink-0" />
                          <span>
                            {new Date(booking.eventId.date).toLocaleDateString(
                              undefined,
                              {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              },
                            )}
                          </span>
                        </div>
                        <div className="flex items-start text-slate-500 text-sm">
                          <FaRupeeSign className="mt-1 mr-3 text-emerald-500 flex-shrink-0" />
                          <span className="font-semibold text-slate-700">
                            {booking.amount === 0
                              ? "Free Entry"
                              : booking.amount}
                          </span>
                        </div>
                        <div className="flex items-start text-slate-400 text-xs mt-4 pt-4 border-t border-slate-100">
                          <FaClock className="mt-0.5 mr-2 flex-shrink-0" />
                          <span>
                            Requested:{" "}
                            {new Date(booking.bookedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center py-8">
                      <div className="bg-rose-50 p-4 rounded-full mb-4">
                        <FaTimesCircle className="text-rose-400 text-3xl" />
                      </div>
                      <p className="text-slate-800 font-bold mb-1">
                        Event Unavailable
                      </p>
                      <p className="text-slate-500 text-sm">
                        This event has been removed by the organizer.
                      </p>
                    </div>
                  )}
                </div>

                {/* Card Footer Actions */}
                <div className="p-5 bg-slate-50 border-t border-slate-200">
                  {booking.eventId && booking.status !== "cancelled" ? (
                    <div className="space-y-3">
                      {/* View Event */}
                      <Link
                        to={`/events/${booking.eventId._id}`}
                        className="w-full flex items-center justify-center rounded-xl bg-white border border-slate-300 py-2.5 font-semibold text-slate-700 hover:bg-slate-100 transition-all duration-200"
                      >
                        View Event
                      </Link>

                      {/* Action Buttons */}
                      <div className="grid grid-cols-2 gap-3">
                        {/* Download Ticket PDF Link */}
                        {booking.status === "confirmed" ? (
                          <PDFDownloadLink
                            document={
                              <TicketPDF booking={booking} user={user} />
                            }
                            fileName={`Ticket-${booking.eventId.title.replace(
                              /\s+/g,
                              "-",
                            )}.pdf`}
                            className="flex items-center justify-center rounded-xl py-2.5 font-semibold bg-indigo-50 text-indigo-600 border border-indigo-200 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all duration-200 shadow-sm text-center"
                          >
                            {({ loading }) =>
                              loading ? "Preparing..." : "Download"
                            }
                          </PDFDownloadLink>
                        ) : (
                          <button
                            disabled
                            className="flex items-center justify-center rounded-xl py-2.5 font-semibold bg-slate-200 text-slate-400 border border-slate-200 cursor-not-allowed"
                            title="You can only download confirmed tickets"
                          >
                            Download
                          </button>
                        )}

                        <button
                          onClick={() => cancelBooking(booking._id)}
                          className="flex items-center justify-center rounded-xl py-2.5 font-semibold bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-600 hover:text-white hover:border-rose-600 transition-all duration-200 shadow-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full text-center py-3 text-sm font-semibold text-slate-500">
                      {booking.status === "cancelled"
                        ? "❌ Booking Cancelled"
                        : "Unavailable"}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
