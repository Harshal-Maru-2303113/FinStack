"use server";

import bcrypt from "bcryptjs";
import prisma from "@/../lib/prisma";
import { sendOTP } from "../../../../server/emailService";

interface SignupParams {
  username: string;
  email: string;
  password: string;
}

export default async function signup({
  username,
  email,
  password,
}: SignupParams) {
  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      return { success: false, error: "User already exists" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        isVerified: false,
        photoURL:
          "https://www.pngarts.com/files/10/Default-Profile-Picture-Download-PNG-Image.png",
        age: 0, // default age, replace with actual value if available
        gender: "Not specified", // default gender, replace with actual value if available
      },
    });
    console.log("New user created:", newUser); // Log the new user
    await sendOTP(email); // Sends an OTP for verification

    return { success: true, message: "User registered successfully" };
  } catch (error) {
    console.error(
      "Signup error:",
      error instanceof Error ? error.message : error
    );
    return { success: false, error: "Failed to register user" };
  }
}
