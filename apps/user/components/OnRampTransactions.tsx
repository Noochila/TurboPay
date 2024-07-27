'use client'
import { Card } from "@repo/ui/Card"
import React, { useState } from "react"
export const OnRampTransactions = ({
    transactions
}: {
    transactions: {
        time: Date,
        amount: number,
        // TODO: Can the type of `status` be more specific?
        status: string,
        provider: string
    }[]
}) => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const totalPages = Math.ceil(transactions.length / itemsPerPage);

    const currentTransactions = transactions.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    ).reverse(); // Reverse the order to show the most recent transactions first

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    if (!transactions.length) {
        return <Card title="Recent Transactions">
            <div className="text-center pb-8 pt-8">
                No Recent transactions
            </div>
        </Card>
    }
    return <Card title="Recent Transactions">
        <div className="pt-2">
            {currentTransactions.map(t => <div className="flex justify-between">
                <div>
                    <div className="text-sm">
                        Received INR
                    </div>
                    <div className="text-slate-600 text-xs">
                        {t.time.toDateString()}
                    </div>
                    <div>
                        {t.status === "Success" || t.status=='success' ? <div className="text-green-500 text-xs">Success</div> : t.status === "processing" ? <div className="text-yellow-500 text-xs">Processing</div> : <div className="text-red-500 text-xs">Failed</div>}
                    </div>
                </div>
                <div className="flex flex-col justify-center">
                    + Rs {t.amount / 100}
                </div>

            </div>)}
        </div>
        <div className="flex justify-center space-x-4 mt-4">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                    key={page}
                    className={`px-4 py-2 ${currentPage === page ? 'bg-blue-500 text-white' : 'bg-white text-blue-500'}`}
                    onClick={() => handlePageChange(page)}
                >
                    {page}
                </button>
            ))}
        </div>
    </Card>
}