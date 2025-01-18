"use server";

import { PrismaClient } from "@prisma/client";

// Initialize PrismaClient for database operations
const prisma: PrismaClient = new PrismaClient();

/**
 * Adds a completed budget entry to the database when a budget is fully used or expired.
 *
 * @param email - The email of the user to whom the budget belongs
 * @param category_id - The category ID associated with the budget
 * @param budget_amount - The original allocated budget amount
 * @param amount_spent - The total amount spent from the budget
 * @param valid_until - The expiration date of the budget
 * @returns A success or failure response with an appropriate message
 */
export default async function addCompletedBudget(
  email: string,
  category_id: number,
  budget_amount: number,
  amount_spent: number,
  valid_until: Date
) {
  // Input validation: Ensure the email is provided (other parameters are assumed to be passed correctly)
  if (!email) {
    console.error("Invalid input:", { email });
    return { success: false, message: "Invalid input parameters" };
  }

  try {
    // Log the received data for debugging and tracking purposes
    console.log("Received Payload:", { email, category_id, budget_amount, amount_spent, valid_until });

    // Insert the completed budget record into the database
    await prisma.completedBudget.create({
      data: {
        email: email,             // Assign the user's email
        category_id: category_id, // Store the category ID of the budget
        budget_amount: budget_amount, // Original budget amount
        amount_spent: amount_spent,   // Total amount spent
        valid_until: valid_until,     // Store the budget expiration date
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
