"use server";

import nodemailer from "nodemailer";
import prisma from "../lib/prisma";
import crypto from "crypto";

// Configure the email transporter to use Gmail with environment variables for security
const transporter = nodemailer.createTransport({
  service: "gmail", // Use Gmail as the email service
  auth: {
    user: process.env.EMAIL_USER, // Email user from environment variable
    pass: process.env.EMAIL_PASSWORD, // Email password from environment variable
  },
});

// Generate a random 6-digit OTP using the crypto module's randomInt method
const generateOTP = (): string => {
  return crypto.randomInt(100000, 999999).toString(); // Generates a 6-digit number between 100000 and 999999
};

/**
 * Save the generated OTP to the database with an expiration time of 10 minutes.
 * The OTP will be inserted if it doesn't exist or updated if it already exists.
 */
const saveOTP = async (email: string, otp: string): Promise<void> => {
  try {
    // Set the expiration time for OTP (10 minutes from now)
    const expiresAt: Date = new Date(Date.now() + 10 * 60 * 1000);

    // Log the OTP saving attempt
    console.log("Attempting to save OTP:", { email, otp, expiresAt });

    // Upsert the OTP into the database (insert or update depending on email)
    const result = await prisma.oTP.upsert({
      where: {
        email, // Use email as the unique identifier
      },
      update: {
        otp, // Update the OTP and expiration date
        expires_at: expiresAt,
      },
      create: {
        email, // Create a new record if it doesn't exist
        otp,
        expires_at: expiresAt,
      },
    });
    console.log("OTP save result:", result); // Log the result of the save operation
  } catch (error) {
    console.error("Database error while saving OTP:", error); // Log any error encountered
    throw new Error("Failed to save OTP"); // Throw error if saving fails
  }
};

/**
 * Verify if the OTP exists for the given email and has not expired.
 * If valid, delete the OTP record after successful verification.
 */
const verifyOTP = async (email: string, otp: string): Promise<boolean> => {
  try {
    // Check if the OTP exists for the email and is not expired
    const record = await prisma.oTP.findFirst({
      where: {
        email,
        otp,
        expires_at: {
          gte: new Date(), // Ensure the OTP is not expired
        },
      },
    });

    console.log("Verification attempt:", {
      email,
      otp,
      found: record !== null, // Log whether the OTP was found or not
    });

    // If the OTP is valid, delete it from the database
    if (record) {
      await prisma.oTP.delete({
        where: {
          email, // Delete OTP record by email
        },
      });
      return true; // OTP verified successfully
    }
    return false; // OTP not found or expired
  } catch (error) {
    console.error("Verification error:", error); // Log any verification errors
    return false; // Return false if verification fails
  }
};

/**
 * Send an OTP to the user's email for verification purposes.
 * Generates the OTP, sends the email, and saves it to the database.
 */
const sendOTP = async (email: string): Promise<boolean> => {
  const otp = generateOTP(); // Generate the OTP
  const mailOptions = {
    from: process.env.EMAIL_USER, // Sender's email address
    to: email, // Recipient's email address
    subject: "FinStack - Email Verification Code", // Subject of the email
    html: `  // HTML content of the email
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Email Verification</h2>
        <div style="background-color: #cfe2ff; border: 1px solid #b6d4fe; color: #084298; padding: 15px; margin: 15px 0; border-radius: 4px;">
          <p style="margin: 0;"><strong>Your verification code is: </strong></p>
          <p style="font-size: 24px; font-weight: bold; margin: 10px 0;">${otp}</p>
        </div>
        
        <div style="background-color: #f8f9fa; padding: 15px; margin: 15px 0; border-radius: 4px;">
          <p style="margin: 0;"><strong>Note:</strong></p>
          <p style="margin: 8px 0;">• This code will expire in 10 minutes</p>
          <p style="margin: 8px 0;">• If you didn't request this code, please ignore this email</p>
        </div>
        
        <p style="font-size: 12px; color: #6c757d; margin-top: 20px;">
          This is an automated message from FinStack. Please do not reply to this email.
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions); // Send the email with the OTP
    await saveOTP(email, otp); // Save the OTP to the database for verification later
    return true; // Return true if OTP was sent successfully
  } catch (error) {
    console.error("Error sending email:", error); // Log any errors encountered while sending the email
    return false; // Return false if sending the email failed
  }
};

/**
 * Send a password reset email with a verification code (OTP) for the user to reset their password.
 * The OTP is generated, the email is sent, and the OTP is saved for future verification.
 */
const sendPasswordResetEmail = async (email: string): Promise<boolean> => {
  const otp = generateOTP(); // Generate the OTP for password reset

  const mailOptions = {
    from: process.env.EMAIL_USER, // Sender's email address
    to: email, // Recipient's email address
    subject: "FinStack - Password Reset Code", // Subject of the email
    html: `  // HTML content of the password reset email
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Password Reset Verification</h2>
        <div style="background-color: #cfe2ff; border: 1px solid #b6d4fe; color: #084298; padding: 15px; margin: 15px 0; border-radius: 4px;">
          <p style="margin: 0;"><strong>Your verification code is: </strong></p>
          <p style="font-size: 24px; font-weight: bold; margin: 10px 0;">${otp}</p>
        </div>
        
        <div style="background-color: #f8f9fa; padding: 15px; margin: 15px 0; border-radius: 4px;">
          <p style="margin: 0;"><strong>Note:</strong></p>
          <p style="margin: 8px 0;">• This code will expire in 10 minutes</p>
          <p style="margin: 8px 0;">• If you didn't request this code, please ignore this email</p>
        </div>
        
        <p style="font-size: 12px; color: #6c757d; margin-top: 20px;">
          This is an automated message from FinStack. Please do not reply to this email.
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions); // Send the password reset OTP email
    await saveOTP(email, otp); // Save the OTP for password reset verification
    return true; // Return true if the email was sent successfully
  } catch (error) {
    console.error("Error sending email:", error); // Log any errors encountered while sending the email
    return false; // Return false if sending the email failed
  }
};

