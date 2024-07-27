import { z } from "zod"


export const MerchantSchema = z.object({
    id: z.number(),
    email: z.string().email({ message: "Invalid email address" }),
    name: z.string().optional(),
    auth_type: z.enum(["google", "email"])
})


export const UserSchema = z.object({
    csrfToken: z.string(),
    email: z.string().email({ message: "Invalid email address" }),
    name: z.string().optional(),
    number: z.string().optional(),
    password: z.string(),
})


export const OnRampSchema = z.enum(["Success", "Failure", "Processing"])

export const BalanceSchema = z.object({
    id: z.number(),
    userId: z.number(),
    amount: z.number({ message: "Invalid amount" }),
    locked: z.number(),
})

export const p2pTransferSchema = z.object({
    id: z.number(),
    amount: z.number({ message: "Invalid amount" }),
    timestamp: z.string(),
    fromUserId: z.number(),
    toUserId: z.number()
})

export type MerchantSchemaType = z.infer<typeof MerchantSchema>
export type UserSchemaType = z.infer<typeof UserSchema>
export type OnRampSchemaType = z.infer<typeof OnRampSchema>
export type BalanceSchemaType = z.infer<typeof BalanceSchema>