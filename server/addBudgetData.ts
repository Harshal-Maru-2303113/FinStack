"use server";

import { PrismaClient } from "@prisma/client";
import { budgetData } from "@/types/BudgetData";
import { Decimal } from "@prisma/client/runtime/library";

// Initialize PrismaClient for database operations
const prisma: PrismaClient = new PrismaClient();

/**
 * Adds a new budget entry to the database.
 * 
 * @param email - The email of the user creating the budget
 * @param category_id - The category ID the budget belongs to
 * @param budget_amount - The total budget amount allocated
 * @param amount_spent - The amount already spent (default can be 0)
 * @param valid_until - The expiration date of the budget
 * @returns A success or failure response with an appropriate message
 */
export default async function addBudgetData({
  email,
  category_id,
  budget_amount,
  amount_spent,
  valid_until,
}: budgetData) {
  
  // Input validation: Ensure all required fields are provided
  if (
    !email ||          // User email must be provided
    !category_id ||    // Category ID must be provided
    !budget_amount ||  // Budget amount must be specified
    amount_spent === undefined || // Amount spent must not be undefined
    !valid_until       // Expiry date must be valid
  ) {
    console.error("Invalid Input:", { email, category_id, budget_amount, amount_spent, valid_until });
    return { success: false, message: "Invalid input parameters" };
  }

  try {
    // Log the received payload for debugging purposes
    console.log("Received Payload:", { email, category_id, budget_amount, amount_spent, valid_until });

    // Create a new budget entry in the database
    await prisma.budget.create({
      data: {
        email: email, // Assign user email
        category_id: Number(category_id), // Convert category ID to a number
        budget_amount: new Decimal(budget_amount), // Convert budget amount to Prisma's Decimal type
        amount_spent: new Decimal(amount_spent), // Convert amount spent to Decimal
        valid_until: new Date(valid_until), // Ensure the valid_until is stored as a Date
      },
    });

    return { success: true, message: "Budget added successfully" };
  } catch (error: unknown) {
    // Handle errors gracefully and differentiate Prisma-specific errors
    if (error instanceof Error) {
      console.error("Prisma Error:", error.message);
    } else {
      console.error("Unexpected Error:", error);
    }
    return { success: false, message: "Budget not added!" };
  }
}
