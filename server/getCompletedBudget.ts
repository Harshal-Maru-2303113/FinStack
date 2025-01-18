"use server";

import { PrismaClient } from "@prisma/client";

const prisma: PrismaClient = new PrismaClient();

export type CompletedBudget = {
  id: number;
  email: string;
  category_id: number;
  budget_amount: number;
  amount_spent: number;
  valid_until: Date;
};

// Function to fetch completed budget data for a given email from the database
export default async function getCompletedBudget(email: string) {
  // Check if the email is provided, log an error and return empty data if not
  if (!email) {
    console.error("Email is required"); // Log error if email is missing
    return { success: false, data: [] as CompletedBudget[] }; // Return failure response with empty data
  }

  try {
    // Attempt to fetch all completed budget entries from the database where the email matches
    const budgets = await prisma.completedBudget.findMany({
      where: {
        email: email, // Filter by email
      },
    });

    // Map over the fetched budgets to convert Decimal fields to numbers for easier use
    const budgetData = budgets.map((budget) => ({
      ...budget, // Spread the original budget properties
      budget_amount: budget.budget_amount.toNumber(), // Convert Decimal to number for budget amount
      amount_spent: budget.amount_spent.toNumber(), // Convert Decimal to number for amount spent
    }));

    // Return success response with formatted budget data
    return { success: true, data: budgetData };
  } catch (error) {
    // Log any errors that occur during the database query
    console.error("Error fetching budget data:", error);

    // Return failure response with empty data in case of an error
    return { success: false, data: [] as CompletedBudget[] };
  }
}
