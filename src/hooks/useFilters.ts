import { useState } from "react";

// Define types for transaction types to limit values to "credit", "debit", or an empty string.
export type TransactionType = "credit" | "debit" | "";

// Define the structure of filters with all possible filter options
export interface Filters {
  date: string; // Filter by specific date
  dateType: string; // Type of date filter (e.g., "exact", "range")
  startDate: string; // Start date for range filter
  endDate: string; // End date for range filter
  rangeOption: string; // Option for range filter (e.g., "last 30 days")
  amount: string; // Filter by amount (e.g., "greater than")
  amountType: string; // Type of amount filter (e.g., "greater than", "less than")
  amountRange: string; // Amount range filter (e.g., "5-100")
  minAmount: string; // Minimum amount for filtering
  maxAmount: string; // Maximum amount for filtering
  category: string[]; // List of selected categories for filtering
  transaction_type: TransactionType | ""; // Type of transaction (credit, debit, or empty)
}

// The custom hook for managing filters
export default function useFilters() {
  // State to store the current filter values
  const [filters, setFilters] = useState<Filters>({
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
    transaction_type: "" as TransactionType | "", // Initialize with an empty string
  });

  // Function to reset all filters back to their initial state
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
    return false; // Return false after resetting (could be used for triggering actions externally)
  };

  // Function to check if any filter is active (i.e., has a non-default value)
  const checkActiveFilters = () => {
    return (
      filters.dateType !== "" || // Check if a specific date filter is set
      filters.startDate !== "" || // Check if start date is set for range filter
      filters.endDate !== "" || // Check if end date is set for range filter
      filters.rangeOption !== "" || // Check if a specific range option is selected
      filters.amount !== "" || // Check if amount filter is set
      filters.amountType !== "" || // Check if amount type filter is set
      filters.minAmount !== "0" || // Check if minimum amount is different from default
      filters.maxAmount !== "0" || // Check if maximum amount is different from default
      filters.category.length > 0 || // Check if any category is selected
      filters.transaction_type !== "" // Check if transaction type is set
    );
  };

  // Return the filters state, the function to update filters, and the reset/check functions
  return { filters, setFilters, resetFilters, checkActiveFilters };
}
