"use server";

import { sendOTP } from "../../../../server/emailService";
import prisma from "@/../lib/prisma";

export default async function resendOTP(email: string) {
  try {
    const users = await prisma.user.findMany({
      where: {
        email: email,
      },
    });
    if (!users) {
      return { success: false, error: "User not found" };
    }

    const otpSent = await sendOTP(email);
    if (!otpSent) {
      return { success: false, error: "Failed to send OTP" };
    }

    return { success: true, message: "Verification code sent successfully" };
  } catch (error) {
    console.error("Error in resendOTP:", error);
    return { success: false, error: "Failed to resend OTP" };
  }
}
