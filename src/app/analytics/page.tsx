"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getSession } from "next-auth/react";
import BalanceChart from "@/components/graphs/BalanceChart";
import SpendingChartByCategories from "@/components/graphs/SpendingChartByCategories";
import IncomeDistributionChart from "@/components/graphs/IncomeChartByCategories";
import IncomeVsExpenseChart from "@/components/graphs/IncomeVsExpense";
import ProcessTransactionData from "@/utils/processTransactionData";
import Navigation from "@/components/Navigation";
import getUserTransactions from "@/../server/getUserTransactions";
import { filter } from "@/../server/getUserTransactions";
import { Transaction } from "@/types/Transaction";
import BarGraphSkeleton from "@/components/GraphLoading";
import { AggregateTransactionData } from "@/utils/AggregateTransactionData";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Motion animation variants for fade-in and stagger effects
const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.2,
    },
  },
};

export default function AnalyticsPage() {
  // State variables for chart data and UI state
  const [spendingChartLabels, setSpendingChartLabels] = useState<string[]>([]);
  const [spendingChartData, setSpendingChartData] = useState<number[]>([]);
  const [balanceOverTimeLabels, setBalanceOverTimeLabels] = useState<string[]>(
    []
  );
  const [balanceOverTimeData, setBalanceOverTimeData] = useState<number[]>([]);
  const [incomeChartLabels, setIncomeChartLabels] = useState<string[]>([]);
  const [incomeChartData, setIncomeChartData] = useState<number[]>([]);
  const [incomeVsExpenseLabels, setIncomeVsExpenseLabels] = useState<string[]>(
    []
  );
  const [incomeData, setIncomeData] = useState<number[]>([]);
  const [expenseData, setExpenseData] = useState<number[]>([]);
  const [isGraphLoading, setIsGraphLoading] = useState(true); // Loading state for graphs
  const [GraphDate, setGraphDate] = useState<string>("Harshal"); // Date label for graph
  const [transactionArray, setTransactionArray] = useState<Transaction[]>([]);

  // Effect hook to fetch and process transaction data on component mount
  useEffect(() => {
    const fetchTransactions = async () => {
      // Fetch user session to check if the user is logged in
      const session = await getSession();
      if (!session) {
        toast.error("Session not found. Please log in."); // Error if not logged in
        return;
      }

      // Fetch transaction data for the logged-in user
      const transactions = await getUserTransactions(
        session.user.email,
        0,
        undefined,
        {} as filter
      );

      // If transactions fetched successfully
      if (transactions.success) {
        setTransactionArray(transactions.data);
        const processTransactions = ProcessTransactionData(transactions.data);
        const AggregatedData = await AggregateTransactionData(
          processTransactions
        );

        // Aggregating spending and income by category
        const spendingSources: { [key: string]: number } = {};
        const incomeSources: { [key: string]: number } = {};

        transactions.data.forEach((transaction: Transaction) => {
          const category = transaction.category_name || "Others";
          const amount = Number(transaction.amount);
          const isCredit = transaction.transaction_type === "credit";

          if (isCredit) {
            incomeSources[category] = (incomeSources[category] || 0) + amount;
          } else {
            spendingSources[category] =
              (spendingSources[category] || 0) + amount;
          }
        });

        // Prepare data for various charts: balances, income, and expenses over time
        const balances: number[] = [];
        const income: number[] = [];
        const expense: number[] = [];
        const dateLabel: string[] = [];

        if (Object.keys(AggregatedData).length === 1) {
          const year = Number(Object.keys(AggregatedData)[0]);
          if (Object.keys(AggregatedData[year]).length === 1) {
            const month = Object.keys(AggregatedData[year])[0];
            const days = AggregatedData[year][month];
            Object.entries(days).forEach(([day, Data]) => {
              dateLabel.push(String(day));
              balances.push(Number(Data.balance[0]));
              income.push(Number(Data.income[0]));
              expense.push(Number(Data.expense[0]));
              setGraphDate(month + " " + year); // Set the date for graph display
            });
          } else {
            const months = Object.keys(AggregatedData[year]);
            Object.entries(months).forEach(([month]) => {
              const days = AggregatedData[year][month];
              Object.entries(days).forEach(([day, Data]) => {
                dateLabel.push(String(day) + " " + month);
                balances.push(Number(Data.balance[0]));
                income.push(Number(Data.income[0]));
                expense.push(Number(Data.expense[0]));
                setGraphDate(String(year));
              });
            });
          }
        } else {
          const years = Number(Object.keys(AggregatedData));
          Object.entries(years).forEach(([year]) => {
            const months = Object.keys(AggregatedData[Number(year)]);
            Object.entries(months).forEach(([month]) => {
              const days = AggregatedData[Number(year)][month];
              Object.entries(days).forEach(([day, Data]) => {
                dateLabel.push(String(day) + " " + month + "" + String(year));
                balances.push(Number(Data.balance[0]));
                income.push(Number(Data.income[0]));
                expense.push(Number(Data.expense[0]));
              });
            });
          });
        }

        // Update state with processed data
        setBalanceOverTimeLabels(dateLabel);
        setBalanceOverTimeData(balances);
        setSpendingChartLabels(Object.keys(spendingSources));
        setSpendingChartData(Object.values(spendingSources));
        setIncomeChartLabels(Object.keys(incomeSources));
        setIncomeChartData(Object.values(incomeSources));
        setIncomeVsExpenseLabels(dateLabel);
        setIncomeData(income);
        setExpenseData(expense);
        setIsGraphLoading(false); // Set graph loading to false after data is ready
        toast.success("Graphs loaded successfully.");
      } else {
        toast.error("Failed to load Graphs."); // Error handling if fetching data fails
      }
    };

    fetchTransactions();
  }, []);

  // Calculate total spending and income from the respective chart data
  const Total_Spending = spendingChartData.reduce((acc, curr) => acc + curr, 0);
  const Total_Income = incomeChartData.reduce((acc, curr) => acc + curr, 0);

  return (
    <div className="flex">
      <Navigation /> {/* Navigation component */}
      <div className="flex-1 md:ml-64 p-4">
        <div className="min-h-screen bg-black p-4 md:p-6 lg:p-8">
        <ToastContainer autoClose={2000} /> {/* Toast container for notifications */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-[1400px] mx-auto"
          >
            <div className="bg-gray-900 rounded-2xl shadow-xl p-4 md:p-6 lg:p-8 space-y-6 md:space-y-8">
              {/* Header Section */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <motion.h1
                  className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent"
                  variants={fadeInUp}
                >
                  Analytics
                </motion.h1>
              </div>

              {/* Quick Stats and Graphs Section */}
              <motion.div
                className="container mx-auto p-4"
                variants={staggerContainer}
                initial="initial"
                animate="animate"
              >
                <motion.div
                  className="grid grid-cols-1 md:grid-cols-2 gap-8"
                  variants={fadeInUp}
                >
                  {/* Spending Analytics Card */}
                  <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                    <h2 className="text-xl font-semibold text-white mb-4">
                      Spending Analytics
                    </h2>
                    <div className="bg-gray-800 rounded-lg p-3 md:p-4 mb-4 text-center shadow-sm shadow-white">
                      <span className="text-gray-400 text-sm md:text-base">
                        Total Spending:
                      </span>
                      <span className="block text-xl md:text-2xl font-bold text-white">
                        {Total_Spending?.toFixed(2) || "0.00"}
                      </span>
                    </div>
                    {isGraphLoading ? (
                      <BarGraphSkeleton /> // Skeleton loader if graphs are still loading
                    ) : (
                      <div className="relative bg-gray-800 rounded-lg shadow-sm shadow-white p-4 md:p-6 lg:p-8 flex items-center justify-center">
                        <SpendingChartByCategories
                          labels={spendingChartLabels}
                          data={spendingChartData}
                        />
                      </div>
                    )}
                  </div>

                  {/* Balance Over Time Card */}
                  <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                    <h2 className="text-xl md:text-xl font-semibold text-white mb-4">
                      Balance Over Time
                    </h2>

                    <div className="bg-gray-800 rounded-lg p-3 md:p-4 mb-4 text-center shadow-sm shadow-white">
                      <span className="text-gray-400 text-sm md:text-base">
                        Current Balance:
                      </span>
                      <span className="block text-xl md:text-2xl font-bold text-white">
                        {isNaN(Number(transactionArray[0]?.balance))
                          ? "0.00"
                          : Number(transactionArray[0]?.balance).toFixed(2)}
                      </span>
                    </div>

                    {isGraphLoading ? (
                      <BarGraphSkeleton /> // Skeleton loader if graph is still loading
                    ) : (
                      <div className="relative bg-gray-800 rounded-lg shadow-sm shadow-white p-4 md:p-6 lg:p-8 flex items-center justify-center">
                        <BalanceChart
                          labels={balanceOverTimeLabels}
                          data={balanceOverTimeData}
                          timePeriod={GraphDate}
                        />
                      </div>
                    )}
                  </div>

                  {/* Income Distribution Card */}
                  <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                    <h2 className="text-xl font-semibold text-white mb-4">
                      Income Distribution
                    </h2>
                    <div className="bg-gray-800 rounded-lg p-3 md:p-4 mb-4 text-center shadow-sm shadow-white">
                      <span className="text-gray-400 text-sm md:text-base">
                        Total Income:
                      </span>
                      <span className="block text-xl md:text-2xl font-bold text-white">
                        {Total_Income?.toFixed(2) || "0.00"}
                      </span>
                    </div>
                    {isGraphLoading ? (
                      <BarGraphSkeleton /> // Skeleton loader if graph is still loading
                    ) : (
                      <div className="relative bg-gray-800 rounded-lg shadow-sm shadow-white p-4 md:p-6 lg:p-8 flex items-center justify-center">
                        <IncomeDistributionChart
                          labels={incomeChartLabels}
                          data={incomeChartData}
                        />
                      </div>
                    )}
                  </div>

                  {/* Income vs Expense Card */}
                  <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                    <h2 className="text-xl font-semibold text-white mb-4">
                      Income vs Expense
                    </h2>

                    {isGraphLoading ? (
                      <BarGraphSkeleton /> // Skeleton loader if graph is still loading
                    ) : (
                      <div className="relative bg-gray-800 rounded-lg shadow-sm shadow-white p-4 md:p-6 lg:p-8 flex items-center justify-center">
                        <IncomeVsExpenseChart
                          labels={incomeVsExpenseLabels}
                          incomeData={incomeData}
                          expenseData={expenseData}
                          timePeriod={GraphDate}
                        />
                      </div>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
