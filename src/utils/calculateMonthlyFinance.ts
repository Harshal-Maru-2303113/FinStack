"use server";
import { PrismaClient } from '@prisma/client';

// Initialize Prisma Client to interact with the database
const prisma = new PrismaClient();

// Function to calculate the monthly income and expense for a given user's email
const calculateMonthlyFinance = async (email: string) => {
  try {
    // Get the current date
    const now = new Date();

    // Calculate the date 30 days ago from the current date
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(now.getDate() - 30); // Subtract 30 days from the current date

    // Fetch all transactions for the given email within the last 30 days
    const transactions = await prisma.transaction.findMany({
      where: {
        email: email, // Filter transactions by the user's email
        date_time: {
          gte: thirtyDaysAgo, // Only consider transactions with date_time greater than or equal to 30 days ago
        },
      },
    });

    console.dir(transactions); // Log the fetched transactions (for debugging purposes)

    // Calculate the total income (sum of 'credit' transactions)
    const totalIncome = transactions.reduce((acc, transaction) => {
      if (transaction.transaction_type === 'credit') {
        // Add the amount for 'credit' transactions to the accumulator
        return acc + Number(transaction.amount);
      }
      return acc; // Skip 'debit' transactions
    }, 0);

    // Calculate the total expense (sum of 'debit' transactions)
    const totalExpense = transactions.reduce((acc, transaction) => {
      if (transaction.transaction_type === 'debit') {
        // Add the amount for 'debit' transactions to the accumulator
        return acc + Number(transaction.amount);
      }
      return acc; // Skip 'credit' transactions
    }, 0);

    // Return the total income and expense, rounded to 2 decimal places
    return {
      totalIncome: Number(totalIncome.toFixed(2)),
      totalExpense: Number(totalExpense.toFixed(2)),
    };
  } catch (error) {
    // In case of an error, log it and return default values (0 for income and expense)
    console.log(error);
    return { totalIncome: 0, totalExpense: 0 };
  }
};

export default calculateMonthlyFinance;
