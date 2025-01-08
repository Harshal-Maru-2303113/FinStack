"use client";

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
import verifyEmail from "@/pages/api/auth/verifyEmail";
import resendOTP from "@/pages/api/auth/resendOTP";

function VerificationPageContent() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [email, setEmail] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  useEffect(() => {
    if (searchParams) {
      const emailParam = searchParams.get("email");
      if (emailParam) {
        setEmail(decodeURIComponent(emailParam));
      }
    }
  }, [searchParams]);

  const handleChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input if value is entered
    if (value !== "" && index < 5) {
      inputRefs[index + 1]?.current?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    // Move to previous input on backspace if current input is empty
    if (e.key === "Backspace" && index > 0 && otp[index] === "") {
      inputRefs[index - 1]?.current?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    const digits = pastedData.split("").filter((char) => !isNaN(Number(char)));

    const newOtp = [...otp];
    digits.forEach((digit, index) => {
      if (index < 6) newOtp[index] = digit;
    });
    setOtp(newOtp);

    // Focus the next empty input or the last input
    const nextEmptyIndex = newOtp.findIndex((val) => val === "");
    if (nextEmptyIndex !== -1) {
      inputRefs[nextEmptyIndex]?.current?.focus();
    } else {
      inputRefs[5]?.current?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpString = otp.join("");
    console.log("Submitting verification:", {
      email,
      otpString,
      otpLength: otpString.length,
      individualDigits: otp,
    });

    try {
      const response = await verifyEmail(email, otpString);

      if (response.success) {
        router.push("/login");
      }
    } catch (error: unknown) {
      console.error("Verification error:", error);
      setOtp(["", "", "", "", "", ""]);
      inputRefs[0]?.current?.focus();
    }
  };

  const handleResendOTP = async () => {
    try {
      const response = await resendOTP(email);
      console.dir(response);
      alert("Otp resent successfully");
    } catch (error: unknown) {
      console.error("Error resending OTP:", error);
      // Add error notification
      alert("Failed to resend OTP. Please try again.");
    }
  };

  // Add visual feedback for verification status
  const [verificationStatus] = useState<string>("");

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <form
          onSubmit={handleSubmit}
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
                ref={inputRefs[index]}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
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
              onClick={handleResendOTP}
              className="text-blue-500 hover:underline"
            >
              Resend
            </button>
          </div>

          {verificationStatus && (
            <div className="text-center text-red-500 mt-2">
              {verificationStatus}
            </div>
          )}
        </form>
      </motion.div>
    </div>
  );
}

export default function VerificationPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerificationPageContent />
    </Suspense>
  );
}
