"use client";

import { motion } from "framer-motion";
import {
  FiUser,
  FiBell,
  FiLock,
  FiCreditCard,
  FiToggleLeft,
  FiToggleRight,
} from "react-icons/fi";
import { useState } from "react";
import Navigation from "#/components/Navigation";

export default function SettingsPage() {
  const [notifications, setNotifications] = useState(true);

  return (
    <div className="flex">
      <Navigation />
      <div className="flex-1 md:ml-64 p-4">
        <div className="p-4 md:p-6 lg:p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-[1000px] mx-auto"
          >
            <div className="bg-gray-900 rounded-2xl shadow-xl p-6">
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent mb-8">
                Settings
              </h1>

              <div className="space-y-8">
                {/* Profile Settings */}
                <motion.section
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="border-b border-gray-800 pb-8"
                >
                  <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                    <FiUser /> Profile Settings
                  </h2>
                  <div className="grid gap-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="First Name"
                        className="bg-gray-800 text-white rounded-lg px-4 py-3 border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                      />
                      <input
                        type="text"
                        placeholder="Last Name"
                        className="bg-gray-800 text-white rounded-lg px-4 py-3 border border-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition"
                      />
                    </div>
                    <input
                      type="email"
                      placeholder="Email"
                      className="bg-gray-800 text-white rounded-lg px-4 py-3 border border-gray-700 focus:border-blue-500 focus:ring-                  focus:ring-blue-500 outline-none transition"
                    />
                  </div>
                </motion.section>

                {/* Notification Settings */}
                <motion.section
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                  className="border-b border-gray-800 pb-8"
                >
                  <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                    <FiBell /> Notification Settings
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Push Notifications</span>
                      <button
                        onClick={() => setNotifications(!notifications)}
                        className={`p-2 rounded-full transition-colors ${
                          notifications ? "bg-blue-500" : "bg-gray-700"
                        }`}
                      >
                        {notifications ? (
                          <FiToggleRight size={24} />
                        ) : (
                          <FiToggleLeft size={24} />
                        )}
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Email Notifications</span>
                      <button
                        onClick={() => setNotifications(!notifications)}
                        className={`p-2 rounded-full transition-colors ${
                          notifications ? "bg-blue-500" : "bg-gray-700"
                        }`}
                      >
                        {notifications ? (
                          <FiToggleRight size={24} />
                        ) : (
                          <FiToggleLeft size={24} />
                        )}
                      </button>
                    </div>
                  </div>
                </motion.section>

                {/* Security Settings */}
                <motion.section
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="border-b border-gray-800 pb-8"
                >
                  <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                    <FiLock /> Security
                  </h2>
                  <div className="space-y-4">
                    <button className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 border border-gray-700 hover:border-blue-500 transition text-left">
                      Change Password
                    </button>
                    <button className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 border border-gray-700 hover:border-blue-500 transition text-left">
                      Two-Factor Authentication
                    </button>
                  </div>
                </motion.section>

                {/* Payment Methods */}
                <motion.section
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                    <FiCreditCard /> Payment Methods
                  </h2>
                  <button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg px-4 py-3 hover:opacity-90 transition">
                    + Add Payment Method
                  </button>
                </motion.section>

                {/* Save Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="flex justify-end"
                >
                  <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-lg hover:opacity-90 transition">
                    Save Changes
                  </button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
