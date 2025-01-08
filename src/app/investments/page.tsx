"use client";

import { motion } from "framer-motion";
import {
  FiTrendingUp,
  FiTrendingDown,
  FiPieChart,
} from "react-icons/fi";
import Navigation from "#/components/Navigation";

export default function InvestmentsPage() {
  const investments = [
    { name: "Tech Stocks", value: 15000, change: 5.2, trend: "up" },
    { name: "Crypto", value: 8000, change: -2.1, trend: "down" },
    { name: "Real Estate", value: 50000, change: 1.8, trend: "up" },
    { name: "Bonds", value: 20000, change: 0.5, trend: "up" },
  ];

  return (
    <div className="flex">
      <Navigation />
      <div className="flex-1 md:ml-64 p-4">
        <div className="p-4 md:p-6 lg:p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-[1400px] mx-auto"
          >
            <div className="grid gap-6">
              <div className="bg-gray-900 rounded-2xl shadow-xl p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                    Investment Portfolio
                  </h1>
                  <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:opacity-90 transition">
                    + Add Investment
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {investments.map((investment, index) => (
                    <motion.div
                      key={investment.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-gray-800 rounded-xl p-4 border border-gray-700"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-white font-semibold">
                          {investment.name}
                        </h3>
                        {investment.trend === "up" ? (
                          <FiTrendingUp className="text-green-500" />
                        ) : (
                          <FiTrendingDown className="text-red-500" />
                        )}
                      </div>
                      <p className="text-2xl font-bold text-white mb-2">
                        ${investment.value.toLocaleString()}
                      </p>
                      <p
                        className={`text-sm ${
                          investment.trend === "up"
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {investment.trend === "up" ? "+" : ""}
                        {investment.change}%
                      </p>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-900 rounded-2xl shadow-xl p-6">
                  <h2 className="text-xl font-semibold text-white mb-4">
                    Portfolio Distribution
                  </h2>
                  <div className="h-64 bg-gray-800 rounded-lg flex items-center justify-center">
                    <FiPieChart size={48} className="text-gray-600" />
                  </div>
                </div>

                <div className="bg-gray-900 rounded-2xl shadow-xl p-6">
                  <h2 className="text-xl font-semibold text-white mb-4">
                    Performance History
                  </h2>
                  <div className="h-64 bg-gray-800 rounded-lg flex items-center justify-center">
                    <FiTrendingUp size={48} className="text-gray-600" />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
