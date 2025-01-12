"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getSession } from "next-auth/react";
import BalanceChart from "@/components/graphs/BalanceChart";
import SpendingChart from "@/components/graphs/SpendingChart";
import IncomeDistributionChart from "@/components/graphs/Income";

import IncomeVsExpenseChart from "@/components/graphs/IncomeVsExpense";


import Navigation from "@/components/Navigation";
import getUserTransactions from "@/../server/getUserTransactions";
import { filter } from "@/../server/getUserTransactions";
import processTransactionDates from "@/utils/processTransactionDates";
import { Transaction } from "@/types/Transaction";
import BarGraphSkeleton from "@/components/GraphLoading";

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
  const [chartLabels, setChartLabels] = useState<string[]>([]);
  const [chartData, setChartData] = useState<number[]>([]);
  const [balanceOverTimeLabels, setBalanceOverTimeLabels] = useState<string[]>([]);
  const [balanceOverTimeData, setBalanceOverTimeData] = useState<number[]>([]);
  const [incomeLabels, setIncomeLabels] = useState<string[]>([]);
  const [incomeData, setIncomeData] = useState<number[]>([]);
  const [incomeVsExpenseLabels, setIncomeVsExpenseLabels] = useState<string[]>([]);
  const [incomeVsExpenseData, setIncomeVsExpenseData] = useState<number[][]>([]);
  const [isGraphLoading, setIsGraphLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      const session = await getSession();
      if (!session) return;

      const transactions = await getUserTransactions(
        session.user.email,
        0,
        undefined,
        {} as filter
      );

      if (transactions.success) {
        const categories: { [key: string]: number } = {};
        const incomeSources: { [key: string]: number } = {};
        const expenseOverTime: { [key: string]: number } = {};
        const incomeOverTime: { [key: string]: number } = {};
        const balances: number[] = [];
        const incomeVsExpense: { [key: string]: { income: number; expense: number } } = {};
        
        // Process dates for all time-based charts
        const date_result = processTransactionDates(transactions.data);
        const timeLabels = date_result.xAxis.labels.reverse();

        // Initialize data structures with processed dates
        timeLabels.forEach(label => {
          incomeVsExpense[label] = { income: 0, expense: 0 };
        });

        transactions.data.forEach((transaction: Transaction) => {
          const category = transaction.category_name || "Others";
          const source = transaction.category_name || "Other Income";
          const dateLabel = timeLabels[timeLabels.length - 1 - transactions.data.indexOf(transaction)];
          const amount = Number(transaction.amount);
          const isCredit = transaction.transaction_type === "credit";
          const balance = transaction.balance;

          if (isCredit) {
            incomeSources[source] = (incomeSources[source] || 0) + amount;
            incomeOverTime[dateLabel] = (incomeOverTime[dateLabel] || 0) + amount;
            incomeVsExpense[dateLabel] = {
              income: (incomeVsExpense[dateLabel]?.income || 0) + amount,
              expense: incomeVsExpense[dateLabel]?.expense || 0,
            };
          } else {
            categories[category] = (categories[category] || 0) + amount;
            expenseOverTime[dateLabel] = (expenseOverTime[dateLabel] || 0) + amount;
            incomeVsExpense[dateLabel] = {
              income: incomeVsExpense[dateLabel]?.income || 0,
              expense: (incomeVsExpense[dateLabel]?.expense || 0) + amount,
            };
          }
          balances.push(Number(balance));
        });

        setBalanceOverTimeLabels(timeLabels);
        setBalanceOverTimeData(balances.reverse());
        setChartLabels(Object.keys(categories));
        setChartData(Object.values(categories));
        setIncomeLabels(Object.keys(incomeSources));
        setIncomeData(Object.values(incomeSources));
        setIncomeVsExpenseLabels(timeLabels);
        setIncomeVsExpenseData(
          timeLabels.map(label => [
            incomeVsExpense[label].income,
            incomeVsExpense[label].expense
          ])
        );
        setIsGraphLoading(false);
      }
    };

    fetchTransactions();
  }, []);

    const Total_Spending = chartData.reduce((acc, curr) => acc + curr, 0);
    const Total_Income = incomeData.reduce((acc, curr) => acc + curr, 0);
    const Current_Balance = balanceOverTimeData[balanceOverTimeData.length - 1];

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
                  <motion.h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent" variants={fadeInUp}>
                  Analytics
                  </motion.h1>
                  
                </div>
  
                {/* Quick Stats */}
                <motion.div
            className="container mx-auto p-4"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-8" variants={fadeInUp}>
              {/* Spending Analytics */}
              <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold text-white mb-4">Spending Analytics</h2>
                <div className="bg-gray-800 rounded-lg p-3 md:p-4 mb-4 text-center shadow-md">
                  <span className="text-gray-400 text-sm md:text-base">
                    Total Spending:
                  </span>
                  <span className="block text-xl md:text-2xl font-bold text-white">
                    ${Total_Spending?.toFixed(2) || "0.00"}
                  </span>
                </div>
                {isGraphLoading ? <BarGraphSkeleton /> : <div className="relative bg-gray-800 rounded-lg shadow-md p-4 md:p-6 lg:p-8 flex items-center justify-center">
                  <SpendingChart labels={chartLabels} data={chartData} />
                </div>}
              </div>

              {/* Balance Over Time */}
              <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                <h2 className="text-xl md:text-xl font-semibold text-white mb-4">
                  Balance Over Time
                </h2>

                <div className="bg-gray-800 rounded-lg p-3 md:p-4 mb-4 text-center shadow-md">
                  <span className="text-gray-400 text-sm md:text-base">
                    Current Balance:
                  </span>
                  <span className="block text-xl md:text-2xl font-bold text-white">
                    ${Current_Balance?.toFixed(2) || "0.00"}
                  </span>
                </div>

                {isGraphLoading ? (
                  <BarGraphSkeleton />
                ) : (
                  <div className="relative bg-gray-800 rounded-lg shadow-md p-4 md:p-6 lg:p-8 flex items-center justify-center">
                    <BalanceChart labels={balanceOverTimeLabels} data={balanceOverTimeData} />
                  </div>
                )}
              </div>
              

              {/* Income Distribution */}
              <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold text-white mb-4">Income Distribution</h2>
                <div className="bg-gray-800 rounded-lg p-3 md:p-4 mb-4 text-center shadow-md">
                  <span className="text-gray-400 text-sm md:text-base">
                    Total Income:
                  </span>
                  <span className="block text-xl md:text-2xl font-bold text-white">
                    ${Total_Income?.toFixed(2) || "0.00"}
                  </span>
                </div>
                {isGraphLoading ? <BarGraphSkeleton /> : <IncomeDistributionChart labels={incomeLabels} data={incomeData} />}
              </div>

              {/* Expense Over Time */}

              {/* Income vs Expense */}
              <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                <h2 className="text-xl font-semibold text-white mb-4">Income vs Expense</h2>
                {isGraphLoading ? <BarGraphSkeleton /> : <IncomeVsExpenseChart
                  labels={incomeVsExpenseLabels}
                  incomeData={incomeVsExpenseData.map((d) => d[0])} // Extract income data
                  expenseData={incomeVsExpenseData.map((d) => d[1])} // Extract expense data
                />
                }
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