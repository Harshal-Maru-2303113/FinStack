"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff } from "react-icons/fi";
import signup from "@/pages/api/auth/signup";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function SignupPage() {
  // Router hook for navigation
  const router = useRouter();

  // State variables to hold form data and password visibility toggles
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Handle form input change, ensuring no spaces in values and sanitizing the username
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let cleanedValue = value.replace(/\s/g, "");

    // Remove special characters for username to allow only alphanumeric characters
    if (name === "username") {
      cleanedValue = cleanedValue.replace(/[^a-zA-Z0-9]/g, "");
    }

    // Update formData state with the cleaned value for the corresponding input field
    setFormData((prev) => ({
      ...prev,
      [name]: cleanedValue,
    }));
  };

  // Function to handle the signup API request
  const handleSignup = async (credentials: {
    username: string;
    email: string;
    password: string;
  }) => {
    try {
      toast.info("Signing up..."); // Show loading toast
      const response = await signup(credentials); // Call signup API
      if (response.success) {
        toast.success("Signup successful! Please verify your email."); // Show success toast
        router.push(`/verification?email=${encodeURIComponent(credentials.email)}`); // Redirect to verification page
      } else {
        toast.error(response.message || "Signup failed. Please try again."); // Show error if signup fails
      }
    } catch {
      toast.error("Failed to register user. Please try again later."); // Show error toast if API call fails
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission

    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!"); // Show error toast if passwords don't match
      return;
    }

    // Prepare credentials to send to the signup function
    const credentials = {
      username: formData.username,
      email: formData.email,
      password: formData.password,
    };

    // Call the handleSignup function with the prepared credentials
    handleSignup(credentials);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <ToastContainer /> {/* Toast container to display toast messages */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <form
          onSubmit={handleSubmit} // Handle form submission
          className="bg-gray-900 rounded-2xl shadow-xl p-8 space-y-8"
        >
          <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
            Create Account
          </h1>

          <div className="space-y-6">
            {/* Username field */}
            <div className="relative">
              <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange} // Update username on input change
                placeholder="Username"
                className="w-full bg-gray-800 text-white rounded-lg pl-10 pr-4 py-3 border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                required
              />
            </div>

            {/* Email field */}
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange} // Update email on input change
                placeholder="Email"
                className="w-full bg-gray-800 text-white rounded-lg pl-10 pr-4 py-3 border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                required
              />
            </div>

            {/* Password field */}
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"} // Toggle password visibility
                name="password"
                value={formData.password}
                onChange={handleChange} // Update password on input change
                placeholder="Password"
                className="w-full bg-gray-800 text-white rounded-lg pl-10 pr-12 py-3 border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)} // Toggle password visibility
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
              >
                {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </button>
            </div>

            {/* Confirm Password field */}
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type={showConfirmPassword ? "text" : "password"} // Toggle confirm password visibility
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange} // Update confirm password on input change
                placeholder="Confirm Password"
                className="w-full bg-gray-800 text-white rounded-lg pl-10 pr-12 py-3 border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)} // Toggle confirm password visibility
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
              >
                {showConfirmPassword ? (
                  <FiEyeOff size={20} />
                ) : (
                  <FiEye size={20} />
                )}
              </button>
            </div>
          </div>

          {/* Submit button for sign-up */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg py-3 font-semibold hover:opacity-90 transition transform hover:scale-[1.01]"
          >
            Sign Up
          </button>

          {/* Link to login page if the user already has an account */}
          <p className="text-center text-gray-400">
            Already have an account?{" "}
            <a href="/login" className="text-blue-500 hover:underline">
              Login
            </a>
          </p>
        </form>
      </motion.div>
    </div>
  );
}
