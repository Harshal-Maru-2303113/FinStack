"use client";

import { useEffect, useState } from "react"; // React hooks for state and effect
import { motion } from "framer-motion"; // For animations
import {
  FiDollarSign,
  FiTrendingUp,
  FiCreditCard,
  FiArrowUp,
  FiArrowDown,
} from "react-icons/fi"; // Importing icons for UI
import Navigation from "@/components/Navigation"; // Navigation component
import Link from "next/link"; // Link component for routing
import { Transaction } from "@/types/Transaction"; // Type for transactions
import getUserTransactions from "@/../server/getUserTransactions"; // Function to fetch user transactions
import TransactionLoading from "@/components/TransactionLoading"; // Skeleton loading component for transactions
import { getSession } from "next-auth/react"; // For getting user session
import { filter } from "@/../server/getUserTransactions"; // Transaction filter type
import truncateDescription from "@/utils/truncateDescription"; // Utility to truncate transaction descriptions
import TransactionModal from "@/components/TransactionModal"; // Modal to display detailed transaction
import calculateMonthlyFinance from "@/utils/calculateMonthlyFinance"; // Utility to calculate monthly finance stats
import SpendingChartByCategories from "@/components/graphs/SpendingChartByCategories"; // Spending chart component
import BarGraphSkeleton from "@/components/GraphLoading"; // Skeleton loading component for graphs
import { ToastContainer, toast } from "react-toastify"; // For showing toast notifications
import "react-toastify/dist/ReactToastify.css"; // Import toast CSS

// Constants for quick stats display (Total Balance, Monthly Income, Total Expenses)
const QUICK_STATS = (amount: number, income: number, expense: number) => [
  {
    title: "Total Balance",
    value: amount,
    icon: <FiDollarSign size={24} />,
  },
  {
    title: "Monthly Income",
    value: income,
    icon: <FiTrendingUp size={24} />,
  },
  {
    title: "Total Expenses",
    value: expense,
    icon: <FiCreditCard size={24} />,
  },
];

