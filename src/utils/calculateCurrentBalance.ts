'use server';

import { PrismaClient } from '@prisma/client';

// Initialize Prisma Client to interact with the database
const prisma = new PrismaClient();

// Function to calculate the current balance for a given user email
export default async function calculateCurrentBalance(email: string) {
  // Check if email is provided; if not, return an error message
  if (!email) {
    return { success: false, message: 'Failed to calculate balance' };
  }

  try {
    // Fetch the latest transaction for the provided email
    const latestTransaction = await prisma.transaction.findFirst({
      where: {
        email: email, // Filter by the user's email
      },
      orderBy: {
        date_time: 'desc', // Order transactions by date in descending order to get the most recent one
      },
    });

    console.log(latestTransaction); // Log the fetched transaction (for debugging)

    // If no transactions are found for the given email, return a message with a balance of 0
    if (!latestTransaction) {
      return { success: true, message: 'No transactions found', value: 0 };
    }

    // Return a successful response with the balance from the latest transaction
    return { success: true, message: 'Balance calculated successfully', value: latestTransaction.balance };
  } catch (error) {
    // If an error occurs while fetching the data, log the error and return a failure message
    console.error('Error calculating balance:', error);
    return { success: false, message: 'Failed to calculate balance' };
  }
};
