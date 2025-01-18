"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { categories } from "@/utils/categories";
import addTransaction from "@/../server/addTransaction";
import { getSession } from "next-auth/react";
import addBudgetAmount from "../../../server/addBudgetAmount";

export default function TransactionPage() {
  const router = useRouter();
  type transactionType = 'credit' | 'debit';

  interface TransactionData {
    amount: number;
    transaction_type: transactionType;
    description: string;
    category_id: number;
  }

  const [amount, setAmount] = useState("");
  const [transaction_type, setTransactionType] = useState<transactionType>("credit");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const sentTransactionData = async () => {
    try {
      toast.info("Transaction is being sent...");
      const data: TransactionData = {
        amount: Number(amount),
        transaction_type,
        description,
        category_id: Number(categoryId),
      };
      const session = await getSession();
      if (!session) {
        toast.error("Please log in to add a transaction.");
        return;
      }
      const response = await addTransaction(data, session.user.email);

      if (response.success) {
        const category: string = String(categories.find((cat) => cat.category_id === Number(categoryId))?.name);
        await addBudgetAmount(
          Number(data.amount),
          data.transaction_type,
          Number(data.category_id),
          response.date_time || new Date(),
          session.user.email,
          category
        );
        toast.success("Transaction added successfully!");
        router.push("/dashboard");
      } else {
        toast.error(response.message);
        resetForm();
        return;
      }
    } catch (error) {
      console.error("Error adding transaction:", error);
      toast.error("Error adding transaction");
      resetForm();
      return;
    }
  };

  const resetForm = () => {
    setAmount("");
    setTransactionType("credit");
    setDescription("");
    setCategoryId("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    sentTransactionData();
  };

  return (
    <div className="min-h-screen bg-black p-4 md:p-6 lg:p-8 flex items-center justify-center">
      <ToastContainer position="top-right" autoClose={3000} />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[600px]  mx-auto"
      >
        <div className="relative p-1 lg:p-1 rounded-2xl bg-gray-900 shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl -m-[2px] animate-gradient-border bg-[length:200%_200%]"></div>
          <div className="relative bg-gray-900 rounded-2xl border-2 border-transparent p-6 lg:p-8">
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent mb-6">
              Add New Transaction
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
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

              <div>
                <label className="block text-gray-300 mb-2">Transaction Type</label>
                <select
                  value={transaction_type}
                  onChange={(e) => setTransactionType(e.target.value as transactionType)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
                >
                  <option value="credit">Credit</option>
                  <option value="debit">Debit</option>
                </select>
              </div>

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
