'use server';  // Indicates this is server-side code in Next.js

import { signOut } from "next-auth/react"; // Import the signOut function from next-auth to handle user logout

// Define an asynchronous function to log out the user
export default async function logOutUser() {
    // Call signOut to log the user out, redirecting them to the home page ("/")
    await signOut({ callbackUrl: '/' });
}
