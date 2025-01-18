'use server'

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

export default async function getCompletedBudget(email: string) {
  if (!email) {
    console.error("Email is required");
    return { success: false, data: [] as CompletedBudget[] }; 
  }

  try {
    const budgets = await prisma.completedBudget.findMany({
      where: {
        email: email,
      },
    });

    const budgetData = budgets.map(budget => ({
      ...budget,
      budget_amount: budget.budget_amount.toNumber(),  // Convert Decimal to number
      amount_spent: budget.amount_spent.toNumber(),    // Convert Decimal to number
    }));
    return { success: true, data: budgetData };
  } catch (error) {
    console.error("Error fetching budget data:", error);
    return { success: false, data: [] as CompletedBudget[] };
  }
}