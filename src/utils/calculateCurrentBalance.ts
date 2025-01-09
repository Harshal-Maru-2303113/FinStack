'use server';

import { PrismaClient } from '@prisma/client';


const prisma = new PrismaClient();


export default async function calculateCurrentBalance(email:string) {
    if(!email){
        return { success: false, message: 'Failed to calculate balance' };
    }
  try {
    const latestTransaction = await prisma.transaction.findFirst({
        where: {
          email: email,
        },
        orderBy: {
          date_time: 'desc', // Order by date in descending order
        },
      });
      
      console.log(latestTransaction);
      if (!latestTransaction) {
        return { success: true, message: 'No transactions found',value:0 };
      }
      return { success: true, message: 'Balance calculated successfully',value:latestTransaction.balance };
  } catch (error) {
    console.error('Error calculating balance:', error);
    return { success: false, message: 'Failed to calculate balance' };
  }
};