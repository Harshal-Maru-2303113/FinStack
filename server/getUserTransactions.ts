"use server";

import { PrismaClient } from "@prisma/client";
import { Transaction } from "@/types/Transaction";
import { categories } from "@/utils/categories";
const prisma = new PrismaClient();

type TransactionType = "credit" | "debit";
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
  category: string[];
  transaction_type: TransactionType | "";
}

export default async function getUserTransactions(
  email: string,
  start: number,
  items: number | undefined,
  filters: {
    date?: string;
    dateType?: string;
    startDate?: string;
    endDate?: string;
    rangeOption?: string;
    amount?: string;
    amountType?: string;
    amountRange: string;
    minAmount?: string;
    maxAmount?: string;
    category?: string[];
    transaction_type?: TransactionType | "";
  }
) {
  try {
    // Build dynamic filter object
    const filterConditions: {
      email: string;
      date_time?: { lte?: Date; gte?: Date };
      amount?: number | { gte?: number; lte?: number };
      category_id?: { in: number[] };
      transaction_type?: TransactionType;
    } = {
      email: email,
    };

    // Date filters
    if (filters.dateType) {
      if (filters.dateType === "single" && filters.startDate) {
        filterConditions.date_time = {
          gte: new Date(filters.startDate),
          lte: new Date(filters.startDate),
        };
      }

      if (filters.dateType === "range" && filters.rangeOption) {
        const now = new Date();
        switch (filters.rangeOption) {
          case "lastHour":
            filterConditions.date_time = {
              gte: new Date(now.getTime() - 3600 * 1000),
            };
            break;
          case "lastDay":
            filterConditions.date_time = {
              gte: new Date(now.getTime() - 24 * 3600 * 1000),
            };
            break;
          case "lastWeek":
            filterConditions.date_time = {
              gte: new Date(now.getTime() - 7 * 24 * 3600 * 1000),
            };
            break;
          case "lastMonth":
            filterConditions.date_time = {
              gte: new Date(now.setMonth(now.getMonth() - 1)),
            };
            break;
          case "lastYear":
            filterConditions.date_time = {
              gte: new Date(now.setFullYear(now.getFullYear() - 1)),
            };
            break;
          default:
            break;
        }
      }

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

    // Amount filters
    if (filters.amountType) {
      if (filters.amountType === "single" && filters.amount) {
        filterConditions.amount = parseFloat(filters.amount);
      }

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

    // Category filter
    if (filters.category && filters.category.length > 0) {
      // Map category names to category IDs
      const categoryIds = filters.category.map(categoryName => {
        const category = categories.find(cat => cat.name === categoryName);
        return category ? category.category_id : null;
      }).filter(id => id !== null);

      if (categoryIds.length > 0) {
        filterConditions.category_id = {
          in: categoryIds,
        };
      }
    }

    // Type filter
    if (filters.transaction_type) {
      filterConditions.transaction_type = filters.transaction_type;
    }

    // Fetch transactions with applied filters
    const rawTransactions = await prisma.transaction.findMany({
      where: filterConditions,
      skip: start,
      take: items,
      orderBy: {
        date_time: "desc",
      },
      include: {
        category: true,
      },
    });

    // Map results with correct category names
    const transactions: Transaction[] = rawTransactions.map((t) => {
      // Find the category name from the categories array
      const category = categories.find(cat => cat.category_id === t.category_id);
      const categoryName = category ? category.name : "Unknown";

      return {
        transaction_id: t.transaction_id,
        email: t.email,
        date_time: t.date_time,
        amount: t.amount.toString(),
        transaction_type: t.transaction_type,
        description: t.description,
        balance: t.balance.toString(),
        category_id: t.category_id,
        category_name: categoryName,
      };
    });

    if (!transactions || transactions.length === 0) {
      return {
        success: false,
        message: "No transactions found",
        data: [] as Transaction[],
      };
    }

    return {
      success: true,
      message: "Transactions found",
      data: transactions as Transaction[],
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      message: "Failed to fetch transactions",
      data: [] as Transaction[],
    };
  }
}

export type { filter };