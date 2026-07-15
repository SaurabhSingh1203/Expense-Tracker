import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/axios";
import { AuthContext } from "../context/AuthContext";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaChair,
  FaMoneyBillWave,
} from "react-icons/fa";

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [showOTP, setShowOTP] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isBooked, setIsBooked] = useState(false);
  const [bookingStatus, setBookingStatus] = useState(null); // pending | confirmed | cancelled
  let buttonText = "Confirm Registration";
  let buttonClass =
    "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200 hover:shadow-indigo-300 hover:-translate-y-0.5";

  useEffect(() => {
  if (!successMsg) return;

  const timer = setTimeout(() => {
    setSuccessMsg("");
  }, 4000);

  return () => clearTimeout(timer);
}, [successMsg]);

  useEffect(() => {
  const fetchEvent = async () => {
    try {
      const { data } = await api.get(`/events/${id}`);
      setEvent(data);

      const { data: bookings } = await api.get("/bookings/my");

      const booking = bookings.find(
        (b) =>
          b.eventId &&
          b.eventId._id.toString() === data._id.toString()
      );

      if (booking) {
        setIsBooked(true);
        setBookingStatus(booking.status);
      } else {
        setIsBooked(false);
        setBookingStatus(null);
      }

    } catch (err) {
      console.log(err);   
      setError("Failed to load event details.");
    } finally {
      setLoading(false);
    }
  };

  fetchEvent();
}, [id]);

  const handleBooking = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    setBookingLoading(true);
    setError("");
    setSuccessMsg("");

    try {
      if (bookingStatus === "pending") {
      
        setTimeout(() =>   setSuccessMsg("Your booking is awaiting admin approval."), 3000);
          setSuccessMsg("");
        return;
      }
      if (bookingStatus === "confirmed") {
        setSuccessMsg("You have already booked this event.");
        setTimeout(() => setSuccessMsg(""), 3000);
        return;
      }

      if (!showOTP) {
        await api.post("/bookings/send-otp");

        setShowOTP(true);
        setSuccessMsg(
          "OTP sent to your email. Please verify to confirm booking.",
        );
      } else {
        await api.post("/bookings", {
          eventId: event._id,
          otp,
        });

        setBookingStatus("pending");
        setIsBooked(true);

        setSuccessMsg("Booking requested! Awaiting admin confirmation.");
        setShowOTP(false);

        setEvent({
          ...event,
          availableSeats: event.availableSeats - 1,
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || "Booking failed");
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error && !event) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] bg-slate-50">
        <div className="bg-rose-50 text-rose-600 px-8 py-6 rounded-2xl font-bold border border-rose-100 shadow-sm">
          {error || "Event not found"}
        </div>
      </div>
    );
  }
  const isSoldOut = event.availableSeats <= 0;

  if (bookingLoading) {
    buttonText = "Processing...";
  } else if (showOTP) {
    buttonText = "Verify & Confirm";

    if (otp.length !== 6) {
      buttonClass = "bg-indigo-300 text-white cursor-not-allowed shadow-none";
    }
  } else if (bookingStatus === "pending") {
    buttonText = "Booking Pending";
    buttonClass =
      "bg-yellow-100 text-yellow-700 border border-yellow-300 cursor-not-allowed";
  } else if (bookingStatus === "confirmed") {
    buttonText = "✓ Already Booked";
    buttonClass =
      "bg-green-100 text-green-700 border border-green-300 cursor-not-allowed";
  } else if (bookingStatus === "cancelled") {
    buttonText = "Book Again";
    buttonClass = "bg-indigo-600 hover:bg-indigo-700 text-white";
  } else if (isSoldOut) {
    buttonText = "Sold Out";
    buttonClass = "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none";
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-5xl mx-auto bg-white rounded-[2rem] shadow-2xl shadow-slate-200/50 overflow-hidden border border-slate-100">
        {/* Header Image */}
        {event.image ? (
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-72 sm:h-96 object-cover"
          />
        ) : (
          <div className="w-full h-72 sm:h-96 bg-gradient-to-r from-indigo-900 via-violet-800 to-fuchsia-900 flex items-center justify-center text-white/30 text-5xl sm:text-7xl font-black uppercase tracking-widest relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=3000&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay opacity-20"></div>
            <span className="relative z-10">{event.category}</span>
          </div>
        )}

        <div className="p-8 sm:p-10 lg:p-14">
          <div className="flex flex-col lg:flex-row justify-between items-start gap-12">
            {/* Event Details Left Column */}
            <div className="flex-1">
              <div className="inline-block bg-indigo-50 text-indigo-700 text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-widest mb-5 border border-indigo-100">
                {event.category}
              </div>
              <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight leading-tight">
                {event.title}
              </h1>
              <p className="text-slate-600 text-lg leading-relaxed whitespace-pre-line">
                {event.description}
              </p>
            </div>

            {/* Booking Card Right Column */}
            <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 w-full lg:w-[400px] shrink-0 shadow-xl shadow-slate-200/40 hover:-translate-y-1 transition-transform duration-300">
              <h3 className="text-2xl font-extrabold text-slate-900 mb-8 tracking-tight">
                Booking Details
              </h3>

              <div className="space-y-6 mb-8">
                <div className="flex items-center gap-5 text-slate-600">
                  <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center text-indigo-500 shrink-0 text-xl">
                    <FaMoneyBillWave />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-0.5">
                      Ticket Price
                    </p>
                    <p className="font-bold text-slate-800 text-lg">
                      {event.ticketPrice === 0 ? (
                        <span className="text-emerald-500">Free Entry</span>
                      ) : (
                        `₹${event.ticketPrice}`
                      )}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-5 text-slate-600">
                  <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center text-indigo-500 shrink-0 text-xl">
                    <FaChair />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-0.5">
                      Availability
                    </p>
                    <p className="font-bold text-slate-800">
                      <span
                        className={
                          event.availableSeats < 10
                            ? "text-amber-500"
                            : "text-emerald-500"
                        }
                      >
                        {event.availableSeats}
                      </span>{" "}
                      / {event.totalSeats}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-5 text-slate-600">
                  <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center text-indigo-500 shrink-0 text-xl">
                    <FaCalendarAlt />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-0.5">
                      Date
                    </p>
                    <p className="font-bold text-slate-800">
                      {new Date(event.date).toLocaleDateString(undefined, {
                        weekday: "short",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-5 text-slate-600">
                  <div className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center text-indigo-500 shrink-0 text-xl">
                    <FaMapMarkerAlt />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-0.5">
                      Location
                    </p>
                    <p className="font-bold text-slate-800">{event.location}</p>
                  </div>
                </div>
              </div>

              {/* OTP Form Area */}
              {showOTP && (
                <div className="mb-6 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 text-center">
                    Security Verification
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="000000"
                    className="w-full bg-slate-50 border border-transparent px-5 py-4 rounded-xl focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 outline-none transition-all font-black tracking-[0.5em] text-center text-2xl text-slate-800"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))} // Numeric only
                    maxLength="6"
                  />
                  <p className="text-[10px] text-slate-400 text-center mt-2 font-medium">
                    Enter the 6-digit code sent to your email.
                  </p>
                </div>
              )}

              {/* Call to Action */}
              <button
                onClick={handleBooking}
                disabled={
                  bookingLoading ||
                  isSoldOut ||
                  bookingStatus === "pending" ||
                  bookingStatus === "confirmed" ||
                  (showOTP && otp.length !== 6)
                }
                className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all shadow-lg ${buttonClass}`}
              >
                {buttonText}
              </button>

              {/* Status Messages */}
              {error && (
                <div className="mt-4 bg-rose-50 border border-rose-100 text-rose-600 text-sm p-3 rounded-xl font-medium text-center flex items-center justify-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-rose-200 text-rose-700 flex items-center justify-center text-xs font-bold">
                    !
                  </span>
                  {error}
                </div>
              )}
              {successMsg && (
                <div className="mt-4 bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm p-3 rounded-xl font-medium text-center flex items-center justify-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-200 text-emerald-800 flex items-center justify-center text-xs font-bold">
                    ✓
                  </span>
                  {successMsg}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
