"use client";

import { motion } from "framer-motion";
import { FiPieChart, FiTrendingUp } from "react-icons/fi";
import Navigation from "#/components/Navigation";

export default function BudgetPage() {
  const categories = [
    {
      name: "Housing",
      allocated: 2000,
      spent: 1800,
      color: "from-blue-500 to-purple-600",
    },
    {
      name: "Food",
      allocated: 600,
      spent: 450,
      color: "from-green-500 to-emerald-600",
    },
    {
      name: "Transportation",
      allocated: 400,
      spent: 380,
      color: "from-yellow-500 to-orange-600",
    },
    {
      name: "Entertainment",
      allocated: 300,
      spent: 250,
      color: "from-pink-500 to-rose-600",
    },
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
              {/* Overview Card */}
              <div className="bg-gray-900 rounded-2xl shadow-xl p-6">
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent mb-6">
                  Budget Overview
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {categories.map((category, index) => (
                    <motion.div
                      key={category.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-gray-800 rounded-xl p-4 border border-gray-700"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-white font-semibold">
                          {category.name}
                        </h3>
                        <span className="text-gray-400 text-sm">
                          ${category.spent}/${category.allocated}
                        </span>
                      </div>

                      <div className="relative h-2 bg-gray-700 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{
                            width: `${
                              (category.spent / category.allocated) * 100
                            }%`,
                          }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className={`absolute h-full bg-gradient-to-r ${category.color}`}
                        />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Monthly Breakdown */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-gray-900 rounded-2xl shadow-xl p-6">
                  <h2 className="text-xl font-semibold text-white mb-4">
                    Monthly Breakdown
                  </h2>
                  <div className="h-64 bg-gray-800 rounded-lg flex items-center justify-center">
                    <FiPieChart size={48} className="text-gray-600" />
                  </div>
                </div>

                <div className="bg-gray-900 rounded-2xl shadow-xl p-6">
                  <h2 className="text-xl font-semibold text-white mb-4">
                    Spending Trends
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
