"use client"
import { Button } from "@repo/ui/Button";
import { Card } from "@repo/ui/Card";
import { TextInput } from "@repo/ui/Textinput";
import { useState } from "react";
import { p2pTransfer } from "../app/lib/actions/p2ptransfer";
import React from "react";
import { Alert } from "@mui/material";

export function SendCard() {
    const [p2p, setP2P] = useState<{
        number: string,
        amount: number
    }>({
        number: "",
        amount: 0
    });
    const [responseMessage, setResponseMessage] = useState<string | null>(null);

    const handleSend = async () => {
        const response = await p2pTransfer(p2p.number, p2p.amount);
        setResponseMessage(response.message);
        // Clear p2p state after transaction
        setP2P({ number: "", amount: 0 });
    };

    return (
        <div className="h-[90vh]">
            <Card title="Send">
                <div className="min-w-72 pt-2">
                    <TextInput 
                        placeholder={"Number"} 
                        label="Number" 
                        value={p2p.number} 
                        onChange={(value) => {
                            setP2P(prevState => ({
                                ...prevState,
                                number: value
                            }));
                        }} 
                    />
                    <TextInput 
                        placeholder={"Amount"} 
                        label="Amount" 
                        value={p2p.amount === 0 ? "" : (p2p.amount / 100).toString()} 
                        onChange={(value) => {
                            setP2P(prevState => ({
                                ...prevState,
                                amount: Number(value) * 100
                            }));
                        }} 
                    />
                    <div className="pt-4 flex justify-center">
                        <Button onClick={handleSend}>Send</Button>
                    </div>
                    {responseMessage && (
                        responseMessage === 'Success' ? (
                            <Alert severity="success">Successfully Transferred</Alert>
                        ) : (
                            <Alert severity="error">{responseMessage}</Alert>
                        )
                    )}
                </div>
            </Card>
        </div>
    );
}
