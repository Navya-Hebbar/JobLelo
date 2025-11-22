// frontend/vite-project/src/pages/UserReg.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Loader2 } from "lucide-react";

const UserReg = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState({
    type: "initial",
    content: 'Please fill out the form and click "Register Account".',
  });
  const [errors, setErrors] = useState({});

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const isValidPassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    return regex.test(password);
  };

  const validate = () => {
    let currentErrors = {};

    if (!email || !isValidEmail(email)) {
      currentErrors.email = "Please enter a valid email address.";
    }

    if (!password || !isValidPassword(password)) {
      currentErrors.password =
        "Password must be 8+ chars, with upper/lower case and a number.";
    }

    if (password && confirmPassword && password !== confirmPassword) {
      currentErrors.confirmPassword = "Passwords do not match.";
    }

    if (!termsAccepted) {
      currentErrors.terms = "You must agree to the Terms and Conditions.";
    }

    setErrors(currentErrors);
    return Object.keys(currentErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { id, value, checked } = e.target;

    if (id === "email") setEmail(value);
    if (id === "password") setPassword(value);
    if (id === "confirmPassword") setConfirmPassword(value);
    if (id === "terms") setTermsAccepted(checked);

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
      const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const res = await fetch(`${API_BASE}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Registration failed");
      }

      setStatusMessage({
        type: "success",
        content: (
          <div className="text-left">
            <p className="text-lg font-bold text-emerald-400">Success!</p>
            <p>Account created for {email}.</p>
            <p className="text-xs text-gray-500 mt-1">
              Redirecting to login...
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

      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      const errorMessage =
        error.message || "An unknown error occurred during registration.";

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
    <div className="min-h-screen w-full font-sans bg-gradient-to-br from-[#020617] via-black to-[#020617] text-white flex items-stretch justify-center overflow-x-hidden">
      <div className="pointer-events-none fixed inset-0 opacity-60">
        <div className="absolute -top-24 -left-24 h-56 w-56 bg-emerald-500 blur-3xl rounded-full opacity-40 animate-pulse" />
        <div className="absolute -bottom-32 -right-16 h-64 w-64 bg-sky-500 blur-3xl rounded-full opacity-40 animate-ping" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-80 w-80 border border-emerald-300/10 rounded-full" />
      </div>

      <div className="relative z-10 max-w-4xl w-full mx-4 px-4 sm:px-0 py-8 md:py-10 lg:py-12 overflow-y-auto">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-400/30 shadow-lg shadow-emerald-500/20">
            <svg
              className="w-4 h-4 text-emerald-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
              />
            </svg>
            <span className="text-xs md:text-sm font-medium tracking-wide">
              Standard Registration • Secure & Fast
            </span>
          </div>
          <h1 className="mt-4 text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight">
            Create Your JOB<span className="text-emerald-400">LELO</span>{" "}
            Account
          </h1>
          <p className="mt-2 max-w-lg text-sm md:text-base text-gray-300">
            Join thousands of users finding their next career step with our
            inclusive intelligence platform.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-start">
          <form
            onSubmit={handleSubmit}
            className="relative rounded-2xl border border-emerald-400/20 bg-white/5 backdrop-blur-xl shadow-[0_0_32px_rgba(16,185,129,0.25)] p-5 md:p-6 lg:p-7 space-y-5"
          >
            <h2 className="text-lg md:text-xl font-bold text-emerald-300">
              Account Details
            </h2>

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
                } focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 px-4 py-2.5 text-sm text-gray-100 placeholder-gray-500 transition-colors`}
                placeholder="you@example.com"
              />
              {errors.email && (
                <p className="text-xs text-red-400 mt-1">{errors.email}</p>
              )}
            </div>

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

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-sm md:text-base transition-all shadow-lg shadow-emerald-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5" />
                  Processing...
                </>
              ) : (
                "Register Account"
              )}
            </button>

            <div className="text-center text-sm text-gray-400">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-emerald-400 hover:text-emerald-300 font-medium"
              >
                Login here
              </Link>
            </div>
          </form>

          <div className="relative rounded-2xl border border-gray-700/60 bg-white/5 backdrop-blur-xl p-5 md:p-6 lg:p-7 space-y-5 self-stretch">
            <h2 className="text-lg md:text-xl font-bold text-sky-300">
              Registration Status
            </h2>

            <div
              className={`rounded-xl p-3.5 text-sm text-gray-200 border ${getStatusClasses()} min-h-[80px] flex items-center`}
            >
              {statusMessage.type === "loading" && (
                <Loader2 className="animate-spin mr-3 h-5 w-5 text-sky-400" />
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
                What You Get
              </p>
              <ul className="text-xs md:text-sm space-y-1 list-disc list-inside text-gray-300">
                <li>AI-powered career assistant</li>
                <li>Resume builder with ATS optimization</li>
                <li>Skill assessment tests</li>
                <li>Personalized job matching</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8 md:mt-9 flex flex-col md:flex-row items-center justify-between gap-2 text-[10px] md:text-[11px] text-gray-500 px-1">
          <span>JOBLELO • Inclusive Career Intelligence</span>
          <span>Standard User Registration</span>
        </div>
      </div>
    </div>
  );
};

export default UserReg;