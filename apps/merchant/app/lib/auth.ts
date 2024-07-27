import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github"
import { sign } from "crypto";
import { Providers } from "../provider";
import db from "@repo/db/client"

export const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || ""
        }),
        GitHubProvider({
            clientId: process.env.GITHUB_ID || "",
            clientSecret: process.env.GITHUB_SECRET || ""
        })
    ],
    callbacks: {
        async signIn({ user, account }: {
            user: {
                email: string;
                name: string;
            },
            account: {
                provider: "google" | "github";

            }
        }) {
            console.log("h1 signIn callback")
            if (!user || !user.email) {
                return false
            }

            await db.merchant.upsert({
                select: {
                    id: true
                }, where: {
                    email: user.email
                }, create: {
                    email: user.email,
                    name: user.name,
                    auth_type: account.provider === "google" ? "Google" : "Github"
                },
                update: {
                    name: user.name,
                    auth_type: account.provider === "google" ? "Google" : "Github"
                }
            })

            return true;
        }
    },
    secret: process.env.JWT_SECRET,

}