"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FiHome, 
  FiDollarSign, 
  FiPieChart, 
  FiTrendingUp,
  FiSettings,
  FiUser,
  FiMenu,
  FiX,
  FiBarChart2
} from "react-icons/fi";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
      setIsOpen(window.innerWidth >= 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const menuItems = [
    { title: "Dashboard", icon: <FiHome size={20} />, path: "/dashboard" },
    { title: "Transactions", icon: <FiDollarSign size={20} />, path: "/transactions" },
    { title: "Budget", icon: <FiPieChart size={20} />, path: "/budget" },
    { title: "Investments", icon: <FiTrendingUp size={20} />, path: "/investments" },
    { title: "Analytics", icon: <FiBarChart2 size={20} />, path: "/analytics" }, 
    { title: "Profile", icon: <FiUser size={20} />, path: "/profile" },
    { title: "Settings", icon: <FiSettings size={20} />, path: "/settings" },
  ];

  const menuVariants = {
    open: {
      x: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 24,
        mass: 0.8
      }
    },
    closed: {
      x: "-100%",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        mass: 0.8
      }
    }
  };

  const menuItemVariants = {
    open: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 250,
        damping: 24,
        mass: 0.8
      }
    },
    closed: {
      x: -20,
      opacity: 0
    }
  };

  const overlayVariants = {
    open: {
      opacity: 1,
      transition: {
        duration: 0.3
      }
    },
    closed: {
      opacity: 0,
      transition: {
        duration: 0.2
      }
    }
  };

  return (
    <>
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 right-4 z-50 p-2 rounded-lg bg-gray-900 text-white"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
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
            variants={menuVariants}
            className="fixed left-0 top-0 h-screen bg-gray-900 text-white
              w-[280px] shadow-2xl border-r border-gray-800 z-40"
          >
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
              {menuItems.map((item, index) => (
                <motion.div
                  key={index}
                  variants={menuItemVariants}
                  custom={index}
                  initial="closed"
                  animate="open"
                  transition={{ delay: index * 0.1 }}
                >
                  <Link 
                    href={item.path}
                    onClick={() => isMobile && setIsOpen(false)}
                    className="flex items-center gap-4 px-4 py-3 hover:bg-gray-800 transition-all"
                  >
                    <div className="text-blue-500">{item.icon}</div>
                    <span className="text-gray-300">{item.title}</span>
                  </Link>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isMobile && isOpen && (
          <motion.div
            variants={overlayVariants}
            initial="closed"
            animate="open"
            exit="closed"
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/50 z-30 md:hidden"
          />
        )}
      </AnimatePresence>
    </>
  );
}
