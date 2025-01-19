"use client";

// Import necessary React hooks and components.
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
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

// Define the shape of the data to be fetched (transactions, email, filters, etc.)
type FetchDataProps = {
  start: number;
  limit: number;
  email: string;
  filters: Filters;
};

export default function TransactionsPage() {
  // State variables to manage transactions, popup, filters, loading states, etc.
  const [transactionArray, setTransactionArray] = useState<Transaction[]>([]);
  const [popupContent, setPopupContent] = useState<Transaction | null>(null);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [filterOverlay, setFilterOverlay] = useState(false);
  const { filters, setFilters, checkActiveFilters, resetFilters } = useFilters();
  const [isTransactionLoading, setIsTransactionLoading] = useState(true);
  const [isFilterActive, setIsFilterActive] = useState(false);
  const [hasReset, setHasReset] = useState(false);

  // Function to fetch transactions from the server with applied filters
  const fetchTransactions = async ({ start, limit, email, filters }: FetchDataProps) => {
    try {
      const response = await getUserTransactions(email, start, limit, filters); // Call the API to get the data
      if (response.success) {
        toast.success("Transactions fetched successfully!"); // Notify success
        return response.data;
      }
      toast.error(response.message); // If failure, show the error message
      return [];
    } catch (error) {
      console.error("Error fetching transactions:", error);
      toast.error("An error occurred while fetching transactions."); // Notify error if request fails
      return [];
    }
  };

  // Fetch the initial set of transactions after the page loads
  const fetchInitialData = async () => {
    setIsTransactionLoading(true); // Start loading
    const session = await getSession(); // Get the current session (user)
    if (!session) {
      toast.error("User not authenticated"); // Handle unauthenticated user
      return;
    }

    // Fetch transactions with initial filters and update the state with the results
    const data = await fetchTransactions({
      start: 0,
      limit: 10,
      email: session.user.email,
      filters,
    });
    setTransactionArray(data);
    setHasMoreData(data.length >= 10); // Determine if there are more transactions
    setIsTransactionLoading(false); // End loading
  };

  // Run the initial data fetch on component mount or when filters are reset
  useEffect(() => {
    fetchInitialData();
  }, [hasReset]); // Trigger fetchInitialData when hasReset state changes (e.g., after resetting filters)

  // Load more transactions when the user scrolls or clicks the "Load More" button
  const loadMoreTransactions = async () => {
    const session = await getSession(); // Get the current session (user)
    if (!session) {
      toast.error("User not authenticated"); // Handle unauthenticated user
      return;
    }
    const newTransactions = await fetchTransactions({
      start: transactionArray.length, // Start from where we left off
      limit: 10, // Limit the number of transactions to fetch
      email: session.user.email,
      filters,
    });

    // If new transactions are fetched, update the state and check if more data exists
    if (newTransactions.length > 0) {
      toast.success("More transactions fetched successfully!");
      setTransactionArray((prev) => [...prev, ...newTransactions]);
      if (newTransactions.length < 10) setHasMoreData(false); // No more data to load
    } else {
      setHasMoreData(false); // No more data available
      toast.info("No more transactions to fetch.");
    }
  };

  // Apply filters and fetch filtered data
  const applyFilters = async () => {
    setIsFilterActive(checkActiveFilters()); // Check if any filters are active
    await fetchInitialData(); // Fetch data with new filters
    setFilterOverlay(false); // Close the filter overlay
  };

  // Reset the applied filters and fetch data again
  const resetFilterHandler = () => {
    resetFilters(); // Reset the filters
    setIsFilterActive(false); // Disable the filter active state
    setHasReset((prev) => !prev); // Toggle the reset state to trigger re-fetch
  };

  return (
    <div className="flex">
       <ToastContainer autoClose={2000} /> {/* Display toast notifications */}
      <Navigation /> {/* Navigation component */}
      <div className="flex-1 md:ml-64 p-4">
        <div className="p-4 md:p-6 lg:p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-[1400px] mx-auto"
          >
            {/* Main content for displaying transactions */}
            <div className="bg-gray-900 rounded-2xl shadow-xl p-6 space-y-6 overflow-hidden">
              {/* Header with Filter button and New Transaction button */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                  Transactions
                </h1>
                <div className="flex gap-3">
                  {/* Filter button */}
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <motion.button
                      className={`relative px-4 py-2 rounded-lg transition-all duration-300 ease-in-out ${
                        isFilterActive
                          ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white"
                          : "bg-gray-800 text-white hover:bg-gray-700"
                      }`}
                      onClick={() => setFilterOverlay(true)} // Open filter overlay when clicked
                    >
                      <div className="flex items-center">
                        <FiFilter className="inline mr-2" /> Filter
                        {/* Show active filter indicator */}
                        {isFilterActive && (
                          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="ml-2 w-2 h-2 bg-white rounded-full" />
                        )}
                      </div>
                    </motion.button>
                  </motion.div>

                  {/* Reset button */}
                  {isFilterActive && (
                    <motion.button
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                      onClick={resetFilterHandler}
                    >
                      Reset
                    </motion.button>
                  )}
                  {/* New Transaction button */}
                  <Link href={"/addtransactions"}>
                    <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-lg hover:opacity-90 transition">
                      + New Transaction
                    </button>
                  </Link>
                </div>
              </div>

              {/* Transaction Table */}
              <TransactionTable
                transactions={transactionArray}
                isLoading={isTransactionLoading}
                onRowClick={setPopupContent} // Show transaction details on row click
              />

              {/* Load More button */}
              {!isTransactionLoading && hasMoreData && (
                <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="text-center mt-4">
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

              {/* Message when no more data is available */}
              {!isTransactionLoading && !hasMoreData && (
                <div className="text-center mt-4 text-gray-400">
                  No more data to load
                </div>
              )}

              {/* Transaction modal for displaying details */}
              {popupContent && (
                <TransactionModal
                  transaction={popupContent}
                  onClose={() => setPopupContent(null)} // Close modal
                />
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Filter overlay component */}
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
