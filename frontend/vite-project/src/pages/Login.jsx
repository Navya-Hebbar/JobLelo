import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

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
      const res = await axios.post("http://localhost:5000/api/auth/login", { email, password });
      const { token, user } = res.data;

      localStorage.setItem("joblelo_token", token);
      localStorage.setItem("joblelo_user_email", user.email);

      setStatusMessage({
        type: "success",
        content: `Welcome back, ${user.email}! Redirecting...`,
      });
      setPassword("");
      
      // Redirect to home page after successful login
      setTimeout(() => navigate("/"), 1500);
    } catch (error) {
      const errorMsg = error?.response?.data?.message || "Login failed.";
      setStatusMessage({ type: "error", content: errorMsg });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusClasses = () => {
    switch (statusMessage.type) {
      case "success": return "border-emerald-500 bg-emerald-900/20";
      case "error": return "border-red-500 bg-red-900/20";
      case "loading": return "border-sky-500 bg-sky-900/20";
      default: return "border-gray-700 bg-black/40";
    }
  };

  return (
    <div className="min-h-screen w-full font-sans bg-gradient-to-br from-[#020617] via-black to-[#020617] text-white flex items-center justify-center p-4">
      <div className="relative z-10 w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-extrabold">
            Welcome to JOB<span className="text-emerald-400">LELO</span>
          </h1>
          <p className="mt-2 text-gray-300">Enter your credentials to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-2xl border border-emerald-400/20 bg-white/5 backdrop-blur-xl p-6 space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              id="email"
              required
              value={email}
              onChange={handleInputChange}
              className={`w-full rounded-xl bg-black/50 border ${errors.email ? "border-red-500" : "border-gray-700"} focus:border-emerald-500 px-4 py-2.5 text-sm`}
              placeholder="you@example.com"
            />
            {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              id="password"
              required
              value={password}
              onChange={handleInputChange}
              className={`w-full rounded-xl bg-black/50 border ${errors.password ? "border-red-500" : "border-gray-700"} focus:border-emerald-500 px-4 py-2.5 text-sm`}
              placeholder="Enter your password"
            />
            {errors.password && <p className="text-xs text-red-400 mt-1">{errors.password}</p>}
          </div>

          <div className={`rounded-xl p-3 text-sm border ${getStatusClasses()}`}>
            {statusMessage.type === "loading" && (
              <span className="inline-block animate-spin mr-2">⏳</span>
            )}
            {statusMessage.content}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold disabled:opacity-50"
          >
            {isSubmitting ? "Logging in..." : "Login"}
          </button>

          <p className="text-center text-sm text-gray-400">
            Don't have an account?{" "}
            <button type="button" onClick={() => navigate("/register")} className="text-emerald-400 hover:underline">
              Register here
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;