"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiFilter } from "react-icons/fi";
import Navigation from "@/components/Navigation";
import Link from "next/link";
import { Transaction } from "@/types/Transaction";
import getUserTransactions from "@/../server/getUserTransactions";
import { getSession } from "next-auth/react";
import useFilters from "@/hooks/useFilters";
import { Filters } from "@/hooks/useFilters";
import FilterOverlay from "@/components/FilterOverlay";
import TransactionTable from "@/components/TransactionTable";
import TransactionModal from "@/components/TransactionModal";

export default function TransactionsPage() {
  const [transactionArray, setTransactionArray] = useState<Transaction[]>([]);
  const [popupContent, setPopupContent] = useState<Transaction | null>(null);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [filterOverlay, setFilterOverlay] = useState(false);
  const { filters, setFilters, checkActiveFilters, resetFilters } =
    useFilters();
  const [isTransactionLoading, setIsTransactionLoading] = useState(true);
  const [isFilterActive, setIsFilterActive] = useState(false);
  const [hasReset,setHasReset] = useState(false);

  const getTransactionsData = async (
    start: number,
    limit: number,
    email: string,
    filters: Filters
  ) => {
    try {
      const response: {
        success: boolean;
        message: string;
        data: Transaction[];
      } = await getUserTransactions(email, start, limit, filters);

      if (response.success) {
        return response.data;
      } else {
        console.error("Error fetching transactions:", response.message);
        return [];
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
      return [];
    }
  };

  const fetchInitialData = async (filters: Filters) => {
    const session = await getSession();
    if (!session) {
      throw new Error("User not authenticated");
    }
    const initialData = await getTransactionsData(
      0,
      10,
      session.user.email,
      filters
    );
    setIsTransactionLoading(false);
    setTransactionArray(initialData);
    if (initialData.length < 10) {
      setHasMoreData(false);
    }
  };

  useEffect(() => {
    fetchInitialData(filters);
  }, [hasReset]);

  const loadMoreTransactions = async () => {
    const session = await getSession();
    if (!session) {
      throw new Error("User not authenticated");
    }
    const start = transactionArray.length;
    const newTransactions = await getTransactionsData(
      start,
      10,
      session.user.email,
      filters
    );
    if (newTransactions.length > 0) {
      setTransactionArray((prev) => [...prev, ...newTransactions]);
      if (newTransactions.length < 10) {
        setHasMoreData(false);
      }
    } else {
      setHasMoreData(false);
    }
  };

  const applyFilters = async () => {
    setIsFilterActive(checkActiveFilters());
    setIsTransactionLoading(true);
    await fetchInitialData(filters);
    setFilterOverlay(false);
  };

  return (
    <div className="flex">
      <Navigation />
      <div className="flex-1 md:ml-64 p-4">
        <div className="p-4 md:p-6 lg:p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-[1400px] mx-auto"
          >
            <div className="bg-gray-900 rounded-2xl shadow-xl p-6 space-y-6 overflow-hidden">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                  Transactions
                </h1>
                <div className="flex gap-3">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <motion.button
                      className={`relative px-4 py-2 rounded-lg transition-all duration-300 ease-in-out ${
                        isFilterActive
                          ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                          : "bg-gray-800 text-white hover:bg-gray-700"
                      }`}
                      onClick={() => setFilterOverlay(true)}
                      animate={{
                        scale: isFilterActive ? [1, 1.05, 1] : 1,
                      }}
                      transition={{
                        duration: 0.3,
                      }}
                    >
                      <div className="flex items-center">
                        <FiFilter className="inline mr-2" />
                        Filter
                        {isFilterActive && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="ml-2 w-2 h-2 bg-white rounded-full"
                          />
                        )}
                      </div>
                    </motion.button>
                  </motion.div>

                  {isFilterActive && (
                    <motion.button
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                      onClick={() => {
                        resetFilters();
                        setIsFilterActive(false);
                        setHasReset(e=>!e)
                      }}
                    >
                      Reset
                    </motion.button>
                  )}
                  <Link href={"/addtransactions"}>
                    <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:opacity-90 transition">
                      + New Transaction
                    </button>
                  </Link>
                </div>
              </div>
              <TransactionTable
                transactions={transactionArray}
                isLoading={isTransactionLoading}
                onRowClick={setPopupContent}
              />
              {/* Load More Button */}
              {!isTransactionLoading && hasMoreData && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="text-center mt-4"
                >
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={loadMoreTransactions}
                    className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-lg hover:opacity-90 transition"
                  >
                    Load More
                  </motion.button>
                </motion.div>
              )}
              {!isTransactionLoading && !hasMoreData && (
                <div className="text-center mt-4 text-gray-400">
                  No more data to load
                </div>
              )}
              {/* Popup Modal */}
              {popupContent && (
                <TransactionModal
                  transaction={popupContent}
                  onClose={() => setPopupContent(null)}
                />
              )}
            </div>
          </motion.div>
        </div>
      </div>
      {/* Filter Overlay */}
      {filterOverlay && (
        <FilterOverlay
          filters={filters}
          setFilters={setFilters}
          applyFilters={applyFilters}
          closeOverlay={() => setFilterOverlay(false)}
        />
      )}
    </div>
  );
}
