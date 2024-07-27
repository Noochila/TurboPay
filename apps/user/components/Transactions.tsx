'use client'
import { Card } from "@repo/ui/Card"
import React, { useState } from "react"

interface Transaction {
    time: Date;
    amount: number;
}

interface OnRampTransaction extends Transaction {
    status: string;
    provider: string;
}

interface CombinedTransactionsProps {
    p2pTransactions: Transaction[];
    onRampTransactions: OnRampTransaction[];
}

export default function CombinedTransactions({
    p2pTransactions,
    onRampTransactions
}: CombinedTransactionsProps): JSX.Element {
    const [currentPage, setCurrentPage] = useState(1);
    const transactionsPerPage = 5;

    const allTransactions = [...p2pTransactions, ...onRampTransactions].sort((a, b) => b.time.getTime() - a.time.getTime());

    if (!allTransactions.length) {
        return <Card title="Recent Transactions">
            <div className="text-center pb-8 pt-8">
                No Recent transactions
            </div>
        </Card>
    }

    const indexOfFirstTransaction = (currentPage - 1) * transactionsPerPage;
    const indexOfLastTransaction = indexOfFirstTransaction + transactionsPerPage;
    const currentTransactions = allTransactions.slice(indexOfFirstTransaction, indexOfLastTransaction);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return <Card title="Recent Transactions">
        <div className="pt-2">
            {currentTransactions.map(t => (
                <div key={t.time.toString()} className="flex justify-between">
                    <div>
                        <div className="text-sm">
                            Sent INR
                        </div>
                        <div className="text-slate-600 text-xs">
                            {t.time.toDateString()}
                        </div>
                    </div>
                    <div className="flex flex-col justify-center">
                        + Rs {t.amount / 100}
                    </div>
                </div>
            ))}
        </div>
        <div className="flex justify-center mt-4">
            {Array.from({ length: Math.ceil(allTransactions.length / transactionsPerPage) }, (_, i) => i + 1).map(number => (
                <button key={number} onClick={() => paginate(number)} className="mx-1 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-700">
                    {number}
                </button>
            ))}
        </div>
    </Card>
}