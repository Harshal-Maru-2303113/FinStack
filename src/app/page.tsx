"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { getUserProfile } from "@/../server/getUserProfile";


const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const floatingAnimation = {
  animate: {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

export default function HeroPage() {
  const [user] = useState<{ username?: string } | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = getUserProfile();
        console.dir(response);
      }
      catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };
    fetchUser();
  }, []);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 overflow-hidden">
      <motion.div
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="text-center relative"
      >
        {/* Background gradient circles */}
        <motion.div
          className="absolute -z-10 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <motion.div
          className="absolute -z-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear",
          }}
        />
        <motion.h1
          variants={fadeInUp}
          className="text-7xl font-bold mb-6 animate-gradient bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 bg-clip-text text-transparent hero-page animate-gradient"
          whileHover={{
            scale: 1.05,
            transition: { duration: 0.2 },
          }}
        >
          Welcome to ClarityFi
        </motion.h1>
        <motion.p
          variants={fadeInUp}
          className="text-gray-400 text-2xl mb-12"
          {...floatingAnimation}
        >
          Your Financial Journey Starts Here
        </motion.p>
        {user ? (
          <motion.div
            variants={fadeInUp}
            className="flex flex-col items-center space-y-6"
          >
            <motion.div className="text-white text-3xl" whileHover={{ scale: 1.05 }}>
              Welcome back,{" "}
              <span className="text-blue-500 font-bold">{user.username}</span>!
            </motion.div>
            <motion.a
              href="/dashboard"
              className="bg-gradient-to-r from-cyan-500 to-teal-600 text-white px-10 py-4 rounded-lg font-semibold inline-block shadow-md hover:shadow-lg hover:shadow-cyan-500/50"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              Go to Dashboard
            </motion.a>
          </motion.div>
        ) : (
          <motion.div variants={fadeInUp} className="space-x-6">
            <motion.a
              href="/login"
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-10 py-4 rounded-lg font-semibold inline-block"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              Login
            </motion.a>
            <motion.a
              href="/signup"
              className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-10 py-4 rounded-lg font-semibold inline-block"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              Sign Up
            </motion.a>
          </motion.div>
        )}
      </motion.div>
    </div>
  );

}