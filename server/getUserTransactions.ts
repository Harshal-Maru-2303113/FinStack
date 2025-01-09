"use server";

import { PrismaClient } from "@prisma/client";
import { Transaction } from "@/utils/Calculate";
const prisma = new PrismaClient();

export default async function getUserTransactions(
  email: string,
  start: number,
  items: number
) {
  try {
    const rawTransactions = await prisma.transaction.findMany({
        where: {
          email: email, // Replace `email` with the actual email variable
        },
        skip: start,
        take: items,
        orderBy: {
          date_time: "desc",
        },
        include: {
          category: true, // Ensure the `category` relation exists in your schema
        },
      });
      
      const transactions: Transaction[] = rawTransactions.map((t) => ({
        transaction_id: t.transaction_id, // Replace `id` with the actual transaction ID field
        email: t.email,
        date_time: t.date_time,
        amount: t.amount.toString(), // Convert `Decimal` to `string`
        transaction_type: t.transaction_type, // Replace with the actual field
        description: t.description,
        balance: t.balance.toString(), // Convert `Decimal` to `string`
        category_id: t.category_id,
        category_name: t.category.category_name, // Replace `name` with the field in the `category` table
      }));
      
      
    if (!transactions) {
      return {success: false, message: "No transactions found", data: [] as Transaction[]};
    }
    return {success: true, message: "Transactions found", data: transactions as Transaction[]};
  } catch (error) {
    console.log(error);
    return {success: false, message: "Failed to fetch transactions", data: [] as Transaction[]};
  }
}
