"use server";

import { PrismaClient } from "@prisma/client";




const prisma: PrismaClient = new PrismaClient();

export async function getUserProfile(email:string) {
  try {

   
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    console.dir(user);
    return user;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
}
