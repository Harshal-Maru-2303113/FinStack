import { useState } from "react";

export type TransactionType = "credit" | "debit" | "";

export interface Filters {
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
}

export default function useFilters() {
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
    transaction_type: "" as TransactionType | "",
  });

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
    return false;
  };

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


  return { filters, setFilters, resetFilters, checkActiveFilters };
}