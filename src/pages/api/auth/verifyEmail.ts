'use server';

import prisma from "@/../lib/prisma";
import { verifyOTP } from "@/utils/emailService";

export default async function verifyEmail(email:string, otp:string) {
 try {
    const isValid = await verifyOTP(email, otp);

    if (!isValid) {
      return {success: false, message: "Invalid OTP"};
    }

    await prisma.user.update({
      where: { email },
      data: { isVerified: true },
    });

    return {success: true, message: "Email verified successfully"};
  } catch (error) {
    console.error("Verification error:", error);
    return {success: false, message: "Failed to verify email"};
  }
}
