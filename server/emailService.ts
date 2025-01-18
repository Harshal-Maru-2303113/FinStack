"use server";

import nodemailer from "nodemailer";
import prisma from "../lib/prisma";
import crypto from "crypto";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const generateOTP = (): string => {
  return crypto.randomInt(100000, 999999).toString();
};

const saveOTP = async (email: string, otp: string): Promise<void> => {
  try {
    const expiresAt: Date = new Date(Date.now() + 10 * 60 * 1000);

    // Log the attempt
    console.log("Attempting to save OTP:", { email, otp, expiresAt });

    const result = await prisma.oTP.upsert({
      where: {
        email,
      },
      update: {
        otp,
        expires_at: expiresAt,
      },
      create: {
        email,
        otp,
        expires_at: expiresAt,
      },
    });
    console.log("OTP save result:", result);
  } catch (error) {
    console.error("Database error while saving OTP:", error);
    throw new Error("Failed to save OTP");
  }
};

const verifyOTP = async (email: string, otp: string): Promise<boolean> => {
  try {
    const record = await prisma.oTP.findFirst({
      where: {
        email,
        otp,
        expires_at: {
          gte: new Date(),
        },
      },
    });

    console.log("Verification attempt:", {
      email,
      otp,
      found: record !== null,
    });

    if (record) {
      await prisma.oTP.delete({
        where: {
          email,
        },
      });
      return true;
    }
    return false;
  } catch (error) {
    console.error("Verification error:", error);
    return false;
  }
};
const sendOTP = async (email: string): Promise<boolean> => {
  const otp = generateOTP();
 
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "FinStack - Email Verification Code",
    html: `
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
    await transporter.sendMail(mailOptions);
    await saveOTP(email, otp);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
 };


 const sendPasswordResetEmail = async (email: string): Promise<boolean> => {
  const otp = generateOTP();

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "FinStack - Password Reset Code",
    html: `
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
    await transporter.sendMail(mailOptions);
    await saveOTP(email, otp);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
};


const sendBudget50 = async (email: string, category: string, budget_amount: number, amount_spent: number, valid_until: Date): Promise<boolean> => {
  // Format the date in a more readable way
  const formattedDate = valid_until.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "FinStack - Budget Alert",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Budget Alert</h2>
        <div style="background-color: #fff3cd; border: 1px solid #ffeeba; color: #856404; padding: 15px; margin: 15px 0; border-radius: 4px;">
          <strong>⚠️ Alert:</strong> You have used 50% or more of your allocated budget.
        </div>
        
        <div style="background-color: #f8f9fa; padding: 15px; margin: 15px 0; border-radius: 4px;">
          <p><strong>Category:</strong> ${category}</p>
          <p><strong>Total Budget:</strong> ${budget_amount.toFixed(2)}</p>
          <p><strong>Amount Spent:</strong> ${amount_spent.toFixed(2)}</p>
          <p><strong>Percentage Used:</strong> ${((amount_spent/budget_amount) * 100).toFixed(1)}%</p>
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
    await transporter.sendMail(mailOptions);
    return true;
  }
  catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
};

const sendBudget100 = async (email: string, category: string, budget_amount: number, amount_spent: number, valid_until: Date): Promise<boolean> => {
  // Format the date in a more readable way
  const formattedDate = valid_until.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
 
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "FinStack - Budget Limit Reached",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Budget Limit Reached</h2>
        <div style="background-color: #f8d7da; border: 1px solid #f5c6cb; color: #721c24; padding: 15px; margin: 15px 0; border-radius: 4px;">
          <strong>🚨 Alert:</strong> You have used 100% of your allocated budget.
        </div>
        
        <div style="background-color: #f8f9fa; padding: 15px; margin: 15px 0; border-radius: 4px;">
          <p><strong>Category:</strong> ${category}</p>
          <p><strong>Total Budget:</strong> ${budget_amount.toFixed(2)}</p>
          <p><strong>Amount Spent:</strong> ${amount_spent.toFixed(2)}</p>
          <p><strong>Percentage Used:</strong> ${((amount_spent/budget_amount) * 100).toFixed(1)}%</p>
          <p><strong>Valid Until:</strong> ${formattedDate}</p>
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
 
  try {
    await transporter.sendMail(mailOptions);
    return true;
  }
  catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
 };
export { sendOTP, verifyOTP,sendPasswordResetEmail,sendBudget50,sendBudget100 };
