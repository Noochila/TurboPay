"use client"
import { Button } from "@repo/ui/Button";
import { Card } from "@repo/ui/Card";
import { Select } from "@repo/ui/Select";
import { useState } from "react";
import { TextInput } from "@repo/ui/Textinput";
import { createOnRampTransaction } from "../app/lib/actions/createOnRamptransaction";

const SUPPORTED_BANKS = [{
    name: "HDFC Bank",
    redirectUrl: "https://netbanking.hdfcbank.com"
}, {
    name: "Axis Bank",
    redirectUrl: "https://www.axisbank.com/"
},
{
    name: "Dummy Bank",
    redirectUrl: "http://localhost:3001/banking"
}
];

export const AddMoney = () => {
    const [redirectUrl, setRedirectUrl] = useState(SUPPORTED_BANKS[0]?.redirectUrl);
    const [provider, setProvider] = useState(SUPPORTED_BANKS[0]?.name || "");
    const [value, setValue] = useState(0)
    return <Card title="Add Money">
        <div className="w-full">
            <TextInput label={"Amount"} value={value == 0 ? "" : value.toString()} placeholder={"Amount"} onChange={(val) => {
                setValue(Number(val))
            }} />
            <div className="py-4 text-left">
                Bank
            </div>
            <Select onSelect={(value) => {
                setRedirectUrl(SUPPORTED_BANKS.find(x => x.name === value)?.redirectUrl || "");
                setProvider(SUPPORTED_BANKS.find(x => x.name === value)?.name || "");
            }} options={SUPPORTED_BANKS.map(x => ({
                key: x.name,
                value: x.name
            }))} />
            <div className="flex justify-center pt-4">
                <Button onClick={async () => {
                    const response = await createOnRampTransaction(provider, value * 100)

                    window.location.href = redirectUrl + '?token=' + response.token + "&user_identifier=" + response.user_identifier + "&amount=" + value || "";
                }}>
                    Add Money
                </Button>
            </div>
        </div>
    </Card>
}