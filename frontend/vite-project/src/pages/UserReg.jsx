// frontend/vite-project/src/pages/UserReg.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../services/api";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";

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

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  
  const isValidPassword = (password) => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(password);
  };

  const validate = () => {
    let currentErrors = {};

    if (!email || !isValidEmail(email)) {
      currentErrors.email = "Please enter a valid email address.";
    }

    if (!password || !isValidPassword(password)) {
      currentErrors.password = "Password must be 8+ chars with upper/lower case and a number.";
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
        content: "Please correct the highlighted errors.",
      });
      return;
    }

    setIsSubmitting(true);
    setStatusMessage({
      type: "loading",
      content: "Creating your account...",
    });

    try {
      const result = await api.register(email, password);

      setStatusMessage({
        type: "success",
        content: `Account created successfully! Redirecting to login...`,
      });

      // Clear form
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setTermsAccepted(false);
      setErrors({});

      // Redirect to login after 2 seconds
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      const errorMessage = error.message || "Registration failed. Please try again.";

      setStatusMessage({
        type: "error",
        content: errorMessage,
      });
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

  const getStatusIcon = () => {
    switch (statusMessage.type) {
      case "success": return <CheckCircle className="inline-block mr-2 h-5 w-5" />;
      case "error": return <AlertCircle className="inline-block mr-2 h-5 w-5" />;
      case "loading": return <Loader2 className="inline-block animate-spin mr-2 h-5 w-5" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen w-full font-sans bg-gradient-to-br from-[#020617] via-black to-[#020617] text-white flex items-center justify-center p-4 overflow-x-hidden">
      {/* Background Effects */}
      <div className="pointer-events-none fixed inset-0 opacity-30">
        <div className="absolute -top-24 -left-24 h-56 w-56 bg-emerald-500 blur-3xl rounded-full opacity-40 animate-pulse" />
        <div className="absolute -bottom-32 -right-16 h-64 w-64 bg-sky-500 blur-3xl rounded-full opacity-40" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10 max-w-md w-full py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-400/30 mb-4">
            <span className="text-xs md:text-sm font-medium">🚀 Start Your Career Journey</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold">
            Join JOB<span className="text-emerald-400">LELO</span>
          </h1>
          <p className="mt-2 text-gray-300">Create your account and get started</p>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="rounded-2xl border border-emerald-400/20 bg-white/5 backdrop-blur-xl p-6 space-y-5 shadow-2xl">
          {/* Email */}
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
              } focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 px-4 py-2.5 text-sm text-white placeholder-gray-500`}
              placeholder="you@example.com"
              disabled={isSubmitting}
            />
            {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
          </div>

          {/* Password */}
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
              } focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 px-4 py-2.5 text-sm text-white placeholder-gray-500`}
              placeholder="Minimum 8 characters"
              disabled={isSubmitting}
            />
            {errors.password && <p className="text-xs text-red-400 mt-1">{errors.password}</p>}
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
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
              } focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 px-4 py-2.5 text-sm text-white placeholder-gray-500`}
              placeholder="Re-enter your password"
              disabled={isSubmitting}
            />
            {errors.confirmPassword && (
              <p className="text-xs text-red-400 mt-1">{errors.confirmPassword}</p>
            )}
          </div>

          {/* Terms Checkbox */}
          <div className="flex items-start">
            <input
              id="terms"
              type="checkbox"
              checked={termsAccepted}
              onChange={handleInputChange}
              className={`mt-1 h-4 w-4 rounded border ${
                errors.terms ? "border-red-500" : "border-gray-700"
              } bg-gray-900 focus:ring-emerald-500`}
              disabled={isSubmitting}
            />
            <label htmlFor="terms" className="ml-3 text-sm text-gray-400">
              I agree to the <span className="text-emerald-400 hover:underline cursor-pointer">Terms and Conditions</span>
            </label>
          </div>
          {errors.terms && <p className="text-xs text-red-400 -mt-3">{errors.terms}</p>}

          {/* Status Message */}
          <div className={`rounded-xl p-3 text-sm border ${getStatusClasses()} flex items-start`}>
            {getStatusIcon()}
            <span>{statusMessage.content}</span>
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
                Creating Account...
              </>
            ) : (
              "Register Account"
            )}
          </button>

          {/* Login Link */}
          <p className="text-center text-sm text-gray-400">
            Already have an account?{" "}
            <Link to="/login" className="text-emerald-400 hover:underline font-semibold">
              Login here
            </Link>
          </p>
        </form>

        {/* Password Requirements */}
        <div className="mt-6 rounded-xl bg-gray-900/50 border border-gray-700 p-4">
          <p className="text-xs font-semibold text-gray-400 mb-2">Password Requirements:</p>
          <ul className="text-xs text-gray-500 space-y-1">
            <li className={password.length >= 8 ? "text-emerald-400" : ""}>✓ Minimum 8 characters</li>
            <li className={/[A-Z]/.test(password) ? "text-emerald-400" : ""}>✓ At least one uppercase letter</li>
            <li className={/[a-z]/.test(password) ? "text-emerald-400" : ""}>✓ At least one lowercase letter</li>
            <li className={/\d/.test(password) ? "text-emerald-400" : ""}>✓ At least one number</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UserReg;