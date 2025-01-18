'use server';

import { PrismaClient } from '@prisma/client';
import calculateCurrentBalance from '@/utils/calculateCurrentBalance';

// Initialize PrismaClient to interact with the database
const prisma = new PrismaClient();

// Define allowed transaction types
type transactionType = 'credit' | 'debit';

// Define the structure of transaction data
interface TransactionData {
    amount: number;          // Amount of the transaction
    transaction_type: transactionType; // Type: 'credit' (income) or 'debit' (expense)
    description: string;     // Description of the transaction
    category_id: number;     // Category ID the transaction belongs to
}

/**
 * Adds a new transaction to the database while maintaining balance integrity.
 *
 * @param {TransactionData} transactionData - The details of the transaction
 * @param {string} email - The email of the user making the transaction
 * @returns An object indicating success or failure, including a message and transaction timestamp if successful.
 */
export default async function addTransactions(
    { amount, transaction_type, description, category_id }: TransactionData,
    email: string
) {
    // Validate input: Ensure an email is provided
    if (!email) {
        return { success: false, message: 'Failed to add transaction' };
    }

    try {
        // Retrieve the user's current balance
        const currentBalance = await calculateCurrentBalance(email);

        // Check if balance retrieval was successful
        if (!currentBalance.success) {
            return { success: false, message: 'Failed to calculate balance' };
        }

        // Ensure the balance value is defined
        if (currentBalance.value === undefined) {
            return { success: false, message: 'Current balance is undefined' };
        }

        // Convert balance to a number and compute the new balance after the transaction
        const balanceValue = Number(currentBalance.value);
        const balance =
            transaction_type === 'credit'
                ? balanceValue + Number(amount) // Increase balance for credits
                : balanceValue - Number(amount); // Decrease balance for debits

        // Store the transaction in the database
        const res = await prisma.transaction.create({
            data: {
                amount: amount,               // Transaction amount
                transaction_type: transaction_type, // 'credit' or 'debit'
                description: description,     // Description of the transaction
                category_id: category_id,     // Category ID
                email: email,                 // User email
                date_time: new Date(),        // Timestamp of transaction creation
                balance: balance,             // Updated balance after the transaction
            },
        });

        // Return success response with transaction timestamp
        return { success: true, message: 'Transaction added successfully', date_time: res.date_time };
    } catch (error) {
        // Log the error and return failure response
        console.error('Error adding transaction:', error);
        return { success: false, message: 'Failed to add transaction' };
    }
}
