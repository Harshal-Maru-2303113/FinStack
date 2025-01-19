"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi"; // Importing icons for input fields
import { signIn } from "next-auth/react"; // For handling login using credentials
import { useRouter } from "next/navigation"; // To navigate after login
import resetPassword from "../../../server/resetPassword"; // Function for resetting the password
import { ToastContainer, toast } from "react-toastify"; // For toast notifications
import "react-toastify/dist/ReactToastify.css"; // Importing CSS for toast notifications

// Main LoginPage component
export default function LoginPage() {
  // State management for form inputs
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  // State management for toggling password visibility
  const [showPassword, setShowPassword] = useState(false);

  // State management for showing the password reset modal
  const [showModal, setShowModal] = useState(false);

  // Using Next.js router to navigate between pages
  const router = useRouter();

  // Handles changes in form fields, removes any spaces from the input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const cleanedValue = value.replace(/\s/g, ""); // Removes spaces from input
    setFormData((prev) => ({
      ...prev,
      [name]: cleanedValue, // Update the respective field value
    }));
  };

  // Toggles the visibility of the password field (text or password)
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword); // Switches the state
  };

  // Handles login submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevents the default form submission
    try {
      const response = await signIn("credentials", { // Makes API request for login
        redirect: false,
        email: formData.email,
        password: formData.password,
      });

      if (response?.error) {
        toast.error(response.error); // Shows error message if login fails
      } else {
        toast.success("Login successful!"); // Success message
        router.push("/dashboard"); // Redirect to dashboard on success
      }
    } catch (error) {
      console.error("An error occurred", error);
      toast.error("An error occurred during login. Please try again."); // Error handling
    }
  };

  // Handles the password reset form submission
  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match."); // Shows error if passwords do not match
      return;
    }
    try {
      const data = {
        email: formData.email,
        password: formData.password,
      };
      toast.info("Resetting password..."); // Inform user about the reset process
      const response = await resetPassword(data); // Calls resetPassword function

      if (response.success) {
        toast.success("Password reset successfully. Please verify your email."); // Success toast
        router.push(`/verification?email=${encodeURIComponent(data.email)}`); // Redirect to verification page
      } else {
        toast.error("Failed to reset password."); // Error handling
      }
    } catch (error) {
      console.error("An error occurred", error);
      toast.error("An error occurred while resetting the password."); // Error handling
    }
    setShowModal(false); // Close the reset password modal
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <ToastContainer autoClose={2000} /> {/* Toast notifications container */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <form
          onSubmit={handleSubmit}
          className="bg-gray-900 rounded-2xl shadow-xl p-8 space-y-8"
        >
          <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
            Welcome Back
          </h1>

          <div className="space-y-6">
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full bg-gray-800 text-white rounded-lg pl-10 pr-4 py-3 border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                required
              />
            </div>

            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className="w-full bg-gray-800 text-white rounded-lg pl-10 pr-12 py-3 border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                required
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
              >
                {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg py-3 font-semibold hover:opacity-90 transition transform hover:scale-[1.01]"
          >
            Login
          </button>

          <p className="text-center text-gray-400">
            Don&apos;t have an account?{" "}
            <a href="/signup" className="text-blue-500 hover:underline">
              Sign up
            </a>
          </p>

          <p className="text-center text-gray-400">
            <button
              type="button"
              onClick={() => {
                setShowModal(true); // Shows reset password modal
              }}
              className="text-blue-500 hover:underline"
            >
              Forgot Password?
            </button>
          </p>
        </form>
      </motion.div>

      {showModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
        >
          <motion.div
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            exit={{ y: 20 }}
            transition={{ duration: 0.3 }}
            className="bg-gray-900 rounded-2xl p-8 w-full max-w-md"
          >
            <h2 className="text-2xl font-bold text-center text-white">
              Reset Password
            </h2>
            <form onSubmit={handleForgotPasswordSubmit} className="space-y-6">
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  className="w-full bg-gray-800 text-white rounded-lg pl-10 pr-4 py-3 border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                  required
                />
              </div>

              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="New Password"
                  className="w-full bg-gray-800 text-white rounded-lg pl-10 pr-4 py-3 border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                  required
                />
              </div>

              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm Password"
                  className="w-full bg-gray-800 text-white rounded-lg pl-10 pr-4 py-3 border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg py-3 font-semibold hover:opacity-90 transition transform hover:scale-[1.01]"
              >
                Reset Password
              </button>
            </form>
            <button
              type="button"
              onClick={() => setShowModal(false)} // Closes the modal
              className="mt-4 text-center text-gray-400 hover:underline block mx-auto"
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
