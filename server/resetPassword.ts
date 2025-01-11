"use server";

import bcrypt from "bcryptjs";
import prisma from "@/../lib/prisma";
import { sendPasswordResetEmail } from "@/../server/emailService";

interface SignupParams {
  email: string;
  password: string;
}

export default async function resetPassword({ email, password }: SignupParams) {
  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (!existingUser) {
      return { success: false, error: "User does not exists" };
    }

    const newHashedPassword = await bcrypt.hash(password, 10);

    const updatedUser = await prisma.user.update({
      where: {
        email: email, // You can update based on a unique field, e.g., email or username
      },
      data: {
        password: newHashedPassword, // Replace with the new hashed password
      },
    });

    console.log("New user created:", updatedUser); // Log the new user
    const res = await sendPasswordResetEmail(email); // Sends an OTP for verification
    if (res) {
      return { success: true, message: "Email Send Successfully" };
    }
    else{
        return { success: false, error: "Failed to send email" };
    }
  } catch (error) {
    console.error(
      "Password reset error:",
      error instanceof Error ? error.message : error
    );
    return { success: false, error: "Failed to register user" };
  }
}
