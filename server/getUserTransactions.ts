"use server";

import { PrismaClient } from "@prisma/client"; // Import PrismaClient for database interaction
import { Transaction } from "@/types/Transaction"; // Import the custom Transaction type
import { categories } from "@/utils/categories"; // Import categories data for category mapping
const prisma = new PrismaClient(); // Initialize Prisma client

// Define the types for transaction types
type TransactionType = "credit" | "debit";

// Interface defining the possible filters for transactions
interface filter {
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
  category: string[]; // Array of category names to filter by
  transaction_type: TransactionType | ""; // Transaction type filter (credit/debit)
}

// The main function to fetch user transactions with applied filters
export default async function getUserTransactions(
  email: string,  // Email of the user to filter transactions
  start: number,  // Pagination: starting point of the data
  items: number | undefined,  // Pagination: number of items to fetch
  filters: filter  // Various filters (date, amount, category, etc.)
) {
  try {
    // Initialize the filter object with the required `email`
    const filterConditions: {
      email: string; // Ensure transactions are for the given email
      date_time?: { lte?: Date; gte?: Date }; // Date filters
      amount?: number | { gte?: number; lte?: number }; // Amount filters
      category_id?: { in: number[] }; // Category filter
      transaction_type?: TransactionType; // Transaction type filter (credit/debit)
    } = {
      email: email,
    };

    // Date filters logic
    if (filters.dateType) {
      // Single date filter
      if (filters.dateType === "single" && filters.startDate) {
        filterConditions.date_time = {
          gte: new Date(filters.startDate),
          lte: new Date(filters.startDate),
        };
      }

      // Date range filter based on predefined options
      if (filters.dateType === "range" && filters.rangeOption) {
        const now = new Date();
        switch (filters.rangeOption) {
          case "lastHour":
            filterConditions.date_time = {
              gte: new Date(now.getTime() - 3600 * 1000), // 1 hour ago
            };
            break;
          case "lastDay":
            filterConditions.date_time = {
              gte: new Date(now.getTime() - 24 * 3600 * 1000), // 1 day ago
            };
            break;
          case "lastWeek":
            filterConditions.date_time = {
              gte: new Date(now.getTime() - 7 * 24 * 3600 * 1000), // 1 week ago
            };
            break;
          case "lastMonth":
            filterConditions.date_time = {
              gte: new Date(now.setMonth(now.getMonth() - 1)), // 1 month ago
            };
            break;
          case "lastYear":
            filterConditions.date_time = {
              gte: new Date(now.setFullYear(now.getFullYear() - 1)), // 1 year ago
            };
            break;
          default:
            break;
        }
      }

      // Custom date range filter
      if (
        filters.dateType === "custom" &&
        filters.startDate &&
        filters.endDate
      ) {
        filterConditions.date_time = {
          gte: new Date(filters.startDate),
          lte: new Date(filters.endDate),
        };
      }
    }

    // Amount filters logic
    if (filters.amountType) {
      // Single amount filter
      if (filters.amountType === "single" && filters.amount) {
        filterConditions.amount = parseFloat(filters.amount);
      }

      // Amount range filter
      if (
        filters.amountType === "range" &&
        filters.minAmount &&
        filters.maxAmount
      ) {
        filterConditions.amount = {
          gte: parseFloat(filters.minAmount),
          lte: parseFloat(filters.maxAmount),
        };
      }
    }

    // Category filter logic
    if (filters.category && filters.category.length > 0) {
      // Map category names to category IDs for filtering
      const categoryIds = filters.category.map(categoryName => {
        const category = categories.find(cat => cat.name === categoryName);
        return category ? category.category_id : null;
      }).filter(id => id !== null);

      if (categoryIds.length > 0) {
        filterConditions.category_id = {
          in: categoryIds, // Filter transactions by category IDs
        };
      }
    }

    // Transaction type filter
    if (filters.transaction_type) {
      filterConditions.transaction_type = filters.transaction_type;
    }

    // Fetch transactions from the database using Prisma
    const rawTransactions = await prisma.transaction.findMany({
      where: filterConditions, // Apply filters
      skip: start,  // Apply pagination: skip `start` records
      take: items,  // Limit number of records to fetch
      orderBy: {
        date_time: "desc",  // Order by transaction date, most recent first
      },
      include: {
        category: true,  // Include category details for each transaction
      },
    });

    // Map raw transaction data to the desired structure with category names
    const transactions: Transaction[] = rawTransactions.map((t) => {
      // Find the category name from the categories array based on category ID
      const category = categories.find(cat => cat.category_id === t.category_id);
      const categoryName = category ? category.name : "Unknown";

      return {
        transaction_id: t.transaction_id,
        email: t.email,
        date_time: t.date_time,
        amount: t.amount.toString(),  // Convert amount to string
        transaction_type: t.transaction_type,
        description: t.description,
        balance: t.balance.toString(), // Convert balance to string
        category_id: t.category_id,
        category_name: categoryName,  // Map category name
      };
    });

    // Return response with either success or error message
    if (!transactions || transactions.length === 0) {
      return {
        success: false,
        message: "No transactions found",  // No transactions matching the filters
        data: [] as Transaction[], // Return empty transaction array
      };
    }

    // Successful response with transactions data
    return {
      success: true,
      message: "Transactions found",  // Transactions found
      data: transactions as Transaction[],  // Return mapped transactions
    };
  } catch (error) {
    console.log(error);  // Log any errors
    return {
      success: false,
      message: "Failed to fetch transactions",  // Return failure message
      data: [] as Transaction[],  // Return empty transaction array in case of failure
    };
  }
}

// Export the filter interface for external use
export type { filter };
