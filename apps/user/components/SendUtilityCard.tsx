"use client"
import { Button } from "@repo/ui/Button";
import { Card } from "@repo/ui/Card";
import { TextInput } from "@repo/ui/Textinput";
import { useState } from "react";
import { setRechargeTransfer } from "../app/lib/actions/recharge";
import React from "react";
import { Alert } from "@mui/material";
import { useSearchParams } from 'next/navigation'

export function SendUtilityCard() {

    const searchParams = useSearchParams();
    const type = searchParams.get('type');
    const provider = searchParams.get('provider');

    const [recharge, setRecharge] = useState<{
        amount: number,
        number: string
    }>({
        amount: 0,
        number: ""
    });
    const [responseMessage, setResponseMessage] = useState<string | null>(null);

    const handleSend = async () => {
        const response = await setRechargeTransfer(recharge.amount, type || "", provider || "", recharge.number);
        setResponseMessage(response.message);
        // Clear recharge state after transaction
        setRecharge({ amount: 0, number: "" });
    };

    return (
        <div className="h-[90vh]">
            <Card title="Send">
                <div>{type} {provider}</div>
                <div className="min-w-72 pt-2">
                    <TextInput
                        placeholder={"Amount"}
                        label="Amount"
                        value={recharge.amount === 0 ? "" : (recharge.amount / 100).toString()}
                        onChange={(value) => {
                            setRecharge(prevState => ({
                                ...prevState,
                                amount: Number(value) * 100
                            }));
                        }}
                    />
                    <TextInput
                        placeholder={"Number"}
                        label="Number"
                        value={recharge.number}
                        onChange={(value) => {
                            setRecharge(prevState => ({
                                ...prevState,
                                number: value
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
