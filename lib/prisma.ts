import { PrismaClient } from "@prisma/client";  

// Declares a variable `prisma` to hold an instance of PrismaClient  
let prisma: PrismaClient;  

// Checks if the environment is "production"
if (process.env.NODE_ENV === "production") {  
    // In production, always create a new PrismaClient instance  
    prisma = new PrismaClient();  
} else {  
    // In development, we store the PrismaClient instance in the global object  
    // This prevents multiple instances from being created during hot reloads in development mode  

    // If `prisma` is not already stored globally, create and assign it  
    if (!(global as typeof globalThis & { prisma?: PrismaClient }).prisma) {  
        (global as typeof globalThis & { prisma?: PrismaClient }).prisma = new PrismaClient();  
    }  

    // Assign the globally stored PrismaClient instance  
    prisma = (global as typeof globalThis & { prisma?: PrismaClient }).prisma!;  
}  

// Export the PrismaClient instance for use in the application  
export default prisma;  
