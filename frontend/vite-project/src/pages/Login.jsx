// frontend/vite-project/src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";
import { Loader2 } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  // Get the page user was trying to access before login
  const from = location.state?.from?.pathname || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState({
    type: "initial",
    content: "Please enter your email and password to log in.",
  });
  const [errors, setErrors] = useState({});

  const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const validate = () => {
    const currentErrors = {};
    if (!email || !isValidEmail(email)) {
      currentErrors.email = "Please enter a valid email address.";
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
    if (Object.keys(errors).length > 0) setTimeout(validate, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      setStatusMessage({ type: "error", content: "Please correct the errors." });
      return;
    }

    setIsSubmitting(true);
    setStatusMessage({ type: "loading", content: "Logging in..." });

    try {
      const response = await api.login(email, password);
      const { token, user } = response;

      // Update auth context
      login(user, token);

      setStatusMessage({
        type: "success",
        content: `Welcome back, ${user.email}! Redirecting...`,
      });
      
      // Redirect to intended page or home
      setTimeout(() => navigate(from, { replace: true }), 1000);
    } catch (error) {
      const errorMsg = error.message || "Login failed. Please try again.";
      setStatusMessage({ type: "error", content: errorMsg });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusClasses = () => {
    switch (statusMessage.type) {
      case "success": return "border-emerald-500 bg-emerald-900/20 text-emerald-300";
      case "error": return "border-red-500 bg-red-900/20 text-red-300";
      case "loading": return "border-sky-500 bg-sky-900/20 text-sky-300";
      default: return "border-gray-700 bg-black/40 text-gray-300";
    }
  };

  return (
    <div className="min-h-screen w-full font-sans bg-gradient-to-br from-[#020617] via-black to-[#020617] text-white flex items-center justify-center p-4">
      {/* Background Effects */}
      <div className="pointer-events-none fixed inset-0 opacity-30">
        <div className="absolute top-0 left-0 h-64 w-64 bg-emerald-500 blur-3xl rounded-full opacity-40 animate-pulse" />
        <div className="absolute bottom-0 right-0 h-64 w-64 bg-sky-500 blur-3xl rounded-full opacity-40" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold">
            Welcome Back to JOB<span className="text-emerald-400">LELO</span>
          </h1>
          <p className="mt-2 text-gray-300">Sign in to continue your career journey</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="rounded-2xl border border-emerald-400/20 bg-white/5 backdrop-blur-xl p-6 space-y-5 shadow-2xl">
          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
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
              } focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 px-4 py-2.5 text-sm text-white placeholder-gray-500 transition-colors`}
              placeholder="you@example.com"
              disabled={isSubmitting}
            />
            {errors.email && (
              <p className="text-xs text-red-400 mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password Input */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2">
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
              } focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 px-4 py-2.5 text-sm text-white placeholder-gray-500 transition-colors`}
              placeholder="Enter your password"
              disabled={isSubmitting}
            />
            {errors.password && (
              <p className="text-xs text-red-400 mt-1">{errors.password}</p>
            )}
          </div>

          {/* Status Message */}
          <div className={`rounded-xl p-3 text-sm border ${getStatusClasses()}`}>
            {statusMessage.type === "loading" && (
              <Loader2 className="inline-block animate-spin mr-2 h-4 w-4" />
            )}
            {statusMessage.content}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin h-5 w-5" />
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </button>

          {/* Register Link */}
          <p className="text-center text-sm text-gray-400">
            Don't have an account?{" "}
            <Link to="/register" className="text-emerald-400 hover:underline font-semibold">
              Register here
            </Link>
          </p>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-gray-500">
          By logging in, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default Login;