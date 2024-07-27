import React from "react"
import { SendCard } from "../../../components/SendCard"
import prisma from "@repo/db/client";
import { BalanceCard } from "../../../components/BalanceCard";
import { getServerSession } from "next-auth";
import { authProvider } from "../../lib/auth";
import { redirect } from "next/navigation";
import { P2Ptransactions } from "../../../components/P2PTransactions"
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

async function getP2Ptransactions() {


    const session = await getServerSession(authProvider);
    if (!session) {
        redirect(`/api/auth/signin`) // Navigate to the new post page
    }
    const txns = await prisma.p2pTransfer.findMany({
        where: {
            fromUserId: Number(session?.user?.id)
        }
    });
    return txns.map(t => ({
        time: t.timestamp,
        amount: t.amount
    }))
}


export default async function () {
    const balance = await getBalance();
    const transactions = await getP2Ptransactions();

    return <div className="w-screen">
        <div className="text-4xl text-[#6a51a6] pt-8 mb-8 font-bold">
            P2P Transfer
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 p-4">
            <div>
                <SendCard />
            </div>
            <div>
                <BalanceCard amount={balance.amount} locked={balance.locked} />
                <div className="pt-4">
                    <P2Ptransactions transactions={transactions} />
                </div>
            </div>
        </div>

    </div>
}