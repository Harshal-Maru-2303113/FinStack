"use client";

import { motion } from "framer-motion";
import { FiCalendar, FiFilter } from "react-icons/fi";
import Navigation from "@/components/Navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Transaction } from "@/utils/Calculate";
import { categories } from "@/utils/categories";
import { FaTimes } from "react-icons/fa";
import { getSession } from "next-auth/react";
import getUserTransactions from "@/../server/getUserTransactions";
import TransactionLoading from "@/components/TransactionLoading";

type TransactionType = "credit" | "debit" | "";

export default function TransactionsPage() {
  const [transactionArray, setTransactionArray] = useState<Transaction[]>([]);
  const [popupContent, setPopupContent] = useState<Transaction | null>(null);
  const [hasMoreData, setHasMoreData] = useState(true);
  const [filterOverlay, setFilterOverlay] = useState(false);
  const [isFilterActive, setIsFilterActive] = useState(false);
  const [hasReset,setHasReset] = useState(false);
  const [filters, setFilters] = useState<{
    date: string;
    dateType: string;
    startDate: string;
    endDate: string;
    rangeOption: string;
    amount: string;
    amountType: string;
    amountRange: string;
    minAmount: string;
    maxAmount: string;
    category: string[];
    transaction_type: TransactionType | "";
  }>({
    date: "",
    dateType: "",
    startDate: "",
    endDate: "",
    rangeOption: "",
    amount: "",
    amountType: "",
    amountRange: "",
    minAmount: "0",
    maxAmount: "0",
    category: [],
    transaction_type: "" as TransactionType | "",
  });

  const [isTransactionLoading, setIsTransactionLoading] = useState(true);

  // Check if any filters are active
  const checkActiveFilters = () => {
    return (
      filters.dateType !== "" ||
      filters.startDate !== "" ||
      filters.endDate !== "" ||
      filters.rangeOption !== "" ||
      filters.amount !== "" ||
      filters.amountType !== "" ||
      filters.minAmount !== "0" ||
      filters.maxAmount !== "0" ||
      filters.category.length > 0 ||
      filters.transaction_type !== ""
    );
  };

  const handleCategoryChange = (value: string) => {
    const currentCategories = filters.category;
    if (!currentCategories.includes(value)) {
      const updatedCategories = [...currentCategories, value];
      setFilters({
        ...filters,
        category: updatedCategories,
      });
    }
  };

  useEffect(() => {
    console.dir(filters.category);
  }, [filters]);

  const removeCategory = (value: string) => {
    const currentCategories = filters.category;
    const updatedCategories = currentCategories.filter(
      (item) => item !== value
    );
    setFilters({
      ...filters,
      category: updatedCategories,
    });
  };

  const getTransactionsData = async (
    start: number,
    limit: number,
    email: string
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

  const fetchInitialData = async () => {
    const session = await getSession();
    if (!session) {
      throw new Error("User not authenticated");
    }
    const initialData = await getTransactionsData(0, 10, session.user.email);
    setIsTransactionLoading(false);
    setTransactionArray(initialData);
    setHasMoreData(initialData.length >= 10);
  };

  useEffect(() => {
    fetchInitialData();
  }, [hasReset]);

  const applyFilters = async () => {
    setIsTransactionLoading(true);
    setTransactionArray([]); // Clear existing transactions
    setHasMoreData(true); // Reset hasMoreData state
    await fetchInitialData();
    setFilterOverlay(false);
    setIsFilterActive(checkActiveFilters());
  };

  const resetFilters = () => {
    setFilters({
      date: "",
      dateType: "",
      startDate: "",
      endDate: "",
      rangeOption: "",
      amount: "",
      amountType: "",
      amountRange: "",
      minAmount: "0",
      maxAmount: "0",
      category: [],
      transaction_type: "",
    });
    setIsFilterActive(false);
    setHasReset(e=>!e);
  };

  const loadMoreTransactions = async () => {
    const session = await getSession();
    if (!session) {
      throw new Error("User not authenticated");
    }
    const start = transactionArray.length;
    const newTransactions = await getTransactionsData(
      start,
      10,
      session.user.email
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

  const truncateDescription = (description: string) => {
    const words = description.split(" ");
    if (words.length > 2) {
      return words.slice(0, 2).join(" ") + " ...";
    }
    return description;
  };

  return (
    <div className="flex ">
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
                      onClick={resetFilters}
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
              <div className="overflow-x-auto">
                <table className="w-full overflow-hidden ">
                  <thead>
                    <tr className="text-gray-400 border-b border-gray-800">
                      <th className="py-4 px-4 text-left text-xl">Sr</th>
                      <th className="py-4 px-4 text-left text-xl">Date</th>
                      <th className="py-4 px-4 text-left text-xl">Name</th>
                      <th className="py-4 px-4 text-left text-xl">Category</th>
                      <th className="py-4 px-4 text-right text-xl">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isTransactionLoading ? (
                      <tr>
                        <td>
                          <TransactionLoading items={4} />
                        </td>
                        <td>
                          <TransactionLoading items={4} />
                        </td>
                        <td>
                          <TransactionLoading items={4} />
                        </td>
                        <td>
                          <TransactionLoading items={4} />
                        </td>
                        <td>
                          <TransactionLoading items={4} />
                        </td>
                      </tr>
                    ) : (
                      <></>
                    )}
                    {transactionArray.reverse().map((transaction, index) => (
                      <motion.tr
                        key={transaction.transaction_id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="border-b border-gray-800 hover:bg-gray-800/50 transition-all"
                        onClick={() => setPopupContent(transaction)}
                      >
                        <td className="py-4 px-4 text-gray-300">{index + 1}</td>
                        <td className="py-4 px-4 text-gray-300">
                          <FiCalendar className="inline mr-2" />
                          {new Date(transaction.date_time).toLocaleDateString(
                            "en-GB",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            }
                          )}
                        </td>
                        <td className="py-4 px-4 text-white">
                          {truncateDescription(transaction.description)}
                        </td>
                        <td className="py-4 px-4 text-gray-300">
                          {transaction.category_name}
                        </td>
                        <td
                          className={`py-4 px-4 text-right font-semibold ${
                            transaction.transaction_type === "credit"
                              ? "text-green-500"
                              : "text-red-500"
                          }`}
                        >
                          {transaction.transaction_type === "credit"
                            ? "+"
                            : "-"}
                          ${transaction.amount}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
                {/* Load More Button */}
                {isTransactionLoading ? (
                  <></>
                ) : (
                  <>
                    {hasMoreData ? (
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
                    ) : (
                      <div className="text-center mt-4 text-gray-400">
                        No more data to load
                      </div>
                    )}
                  </>
                )}
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
                          {new Date(popupContent.date_time).toLocaleDateString(
                            "en-GB",
                            {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            }
                          )}
                        </span>
                      </p>
                      <p className="flex items-center gap-4">
                        <span className="font-semibold text-xl text-blue-400">
                          Time:
                        </span>
                        <span className="block text-xl text-gray-200">
                          {new Date(popupContent.date_time).toLocaleTimeString(
                            "en-US",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true,
                            }
                          )}
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
                        <span
                          className={`block text-xl ${
                            popupContent.transaction_type === "credit"
                              ? "text-green-400"
                              : "text-red-400"
                          }`}
                        >
                          ${Number(popupContent.amount).toFixed(2)}
                        </span>
                      </p>
                      <p>
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
            {/* Filter Overlay */}
            {filterOverlay && (
              <div
                className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
                onClick={() => setFilterOverlay(false)}
              >
                <div
                  className="bg-gray-800 p-6 rounded-xl border border-gray-700 max-w-md w-full mx-4"
                  onClick={(e) => e.stopPropagation()}
                >
                  <h3 className="text-2xl font-bold text-white mb-4">
                    Apply Filters
                  </h3>
                  <div className="space-y-4">
                    {/* Date Options */}
                    <select
                      className="w-full p-2 bg-gray-700 text-white rounded-lg"
                      value={filters.dateType}
                      onChange={(e) =>
                        setFilters({ ...filters, dateType: e.target.value })
                      }
                    >
                      <option value="">Date Options</option>
                      <option value="single">Single</option>
                      <option value="range">Range</option>
                      <option value="custom">Custom</option>
                    </select>

                    {filters.dateType === "single" && (
                      <input
                        type="date"
                        className="w-full p-2 bg-gray-700 text-white rounded-lg"
                        value={filters.startDate}
                        onChange={(e) =>
                          setFilters({ ...filters, startDate: e.target.value })
                        }
                        placeholder="Date"
                      />
                    )}

                    {filters.dateType === "range" && (
                      <select
                        className="w-full p-2 bg-gray-700 text-white rounded-lg"
                        value={filters.rangeOption}
                        onChange={(e) =>
                          setFilters({
                            ...filters,
                            rangeOption: e.target.value,
                          })
                        }
                      >
                        <option value="">Select Range</option>
                        <option value="lastHour">Last Hour</option>
                        <option value="lastDay">Last Day</option>
                        <option value="lastWeek">Last Week</option>
                        <option value="lastMonth">Last Month</option>
                        <option value="lastYear">Last Year</option>
                      </select>
                    )}

                    {filters.dateType === "custom" && (
                      <div className="flex gap-4">
                        <input
                          type="date"
                          className="w-1/2 p-2 bg-gray-700 text-white rounded-lg"
                          value={filters.startDate}
                          onChange={(e) =>
                            setFilters({
                              ...filters,
                              startDate: e.target.value,
                            })
                          }
                          placeholder="Start Date"
                        />
                        <input
                          type="date"
                          className="w-1/2 p-2 bg-gray-700 text-white rounded-lg"
                          value={filters.endDate}
                          onChange={(e) =>
                            setFilters({ ...filters, endDate: e.target.value })
                          }
                          placeholder="End Date"
                        />
                      </div>
                    )}

                    {/* Amount Options */}
                    <select
                      className="w-full p-2 bg-gray-700 text-white rounded-lg"
                      value={filters.amountType}
                      onChange={(e) =>
                        setFilters({ ...filters, amountType: e.target.value })
                      }
                    >
                      <option value="">Amount Options</option>
                      <option value="single">Single</option>
                      <option value="range">Range</option>
                    </select>

                    {filters.amountType === "single" && (
                      <input
                        type="number"
                        className="w-full p-2 bg-gray-700 text-white rounded-lg"
                        value={filters.amount}
                        onChange={(e) =>
                          setFilters({ ...filters, amount: e.target.value })
                        }
                        placeholder="Amount"
                      />
                    )}

                    {filters.amountType === "range" && (
                      <div className="flex gap-4">
                        <input
                          type="number"
                          className="w-1/2 p-2 bg-gray-700 text-white rounded-lg"
                          value={filters.minAmount}
                          onChange={(e) =>
                            setFilters({
                              ...filters,
                              minAmount: e.target.value,
                            })
                          }
                          placeholder="Min Amount"
                        />
                        <input
                          type="number"
                          className="w-1/2 p-2 bg-gray-700 text-white rounded-lg"
                          value={filters.maxAmount}
                          onChange={(e) =>
                            setFilters({
                              ...filters,
                              maxAmount: e.target.value,
                            })
                          }
                          placeholder="Max Amount"
                        />
                      </div>
                    )}

                    {/* Category and Type */}
                    <select
                      className="w-full p-2 bg-gray-700 text-white rounded-lg appearance-none transition-all duration-300 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value="" // Prevent default selection
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                        handleCategoryChange(e.target.value)
                      }
                    >
                      <option value="">Select Categories</option>
                      {categories.map((category) => (
                        <option
                          key={category.category_id}
                          value={category.name}
                          disabled={filters.category.includes(category.name)}
                        >
                          {category.name}
                        </option>
                      ))}
                    </select>

                    {/* Display selected categories as tags */}
                    {filters.category && (
                      <div className="mt-2 flex flex-wrap gap-2">
                        {filters.category.map((selectedCategory) => (
                          <span
                            key={selectedCategory}
                            className="bg-blue-600 text-white px-3  rounded-full flex justify-center items-center shadow-md transition-transform transform hover:scale-105"
                          >
                            {selectedCategory}
                            <button
                              className="ml-2 text-xs text-white bg-red-500 rounded-full h-1/2 p-1 transition-colors duration-300 hover:bg-red-700"
                              onClick={() => removeCategory(selectedCategory)}
                            >
                              <FaTimes className="mb-[1.375rem] text-xs" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                    <select
                      className="w-full p-2 bg-gray-700 text-white rounded-lg"
                      value={filters.transaction_type}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          transaction_type: e.target.value as TransactionType,
                        })
                      }
                    >
                      <option value="">All Types</option>
                      <option value="credit">Credit</option>
                      <option value="debit">Debit</option>
                    </select>
                  </div>
                  <button
                    onClick={applyFilters}
                    className="mt-4 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:opacity-90 transition"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
