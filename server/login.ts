"use server";

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma: PrismaClient = new PrismaClient();

export async function loginUser(data: { email: string; password: string }) {
  try {
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new Error("Invalid email");
    }
    const passwordMatch = await bcrypt.compare(data.password, user.password);
    if (!passwordMatch) {
      throw new Error("Invalid password");
    }
    return { success: true, message: "Login successful", user };
  } catch (error) {
    console.error(
      "Error during login:",
      error instanceof Error ? error.message : error
    );
    throw new Error("Login failed");
  }
}
