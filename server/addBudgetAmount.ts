'use server';

import { PrismaClient } from '@prisma/client';
import { sendBudget100, sendBudget50 } from './emailService';
import deleteBudget from './deleteBudget';

const prisma = new PrismaClient();

type transactionType = 'credit' | 'debit';


export default async function addBudgetAmount(amount:number, transaction_type:transactionType,category_id:number,date_time:Date,email:string,category:string) {
    if (!email) {
        return { success: false, message: 'Failed to add transaction' };
    }
    try {
        if (transaction_type === 'debit') {
            const budgets = await prisma.budget.findMany({
                where: {
                    email: email,
                    category_id: category_id
                },
            });
    
            if (budgets.length > 0) {
                console.dir(budgets);
                // Check if date_time is AFTER created_at AND BEFORE valid_until
                if (date_time >= budgets[0].created_at && date_time <= budgets[0].valid_until) {
                    const updatedBudgets = await prisma.budget.update({
                        data: {
                            amount_spent: Number(budgets[0].amount_spent) + Number(amount)
                        },
                        where: {
                            email_category_id: {
                                email: email,
                                category_id: Number(category_id)
                            }
                        }
                    });
                    console.dir(updatedBudgets);
                    if(updatedBudgets){
                        if(Number(updatedBudgets.amount_spent)/Number(updatedBudgets.budget_amount)>=0.5 && !updatedBudgets.emailSent50){
                            const emailSent50 = await sendBudget50(email,category,Number(updatedBudgets.budget_amount),Number(updatedBudgets.amount_spent),updatedBudgets.valid_until);
                            if(emailSent50){
                                await prisma.budget.update({
                                    data:{
                                        emailSent50:true
                                    },
                                    where:{
                                        email_category_id:{
                                            email:email,
                                            category_id:category_id
                                        }
                                    }
                                })
                            }
                        }
                        if(Number(updatedBudgets.amount_spent)/Number(updatedBudgets.budget_amount)>=1 && !updatedBudgets.emailSent100){
                            const emailSent100 = await sendBudget100(email,category,Number(updatedBudgets.budget_amount),Number(updatedBudgets.amount_spent),updatedBudgets.valid_until);
                            if(emailSent100){
                                const budgetDeleted = await deleteBudget(email,category_id);
                                if(budgetDeleted){
                                    console.log("Budget deleted");
                                }
                            }
                        }
                    }
                    return { success: true, message: 'budget' };
                }
            }
        }
        
        return { success: false, message: ' No budget' };
    } catch (error) {
        console.error('Error adding transaction:', error);
        return { success: false, message: 'Failed to add Budget' };
    }
}