"use server";  // Indicates this is server-side code in Next.js

import bcrypt from "bcryptjs"; // Import bcrypt library to handle password hashing
import prisma from "@/../lib/prisma"; // Import Prisma client instance to interact with the database
import { sendPasswordResetEmail } from "@/../server/emailService"; // Import the function to send the password reset email

// Define an interface for the input parameters to ensure type safety
interface SignupParams {
  email: string;  // User's email address
  password: string;  // New password provided by the user
}

// Define an asynchronous function to handle password reset logic
export default async function resetPassword({ email, password }: SignupParams) {
  try {
    // Check if a user with the provided email already exists in the database
    const existingUser = await prisma.user.findUnique({ where: { email } });

    // If no user is found with that email, return an error message
    if (!existingUser) {
      return { success: false, error: "User does not exist" };
    }

    // Hash the new password using bcrypt with a salt rounds value of 10
    const newHashedPassword = await bcrypt.hash(password, 10);

    // Update the user's password in the database with the newly hashed password
    const updatedUser = await prisma.user.update({
      where: { email: email },  // Find the user by their email
      data: { password: newHashedPassword },  // Set the new password field
    });

    console.log("User password updated:", updatedUser); // Log the updated user details (without exposing sensitive data)

    // After updating the password, send a password reset email for verification
    const res = await sendPasswordResetEmail(email); 

    // Check if the email was successfully sent
    if (res) {
      return { success: true, message: "Email sent successfully" };  // Return success message
    } else {
      return { success: false, error: "Failed to send email" };  // Return error if email sending fails
    }
  } catch (error) {
    // Catch and log any error that occurs during the process
    console.error(
      "Password reset error:",
      error instanceof Error ? error.message : error  // Ensure proper error message handling
    );
    return { success: false, error: "Failed to reset password" };  // Return a general error message in case of failure
  }
}
