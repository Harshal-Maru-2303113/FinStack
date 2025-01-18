"use client";

// Import necessary hooks, components, and utilities
import {
  useState,
  useRef,
  KeyboardEvent,
  ClipboardEvent,
  useEffect,
  Suspense,
} from "react";
import { motion } from "framer-motion";
import { FiMail } from "react-icons/fi";
import { useRouter, useSearchParams } from "next/navigation";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import verifyEmail from "@/pages/api/auth/verifyEmail"; // API call for email verification
import resendOTP from "@/pages/api/auth/resendOTP"; // API call for resending OTP

// VerificationPageContent component where OTP input and verification logic are handled
function VerificationPageContent() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]); // State to store OTP digits
  const [email, setEmail] = useState(""); // State to store the user's email
  const router = useRouter(); // Router for navigation
  const searchParams = useSearchParams(); // Get search params from the URL
  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ]; // References for each OTP input field

  // Effect hook to extract the email from the URL search parameters
  useEffect(() => {
    if (searchParams) {
      const emailParam = searchParams.get("email"); // Get the email param from the URL
      if (emailParam) {
        setEmail(decodeURIComponent(emailParam)); // Set the email state
      }
    }
  }, [searchParams]);

  // Handle change in OTP inputs
  const handleChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return; // Only accept numeric input

    const newOtp = [...otp]; // Create a copy of the OTP array
    newOtp[index] = value; // Update the corresponding digit in OTP
    setOtp(newOtp); // Update the OTP state

    // Move to next input field if value is entered and it's not the last input
    if (value !== "" && index < 5) {
      inputRefs[index + 1]?.current?.focus(); // Focus next input field
    }
  };

  // Handle keydown event for backspace to move focus to previous input
  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && index > 0 && otp[index] === "") {
      inputRefs[index - 1]?.current?.focus(); // Move focus to the previous input
    }
  };

  // Handle paste event to allow OTP to be pasted into the fields
  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault(); // Prevent the default paste action
    const pastedData = e.clipboardData.getData("text").slice(0, 6); // Get first 6 characters of pasted data
    const digits = pastedData.split("").filter((char) => !isNaN(Number(char))); // Filter out non-numeric characters

    const newOtp = [...otp]; // Create a copy of the OTP array
    digits.forEach((digit, index) => {
      if (index < 6) newOtp[index] = digit; // Fill the OTP with the pasted digits
    });
    setOtp(newOtp); // Update the OTP state

    // Focus the next empty input or the last input field
    const nextEmptyIndex = newOtp.findIndex((val) => val === "");
    if (nextEmptyIndex !== -1) {
      inputRefs[nextEmptyIndex]?.current?.focus(); // Focus the next empty input field
    } else {
      inputRefs[5]?.current?.focus(); // Focus the last input field if no empty fields
    }
  };

  // Handle form submission (OTP verification)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent form default submission behavior
    const otpString = otp.join(""); // Combine OTP array into a single string

    try {
      toast.info("Verifying OTP..."); // Show a loading toast
      const response = await verifyEmail(email, otpString); // Call verifyEmail API
      if (response.success) {
        toast.success("Verification successful!"); // Show success toast
        router.push("/login"); // Redirect to login page
      }
    } catch {
      toast.error("Verification failed. Please try again."); // Show error toast
      setOtp(["", "", "", "", "", ""]); // Reset OTP inputs
      inputRefs[0]?.current?.focus(); // Focus the first input field
    }
  };

  // Handle OTP resend
  const handleResendOTP = async () => {
    try {
      toast.info("Resending OTP..."); // Show a loading toast
      const response = await resendOTP(email); // Call resendOTP API
      if (response.success) {
        toast.success("OTP resent successfully!"); // Show success toast
      }
    } catch {
      toast.error("Failed to resend OTP. Please try again."); // Show error toast
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <ToastContainer /> {/* Display toast notifications */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} // Initial animation state
        animate={{ opacity: 1, y: 0 }} // Final animation state
        className="w-full max-w-md"
      >
        <form
          onSubmit={handleSubmit} // Handle form submission
          className="bg-gray-900 rounded-2xl shadow-xl p-8 space-y-8"
        >
          <div className="flex justify-center mb-8">
            <div className="rounded-full bg-blue-500/10 p-3">
              <FiMail className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="space-y-4 text-center">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              Email Verification
            </h1>
            <p className="text-gray-400">
              We&apos;ve sent a verification code to your email
            </p>
          </div>

          <div className="flex justify-center gap-3">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={inputRefs[index]} // Set the reference for each input field
                type="text"
                maxLength={1}
                value={digit} // Set input value from OTP state
                onChange={(e) => handleChange(index, e.target.value)} // Handle value change
                onKeyDown={(e) => handleKeyDown(index, e)} // Handle backspace key
                onPaste={handlePaste} // Handle paste event
                className="w-12 h-12 text-center text-xl font-semibold bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                required
              />
            ))}
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg py-3 font-semibold hover:opacity-90 transition transform hover:scale-[1.01]"
          >
            Verify Email
          </button>

          <div className="text-center text-gray-400">
            Didn&apos;t receive the code?{" "}
            <button
              type="button"
              onClick={handleResendOTP} // Handle resend OTP
              className="text-blue-500 hover:underline"
            >
              Resend
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

// Main VerificationPage component wrapped in Suspense for fallback handling
export default function VerificationPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}> {/* Show loading text while the content is loading */}
      <VerificationPageContent /> {/* Render the main content */}
    </Suspense>
  );
}
