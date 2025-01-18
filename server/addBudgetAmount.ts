'use server';

import { PrismaClient } from '@prisma/client';
import { sendBudget100, sendBudget50 } from './emailService';
import deleteBudget from './deleteBudget';
import addCompletedBudget from './addCompletedBudget';

// Initialize a PrismaClient instance to interact with the database
const prisma = new PrismaClient();

// Define the allowed transaction types
type transactionType = 'credit' | 'debit';

/**
 * Adds a budget amount to a user's spending, updates budget tracking, 
 * and sends notifications when spending thresholds are met.
 * 
 * @param amount - The amount spent in the transaction
 * @param transaction_type - Either 'credit' or 'debit'
 * @param category_id - The category the transaction belongs to
 * @param date_time - The timestamp of the transaction
 * @param email - The user's email (must be provided)
 * @param category - The category name for notifications
 * @returns An object indicating success or failure with a message
 */
export default async function addBudgetAmount(
    amount: number, 
    transaction_type: transactionType, 
    category_id: number, 
    date_time: Date, 
    email: string, 
    category: string
) {
    // Ensure the email is provided; otherwise, return an error response
    if (!email) {
        return { success: false, message: 'Failed to add transaction' };
    }

    try {
        // Only process if the transaction is a 'debit' (spending money)
        if (transaction_type === 'debit') {
            // Fetch existing budgets for the user in the given category
            const budgets = await prisma.budget.findMany({
                where: {
                    email: email,
                    category_id: category_id
                },
            });

            // Check if the user has an active budget in this category
            if (budgets.length > 0) {
                console.dir(budgets);

                // Ensure the transaction date falls within the budget's validity period
                if (date_time >= budgets[0].created_at && date_time <= budgets[0].valid_until) {
                    
                    // Update the budget with the new spending amount
                    const updatedBudgets = await prisma.budget.update({
                        data: {
                            amount_spent: Number(budgets[0].amount_spent) + Number(amount)
                        },
                        where: {
                            email_category_id: {
                                email: email,
                                category_id: Number(category_id)
                            }
                        }
                    });

                    console.dir(updatedBudgets);

                    // If the budget was successfully updated, check threshold alerts
                    if (updatedBudgets) {
                        // If spending reaches 50% and an email hasn't been sent yet
                        if (Number(updatedBudgets.amount_spent) / Number(updatedBudgets.budget_amount) >= 0.5 && !updatedBudgets.emailSent50) {
                            const emailSent50 = await sendBudget50(
                                email, 
                                category, 
                                Number(updatedBudgets.budget_amount), 
                                Number(updatedBudgets.amount_spent), 
                                updatedBudgets.valid_until
                            );

                            // Mark the email as sent if successfully delivered
                            if (emailSent50) {
                                await prisma.budget.update({
                                    data: { emailSent50: true },
                                    where: {
                                        email_category_id: {
                                            email: email,
                                            category_id: category_id
                                        }
                                    }
                                });
                            }
                        }

                        // If spending reaches 100% and an email hasn't been sent yet
                        if (Number(updatedBudgets.amount_spent) / Number(updatedBudgets.budget_amount) >= 1 && !updatedBudgets.emailSent100) {
                            const emailSent100 = await sendBudget100(
                                email, 
                                category, 
                                Number(updatedBudgets.budget_amount), 
                                Number(updatedBudgets.amount_spent), 
                                updatedBudgets.valid_until
                            );

                            if (emailSent100) {
                                // Move the budget to the completed budgets table
                                const completedBudget = await addCompletedBudget(
                                    email, 
                                    category_id, 
                                    Number(updatedBudgets.budget_amount), 
                                    Number(updatedBudgets.amount_spent), 
                                    updatedBudgets.valid_until
                                );

                                if (completedBudget) {
                                    console.log("Budget completed");
                                }

                                // Delete the budget since it has been fully utilized
                                const budgetDeleted = await deleteBudget(email, category_id);
                                if (budgetDeleted) {
                                    console.log("Budget deleted");
                                }
                            }
                        }
                    }

                    return { success: true, message: 'Budget updated successfully' };
                }
                // If the transaction date is beyond the budget's valid period
                else if (date_time >= budgets[0].valid_until) {
                    // Move the expired budget to the completed budgets table
                    const completedBudget = await addCompletedBudget(
                        email, 
                        category_id, 
                        Number(budgets[0].budget_amount), 
                        Number(budgets[0].amount_spent), 
                        budgets[0].valid_until
                    );

                    if (completedBudget) {
                        console.log("Budget completed due to expiration");
                    }

                    // Delete the expired budget
                    const budgetDeleted = await deleteBudget(email, category_id);
                    if (budgetDeleted) {
                        console.log("Expired budget deleted");
                    }

                    return { success: true, message: 'Budget expired and archived' };
                }
            }
        }
        
        // If no budget exists for the user in this category, return an error message
        return { success: false, message: 'No budget found' };

    } catch (error) {
        console.error('Error adding transaction:', error);
        return { success: false, message: 'Failed to add Budget' };
    }
}
