import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // 👈 import navigate

const Login = () => {
  const navigate = useNavigate(); // 👈 hook for redirect

  // Form data
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState({
    type: "initial", // 'initial', 'success', 'error', 'loading'
    content: "Please enter your email and password to log in.",
  });

  // Error state
  const [errors, setErrors] = useState({});

  const isValidEmail = (value) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  };

  const validate = () => {
    const currentErrors = {};

    if (!email || !isValidEmail(email)) {
      currentErrors.email =
        "Please enter a valid email address (e.g., user@domain.com).";
    }

    if (!password) {
      currentErrors.password = "Password is required.";
    }

    setErrors(currentErrors);
    return Object.keys(currentErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;

    if (id === "email") setEmail(value);
    if (id === "password") setPassword(value);

    if (Object.keys(errors).length > 0) {
      setTimeout(validate, 0);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      setStatusMessage({
        type: "error",
        content: "Validation failed. Please correct the highlighted errors.",
      });
      return;
    }

    setIsSubmitting(true);
    setStatusMessage({
      type: "loading",
      content: "Attempting login... Please wait.",
    });

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      const { token, user } = res.data;

      // store auth data
      localStorage.setItem("joblelo_token", token);
      localStorage.setItem("joblelo_user_email", user.email);

      setStatusMessage({
        type: "success",
        content: (
          <div className="text-left">
            <p className="text-lg font-bold text-emerald-400">
              Login Successful!
            </p>
            <p>Welcome back, {user.email}.</p>
            <p className="text-xs text-gray-500 mt-1">
              Redirecting you to home...
            </p>
          </div>
        ),
      });

      setPassword("");

      // ✅ redirect only when login is valid
      navigate("/home"); // make sure you have <Route path="/home" element={<Home />} />
    } catch (error) {
      const errorMsg =
        error?.response?.data?.message || "Login failed due to a server error.";

      setStatusMessage({
        type: "error",
        content: (
          <div className="text-left">
            <p className="text-lg font-bold text-red-400">Login Failed</p>
            <p className="text-red-300">{errorMsg}</p>
            <p className="text-sm text-gray-400 mt-2">
              Please check your email and password and try again.
            </p>
          </div>
        ),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusClasses = () => {
    switch (statusMessage.type) {
      case "success":
        return "border-emerald-500 bg-emerald-900/20";
      case "error":
        return "border-red-500 bg-red-900/20";
      case "loading":
        return "border-sky-500 bg-sky-900/20";
      case "initial":
      default:
        return "border-gray-700 bg-black/40";
    }
  };

  return (
    <div
      className="
        min-h-screen w-full font-sans 
        bg-gradient-to-br from-[#020617] via-black to-[#020617] 
        text-white flex items-stretch justify-center 
        overflow-x-hidden
      "
    >
      {/* Background orbs but a bit softer & non-blocking */}
      <div className="pointer-events-none fixed inset-0 opacity-50">
        <div className="absolute -top-32 -left-32 h-64 w-64 bg-emerald-500 blur-3xl rounded-full opacity-40 animate-pulse" />
        <div className="absolute -bottom-40 -right-20 h-72 w-72 bg-sky-500 blur-3xl rounded-full opacity-40 animate-ping" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-80 w-80 border border-emerald-300/10 rounded-full" />
      </div>

      {/* Scroll container so content never gets cut off */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 py-10 md:py-12 lg:py-16 overflow-y-auto">
        {/* Header */}
        <div className="mb-8 md:mb-10 flex flex-col items-center text-center gap-3">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-400/30 shadow-lg shadow-emerald-500/20">
            <svg
              className="w-4 h-4 text-emerald-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
            <span className="text-xs md:text-sm font-medium tracking-wide">
              Secure Login • JOBLELO
            </span>
          </div>
          <h1 className="mt-1 text-2xl md:text-4xl lg:text-5xl font-extrabold tracking-tight">
            Welcome back to JOB
            <span className="text-emerald-400">LELO</span>
          </h1>
          <p className="mt-1 max-w-xl text-xs md:text-sm lg:text-base text-gray-300">
            Enter your credentials to continue your journey with our inclusive
            career intelligence platform.
          </p>
        </div>

        {/* Two-column layout, collapses nicely on small screens */}
        <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-start">
          {/* Login Form Card */}
          <form
            onSubmit={handleSubmit}
            className="
              relative rounded-2xl border border-emerald-400/20 
              bg-white/5 backdrop-blur-xl 
              shadow-[0_0_30px_rgba(16,185,129,0.25)]
              p-5 md:p-7 lg:p-8 
              space-y-5
            "
          >
            <h2 className="text-lg md:text-xl font-bold text-emerald-300">
              Login to your account
            </h2>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium mb-2 text-gray-200"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                required
                value={email}
                onChange={handleInputChange}
                className={`w-full rounded-xl bg-black/50 border ${
                  errors.email ? "border-red-500" : "border-gray-700"
                } focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 px-3.5 py-2.5 text-sm text-gray-100 placeholder-gray-500 transition-colors`}
                placeholder="you@example.com"
              />
              {errors.email && (
                <p className="text-xs text-red-400 mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-2 text-gray-200"
              >
                Password
             </label>
              <input
                type="password"
                id="password"
                required
                value={password}
                onChange={handleInputChange}
                className={`w-full rounded-xl bg-black/50 border ${
                  errors.password ? "border-red-500" : "border-gray-700"
                } focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 px-3.5 py-2.5 text-sm text-gray-100 placeholder-gray-500 transition-colors`}
                placeholder="Enter your password"
              />
              {errors.password && (
                <p className="text-xs text-red-400 mt-1">{errors.password}</p>
              )}
            </div>

            {/* Forgot password hint */}
            <div className="flex justify-end">
              <button
                type="button"
                className="text-xs text-sky-400 hover:text-sky-300"
              >
                Forgot password?
              </button>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="
                w-full inline-flex items-center justify-center gap-2 
                px-5 py-2.5 rounded-xl 
                bg-emerald-500 hover:bg-emerald-400 
                text-black font-bold text-sm md:text-base 
                transition-all shadow-lg shadow-emerald-500/30 
                disabled:opacity-50 disabled:cursor-not-allowed
              "
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 text-black"
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
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </button>
          </form>

          {/* Status & Info Card */}
          <div
            className="
              relative rounded-2xl border border-gray-700/60 
              bg-white/5 backdrop-blur-xl 
              p-5 md:p-7 lg:p-8 
              space-y-5 self-stretch
            "
          >
            <h2 className="text-lg md:text-xl font-bold text-sky-300">
              Login Status
            </h2>

            <div
              className={`rounded-xl p-3.5 md:p-4 text-sm text-gray-200 border ${getStatusClasses()} min-h-[80px] flex items-center`}
            >
              {statusMessage.type === "loading" && (
                <svg
                  className="animate-spin mr-3 h-5 w-5 text-sky-400"
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
              )}
              {typeof statusMessage.content === "string" ? (
                <p
                  className={
                    statusMessage.type === "error"
                      ? "text-red-300"
                      : "text-gray-200"
                  }
                >
                  {statusMessage.content}
                </p>
              ) : (
                statusMessage.content
              )}
            </div>

            <div className="border-t border-gray-700/60 pt-3 md:pt-4">
              <p className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-gray-400 mb-2">
                Security Tip
              </p>
              <p className="text-xs md:text-sm text-gray-300">
                Never share your password with anyone. JOBLELO uses hashed
                passwords and JWT-based authentication on the backend for
                secure access.
              </p>
            </div>

            <div className="border-t border-gray-700/60 pt-3 md:pt-4">
              <p className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-gray-400 mb-2">
                New to JOBLELO?
              </p>
              <p className="text-xs md:text-sm text-gray-300">
                If you don’t have an account yet, go to the registration page
                or use the voice registration flow to get started.
              </p>
            </div>
          </div>
        </div>

        {/* Footer line */}
        <div className="mt-6 md:mt-8 flex flex-col md:flex-row items-center justify-between gap-2 text-[10px] md:text-[11px] text-gray-500 px-1">
          <span>JOBLELO • Inclusive Career Intelligence</span>
          <span>Standard User Login</span>
        </div>
      </div>
    </div>
  );
};

export default Login;
