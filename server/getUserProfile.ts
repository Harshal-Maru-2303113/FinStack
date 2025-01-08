"use server";

import { PrismaClient } from "@prisma/client";

const prisma: PrismaClient = new PrismaClient();

export async function getUserProfile() {
  try {
    const user = await prisma.user.findMany();
    console.dir(user);
    return user;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
}
