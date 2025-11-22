import React, { useState } from "react";
import axios from "axios";

const API_BASE = "http://localhost:5000"; // backend base URL

// Real API call to backend
const registerUser = async (email, password) => {
  const res = await axios.post(`${API_BASE}/api/auth/register`, {
    email,
    password,
  });
  // Backend responds with: { message, userId }
  return res.data;
};

const UserReg = () => {
  // Form data state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);

  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState({
    type: "initial", // 'initial', 'success', 'error', 'loading'
    content: 'Please fill out the form and click "Register Account".',
  });

  // Error state
  const [errors, setErrors] = useState({});

  // Validation helpers
  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const isValidPassword = (password) => {
    // Minimum 8 characters, at least one uppercase, one lowercase, and one number
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    return regex.test(password);
  };

  // Full validation
  const validate = () => {
    let currentErrors = {};

    // 1. Email Validation
    if (!email || !isValidEmail(email)) {
      currentErrors.email =
        "Please enter a valid email address (e.g., user@domain.com).";
    }

    // 2. Password Strength Validation
    if (!password || !isValidPassword(password)) {
      currentErrors.password =
        "Password must be 8+ chars, with upper/lower case and a number.";
    }

    // 3. Confirm Password Match Validation
    if (password && confirmPassword && password !== confirmPassword) {
      currentErrors.confirmPassword = "Passwords do not match.";
    }

    // 4. Terms Check
    if (!termsAccepted) {
      currentErrors.terms = "You must agree to the Terms and Conditions.";
    }

    setErrors(currentErrors);
    // Returns true if no errors
    return Object.keys(currentErrors).length === 0;
  };

  // Validate on input change
  const handleInputChange = (e) => {
    const { id, value, checked } = e.target;

    if (id === "email") setEmail(value);
    if (id === "password") setPassword(value);
    if (id === "confirmPassword") setConfirmPassword(value);
    if (id === "terms") setTermsAccepted(checked);

    // Re-validate to update error messages
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
      content: "Attempting registration... Please wait.",
    });

    try {
      const result = await registerUser(email, password); // calls real backend

      setStatusMessage({
        type: "success",
        content: (
          <div className="text-left">
            <p className="text-lg font-bold text-emerald-400">Success!</p>
            <p>Account created for {email}. You can now log in.</p>
            <p className="text-xs text-gray-500 mt-1">
              User ID: {result.userId}
            </p>
          </div>
        ),
      });

      // Clear form
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setTermsAccepted(false);
      setErrors({});
    } catch (error) {
      const errorMessage =
        error?.response?.data?.message ||
        error.message ||
        "An unknown error occurred during registration.";

      setStatusMessage({
        type: "error",
        content: (
          <div className="text-left">
            <p className="text-lg font-bold text-red-400">
              Registration Failed
            </p>
            <p className="text-red-300">{errorMessage}</p>
            <p className="text-sm text-gray-400 mt-2">
              Please check your details and try again.
            </p>
          </div>
        ),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Status card styling
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
      {/* Glowing background orbs (slightly smaller + fixed so they don't add height) */}
      <div className="pointer-events-none fixed inset-0 opacity-60">
        <div className="absolute -top-24 -left-24 h-56 w-56 bg-emerald-500 blur-3xl rounded-full opacity-40 animate-pulse" />
        <div className="absolute -bottom-32 -right-16 h-64 w-64 bg-sky-500 blur-3xl rounded-full opacity-40 animate-ping" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-80 w-80 border border-emerald-300/10 rounded-full" />
      </div>

      {/* Scrollable content wrapper so nothing gets cut off */}
      <div className="relative z-10 max-w-4xl w-full mx-4 px-4 sm:px-0 py-8 md:py-10 lg:py-12 overflow-y-auto">
        <div className="mb-8 flex flex-col items-center text-center">
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
                d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1m-1-4h1m-1 4h-1m-4 1v1m-1-4h1m-1 4h-1m-4 1v1m-1-4h1m-1 4h-1m-4 1v1m-1-4h1m-1 4h-1m4-12v1m-1-4h1m-1 4h-1m-4 1v1m-1-4h1m-1 4h-1m-4 1v1m-1-4h1m-1 4h-1m4 1v1m-1-4h1m-1 4h-1m-4 1v1m-1-4h1m-1 4h-1"
              ></path>
            </svg>
            <span className="text-xs md:text-sm font-medium tracking-wide">
              Standard Registration • Secure & Fast
            </span>
          </div>
          <h1 className="mt-4 text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight">
            Create Your JOB<span className="text-emerald-400">LELO</span> Account
          </h1>
          <p className="mt-2 max-w-lg text-sm md:text-base text-gray-300">
            Join thousands of users finding their next career step with our
            inclusive intelligence platform.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-start">
          {/* Registration Form Card */}
          <form
            onSubmit={handleSubmit}
            className="
              relative rounded-2xl border border-emerald-400/20 
              bg-white/5 backdrop-blur-xl 
              shadow-[0_0_32px_rgba(16,185,129,0.25)] 
              p-5 md:p-6 lg:p-7 
              space-y-5
            "
          >
            <h2 className="text-lg md:text-xl font-bold text-emerald-300">
              Account Details
            </h2>

            {/* Email Input */}
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
                name="email"
                required
                value={email}
                onChange={handleInputChange}
                className={`w-full rounded-xl bg-black/50 border ${
                  errors.email ? "border-red-500" : "border-gray-700"
                } focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 px-4 py-2.5 text-sm text-gray-100 placeholder-gray-500 transition-colors`}
                placeholder="you@example.com"
              />
              {errors.email && (
                <p className="text-xs text-red-400 mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password Input */}
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
                name="password"
                required
                minLength={8}
                value={password}
                onChange={handleInputChange}
                className={`w-full rounded-xl bg-black/50 border ${
                  errors.password ? "border-red-500" : "border-gray-700"
                } focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 px-4 py-2.5 text-sm text-gray-100 placeholder-gray-500 transition-colors`}
                placeholder="Minimum 8 characters"
              />
              {errors.password && (
                <p className="text-xs text-red-400 mt-1">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password Input */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium mb-2 text-gray-200"
              >
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                required
                value={confirmPassword}
                onChange={handleInputChange}
                className={`w-full rounded-xl bg-black/50 border ${
                  errors.confirmPassword ? "border-red-500" : "border-gray-700"
                } focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 px-4 py-2.5 text-sm text-gray-100 placeholder-gray-500 transition-colors`}
                placeholder="Re-enter your password"
              />
              {errors.confirmPassword && (
                <p className="text-xs text-red-400 mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            {/* Terms and Conditions Checkbox */}
            <div className="flex items-start pt-1.5">
              <input
                id="terms"
                type="checkbox"
                required
                checked={termsAccepted}
                onChange={handleInputChange}
                className={`mt-1 h-4 w-4 text-emerald-500 rounded border ${
                  errors.terms ? "border-red-500" : "border-gray-700"
                } bg-gray-900 focus:ring-emerald-500`}
              />
              <label htmlFor="terms" className="ml-3 text-sm text-gray-400">
                I agree to the{" "}
                <a
                  href="#"
                  className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
                >
                  Terms and Conditions
                </a>
                .
              </label>
            </div>
            {errors.terms && (
              <p className="text-xs text-red-400 mt-1 -mt-1">{errors.terms}</p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="
                w-full inline-flex items-center justify-center gap-2 
                px-6 py-2.5 rounded-xl 
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
                  Processing...
                </>
              ) : (
                "Register Account"
              )}
            </button>
          </form>

          {/* Status and Information Card */}
          <div
            className="
              relative rounded-2xl border border-gray-700/60 
              bg-white/5 backdrop-blur-xl 
              p-5 md:p-6 lg:p-7 
              space-y-5 self-stretch
            "
          >
            <h2 className="text-lg md:text-xl font-bold text-sky-300">
              Registration Status
            </h2>

            <div
              className={`rounded-xl p-3.5 text-sm text-gray-200 border ${getStatusClasses()} min-h-[80px] flex items-center`}
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

            <div className="border-t border-gray-700/60 pt-3.5">
              <p className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-gray-400 mb-2">
                Password Policy
              </p>
              <ul className="text-xs md:text-sm space-y-1 list-disc list-inside text-gray-300">
                <li>Minimum 8 characters.</li>
                <li>Must include uppercase and lowercase letters.</li>
                <li>Must include at least one number.</li>
              </ul>
            </div>

            <div className="border-t border-gray-700/60 pt-3.5">
              <p className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-gray-400 mb-2">
                Note
              </p>
              <p className="text-xs md:text-sm text-gray-300">
                This registration is connected to your real JOBLELO backend API
                at{" "}
                <code className="text-[10px]">/api/auth/register</code>.
              </p>
            </div>
          </div>
        </div>

        {/* Footer line */}
        <div className="mt-8 md:mt-9 flex flex-col md:flex-row items-center justify-between gap-2 text-[10px] md:text-[11px] text-gray-500 px-1">
          <span>JOBLELO • Inclusive Career Intelligence</span>
          <span>Standard User Registration</span>
        </div>
      </div>
    </div>
  );
};

export default UserReg;
