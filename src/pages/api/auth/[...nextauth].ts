'use server'

import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "@/../lib/prisma"; // Adjust the path to your Prisma instance
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      username?: string;
      isVerified?: boolean;
      photoURL?: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    username?: string;
    isVerified?: boolean;
    photoURL?: string;
  }
}

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "you@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        // Fetch user from the database
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) {
          throw new Error("Invalid email or password");
        }

        // Verify password
        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isValid) {
          throw new Error("Invalid email or password");
        }

        // Check email verification status
        if (!user.isVerified) {
          throw new Error("Email not verified");
        }

        // Convert `id` to string for compatibility with `next-auth`
        return {
          ...user,
          id: String(user.id), // Convert ID to string here
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email ?? "";
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user = {
          id: token.id,
          email: token.email,
        };
      }
      return session;
    },
  },
  pages:{
    signIn:"/login",
  },
  secret: process.env.NEXT_AUTH_SECRET,
});
