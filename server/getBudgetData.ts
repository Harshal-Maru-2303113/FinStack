'use server'

import { BudgetFetchData } from "@/types/BudgetData";
import { PrismaClient } from "@prisma/client";

const prisma: PrismaClient = new PrismaClient();

export default async function getBudgetData(email: string) {
  if (!email) {
    console.error("Email is required");
    return { success: false, data: [] as BudgetFetchData[] }; 
  }

  try {
    const budgets = await prisma.budget.findMany({
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
    return { success: false, data: [] as BudgetFetchData[] };
  }
}
