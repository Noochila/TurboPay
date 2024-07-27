"use server";

import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authProvider } from "../auth";
import axios from "axios"

async function getToken() {
    const response = await axios.get("http://localhost:3100/token");
    return response.data.token.toString();
}

export async function createOnRampTransaction(provider: string, amount: number) {
    try {
        // Ideally the token should come from the banking provider (hdfc/axis)
        const session = await getServerSession(authProvider);
        if (!session?.user || !session.user?.id) {
            return {
                message: "Unauthenticated request"
            };
        }
        const user_identifier=session.user.id.toString()
        const token = await getToken();
        await prisma.onRampTransaction.create({
            data: {
                provider,
                status: "Processing",
                startTime: new Date(),
                token: token,
                userId: Number(session?.user?.id),
                amount: amount
            }
        });

        return {
            message: "Done",
            token: token,
            user_identifier: user_identifier
        };
    } catch (error) {
        return {
            message: "Transaction failed"
        };
    }
}
