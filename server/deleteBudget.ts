'use server';

import { PrismaClient } from "@prisma/client";

// Initialize PrismaClient to interact with the database
const prisma = new PrismaClient();

/**
 * Deletes a budget entry for a specific user and category.
 *
 * @param {string} email - The email of the user whose budget should be deleted.
 * @param {number} category_id - The ID of the category for which the budget is being deleted.
 * @returns {boolean} - Returns `true` if the deletion is successful, otherwise `false`.
 */
export default async function deleteBudget(email: string, category_id: number) {
  try {
    // Attempt to delete the budget record matching the provided email and category_id
    await prisma.budget.delete({
      where: {
        email_category_id: {
          email: email,         // Identify the budget by user email
          category_id: category_id, // Identify the budget by category ID
        }
      }
    });

    // Log success message for debugging
    console.log("Budget deleted successfully");

    return true; // Indicate successful deletion
  } catch (error) {
    // Log error if the deletion fails
    console.error("Error deleting budget:", error);
    
    return false; // Indicate failure
  }
}
