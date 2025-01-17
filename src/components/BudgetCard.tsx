"use client";

import { BudgetFetchData } from "@/types/BudgetData";
import { categories } from "@/utils/categories";
import { motion } from "framer-motion";
import deleteBudget from "../../server/deleteBudget";

const BudgetCard = (budget: BudgetFetchData) => {
  const percentUsed = (budget.amount_spent / budget.budget_amount) * 100;
  return (
    <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10">
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div className="flex-1">
          <motion.h2
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-xl font-semibold text-white mb-4"
          >
            {categories.find((cat) => cat.category_id === budget.category_id)
              ?.name || "Unknown Category"}
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex justify-between items-center mb-4"
          >
            <span className="text-gray-400">Spent / Budget</span>
            <span className="text-white font-semibold">
              ${budget.amount_spent.toFixed(2)} / ${" "}
              {budget.budget_amount.toFixed(2)}
            </span>
          </motion.div>

          {/* Progress Bar */}
          <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ delay: 0.4, duration: 0.7, ease: "easeOut" }}
            className="relative h-3 bg-gray-700 rounded-full overflow-hidden"
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${percentUsed}%` }}
              transition={{ delay: 0.5, duration: 1, ease: "easeOut" }}
              className={`absolute top-0 left-0 h-full ${
                percentUsed > 90
                  ? "bg-red-500"
                  : percentUsed > 70
                  ? "bg-yellow-500"
                  : "bg-blue-500"
              }`}
            />
          </motion.div>

          {/* Valid Until Date */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="flex justify-between items-center mt-4"
          >
            <span className="text-gray-400">Valid until</span>
            <span className="text-white">
              {budget.valid_until.toLocaleDateString()}
            </span>
          </motion.div>
        </div>
        {/* Delete Button */}
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          onClick={() => {
            deleteBudget(budget.email, Number(budget.category_id));
            window.location.reload();
          }}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-500 transition-colors duration-300"
        >
          Delete
        </motion.button>
      </div>
    </div>
  );
};

export { BudgetCard };
