import express from "express";
import db from "@repo/db/client"
const app = express();

app.use(express.json())

app.post("/dummyWebhook", async (req, res) => {

    const paymentInformation: {
        token: string;
        userId: string;
        amount?: string

    } = {
        token: req.body.token,
        userId: req.body.user_identifier,

    };
    console.log(paymentInformation.token + " " + " " + paymentInformation.userId)


    const check = await db.onRampTransaction.findFirst({
        where: {
            token: paymentInformation.token,
            status: "Processing"
        }
    });

    if (!check) {
        res.status(400).json({
            message: "Transaction not found"
        });
        return; // Ensure no further processing if transaction not found
    } else {
        paymentInformation.amount = String(check.amount)
    }

    try {
        await db.$transaction([
            db.balance.updateMany({
                where: {
                    userId: Number(paymentInformation.userId)
                },
                data: {
                    amount: {
                        // You can also get this from your DB
                        increment: Number(paymentInformation.amount)
                    }
                }
            }),
            db.onRampTransaction.updateMany({
                where: {
                    token: paymentInformation.token
                },
                data: {
                    status: "Success",
                }
            })
        ]);

        res.json({
            message: "Captured"
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({
            message: "Error while processing webhook"
        });
    }

})

app.post("/dummyServiceHook", async (req, res) => {



    console.log(req.body)
    const { order_id, amount } = req.body;

    const check = await db.recharge.findFirst({
        where: {
            id: Number(order_id),
            status: "processing"
        }
    })

    if (!check) {
        res.status(400).json({
            message: "Transaction not found"

        })
        return;
    }

    try {
        await db.$transaction([
            db.balance.updateMany({
                where: {
                    userId: Number(check?.userId)
                },
                data: {
                    amount: {
                        // You can also get this from your DB
                        decrement: Number(amount)
                    }
                }
            }),
            db.recharge.updateMany({
                where: {
                    id: Number(order_id)
                },
                data: {
                    status: "success"
                }
            })
        ]);

        res.json({
            message: "Captured"
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({
            message: "Error while processing webhook"
        });
    }
})

app.listen(3003, () => {
    console.log("Server started at 3003")
});