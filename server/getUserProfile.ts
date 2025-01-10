"use server";

import { PrismaClient } from "@prisma/client";

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
} | null;



const prisma: PrismaClient = new PrismaClient();

export async function getUserProfile(email:string): Promise<User> {
  try {

   
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    console.dir(user);
    return user;
  } catch (error) {
    console.log(error)
    return {} as User;
  }
}
