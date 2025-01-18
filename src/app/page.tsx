"use client"; // Marks this file to be used in a client-side rendered (CSR) environment

// Import necessary dependencies
import { motion } from "framer-motion"; // Animation library for React
import { useEffect, useState } from "react"; // React hooks for state and effect handling
import { getUserProfile } from "@/../server/getUserProfile"; // Function to fetch user profile data
import { getSession } from "next-auth/react"; // Next.js function to get the session data (auth state)
import LoadingSpinner from "@/components/LoadingBuffer"; // Custom loading spinner component
import { ToastContainer, toast } from "react-toastify"; // Toast notifications
import "react-toastify/dist/ReactToastify.css"; // Importing toast styles

// Animation variants for different motion elements
const fadeInUp = {
  initial: { opacity: 0, y: 60 }, // Initial state: invisible and slightly below
  animate: { opacity: 1, y: 0 },   // Animated state: fully visible and in original position
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.2, // Delays the animation for each child element
    },
  },
};

const floatingAnimation = {
  animate: {
    y: [0, -10, 0], // Vertical floating effect
    transition: {
      duration: 3,  // Duration of the animation loop
      repeat: Infinity,  // Loop indefinitely
      ease: "easeInOut", // Smooth easing for animation
    },
  },
};

export default function HeroPage() {
  const [user, setUser] = useState<{ username?: string } | null>(null); // State for user data
  const [loading, setLoading] = useState(true); // State to track loading status

  // Fetch user profile when component mounts
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const session = await getSession(); // Get the current session
        if (session && session.user) { // If a session exists
          const userProfile = await getUserProfile(session.user.email); // Fetch user profile based on email
          if (userProfile) {
            setUser({ username: userProfile.username }); // Set user data in state
            toast.success(`Welcome back, ${userProfile.username}!`); // Show success toast
          }
        }
        setLoading(false); // Set loading state to false after fetching
      } catch {
        // Handle any errors (if needed)
      }
    };

    fetchUser(); // Execute the fetchUser function
  }, []); // Empty dependency array to run the effect once on mount

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 overflow-hidden">
      {/* Toast container for showing toasts */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      
      {/* Display loading spinner if still loading */}
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <LoadingSpinner />
        </div>
      ) : (
        <motion.div
          variants={staggerContainer} // Applying stagger animation container
          initial="initial"
          animate="animate"
          className="text-center relative"
        >
          {/* Background gradient circles with animations */}
          <motion.div
            className="absolute -z-10 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
            animate={{
              scale: [1, 1.2, 1], // Scale animation
              rotate: [0, 180, 360], // Rotation animation
            }}
            transition={{
              duration: 8,
              repeat: Infinity, // Repeat indefinitely
              ease: "linear", // Smooth, linear transition
            }}
          />
          <motion.div
            className="absolute -z-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
            animate={{
              scale: [1.2, 1, 1.2], // Scale animation
              rotate: [360, 180, 0], // Rotation animation in reverse direction
            }}
            transition={{
              duration: 8,
              repeat: Infinity, // Repeat indefinitely
              ease: "linear", // Smooth, linear transition
            }}
          />
          
          {/* Main title with animation */}
          <motion.h1
            variants={fadeInUp}
            className="text-7xl font-bold mb-6 animate-gradient bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 bg-clip-text text-transparent hero-page animate-gradient"
            whileHover={{
              scale: 1.05, // Slightly scale up on hover
              transition: { duration: 0.2 }, // Short transition duration
            }}
          >
            Welcome to FinStack
          </motion.h1>
          
          {/* Subtitle with floating animation */}
          <motion.p
            variants={fadeInUp}
            className="text-gray-400 text-2xl mb-12"
            {...floatingAnimation} // Applying floating effect
          >
            Your Financial Journey Starts Here
          </motion.p>

          {/* Check if user is logged in */}
          {user ? (
            <motion.div
              variants={fadeInUp}
              className="flex flex-col items-center space-y-6"
            >
              {/* Display welcome message for logged-in user */}
              <motion.div
                className="text-white text-3xl"
                whileHover={{ scale: 1.05 }} // Slightly scale up on hover
              >
                Welcome back,{" "}
                <span className="text-blue-500 font-bold">{user.username}</span>!
              </motion.div>

              {/* Button to navigate to the dashboard */}
              <motion.a
                href="/dashboard"
                className="bg-gradient-to-r from-cyan-500 to-teal-600 text-white px-10 py-4 rounded-lg font-semibold inline-block shadow-md hover:shadow-lg hover:shadow-cyan-500/50"
                whileHover={{ scale: 1.1 }} // Slightly scale up on hover
                whileTap={{ scale: 0.95 }} // Slightly scale down on tap
              >
                Go to Dashboard
              </motion.a>
            </motion.div>
          ) : (
            <motion.div variants={fadeInUp} className="space-x-6">
              {/* Login and Sign Up buttons for non-logged-in users */}
              <motion.a
                href="/login"
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-10 py-4 rounded-lg font-semibold inline-block"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => toast.info("Redirecting to Login")}
              >
                Login
              </motion.a>
              <motion.a
                href="/signup"
                className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-10 py-4 rounded-lg font-semibold inline-block"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => toast.info("Redirecting to Sign Up")}
              >
                Sign Up
              </motion.a>
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  );
}
