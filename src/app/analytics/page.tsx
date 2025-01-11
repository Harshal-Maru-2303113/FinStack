"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getSession } from "next-auth/react";
import BalanceChart from "@/components/graphs/BalanceChart";
import SpendingChart from "@/components/graphs/SpendingChart";
import Navigation from "@/components/Navigation";
import getUserTransactions from "@/../server/getUserTransactions";

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
  const [balanceData, setBalanceData] = useState<number[]>([]);
  const [spendingData, setSpendingData] = useState<number[]>([]);
  const [labels, setLabels] = useState<string[]>([]);
  const [chartLabels, setChartLabels] = useState<string[]>([]);
  const [chartData, setChartData] = useState<number[]>([]);
  const [balanceOverTimeLabels, setBalanceOverTimeLabels] = useState<string[]>(
    []
  );
  const [balanceOverTimeData, setBalanceOverTimeData] = useState<number[]>([]);
  // const [isGraphLoading, setIsGraphLoading] = useState(true);
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

          const balances: number[] = [];
          const date_result = processTransactionDates(allTransactions.data);
          allTransactions.data.reverse().forEach((transaction: Transaction) => {
            balances.push(Number(transaction.balance));
          });
          setBalanceOverTimeLabels(date_result);
          setBalanceOverTimeData(balances);

      }
      setIsFinanceValuesLoading(false);
      setIsTransactionLoading(false);
    };
    

    const getChartData = async () => {
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
        transactions.data.forEach((transaction: Transaction) => {
          const category = transaction.category_name || "Others";
          categories[category] =
            (categories[category] || 0) + Number(transaction.amount);
        });
        setIsGraphLoading(false);
        setChartLabels(Object.keys(categories));
        setChartData(Object.values(categories));
      }
    };

    fetchTransactions();
    getChartData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navigation />
      <motion.div
        className="container mx-auto p-4"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        <motion.h1
          className="text-4xl font-bold mb-8"
          variants={fadeInUp}
        >
          Analytics
        </motion.h1>

        <motion.div className="grid grid-cols-1 md:grid-cols-2 gap-8" variants={fadeInUp}>
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">Balance Over Time</h2>
            <BalanceChart
                        labels={balanceOverTimeLabels}
                        data={balanceOverTimeData}
                      />
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">Spending Breakdown</h2>
            <SpendingChart labels={chartLabels} data={chartData} />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}