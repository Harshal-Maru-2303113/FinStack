"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { categories } from "@/utils/categories"; // Import categories for selection
import addTransaction from "@/../server/addTransaction"; // Function to add transaction
import { getSession } from "next-auth/react"; // Get session data for logged-in user
import addBudgetAmount from "../../../server/addBudgetAmount"; // Function to update budget

export default function TransactionPage() {
  const router = useRouter(); // Use router to navigate after successful form submission
  type transactionType = "credit" | "debit"; // Define transaction types

  // Transaction data interface
  interface TransactionData {
    amount: number;
    transaction_type: transactionType;
    description: string;
    category_id: number;
  }

  // State hooks for form inputs
  const [amount, setAmount] = useState("");
  const [transaction_type, setTransactionType] =
    useState<transactionType>("credit");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");

  // Function to send transaction data to the server
  const sentTransactionData = async () => {
    try {
      toast.info("Transaction is being sent..."); // Notify user of pending transaction
      const data: TransactionData = {
        amount: Number(amount), // Convert amount to number
        transaction_type,
        description,
        category_id: Number(categoryId), // Convert categoryId to number
      };

      const session = await getSession(); // Get current session to check if user is logged in
      if (!session) {
        toast.error("Please log in to add a transaction."); // Notify if user is not logged in
        return;
      }

      // Call addTransaction function to store transaction data
      const response = await addTransaction(data, session.user.email);

      if (response.success) {
        // If transaction is added successfully, update budget
        toast.success("Transaction added successfully!"); // Notify on success
        const category: string = String(
          categories.find((cat) => cat.category_id === Number(categoryId))?.name
        );
        await addBudgetAmount(
          Number(data.amount),
          data.transaction_type,
          Number(data.category_id),
          response.date_time || new Date(),
          session.user.email,
          category
        );

        router.push("/dashboard"); // Navigate to dashboard
      } else {
        toast.error(response.message); // Display error if transaction fails
        resetForm(); // Reset form values
        return;
      }
    } catch (error) {
      console.error("Error adding transaction:", error); // Log any errors
      toast.error("Error adding transaction"); // Notify user of error
      resetForm(); // Reset form values
      return;
    }
  };

  // Function to reset form fields
  const resetForm = () => {
    setAmount("");
    setTransactionType("credit");
    setDescription("");
    setCategoryId("");
  };

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission
    sentTransactionData(); // Call function to send data
  };

  return (
    <div className="min-h-screen bg-black p-4 md:p-6 lg:p-8 flex items-center justify-center">
      <ToastContainer autoClose={2000} />
      {/* Toast notifications */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[600px] mx-auto"
      >
        <div className="relative p-1 lg:p-1 rounded-2xl bg-gray-900 shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl -m-[2px] animate-gradient-border bg-[length:200%_200%]"></div>
          <div className="relative bg-gray-900 rounded-2xl border-2 border-transparent p-6 lg:p-8">
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent mb-6">
              Add New Transaction
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Input field for amount */}
              <div>
                <label className="block text-gray-300 mb-2">Amount</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={amount}
                  min={0.01}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
                  placeholder="Enter amount"
                />
              </div>

              {/* Dropdown for transaction type */}
              <div>
                <label className="block text-gray-300 mb-2">
                  Transaction Type
                </label>
                <select
                  value={transaction_type}
                  onChange={(e) =>
                    setTransactionType(e.target.value as transactionType)
                  }
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
                >
                  <option value="credit">Credit</option>
                  <option value="debit">Debit</option>
                </select>
              </div>

              {/* Input field for description */}
              <div>
                <label className="block text-gray-300 mb-2">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
                  placeholder="Enter description"
                  rows={3}
                />
              </div>

              {/* Dropdown for category */}
              <div>
                <label className="block text-gray-300 mb-2">Category</label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  required
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat.category_id} value={cat.category_id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg px-4 py-3 font-semibold hover:opacity-90 transition"
              >
                Add Transaction
              </button>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