/**
 * Send a 50% budget alert email to the user, notifying them that they've used 50% or more of their allocated budget.
 * Includes category details, budget amount, amount spent, and expiration date.
 */
const sendBudget50 = async (
  email: string,
  category: string,
  budget_amount: number,
  amount_spent: number,
  valid_until: Date
): Promise<boolean> => {
  // Format the expiration date into a more readable format
  const formattedDate = valid_until.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const mailOptions = {
    from: process.env.EMAIL_USER, // Sender's email address
    to: email, // Recipient's email address
    subject: "FinStack - Budget Alert", // Subject of the email
    html: `  // HTML content of the budget alert email
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Budget Alert</h2>
        <div style="background-color: #fff3cd; border: 1px solid #ffeeba; color: #856404; padding: 15px; margin: 15px 0; border-radius: 4px;">
          <strong>⚠️ Alert:</strong> You have used 50% or more of your allocated budget.
        </div>
        
        <div style="background-color: #f8f9fa; padding: 15px; margin: 15px 0; border-radius: 4px;">
          <p><strong>Category:</strong> ${category}</p>
          <p><strong>Total Budget:</strong> ${budget_amount.toFixed(2)}</p>
          <p><strong>Amount Spent:</strong> ${amount_spent.toFixed(2)}</p>
          <p><strong>Percentage Used:</strong> ${(
            (amount_spent / budget_amount) *
            100
          ).toFixed(1)}%</p>
          <p><strong>Valid Until:</strong> ${formattedDate}</p>
        </div>

        <p>This is an automated notification to help you track your spending. Please review your expenses if needed.</p>
        <p>You can view detailed analytics by logging into your FinStack account.</p>
        
        <p style="font-size: 12px; color: #6c757d; margin-top: 20px;">
          If you didn't set this budget, please ignore this email.
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions); // Send the 50% budget alert email
    return true; // Return true if the email was sent successfully
  } catch (error) {
    console.error("Error sending email:", error); // Log any errors encountered
    return false; // Return false if sending the email failed
  }
};

/**
 * Send a 100% budget limit reached email to the user, notifying them that they've reached their budget limit.
 * Includes category details, budget amount, amount spent, and expiration date.
 */

const sendBudget100 = async (
  email: string, // Recipient's email address
  category: string, // Category of the budget
  budget_amount: number, // The total budget allocated for the category
  amount_spent: number, // The total amount spent in the category
  valid_until: Date // Expiration date of the budget
): Promise<boolean> => {
  // Format the expiration date into a more readable format
  const formattedDate = valid_until.toLocaleDateString("en-US", {
    year: "numeric", // Show the year in numeric format
    month: "long", // Show the full name of the month
    day: "numeric", // Show the day of the month
  });

  // Email options including subject, recipient, and HTML content
  const mailOptions = {
    from: process.env.EMAIL_USER, // Sender's email address from environment variables
    to: email, // Recipient's email address passed as argument
    subject: "FinStack - Budget Limit Reached", // Email subject

    // HTML content of the email
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Budget Limit Reached</h2>
        <div style="background-color: #f8d7da; border: 1px solid #f5c6cb; color: #721c24; padding: 15px; margin: 15px 0; border-radius: 4px;">
          <strong>🚨 Alert:</strong> You have used 100% of your allocated budget.
        </div>
        
        <div style="background-color: #f8f9fa; padding: 15px; margin: 15px 0; border-radius: 4px;">
          <p><strong>Category:</strong> ${category}</p> <!-- Display the budget category -->
          <p><strong>Total Budget:</strong> ${budget_amount.toFixed(
            2
          )}</p> <!-- Display the total budget amount -->
          <p><strong>Amount Spent:</strong> ${amount_spent.toFixed(
            2
          )}</p> <!-- Display the amount spent -->
          <p><strong>Percentage Used:</strong> ${(
            (amount_spent / budget_amount) *
            100
          ).toFixed(
            1
          )}%</p> <!-- Calculate and display percentage of budget used -->
          <p><strong>Valid Until:</strong> ${formattedDate}</p> <!-- Display the valid until date -->
        </div>
 
        <p>Your budget limit has been reached</p>
        <p>To continue tracking expenses in this category, please create a new budget.</p>
        <p>You can view detailed analytics by logging into your FinStack account.</p>
        
        <p style="font-size: 12px; color: #6c757d; margin-top: 20px;">
          If you didn't set this budget, please ignore this email.
        </p>
      </div>
    `,
  };

  // Attempt to send the email using the transporter object
  try {
    await transporter.sendMail(mailOptions); // Send the email
    return true; // Return true if email was sent successfully
  } catch (error) {
    console.error("Error sending email:", error); // Log any errors that occur
    return false; // Return false if there was an error sending the email
  }
};

export {
  sendOTP,
  verifyOTP,
  sendPasswordResetEmail,
  sendBudget50,
  sendBudget100,
};
