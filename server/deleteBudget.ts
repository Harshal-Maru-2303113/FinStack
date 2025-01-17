'use server'

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();


export default async function deleteBudget(email: string, category_id: number) {
  try {
    await prisma.budget.delete({
      where: {
        email_category_id: {
          email: email,
          category_id: category_id
        }
      }
    });
    console.log("Budget deleted successfully");
    return true;
  }
  catch (error) {
    console.error("Error deleting budget:", error);
    return false
  }
}