"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiPlus } from "react-icons/fi";
import Navigation from "@/components/Navigation";
import { getSession } from "next-auth/react";
import addBudgetData from "../../../server/addBudgetData";
import { categories } from "@/utils/categories";
import getBudgetData from "../../../server/getBudgetData";
import { BudgetFetchData } from "@/types/BudgetData";
import { BudgetCard } from "@/components/BudgetCard";

export interface Budget {
  category_id: number;
  budget_amount: number;
  amount_spent: number;
  valid_until: Date;
}

// Main Budget Page Component
export default function BudgetPage() {
  const [budgets, setBudgets] = useState<BudgetFetchData[]>([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [email, setEmail] = useState("");

  // Add Budget Form State
  const [category, setCategory] = useState("");
  const [category_id, setCategory_id] = useState(0);
  const [amount, setAmount] = useState("");
  const [validUntil, setValidUntil] = useState("");
  useEffect(() => {
    const fetchBudget = async () => {
      const session = await getSession();
      if (!session?.user.email) {
        return;
      }
      setEmail(session.user.email);
      try {
        const response = await getBudgetData(session.user.email);
        if (response.success) {
          setBudgets(response.data as BudgetFetchData[]);
        } else {
          console.error("Failed to fetch budget data:");
        }
      } catch (error) {
        console.error("Error fetching budget data:", error);
      }
    };
    fetchBudget();
  }, []); // Add the empty dependency array to run this effect only once on mount

  const addBudget = async (newBudget: Budget) => {
    try {
      if (!newBudget || !email) {
        console.error("Invalid payload. Budget or email is missing.");
        alert("Failed to add budget. Please try again.");
        return;
      }

      const response = await addBudgetData({
        email: email,
        category_id: category_id,
        budget_amount: parseFloat(Number(amount).toFixed(2)),
        amount_spent: 0,
        valid_until: newBudget.valid_until,
      });

      if (response.success) {
        alert("Budget added successfully");
        setIsPopupOpen(false);
        setCategory("");
        setAmount("");
        setValidUntil("");
      } else {
        alert(response.message);
      }
    } catch (error) {
      console.error("Error while adding budget:", error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(validUntil);
    selectedDate.setHours(0, 0, 0, 0);

    if (parseFloat(amount) < 0) {
      alert("Amount cannot be negative");
      return;
    }

    if (selectedDate < today) {
      alert("Valid date cannot be in the past");
      return;
    }

    const newBudget: Budget = {
      category_id: category_id,
      budget_amount: parseFloat(amount),
      amount_spent: 0,
      valid_until: new Date(validUntil),
    };

    addBudget(newBudget);
  };

  // Budget Card Component
  

  return (
    <div className="flex">
      <Navigation />
      <div className="flex-1 md:ml-64 p-4">
        <div className="min-h-screen bg-black p-4 md:p-6 lg:p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-[1400px] mx-auto"
          >
            <div className="bg-gray-900 rounded-2xl shadow-xl p-4 md:p-6 lg:p-8 space-y-6 md:space-y-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                  Budget Overview
                </h1>
                <button
                  onClick={() => setIsPopupOpen(true)}
                  className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg px-4 py-2 font-semibold hover:opacity-90 transition flex items-center justify-center"
                >
                  <FiPlus className="mr-2" /> Add Budget
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {budgets.length > 0
                  ? budgets.map((budget, index) => (
                      <BudgetCard key={index} {...budget} />
                    ))
                  : ""}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Add Budget Popup */}
      <AnimatePresence>
        {isPopupOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
            onClick={() => setIsPopupOpen(false)} // Close on overlay click
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-800 p-6 rounded-xl border border-gray-700 max-w-md w-full mx-4"
              onClick={(e) => e.stopPropagation()} // Prevent closing on inside click
            >
              <h2 className="text-2xl font-bold text-white mb-4">
                Add New Budget
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="category"
                    className="block text-gray-400 mb-1"
                  >
                    Category
                  </label>
                  <select
                    id="category"
                    value={category}
                    onChange={(e) => {
                      setCategory(e.target.value);
                      const categoryData = categories.find(
                        (cat) => cat.name === e.target.value
                      );
                      if (categoryData) {
                        setCategory_id(categoryData.category_id);
                      }
                    }}
                    className="w-full p-2 bg-gray-700 text-white rounded-lg"
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map((cat) => (
                      <option key={cat.category_id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="amount" className="block text-gray-400 mb-1">
                    Amount
                  </label>
                  <input
                    type="number"
                    id="amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    min="0"
                    className="w-full p-2 bg-gray-700 text-white rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="validUntil"
                    className="block text-gray-400 mb-1"
                  >
                    Valid Until
                  </label>
                  <input
                    type="date"
                    id="validUntil"
                    value={validUntil}
                    onChange={(e) => setValidUntil(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full p-2 bg-gray-700 text-white rounded-lg"
                    required
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsPopupOpen(false)}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:opacity-90 transition"
                  >
                    Add Budget
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
