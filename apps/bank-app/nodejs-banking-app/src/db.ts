import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();
import bcrypt from 'bcrypt';


interface Account {
    username: string;
    acNm: string;
    balance: number;
    password: string;
}

interface Transaction {
    username: string;
    amount: number;
}

interface Transfer {
    srcUsername: string;
    destUsername: string;
    amount: number;
}

const createNewAccount = async ({ username, acNm, balance, password }: Account, onCreate: ((msg: string) => void) | undefined = undefined) => {
    try {

        if (balance < 0) throw new Error("Initial balance cannot be negative.");
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.account.create({
            data: {
                username,
                acNm,
                balance,
                password: hashedPassword
            }
        });
        console.log(`\n ✅ New Customer Created Successfully`);
        if (onCreate) onCreate(`✅ New Customer Created Successfully`);
    } catch (err: any) {
        console.log(`\n ❌ Problem In Creating the Customer`, err);
        if (onCreate) onCreate(`❌ Problem In Creating the Customer: ${err.message}`);
    }
}

const withdraw = async ({ username, amount }: Transaction, onWithdraw: ((msg: string) => void) | undefined = undefined) => {
    try {
        const account = await db.account.findUnique({
            where: { username }
        });
        if (!account) throw new Error("Account not found.");
        const newBalance = account.balance - parseFloat(amount.toString());
        if (newBalance < 0) throw new Error("Insufficient funds.");
        await db.account.update({
            where: { username },
            data: { balance: newBalance }
        });
        console.log(`\n ✅ Amount ${amount} Withdrawn Successfully`);
        if (onWithdraw) onWithdraw(`✅ Amount ${amount} Withdrawn Successfully`);
    } catch (err: any) {
        console.log(`\n ❌ Problem In Withdrawing`, err);
        if (onWithdraw) onWithdraw(`❌ Problem In Withdrawing: ${err.message}`);
    }
}

const deposit = async ({ username, amount }: Transaction, onDeposit: ((msg: string) => void) | undefined = undefined) => {
    try {
        const account = await db.account.findUnique({
            where: { username }
        });
        if (!account) throw new Error("Account not found.");
        const newBalance = account.balance + parseFloat(amount.toString());
        await db.account.update({
            where: { username },
            data: { balance: newBalance }
        });
        console.log(`\n ✅ Amount ${amount} Deposited Successfully`);
        if (onDeposit) onDeposit(`✅ Amount ${amount} Deposited Successfully`);
    } catch (err: any) {
        console.log(`\n ❌ Problem In Depositing`, err);
        if (onDeposit) onDeposit(`❌ Problem In Depositing: ${err.message}`);
    }
}

const transfer = async ({ srcUsername, destUsername, amount }: Transfer, onTransfer: ((msg: string) => void) | undefined = undefined) => {
    try {
        const withdrawResult = await withdraw({ username: srcUsername, amount });
        const depositResult = await deposit({ username: destUsername, amount });
        console.log(`✅ Amount ${amount} Transferred Successfully`);
        if (onTransfer) onTransfer(`✅ Amount ${amount} Transferred Successfully`);
    } catch (err: any) {
        console.log(`❌ Problem In Transferring: ${err.message}`);
        if (onTransfer) onTransfer(`❌ Problem In Transferring: ${err.message}`);
    }
}

const balance = async (username: string, onBalance: ((balance: number | string) => void) | undefined = undefined) => {
    console.log(username)
    try {
        const account = await db.account.findUnique({
            where: { username }
        });
        if (!account) throw new Error("Account not found.");
        console.log(`\n 💰 Your Account Balance Is : ${account.balance}`);
        if (onBalance) onBalance(account.balance);
    } catch (err: any) {
        console.log(`\n ❌ Problem In Fetching the balance`, err);
        if (onBalance) onBalance(`❌ Problem In Fetching the balance: ${err.message}`);
    }
}
const findUserByUsernameAndPassword = async (username: string, password: string) => {
    const account = await db.account.findUnique({
        where: { username }
    });
    if (!account) return null;
    const isMatch = await bcrypt.compare(password, account.password);
    return isMatch ? account : null;
}

export {
    createNewAccount, deposit, withdraw, transfer, balance, findUserByUsernameAndPassword
}
