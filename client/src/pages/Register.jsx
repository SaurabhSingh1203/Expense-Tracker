import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showOTP, setShowOTP] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { register, verifyOTP } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (!showOTP) {
        await register(name, email, password);
        setShowOTP(true);
        setError("");
      } else {
        await verifyOTP(email, otp);
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.message || err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-neutral-950 font-sans text-neutral-100">
      {/* Left Panel - Branding (Hidden on smaller screens) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-neutral-900 overflow-hidden items-center justify-center border-r border-neutral-800">
        {/* Decorative background glows */}
        <div className="absolute top-[-15%] left-[-10%] w-96 h-96 bg-emerald-600/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-teal-600/20 rounded-full blur-3xl"></div>

        <div className="relative z-10 text-center px-16">
          <h1 className="text-5xl font-extrabold tracking-tight mb-6 bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
            OurEvents
          </h1>
          <p className="text-lg text-neutral-400 max-w-md mx-auto leading-relaxed">
            Discover, manage, and experience unforgettable moments. Your gateway
            to extraordinary events starts here.
          </p>
        </div>
      </div>

      {/* Right Panel - Register Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 md:p-16">
        <div className="w-full max-w-md space-y-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-white">
              Create an Account
            </h2>
            <p className="mt-2 text-sm text-neutral-400">
              Join OurEvents today and start exploring
            </p>
          </div>

          {error && (
            <div className="bg-red-950/50 border-l-4 border-red-500 p-4 rounded-r-md animate-pulse">
              <p className="text-sm text-red-400 font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            {!showOTP ? (
              <div className="space-y-5">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-neutral-300"
                  >
                    Full Name
                  </label>
                  <div className="mt-2">
                    <input
                      id="name"
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="block w-full rounded-md border-0 bg-neutral-900 py-3.5 px-4 text-white shadow-sm ring-1 ring-inset ring-neutral-800 focus:ring-2 focus:ring-inset focus:ring-emerald-500 sm:text-sm sm:leading-6 transition-all placeholder:text-neutral-600"
                      placeholder="John Doe"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-neutral-300"
                  >
                    Email Address
                  </label>
                  <div className="mt-2">
                    <input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full rounded-md border-0 bg-neutral-900 py-3.5 px-4 text-white shadow-sm ring-1 ring-inset ring-neutral-800 focus:ring-2 focus:ring-inset focus:ring-emerald-500 sm:text-sm sm:leading-6 transition-all placeholder:text-neutral-600"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-neutral-300"
                  >
                    Password
                  </label>
                  <div className="mt-2">
                    <input
                      id="password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full rounded-md border-0 bg-neutral-900 py-3.5 px-4 text-white shadow-sm ring-1 ring-inset ring-neutral-800 focus:ring-2 focus:ring-inset focus:ring-emerald-500 sm:text-sm sm:leading-6 transition-all placeholder:text-neutral-600"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-emerald-950/30 border border-emerald-900/50 text-emerald-400 p-4 rounded-lg text-sm font-medium text-center">
                  An OTP has been sent to your email. Please verify to continue.
                </div>
                <div>
                  <label
                    htmlFor="otp"
                    className="block text-sm font-medium text-center text-neutral-300 mb-4"
                  >
                    Enter 6-Digit Verification Code
                  </label>
                  <input
                    id="otp"
                    type="text"
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    maxLength="6"
                    className="block w-full rounded-lg border-0 bg-neutral-900 py-4 px-4 text-center text-3xl font-mono text-emerald-400 tracking-[0.5em] shadow-sm ring-1 ring-inset ring-neutral-800 focus:ring-2 focus:ring-inset focus:ring-emerald-500 transition-all placeholder:text-neutral-700"
                    placeholder="000000"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || (showOTP && otp.length !== 6)}
              className={`flex w-full justify-center rounded-md px-3 py-4 text-sm font-semibold leading-6 text-white shadow-sm transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 mt-8 ${
                loading || (showOTP && otp.length !== 6)
                  ? "bg-neutral-800 text-neutral-500 cursor-not-allowed"
                  : "bg-emerald-600 hover:bg-emerald-500 focus-visible:outline-emerald-600 hover:shadow-[0_0_20px_rgba(16,185,129,0.3)]"
              }`}
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="animate-spin h-5 w-5 text-current"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </span>
              ) : showOTP ? (
                "Verify & Complete"
              ) : (
                "Sign Up"
              )}
            </button>
          </form>

          {!showOTP && (
            <p className="mt-10 text-center text-sm text-neutral-400">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold leading-6 text-emerald-500 hover:text-emerald-400 transition-colors"
              >
                Sign in
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Register;
