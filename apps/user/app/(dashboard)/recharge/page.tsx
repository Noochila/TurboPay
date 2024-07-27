
import prisma from "@repo/db/client";
import { SendUtilityCard } from "../../../components/SendUtilityCard";
import { BalanceCard } from "../../../components/BalanceCard";
import { OnRampTransactions } from "../../../components/OnRampTransactions";
import { getServerSession } from "next-auth";
import { authProvider } from "../../lib/auth";
import React from "react";
import { redirect } from "next/navigation";


async function getBalance() {
    const session = await getServerSession(authProvider);
    if (!session) {
        redirect(`/api/auth/signin`) // Navigate to the new post page
    }
    const balance = await prisma.balance.findFirst({
        where: {
            userId: Number(session?.user?.id)
        }
    });
    return {
        amount: balance?.amount || 0,
        locked: balance?.locked || 0
    }
}

async function getRecharge() {
    const session = await getServerSession(authProvider);
    if (!session) {
        redirect(`/api/auth/signin`) // Navigate to the new post page
    }
    const txns = await prisma.recharge.findMany({
        where: {
            userId: Number(session?.user?.id)
        }
    });
    return txns.map(t => ({
        time: t.timestamp,
        amount: t.amount,
        status: t.status,
        provider: t.provider
    }))
}

export default async function () {
    const balance = await getBalance();
    const transactions = await getRecharge();


    return <div className="w-screen">
        <div className="text-4xl text-[#6a51a6] pt-8 mb-8 font-bold">
            Recharge for your account
        </div>
    
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
            <div>
                <SendUtilityCard />
            </div>
            <div>
                <BalanceCard amount={balance.amount} locked={balance.locked} />
                <div className="pt-4">
                    <OnRampTransactions transactions={transactions} />
                </div>
            </div>
        </div>
    </div>
}