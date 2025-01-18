"use server";

import { PrismaClient, } from "@prisma/client";

const prisma: PrismaClient = new PrismaClient();

export default async function addCompletedBudget(email:string,category_id:number,budget_amount:number,amount_spent:number,valid_until:Date) {
  if (!email) {
    console.error("Invalid input:", { email });
    return { success: false, message: "Invalid input parameters" };
  }
  try {
    console.log("Received Payload:", { email, category_id, budget_amount, amount_spent, valid_until });
    await prisma.completedBudget.create({
      data: {
        email: email,
        category_id: category_id,
        budget_amount: budget_amount,
        amount_spent: amount_spent,
        valid_until: valid_until,
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