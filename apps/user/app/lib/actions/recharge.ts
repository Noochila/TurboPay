"use server"
import { getServerSession } from "next-auth";
import { authProvider } from "../auth";
import prisma from "@repo/db/client";
import axios from 'axios';

export async function setRechargeTransfer(amount: number, type: string, provider: string, number: string) {
    console.log(amount, type, provider, number);
    try {
        const session = await getServerSession(authProvider);
        const from = session?.user?.id;
        if (!from) {
            return {
                message: "Error while sending"
            };
        }

        // Start a transaction
        const result = await prisma.$transaction(async (tx) => {
            await tx.$queryRaw`SELECT * FROM "Balance" WHERE "userId" = ${Number(from)} FOR UPDATE`;

            const fromBalance = await tx.balance.findUnique({
                where: { userId: Number(from) },
            });
            if (!fromBalance || fromBalance.amount < amount) {
                throw new Error('Insufficient funds');
            }

            // Decrement the balance
            await tx.balance.update({
                where: { userId: Number(from) },
                data: { amount: { decrement: amount } },
            });

            // Create the recharge record
            const recharge = await tx.recharge.create({
                data: {
                    userId: Number(from),
                    amount,
                    timestamp: new Date(),
                    type,
                    provider,
                    number,
                    status: "processing"
                }
            });

            // Ensure the recharge record is created before making the external API call
            if (!recharge) {
                throw new Error('Failed to create recharge record');
            }

            return recharge;
        });

        // Make the external API call outside the transaction
        const response = await axios.post('http://localhost:1337/api/order/pretransaction', {
            order_id: result.id.toString(),
            provider,
            type,
            amount,
            number
        });

        if(response.status === 200){
            return {
                message: "Success"
            };
        }

    
       
    } catch (error) {
        console.error(error);
        return {
            message: "Transaction failed"
        };
    }
}
