"use server";

import { PrismaClient, } from "@prisma/client";
import { budgetData } from "@/types/BudgetData";
import { Decimal } from "@prisma/client/runtime/library";

const prisma: PrismaClient = new PrismaClient();

export default async function addBudgetData({
  email,
  category_id,
  budget_amount,
  amount_spent,
  valid_until,
}: budgetData) {
  if (
    !email ||
    !category_id ||
    !budget_amount ||
    amount_spent === undefined ||
    !valid_until
  ) {
    console.error("Invalid Input:", { email, category_id, budget_amount, amount_spent, valid_until });
    return { success: false, message: "Invalid input parameters" };
  }

  try {
    console.log("Received Payload:", { email, category_id, budget_amount, amount_spent, valid_until });
    await prisma.budget.create({
      data: {
        email:email,
        category_id:Number(category_id),
        budget_amount: new Decimal(budget_amount),
        amount_spent: new Decimal(amount_spent),
        valid_until: new Date(valid_until),
      },
    });
    return { success: true, message: "Budget added successfully" };
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Prisma Error:", error.message);
    } else {
      console.error("Unexpected Error:", error);
    }
    return { success: false, message: "Budget not added!" };
  }
}
