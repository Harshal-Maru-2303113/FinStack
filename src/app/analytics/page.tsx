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
  const [spendingChartLabels, setSpendingChartLabels] = useState<string[]>([]);
  const [spendingChartData, setSpendingChartData] = useState<number[]>([]);
  const [balanceOverTimeLabels, setBalanceOverTimeLabels] = useState<string[]>([]);
  const [balanceOverTimeData, setBalanceOverTimeData] = useState<number[]>([]);
  const [incomeChartLabels, setIncomeChartLabels] = useState<string[]>([]);
  const [incomeChartData, setIncomeChartData] = useState<number[]>([]);
  const [incomeVsExpenseLabels, setIncomeVsExpenseLabels] = useState<string[]>([]);
  const [incomeData, setIncomeData] = useState<number[]>([]);
  const [expenseData, setExpenseData] = useState<number[]>([]);
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
        const processTransactions = ProcessTransactionData(transactions.data);
        const AggregatedData = await AggregateTransactionData(processTransactions);


        const spendingSources: { [key: string]: number } = {};
        const incomeSources: { [key: string]: number } = {};




        transactions.data.forEach((transaction: Transaction) => {
          const category = transaction.category_name || "Others";
          const amount = Number(transaction.amount);
          const isCredit = transaction.transaction_type === "credit";

          if (isCredit) {
            incomeSources[category] = (incomeSources[category] || 0) + amount;
          } else {
            spendingSources[category] = (spendingSources[category] || 0) + amount;
          }
        });

        const balances: number[] = [];
        const income: number[] = [];
        const expense: number[] = []
        const dateLabel: string[] = [];

        if (Object.keys(AggregatedData).length === 1) {
          const year = Number(Object.keys(AggregatedData)[0]);
          if (Object.keys(AggregatedData[year]).length === 1) {
            const month = Object.keys(AggregatedData[year])[0];
            const days = AggregatedData[year][month];
            Object.entries(days).forEach(([day, Data]) => {
              dateLabel.push(String(day)); // Add the day to dateLabel
              balances.push(Number(Data.balance[0]))
              income.push(Number(Data.income[0]))
              expense.push(Number(Data.expense[0]))
            });
          }
        }
        console.dir(dateLabel);
        console.dir(balances)


        setBalanceOverTimeLabels(dateLabel);
        setBalanceOverTimeData(balances);
        setSpendingChartLabels(Object.keys(spendingSources));
        setSpendingChartData(Object.values(spendingSources));
        setIncomeChartLabels(Object.keys(incomeSources));
        setIncomeChartData(Object.values(incomeSources));
        setIncomeVsExpenseLabels(dateLabel);
        setIncomeData(income)
        setExpenseData(expense)
        setIsGraphLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const Total_Spending = spendingChartData.reduce((acc, curr) => acc + curr, 0);
  const Total_Income = incomeChartData.reduce((acc, curr) => acc + curr, 0);
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
                      <SpendingChartByCategories labels={spendingChartLabels} data={spendingChartData} />
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
                    {isGraphLoading ? <BarGraphSkeleton /> : <IncomeDistributionChart labels={incomeChartLabels} data={incomeChartData} />}
                  </div>

                  {/* Expense Over Time */}

                  {/* Income vs Expense */}
                  <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
                    <h2 className="text-xl font-semibold text-white mb-4">Income vs Expense</h2>
                    {isGraphLoading ? <BarGraphSkeleton /> : <IncomeVsExpenseChart
                      labels={incomeVsExpenseLabels}
                      incomeData={incomeData}
                      expenseData={expenseData}
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