export default function Dashboard() {
  // State hooks to store transaction data, balance, income, expenses, and loading states
  const [transactionArray, setTransactionArray] = useState<Transaction[]>([]);
  const [balance, setBalance] = useState(0);
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [isTransactionLoading, setIsTransactionLoading] = useState(true);
  const [popupContent, setPopupContent] = useState<Transaction | null>(null);
  const [isFinanceValuesLoading, setIsFinanceValuesLoading] = useState(true);

  // State hooks for chart data
  const [spendingChartLabels, setSpendingChartLabels] = useState<string[]>([]);
  const [spendingChartData, setSpendingChartData] = useState<number[]>([]);

  const [isGraphLoading, setIsGraphLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      const session = await getSession();
      if (!session) {
        toast.error("Session not found. Please log in.");
        return;
      }

      try {
        const transactions = await getUserTransactions(
          session.user.email,
          0,
          undefined,
          {} as filter
        );

        if (transactions.success && transactions.data.length > 0) {
          toast.success("Transactions fetched successfully!");

          // Get the latest transaction to set the current balance
          const latestTransaction =
            transactions.data[transactions.data.length - 1];
          setBalance(Number(latestTransaction.balance));

          // Use slice() to create a reversed copy for display without changing the original
          setTransactionArray(transactions.data.slice().reverse());

          // Calculate monthly totals
          const FinanceData = await calculateMonthlyFinance(session.user.email);
          setIncome(FinanceData.totalIncome);
          setExpense(FinanceData.totalExpense);

          // --- This is the only logic needed for your spending chart ---
          const spendingSources: { [key: string]: number } = {};
          transactions.data.forEach((transaction: Transaction) => {
            if (transaction.transaction_type !== "credit") {
              const category = transaction.category_name || "Others";
              spendingSources[category] =
                (spendingSources[category] || 0) + Number(transaction.amount);
            }
          });

          setSpendingChartLabels(Object.keys(spendingSources));
          setSpendingChartData(Object.values(spendingSources));
          // --- End of required logic ---
        } else if (transactions.success) {
          // Handle case where user has no transactions
          toast.info("No transactions found.");
        } else {
          toast.error("Failed to fetch transactions.");
        }
      } catch (error) {
        console.error("Error fetching transactions:", error);
        toast.error("An error occurred while fetching transactions.");
      } finally {
        // Stop all loading indicators
        setIsFinanceValuesLoading(false);
        setIsTransactionLoading(false);
        setIsGraphLoading(false);
      }
    };

    fetchTransactions();
  }, []);
  // Calculate total spending from the chart data
  const Total_Spending = spendingChartData.reduce((acc, curr) => acc + curr, 0);

  return (
    <div className="flex">
      <Navigation /> {/* Navigation component */}
      <div className="flex-1 md:ml-64 p-4">
        <ToastContainer autoClose={2000} />{" "}
        {/* Toast notifications container */}
        <div className="min-h-screen bg-black p-4 md:p-6 lg:p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-[1400px] mx-auto"
          >
            <div className="bg-gray-900 rounded-2xl shadow-xl p-4 md:p-6 lg:p-8 space-y-6 md:space-y-8">
              {/* Header Section */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                  Financial Overview
                </h1>
                <Link href="/addtransactions">
                  <button className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg px-4 py-2 font-semibold hover:opacity-90 transition">
                    + New Transaction
                  </button>
                </Link>
              </div>

              {/* Quick Stats Section */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {QUICK_STATS(balance, income, expense).map((stat, index) => (
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
                        {isFinanceValuesLoading ? (
                          <TransactionLoading items={1} />
                        ) : (
                          <p className="text-xl md:text-2xl font-bold text-white">
                            {stat.value}
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Main Content */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 md:gap-6">
                {/* Chart Section */}
                <div className="hidden md:flex xl:col-span-2 flex-col lg:flex-row justify-evenly items-stretch bg-gray-800 p-4 md:p-6 rounded-xl border border-gray-700 gap-6">
                  {/* Spending Analytics Section */}
                  <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                    <h2 className="text-xl md:text-xl font-semibold text-white mb-4">
                      Spending Analytics
                    </h2>

                    {/* Total Spending Tab */}
                    <div className="bg-gray-800 rounded-lg p-3 md:p-4 mb-4 text-center shadow-sm shadow-white">
                      <span className="text-gray-400 text-sm md:text-base">
                        Total Spending:
                      </span>
                      <span className="block text-xl md:text-2xl font-bold text-white">
                        {Total_Spending?.toFixed(2)}
                      </span>
                    </div>

                    {/* Chart Section */}
                    {isGraphLoading ? (
                      <BarGraphSkeleton />
                    ) : (
                      <div className="relative bg-gray-800 rounded-lg shadow-sm shadow-white p-4 md:p-6 lg:p-8 flex items-center justify-center">
                        <SpendingChartByCategories
                          labels={spendingChartLabels}
                          data={spendingChartData}
                        />
                      </div>
                    )}
                  </div>

                  {/* Balance Over Time Section */}
                </div>

                {/* Recent Transactions */}
                <div className="bg-gray-800 p-4 md:p-6 rounded-xl border border-gray-700">
                  <h2 className="text-xl md:text-xl font-semibold text-white mb-4">
                    Recent Transactions
                  </h2>
                  <div className="space-y-3">
                    {isTransactionLoading ? (
                      <div className="flex">
                        <TransactionLoading items={4} />
                        <TransactionLoading items={4} />
                      </div>
                    ) : (
                      transactionArray
                        .slice(-8)
                        .reverse()
                        .map((transaction, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
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
                              {Number(transaction.amount).toFixed(2)}
                            </span>
                          </motion.div>
                        ))
                    )}
                  </div>
                  <TransactionModal
                    transaction={popupContent}
                    onClose={() => setPopupContent(null)}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
