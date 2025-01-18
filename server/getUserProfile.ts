"use server";

import { PrismaClient } from "@prisma/client";

// Define the User type which represents the structure of a user profile
type User = {
  id: number;
  username: string;
  email: string;
  password: string;
  isVerified: boolean;
  age: number;
  gender: string;
  photoURL: string;
  created_at: Date;
  updated_at: Date;
} | null; // `null` allows the return value to be null if no user is found

const prisma: PrismaClient = new PrismaClient(); // Initialize Prisma client for database interaction

// Function to fetch a user profile from the database based on their email
export async function getUserProfile(email: string): Promise<User> {
  try {
    // Query the database to find a unique user by their email
    const user = await prisma.user.findUnique({
      where: {
        email: email, // Email is used as the unique identifier to fetch the user
      },
    });

    console.dir(user); // Log the user profile to the console for debugging

    return user; // Return the user profile found
  } catch (error) {
    console.log(error); // Log any errors that occur during the query

    return {} as User; // Return an empty object cast as a User type in case of error
  }
}
