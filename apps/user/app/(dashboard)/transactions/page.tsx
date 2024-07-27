
import React from "react"
import CombinedTransactions from "../../../components/Transactions"
import prisma from "@repo/db/client";
import { getServerSession } from "next-auth";
import { authProvider } from "../../lib/auth";
import { redirect } from "next/navigation";

async function getP2Ptransactions() {
    const session = await getServerSession(authProvider);
    if (!session) {
        redirect(`/api/auth/signin`);
    }
    const txns = await prisma.p2pTransfer.findMany({
        where: {
            fromUserId: Number(session?.user?.id)
        }
    });
    return txns.map(t => ({
        time: t.timestamp,
        amount: t.amount
    }));
}

async function getOnRampTransactions() {
    const session = await getServerSession(authProvider);
    if (!session) {
        redirect(`/api/auth/signin`);
    }
    const txns = await prisma.onRampTransaction.findMany({
        where: {
            userId: Number(session?.user?.id)
        }
    });
    return txns.map(t => ({
        time: t.startTime,
        amount: t.amount,
        status: t.status,
        provider: t.provider
    }));
}

export default async function () {
    const p2pTransactions = await getP2Ptransactions();
    const onRampTransactions = await getOnRampTransactions();

    return <CombinedTransactions p2pTransactions={p2pTransactions} onRampTransactions={onRampTransactions}/>
}
