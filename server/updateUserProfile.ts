"use server";  // Indicates this code is intended for the server side in a Next.js environment

import { PrismaClient } from "@prisma/client"; // Import the Prisma client for interacting with the database

const prisma = new PrismaClient();  // Create an instance of the Prisma client to interact with the database

// Define the interface for the user profile input
interface UserProfile {
  username: string;  // User's username
  email: string;     // User's email, used as a unique identifier
  age: string;       // User's age (as a string, will be converted to number)
  gender: string;    // User's gender
  photoURL: string;  // URL of the user's profile photo
}

// Function to update the user profile
export default async function updateUserProfile(profile: UserProfile) {
  try {
    console.dir(profile);  // Log the profile data (make sure no sensitive data is exposed in production)

    // Update the user's profile in the database using Prisma
    const user = await prisma.user.update({
      where: {
        email: profile.email,  // Find the user by their email address
      },
      data: {
        username: profile.username,  // Update the username
        age: Number(profile.age),    // Convert age from string to number and update
        photoURL: profile.photoURL,  // Update the photo URL
        gender: profile.gender,      // Update gender
      },
    });

    // If the update was successful, return the updated user data
    if (user) {
      return { success: true, data: user };
    }

    // If no user is found or no data is updated, return a failure response
    return { success: false, data: {} };

  } catch (error) {
    // Log any errors encountered during the update process
    console.error(error);
    return { success: false, data: {} };  // Return a failure response if an error occurs
  }
}
