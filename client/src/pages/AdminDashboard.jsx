import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import api from "../utils/axios";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showEventForm, setShowEventForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    category: "",
    totalSeats: "",
    ticketPrice: "",
    image: "",
  });

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/login");
      return;
    }
    fetchData();
  }, [user, navigate]);

  const fetchData = async () => {
    try {
      const [eventsRes, bookingsRes] = await Promise.all([
        api.get("/events"),
        api.get("/bookings/my"), // Admin gets all bookings
      ]);
      setEvents(eventsRes.data);
      setBookings(bookingsRes.data);
    } catch (error) {
      console.error("Error fetching admin data", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      await api.post("/events", formData);
      setShowEventForm(false);
      setFormData({
        title: "",
        description: "",
        date: "",
        location: "",
        category: "",
        totalSeats: "",
        ticketPrice: "",
        image: "",
      });
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || "Error creating event");
    }
  };

  const handleDeleteEvent = async (id) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await api.delete(`/events/${id}`);
        fetchData();
      } catch (error) {
        alert("Error deleting event");
      }
    }
  };

  const handleConfirmBooking = async (id, paymentStatus) => {
    try {
      await api.put(`/bookings/${id}/confirm`, { paymentStatus });
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || "Error confirming booking");
    }
  };

  const handleCancelBooking = async (id) => {
    if (window.confirm("Cancel this user's booking request?")) {
      try {
        await api.delete(`/bookings/${id}`);
        fetchData();
      } catch (error) {
        alert(error.response?.data?.message || "Error cancelling booking");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh] bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-slate-50 min-h-screen font-sans">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-900 via-violet-800 to-fuchsia-900 text-white rounded-[2rem] p-8 sm:p-10 mb-10 shadow-2xl flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=3000&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay opacity-20"></div>
        <div className="relative z-10">
          <span className="bg-white/20 text-indigo-100 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase mb-4 inline-block">
            Control Panel
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-2 tracking-tight">
            Admin Dashboard
          </h1>
          <p className="text-indigo-100 font-medium text-lg">
            Manage events, track revenue, and confirm bookings.
          </p>
        </div>
        <button
          onClick={() => setShowEventForm(!showEventForm)}
          className="relative z-10 w-full md:w-auto bg-white text-indigo-900 font-bold py-3.5 px-8 rounded-xl hover:bg-indigo-50 transition-colors shadow-lg"
        >
          {showEventForm ? "✕ Cancel Creation" : "+ Create New Event"}
        </button>
      </div>

      {/* Admin Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="bg-white p-6 rounded-3xl shadow-xl shadow-emerald-100/40 border border-slate-100 flex items-center justify-between hover:-translate-y-1 transition-transform duration-300">
          <div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">
              Total Revenue
            </p>
            <h3 className="text-4xl font-black text-emerald-500">
              ₹
              {bookings.reduce(
                (sum, b) =>
                  b.paymentStatus === "paid" && b.status === "confirmed"
                    ? sum + b.amount
                    : sum,
                0,
              )}
            </h3>
          </div>
          <div className="w-14 h-14 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center text-2xl font-bold">
            ₹
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-xl shadow-blue-100/40 border border-slate-100 flex items-center justify-between hover:-translate-y-1 transition-transform duration-300">
          <div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">
              Paid Clients
            </p>
            <h3 className="text-4xl font-black text-blue-500">
              {
                new Set(
                  bookings
                    .filter(
                      (b) =>
                        b.paymentStatus === "paid" && b.status === "confirmed",
                    )
                    .map((b) => b.userId?._id),
                ).size
              }
            </h3>
          </div>
          <div className="w-14 h-14 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center text-2xl font-bold">
            👤
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-xl shadow-amber-100/40 border border-slate-100 flex items-center justify-between hover:-translate-y-1 transition-transform duration-300">
          <div>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">
              Pending Requests
            </p>
            <h3 className="text-4xl font-black text-amber-500">
              {bookings.filter((b) => b.status === "pending").length}
            </h3>
          </div>
          <div className="w-14 h-14 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center text-2xl font-bold">
            ⏳
          </div>
        </div>
      </div>

      {/* Event Creation Form */}
      {showEventForm && (
        <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-xl shadow-indigo-100/50 border border-slate-100 mb-12">
          <div className="mb-8 border-b border-slate-100 pb-4">
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Create New Event
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              Fill out the details below to publish a new event to the platform.
            </p>
          </div>
          <form
            onSubmit={handleCreateEvent}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            <input
              required
              type="text"
              placeholder="Event Title"
              className="bg-slate-50 border border-transparent px-5 py-4 rounded-xl focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 outline-none transition-all font-medium text-slate-700"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
            <input
              required
              type="text"
              placeholder="Category (e.g., Tech, Music)"
              className="bg-slate-50 border border-transparent px-5 py-4 rounded-xl focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 outline-none transition-all font-medium text-slate-700"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
            />
            <input
              required
              type="date"
              className="bg-slate-50 border border-transparent px-5 py-4 rounded-xl focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 outline-none transition-all font-medium text-slate-700"
              value={formData.date}
              onChange={(e) =>
                setFormData({ ...formData, date: e.target.value })
              }
            />
            <input
              required
              type="text"
              placeholder="Location"
              className="bg-slate-50 border border-transparent px-5 py-4 rounded-xl focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 outline-none transition-all font-medium text-slate-700"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
            />
            <input
              required
              type="number"
              placeholder="Total Seats"
              className="bg-slate-50 border border-transparent px-5 py-4 rounded-xl focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 outline-none transition-all font-medium text-slate-700"
              value={formData.totalSeats}
              onChange={(e) =>
                setFormData({ ...formData, totalSeats: e.target.value })
              }
            />
            <input
              required
              type="number"
              placeholder="Ticket Price (0 for free)"
              className="bg-slate-50 border border-transparent px-5 py-4 rounded-xl focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 outline-none transition-all font-medium text-slate-700"
              value={formData.ticketPrice}
              onChange={(e) =>
                setFormData({ ...formData, ticketPrice: e.target.value })
              }
            />

            <div className="md:col-span-2">
              <input
                type="text"
                placeholder="Image URL (Provide any direct link to an image)"
                className="w-full bg-slate-50 border border-transparent px-5 py-4 rounded-xl focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 outline-none transition-all font-medium text-slate-700"
                value={formData.image}
                onChange={(e) =>
                  setFormData({ ...formData, image: e.target.value })
                }
              />
            </div>

            <textarea
              required
              placeholder="Event Description"
              className="bg-slate-50 border border-transparent px-5 py-4 rounded-xl md:col-span-2 h-36 focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 outline-none transition-all font-medium text-slate-700 resize-none"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
            <button
              type="submit"
              className="md:col-span-2 bg-indigo-600 text-white font-bold py-4 mt-2 rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 text-lg"
            >
              Publish Event
            </button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Events Section */}
        <div className="flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center">
              {events.length}
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Manage Events
            </h2>
          </div>
          <div className="bg-white rounded-3xl shadow-md shadow-slate-200/50 border border-slate-100 overflow-hidden">
            <ul className="divide-y divide-slate-100 max-h-[650px] overflow-y-auto custom-scrollbar">
              {events.length === 0 ? (
                <li className="p-10 text-slate-500 text-center font-medium">
                  No events created yet.
                </li>
              ) : (
                events.map((event) => (
                  <li
                    key={event._id}
                    className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5 hover:bg-slate-50 transition-colors"
                  >
                    <div>
                      <h4 className="font-bold text-slate-900 text-lg mb-2 leading-tight">
                        {event.title}
                      </h4>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                        <span className="flex items-center gap-1.5 font-medium">
                          <div className="w-2 h-2 rounded-full bg-violet-400"></div>
                          {new Date(event.date).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                        <span className="flex items-center gap-1.5 font-medium">
                          <div
                            className={`w-2 h-2 rounded-full ${event.availableSeats > 0 ? "bg-emerald-400" : "bg-rose-400"}`}
                          ></div>
                          {event.availableSeats}/{event.totalSeats} seats
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteEvent(event._id)}
                      className="w-full sm:w-auto text-rose-500 hover:text-white hover:bg-rose-500 bg-rose-50 px-5 py-2.5 rounded-xl text-sm font-bold transition-colors shrink-0"
                    >
                      Delete
                    </button>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>

        {/* Bookings Section */}
        <div className="flex flex-col">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 font-bold flex items-center justify-center">
              {bookings.length}
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Booking Requests
            </h2>
          </div>
          <div className="bg-white rounded-3xl shadow-md shadow-slate-200/50 border border-slate-100 overflow-hidden">
            <ul className="divide-y divide-slate-100 max-h-[650px] overflow-y-auto custom-scrollbar">
              {bookings.length === 0 ? (
                <li className="p-10 text-slate-500 text-center font-medium">
                  No bookings yet.
                </li>
              ) : (
                bookings.map((booking) => (
                  <li
                    key={booking._id}
                    className="p-6 hover:bg-slate-50 transition-colors relative"
                  >
                    {/* Status indicator line */}
                    <div
                      className={`absolute left-0 top-0 bottom-0 w-1.5 ${booking.status === "pending" ? "bg-amber-400" : booking.status === "confirmed" ? "bg-emerald-400" : "bg-rose-400"}`}
                    ></div>

                    <div className="flex justify-between items-start mb-4 pl-2">
                      <h4 className="font-bold text-slate-900 text-lg leading-tight">
                        {booking.eventId?.title || "Deleted Event"}
                      </h4>
                      <div className="flex flex-col gap-2 items-end shrink-0 ml-4">
                        <span
                          className={`px-2.5 py-1 text-[10px] font-black rounded-md uppercase tracking-wider ${booking.status === "confirmed" ? "bg-emerald-100 text-emerald-700" : booking.status === "cancelled" ? "bg-rose-100 text-rose-700" : "bg-amber-100 text-amber-700"}`}
                        >
                          {booking.status}
                        </span>
                        {booking.status !== "cancelled" && (
                          <span
                            className={`px-2.5 py-1 text-[10px] font-black rounded-md uppercase tracking-wider ${booking.paymentStatus === "paid" ? "bg-indigo-100 text-indigo-700" : "bg-slate-200 text-slate-700"}`}
                          >
                            {booking.paymentStatus.replace("_", " ")}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="bg-slate-50 rounded-2xl p-4 mb-4 border border-slate-100 text-sm ml-2">
                      <div className="grid grid-cols-[70px_1fr] gap-y-2 text-slate-700">
                        <span className="font-bold text-slate-400 uppercase text-xs flex items-center">
                          User
                        </span>
                        <span className="font-semibold">
                          {booking.userId?.name}{" "}
                          <span className="text-slate-400 font-normal ml-1">
                            ({booking.userId?.email})
                          </span>
                        </span>

                        <span className="font-bold text-slate-400 uppercase text-xs flex items-center">
                          Amount
                        </span>
                        <span
                          className={`font-semibold ${booking.amount === 0 ? "text-emerald-500" : ""}`}
                        >
                          {booking.amount === 0 ? "Free" : `₹${booking.amount}`}
                        </span>

                        <span className="font-bold text-slate-400 uppercase text-xs flex items-center">
                          Date
                        </span>
                        <span>
                          {new Date(booking.bookedAt).toLocaleString(
                            undefined,
                            { dateStyle: "medium", timeStyle: "short" },
                          )}
                        </span>
                      </div>

                      {booking.eventId && (
                        <div className="mt-3 pt-3 border-t border-slate-200 grid grid-cols-[70px_1fr] text-slate-700">
                          <span className="font-bold text-slate-400 uppercase text-xs flex items-center">
                            Seats
                          </span>
                          <span>
                            <span
                              className={`font-bold ${booking.eventId.availableSeats > 0 ? "text-emerald-500" : "text-rose-500"}`}
                            >
                              {booking.eventId.availableSeats}
                            </span>{" "}
                            remaining of {booking.eventId.totalSeats}
                          </span>
                        </div>
                      )}
                    </div>

                    {booking.status === "pending" && (
                      <div className="flex flex-wrap gap-3 ml-2">
                        <button
                          onClick={() =>
                            handleConfirmBooking(booking._id, "paid")
                          }
                          className="flex-1 min-w-[120px] bg-emerald-50 text-emerald-700 hover:bg-emerald-500 hover:text-white text-xs font-bold py-3 px-3 rounded-xl transition-colors"
                        >
                          Approve (Paid)
                        </button>
                        <button
                          onClick={() =>
                            handleConfirmBooking(booking._id, "not_paid")
                          }
                          className="flex-1 min-w-[120px] bg-slate-100 text-slate-700 hover:bg-slate-700 hover:text-white text-xs font-bold py-3 px-3 rounded-xl transition-colors"
                        >
                          Approve (Unpaid)
                        </button>
                        <button
                          onClick={() => handleCancelBooking(booking._id)}
                          className="w-auto px-5 bg-rose-50 text-rose-600 hover:bg-rose-500 hover:text-white text-xs font-bold py-3 rounded-xl transition-colors"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
