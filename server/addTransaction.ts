'use server';

import { PrismaClient } from '@prisma/client';
import calculateCurrentBalance from '@/utils/calculateCurrentBalance';

const prisma = new PrismaClient();

type transactionType = 'credit' | 'debit';

interface TransactionData {
    amount: number;
    transaction_type: transactionType;
    description: string;
    category_id: number;
}

export default async function addTransactions({amount, transaction_type, description,category_id}: TransactionData,email:string) {
    if (!email) {
        return { success: false, message: 'Failed to add transaction' };
    }
    try {
        const currentBalance = await calculateCurrentBalance(email);
        if (!currentBalance.success) {
            return { success: false, message: 'Failed to calculate balance' };
        }
        if (currentBalance.value === undefined) {
            return { success: false, message: 'Current balance is undefined' };
        }
        const balanceValue = Number(currentBalance.value);
        const balance = transaction_type === 'credit' ? balanceValue + Number(amount) : balanceValue - Number(amount);
        await prisma.transaction.create({
            data: {
                amount: amount,
                transaction_type: transaction_type,
                description: description,
                category_id: category_id,
                email: email,
                date_time: new Date(),
                balance: balance, // or calculate the balance as needed
            },
        });
        return { success: true, message: 'Transaction added successfully' };
    } catch (error) {
        console.error('Error adding transaction:', error);
        return { success: false, message: 'Failed to add transaction' };
    }
}