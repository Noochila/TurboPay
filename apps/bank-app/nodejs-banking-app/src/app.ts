// this code will help you to create a web application

import express, { Request, Response, NextFunction } from 'express';
import axios from 'axios';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { createNewAccount, deposit, withdraw, balance, transfer, findUserByUsernameAndPassword } from './db.js';
const app = express();
app.use(cors());
app.use(express.json()); // Use express.json() middleware globally

const port = 3100;

const accountSchema = z.object({
    username: z.string().nonempty({ message: "Username is required" }),
    acNm: z.string().nonempty({ message: "Account name is required" }),
    balance: z.number().nonnegative({ message: "Balance cannot be negative" }),
    password: z.string().nonempty({ message: "Password is required" })
});

const transferSchema = z.object({
    srcUsername: z.string().nonempty({ message: "Source username is required" }),
    destUsername: z.string().nonempty({ message: "Destination username is required" }),
    amount: z.number().positive({ message: "Amount must be positive" })
});

const transactionSchema = z.object({
    username: z.string().nonempty({ message: "Username is required" }),
    amount: z.number().positive({ message: "Amount must be positive" })
});

interface CustomRequest extends Request {
    token?: string;
}

// Middleware to sign username
app.use((req: CustomRequest, res: Response, next: NextFunction) => {
    if (req.path === '/create' || req.path === '/signin') {
        if (req.body.username) {
            req.token = jwt.sign({ username: req.body.username }, 'your-256-bit-secret');
        }
    }
    next();
});

app.post('/create', (req: CustomRequest, res: Response) => {
    const validation = accountSchema.safeParse(req.body);
    if (!validation.success) {
        return res.status(400).json({ status: 'error', message: 'Invalid account data. Please ensure all fields are correctly filled and meet the requirements.' });
    }
    createNewAccount(validation.data, (msg: string) => {
        res.json({ 'status': 'success', 'message': msg, 'token': req.token, 'username': validation.data.username})
    })
})

app.post('/signin', async (req: CustomRequest, res: Response) => {
    // Implement sign-in logic here
    const { username, password } = req.body;
    const user = await findUserByUsernameAndPassword(username, password);
    if (!user) {
        return res.status(404).json({ status: 'error', message: 'User not found' });
    }
    res.json({ 'status': 'success', 'message': 'Signed in successfully', 'token': req.token });
});

app.get("/token", (req: Request, res: Response) => {
    const token = Math.floor(100000 + Math.random() * 900000); // Generates a 6-digit token
    res.json({ 'token': token })
})

app.put('/transfer', (req: Request, res: Response) => {
    const validation = transferSchema.safeParse(req.body);
    if (!validation.success) {
        return res.status(400).json({ status: 'error', message: 'Invalid transfer data. Please check the source and destination usernames and ensure the amount is positive.' });
    }
    transfer(validation.data, (msg: string) => {
        res.json({ 'status': 'success', 'message': msg })
    })
})

app.put('/withdraw', async (req: Request, res: Response) => {
    const validation = transactionSchema.safeParse(req.body);
    if (!validation.success) {
        return res.status(400).json({ status: 'error', message: 'Invalid withdrawal data. Please ensure the username is correct and the amount is positive.' });
    }
    withdraw(validation.data, (msg: string) => {
        res.json({ 'status': 'success', 'message': msg })
    })
})

app.put('/deposit', (req: Request, res: Response) => {
    const validation = transactionSchema.safeParse(req.body);
    if (!validation.success) {
        return res.status(400).json({ status: 'error', message: 'Invalid deposit data. Please ensure the username is correct and the amount is positive.' });
    }
    deposit(validation.data, (msg: string) => {
        res.json({ 'status': 'success', 'message': msg })
    })
})

app.put("/internetbanking", (req: Request, res: Response) => {
    const { token, amount, user_identifier, username } = req.query;
    const withdrawalData = {
        username: username as string,
        amount: Number(amount)
    };

    withdraw(withdrawalData, async (msg: string) => {
        try {
            const response = await axios.post('http://localhost:3003/dummyWebhook', {
                token,
                user_identifier
            });
            res.json({ 'status': 'success', 'message': 'Transaction completed and data sent to dummy bank.', 'dummyBankResponse': response.data });
        } catch (error: any) {
            res.status(500).json({ 'status': 'error', 'message': 'Failed to send data to dummy bank.', 'error': error.message });
        }
    });
})

app.get('/balance/:username', (req: Request, res: Response) => {
    const username = req.params.username

    if (!username) {
        return res.status(400).json({ 'status': 'error', 'message': 'Username is required' });
    }
    balance(username, (bal: string | number) => {
        if (typeof bal === 'number') {
            res.json({ 'balance': bal });
        } else {
            res.status(500).json({ 'status': 'error', 'message': 'Invalid balance type' });
        }
    })
})
app.listen(port, () => {
    console.log(`Banking App listening on port ${port}`)
})
