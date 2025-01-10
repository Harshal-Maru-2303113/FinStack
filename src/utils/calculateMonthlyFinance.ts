"use server"
import {PrismaClient} from '@prisma/client';

const prisma = new PrismaClient();

const calculateMonthlyFinance = async (email:string) => {
    try {
        const now = new Date();
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(now.getDate() - 30); // Subtract 30 days from the current date
        const transactions = await prisma.transaction.findMany({
            where: {
                email: email,
                date_time: {
                    gte: thirtyDaysAgo,
                },
            },
        });
        console.dir(transactions);
        const totalIncome = transactions.reduce((acc, transaction) => {
            if (transaction.transaction_type === 'credit') {
                return acc + Number(transaction.amount);
            }
            return acc;
        }, 0);
        const totalExpense = transactions.reduce((acc, transaction) => {
            if (transaction.transaction_type === 'debit') {
                return acc + Number(transaction.amount);
            }
            return acc;
        }, 0);

        return {totalIncome:Number(totalIncome.toFixed(2)),totalExpense:Number(totalExpense.toFixed(2)),};
    } catch (error) {
        console.log(error)
        return {totalIncome:0,totalExpense:0};
    }
};

export default calculateMonthlyFinance;