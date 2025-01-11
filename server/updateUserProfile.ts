"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface UserProfile {
  username: string;
  email: string;
  age: string;
  gender: string;
  photoURL: string;
}
export default async function updateUserProfile(profile: UserProfile) {
  try {
    console.dir(profile);
    const user = await prisma.user.update({
      where: {
        email: profile.email,
      },
      data: {
        username: profile.username,
        age: Number(profile.age),
        photoURL: profile.photoURL,
        gender: profile.gender,
      },
    });
    if (user) {
      return { success: true, data: user };
    }
    return { success: false, data: {} };
  } catch (error) {
    console.error(error);
    return { success: false, data: {} };
  }
}
