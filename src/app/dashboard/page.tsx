"use client";

import { motion } from "framer-motion";
import {
  FiDollarSign,
  FiTrendingUp,
  FiPieChart,
  FiCreditCard,
  FiArrowUp,
  FiArrowDown,
} from "react-icons/fi";
import Navigation from "@/components/Navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { calculateBalance, Transaction } from "@/utils/Calculate";


export default function Dashboard() {
  const [transactionArray] = useState<Transaction[]>([]);
  const [amount, setAmount] = useState(0);
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);

  // const getTransactionsData = async (start: number, limit: number) => {
  //   try {
  //     const response = await api.post<{ success: boolean; data: Transaction[]; message?: string }>("/user/getTransactionData", {
  //       start,
  //       limit,
  //     });
  //     if (response.data.success) {
  //       return response.data.data;
  //     } else {
  //       console.error("Error fetching transactions:", response.data.message);
  //       return [];
  //     }
  //   } catch (error) {
  //     console.error("Error fetching transactions:", error);
  //     return [];
  //   }
  // };
  // useEffect(() => {
  //   const fetchDta = async ()=>{
  //     const initialData = await getTransactionsData(0, 4);
  //     setTransactionArray(initialData);
  //   }
  //   fetchDta();
  // }, []);
  console.log(transactionArray);
  useEffect(() => {
    if (transactionArray.length > 0) {
      const { currentBalance, totalIncome, totalSpending } =
        calculateBalance(transactionArray);
      setAmount(currentBalance);
      setIncome(totalIncome);
      setExpense(totalSpending);
    }
  }, [transactionArray]);
  const [popupContent, setPopupContent] = useState<Transaction | null>(null);

  // Function to handle showing the popup

  // Function to truncate description to first two words
  const truncateDescription = (description: string) => {
    const words = description.split(" ");
    if (words.length > 2) {
      return words.slice(0, 2).join(" ") + " ...";
    }
    return description;
  };

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
              {/* Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                  Financial Overview
                </h1>
                <Link href={"/addtransactions"}>
                  <button className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg px-4 py-2 font-semibold hover:opacity-90 transition">
                    + New Transaction
                  </button>
                </Link>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {[
                  {
                    title: "Total Balance",
                    amount: amount,
                    icon: <FiDollarSign size={24} />,
                  },
                  {
                    title: "Monthly Income",
                    amount: income,
                    icon: <FiTrendingUp size={24} />,
                  },
                  {
                    title: "Total Expenses",
                    amount: expense,
                    icon: <FiCreditCard size={24} />,
                  },
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-gray-800 p-4 md:p-6 rounded-xl border border-gray-700 hover:border-blue-500/50 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-blue-500/10 rounded-lg text-blue-500">
                        {stat.icon}
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm md:text-xl">
                          {stat.title}
                        </p>
                        <p className="text-xl md:text-2xl font-bold text-white">
                          {stat.amount}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Main Content */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 md:gap-6">
                {/* Chart Section */}
                <div className="xl:col-span-2 bg-gray-800 p-4 md:p-6 rounded-xl border border-gray-700">
                  <h2 className="text-xl md:text-xl font-semibold text-white mb-4">
                    Spending Analytics
                  </h2>
                  <div className="h-48 md:h-64 bg-gray-700/50 rounded-lg flex items-center justify-center">
                    <FiPieChart size={48} className="text-gray-600" />
                  </div>
                </div>

                {/* Recent Transactions */}
                <div className="bg-gray-800 p-4 md:p-6 rounded-xl border border-gray-700">
                  <h2 className="text-xl md:text-xl font-semibold text-white mb-4">
                    Recent Transactions
                  </h2>
                  <div className="space-y-3">
                    {transactionArray
                      .map((transaction, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 md:p-3 hover:bg-gray-700/50 rounded-lg transition-all cursor-pointer"
                          onClick={() => setPopupContent(transaction)}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`p-2 rounded-lg ${
                                transaction.transaction_type === "credit"
                                  ? "bg-green-500/10"
                                  : "bg-red-500/10"
                              }`}
                            >
                              {transaction.transaction_type === "credit" ? (
                                <FiArrowUp className="text-green-500" />
                              ) : (
                                <FiArrowDown className="text-red-500" />
                              )}
                            </div>
                            <span className="text-white text-sm md:text-xl">
                              {truncateDescription(transaction.description)}
                            </span>
                          </div>

                          <span
                            className={`font-semibold text-sm md:text-xl ${
                              transaction.transaction_type === "credit"
                                ? "text-green-500"
                                : "text-red-500"
                            }`}
                          >
                            {transaction.transaction_type === "credit"
                              ? "+"
                              : "-"}
                            ${Number(transaction.amount).toFixed(2)}
                          </span>
                        </div>
                      ))}
                  </div>

                  {/* Popup Modal */}
                  {popupContent && (
                    <div
                      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
                      onClick={() => setPopupContent(null)} // Close when clicking on the overlay
                    >
                      <div
                        className="bg-gray-800 p-6 rounded-xl border border-gray-700 max-w-md w-full mx-4"
                        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
                      >
                        <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent p-3 text-center">
                          Transaction Details
                        </h3>
                        <div className="space-y-4 text-white text-sm md:text-xl">
                          <p className="flex items-center gap-4">
                            <span className="font-semibold text-xl text-blue-400">
                              Transaction ID:
                            </span>
                            <span className="block text-xl text-gray-200">
                              {popupContent.transaction_id}
                            </span>
                          </p>
                          <p className="flex items-center gap-4">
                            <span className="font-semibold text-xl text-blue-400">
                              Date:
                            </span>
                            <span className="block text-xl text-gray-200">
                              {new Date(
                                popupContent.date_time
                              ).toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })}
                            </span>
                          </p>
                          <p className="flex items-center gap-4">
                            <span className="font-semibold text-xl text-blue-400">
                              Time:
                            </span>
                            <span className="block text-xl text-gray-200">
                              {new Date(
                                popupContent.date_time
                              ).toLocaleTimeString("en-US", {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true,
                              })}
                            </span>
                          </p>
                          <p className="flex items-center gap-4">
                            <span className="font-semibold text-xl text-blue-400">
                              Type:
                            </span>
                            <span
                              className={`block text-xl ${
                                popupContent.transaction_type === "credit"
                                  ? "text-green-400"
                                  : "text-red-400"
                              }`}
                            >
                              {popupContent.transaction_type
                                .charAt(0)
                                .toUpperCase() +
                                popupContent.transaction_type.slice(1)}
                            </span>
                          </p>
                          <p className="flex items-center gap-4">
                            <span className="font-semibold text-xl text-blue-400">
                              Amount:
                            </span>
                            <span className={`block text-xl ${
                                popupContent.transaction_type === "credit"
                                  ? "text-green-400"
                                  : "text-red-400"
                              }`}>
                              ${Number(popupContent.amount).toFixed(2)}
                            </span>
                          </p>
                          <p >
                            <span className="font-semibold text-xl text-blue-400">
                              Description:
                            </span>
                            <span className="block text-xl text-gray-200 ml-3">
                              {popupContent.description}
                            </span>
                          </p>
                          <p className="flex items-center gap-4">
                            <span className="font-semibold text-xl text-blue-400">
                              Category:
                            </span>
                            <span className="block text-xl text-gray-200">
                              {popupContent.category_name}
                            </span>
                          </p>
                          
                          <p className="flex items-center gap-4">
                            <span className="font-semibold text-xl text-blue-400">
                              Balance:
                            </span>
                            <span className="block text-xl text-gray-200">
                              ${Number(popupContent.balance).toFixed(2)}
                            </span>
                          </p>
                        </div>
                        <button
                          className="mt-4 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:opacity-90 transition"
                          onClick={() => setPopupContent(null)}
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
