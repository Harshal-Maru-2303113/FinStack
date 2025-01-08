import { PrismaClient } from "@prisma/client";

let prisma: PrismaClient;

if(process.env.NODE_ENV === "production") {
    prisma = new PrismaClient();
} else {
    if(!(global as typeof globalThis & { prisma?: PrismaClient }).prisma) {
        (global as typeof globalThis & { prisma?: PrismaClient }).prisma = new PrismaClient();
    }

    prisma = (global as typeof globalThis & { prisma?: PrismaClient }).prisma!;
}

export default prisma;