import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../utils/axios";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaSearch,
  FaRegClock,
  FaTicketAlt,
  FaShieldAlt,
} from "react-icons/fa";

const Home = () => {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchEvents();
    }, 400);
    return () => clearTimeout(timeoutId);
  }, [search]);

  const fetchEvents = async () => {
    try {
      const { data } = await api.get(`/events?search=${search}`);
      setEvents(data);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC] font-sans text-slate-900">
      <section className="px-4 sm:px-6 lg:px-8 pt-20 pb-16 lg:pt-32 lg:pb-24 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-4xl mx-auto">
          <span className="inline-block py-1.5 px-4 rounded-full bg-rose-100 text-rose-700 text-sm font-bold tracking-widest uppercase mb-6">
            Welcome to OurEvents
          </span>
          <h1 className="text-5xl md:text-7xl font-black tracking-tight text-slate-900 mb-8 leading-tight">
            Find the experiences that <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-orange-400">
              matter to you.
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-500 mb-12 max-w-2xl mx-auto">
            Discover top local events, secure your tickets seamlessly, and make
            memories that last a lifetime.
          </p>

          {/* Redesigned Search Bar */}
          <div className="relative max-w-2xl mx-auto group">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <FaSearch className="text-slate-400 text-xl group-focus-within:text-rose-500 transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Search by event name, category, or location..."
              className="w-full pl-14 pr-6 py-5 rounded-full border border-slate-200 bg-white text-lg focus:outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-50 shadow-sm transition-all text-slate-800 placeholder-slate-400"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Minimalist Feature Strip */}
      <section className="bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-slate-100">
            <div className="flex flex-col items-center px-4 pt-4 md:pt-0">
              <FaRegClock className="text-3xl text-orange-400 mb-4" />
              <h3 className="text-lg font-bold text-slate-800 mb-2">
                Fast Checkout
              </h3>
              <p className="text-slate-500 text-sm">
                Grab your tickets in seconds with our optimized platform.
              </p>
            </div>
            <div className="flex flex-col items-center px-4 pt-8 md:pt-0">
              <FaTicketAlt className="text-3xl text-rose-500 mb-4" />
              <h3 className="text-lg font-bold text-slate-800 mb-2">
                Digital Tickets
              </h3>
              <p className="text-slate-500 text-sm">
                Access all your event passes instantly from your mobile device.
              </p>
            </div>
            <div className="flex flex-col items-center px-4 pt-8 md:pt-0">
              <FaShieldAlt className="text-3xl text-rose-600 mb-4" />
              <h3 className="text-lg font-bold text-slate-800 mb-2">
                Secure Booking
              </h3>
              <p className="text-slate-500 text-sm">
                Your payment data is fully encrypted and secure with us.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Events Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex-grow w-full">
        <div className="flex items-center justify-between mb-10 border-b border-slate-200 pb-6">
          <h2 className="text-3xl font-bold text-slate-900">Explore Events</h2>
          <span className="bg-slate-900 text-white text-sm font-semibold px-4 py-1.5 rounded-full">
            {events.length} Results
          </span>
        </div>

        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center">
            <div className="w-12 h-12 border-4 border-rose-100 border-t-rose-500 rounded-full animate-spin mb-4"></div>
            <p className="text-slate-500 font-medium">
              Loading amazing events...
            </p>
          </div>
        ) : events.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center bg-white rounded-2xl border border-slate-200">
            <div className="bg-slate-50 p-6 rounded-full mb-4">
              <FaSearch className="text-4xl text-slate-300" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">
              No results found
            </h3>
            <p className="text-slate-500">
              We couldn't find any events matching "{search}".
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <div
                key={event._id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col h-full group"
              >
                {/* Image Container */}
                <div className="aspect-[4/3] relative overflow-hidden bg-slate-100">
                  {event.image ? (
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold text-xl uppercase tracking-widest bg-slate-100">
                      {event.category || "Event"}
                    </div>
                  )}
                  {/* Floating Badges */}
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-md text-xs font-bold text-slate-800 shadow-sm uppercase tracking-wide">
                    {event.category}
                  </div>
                  <div className="absolute top-4 right-4 bg-slate-900 text-white px-3 py-1 rounded-md text-sm font-bold shadow-sm">
                    {event.ticketPrice === 0 ? "FREE" : `₹${event.ticketPrice}`}
                  </div>
                </div>

                {/* Content Container */}
                <div className="p-6 flex flex-col flex-grow">
                  <h2 className="text-xl font-bold text-slate-900 mb-4 line-clamp-2 leading-snug group-hover:text-rose-600 transition-colors">
                    {event.title}
                  </h2>

                  <div className="space-y-3 mb-8">
                    <div className="flex items-start text-slate-500 text-sm">
                      <FaCalendarAlt className="mt-1 mr-3 text-rose-400 flex-shrink-0" />
                      <span>
                        {new Date(event.date).toLocaleDateString(undefined, {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="flex items-start text-slate-500 text-sm">
                      <FaMapMarkerAlt className="mt-1 mr-3 text-orange-400 flex-shrink-0" />
                      <span className="line-clamp-2">{event.location}</span>
                    </div>
                  </div>

                  {/* Footer / Action Area */}
                  <div className="mt-auto pt-5 border-t border-slate-100 flex items-center justify-between">
                    <div className="text-sm">
                      <span className="block text-slate-400 font-medium text-xs mb-0.5">
                        Availability
                      </span>
                      <span
                        className={`font-bold ${event.availableSeats < 10 ? "text-orange-500" : "text-emerald-600"}`}
                      >
                        {event.availableSeats} / {event.totalSeats} seats
                      </span>
                    </div>
                    <Link
                      to={`/events/${event._id}`}
                      className="bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white font-semibold py-2.5 px-6 rounded-lg transition-colors duration-200"
                    >
                      Book Now
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Minimalist Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 text-white mb-4">
            <FaTicketAlt className="text-rose-500 text-xl" />
            <span className="text-2xl font-black tracking-tight">
              OurEvents
            </span>
          </div>
          <p className="text-sm max-w-sm mx-auto mb-6 leading-relaxed">
            Your central hub to discover, book, and enjoy the best live
            experiences happening around you.
          </p>
          <p className="text-xs text-slate-600 font-medium">
            &copy; {new Date().getFullYear()} OurEvents. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
