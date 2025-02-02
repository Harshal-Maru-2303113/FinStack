"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useIsCurrentPage } from "@/hooks/useIsCurrentPage"; // Hook to check the current page
import {
  FiHome,
  FiDollarSign,
  FiPieChart,
  FiUser,
  FiMenu,
  FiX,
  FiBarChart2,
} from "react-icons/fi"; // Icons used for the navigation items

export default function Navigation() {
  // State for controlling whether the sidebar is open or closed
  const [isOpen, setIsOpen] = useState(true);

  // State to detect if the user is on a mobile device (screen width < 768px)
  const [isMobile, setIsMobile] = useState(false);

  // Effect hook to handle screen resizing and update the state for mobile screens
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
      setIsOpen(window.innerWidth >= 768); // Sidebar is open for screens wider than 768px
    };

    checkScreenSize(); // Check initial screen size
    window.addEventListener("resize", checkScreenSize); // Update on screen resize
    return () => window.removeEventListener("resize", checkScreenSize); // Clean up on unmount
  }, []);

  // Array of menu items with title, icon, and path for navigation
  const menuItems = [
    { title: "Dashboard", icon: <FiHome size={20} />, path: "/dashboard" },
    {
      title: "Transactions",
      icon: <FiDollarSign size={20} />,
      path: "/transactions",
    },
    { title: "Budget", icon: <FiPieChart size={20} />, path: "/budget" },
    { title: "Analytics", icon: <FiBarChart2 size={20} />, path: "/analytics" },
    { title: "Profile", icon: <FiUser size={20} />, path: "/profile" },
  ];

  // Animation variants for menu transition (open/closed)
  const menuVariants = {
    open: {
      x: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 24,
        mass: 0.8,
      },
    },
    closed: {
      x: "-100%", // Menu slides off screen when closed
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        mass: 0.8,
      },
    },
  };

  // Animation variants for each menu item transition
  const menuItemVariants = {
    open: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 250,
        damping: 24,
        mass: 0.8,
      },
    },
    closed: {
      x: -20,
      opacity: 0, // Menu items fade and slide when closed
    },
  };

  // Overlay animation when the mobile menu is open
  const overlayVariants = {
    open: {
      opacity: 1,
      transition: {
        duration: 0.3,
      },
    },
    closed: {
      opacity: 0,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <>
      {/* Button to toggle sidebar on mobile */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)} // Toggle sidebar visibility
        className="md:hidden fixed top-4 right-4 z-50 p-2 rounded-lg bg-gray-900 text-white"
        whileHover={{ scale: 1.05 }} // Add hover effect
        whileTap={{ scale: 0.95 }} // Add tap effect
      >
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }} // Rotate button when sidebar is open/closed
          transition={{ duration: 0.3 }}
        >
          {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants} // Apply open/close animation
            className="fixed left-0 top-0 h-screen bg-gray-900 text-white
              w-[280px] shadow-2xl border-r border-gray-800 z-40"
          >
            {/* Sidebar header */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-4"
            >
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                FinStack
              </h1>
            </motion.div>

            <nav className="mt-8">
              {/* Iterate over the menu items */}
              {menuItems.map((item, index) => {
                // Check if the current item path is the active page
                // eslint-disable-next-line react-hooks/rules-of-hooks
                const isCurrentPage = useIsCurrentPage(item.path);
                return (
                  <motion.div
                    key={index}
                    variants={menuItemVariants} // Apply menu item animation
                    custom={index}
                    initial="closed"
                    animate="open"
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      href={item.path}
                      onClick={() => isMobile && setIsOpen(false)} // Close the menu on mobile when a link is clicked
                      className={`flex items-center gap-4 px-4 py-3 hover:bg-gray-800 transition-all relative overflow-hidden ${
                        isCurrentPage ? "text-blue-500" : "text-gray-300"
                      }`}
                    >
                      {/* Icon and Title for the menu item */}
                      <div
                        className={
                          isCurrentPage ? "text-blue-500" : "text-gray-500"
                        }
                      >
                        {item.icon}
                      </div>
                      <span>{item.title}</span>
                      {/* Highlight the active menu item */}
                      {isCurrentPage && (
                        <motion.div
                          layoutId="activeNavItem"
                          className="absolute inset-0 bg-gray-800 z-[-1]"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{
                            type: "spring",
                            stiffness: 380,
                            damping: 30,
                          }}
                        />
                      )}
                    </Link>
                  </motion.div>
                );
              })}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay to dim the background on mobile when the menu is open */}
      <AnimatePresence>
        {isMobile && isOpen && (
          <motion.div
            variants={overlayVariants}
            initial="closed"
            animate="open"
            exit="closed"
            onClick={() => setIsOpen(false)} // Close the menu when the overlay is clicked
            className="fixed inset-0 bg-black/50 z-30 md:hidden"
          />
        )}
      </AnimatePresence>
    </>
  );
}
