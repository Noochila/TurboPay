
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcrypt";
import db from "@repo/db/client"

import { z } from "zod"
import { UserSchemaType } from "@repo/common/UserSchemaType"
import { UserSchema } from "@repo/common/UserSchema";


export const authProvider = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',

            credentials: {
                email: { label: "email", type: "email", placeholder: "a@b.com" },
                password: { label: "Password", type: "password" },
                number: { label: "number", type: "number" },
                name: { label: "name", type: "text" },

            },
            async authorize(credentials: any) {
        
                const SchemaCurrent = UserSchema.safeParse(credentials);
                if (!SchemaCurrent.success) {
                    return null;
                }
                const hashedPassword = await bcrypt.hash(credentials.password, 10);
                const existingUser = await db.user.findFirst({
                    where: {
                        email: credentials.email
                    }
                });

                if (existingUser) {
                    const passwordValidation = await bcrypt.compare(credentials.password, existingUser.password);
                    if (passwordValidation) {
                        return {
                            id: existingUser.id.toString(),
                            name: existingUser.name,
                            email: existingUser.email
                        }
                    }
                    return null;
                }

                try {
                    const user = await db.user.create({
                        data: {
                            number: credentials.number,
                            password: hashedPassword,
                            email: credentials.email,
                            name: credentials.name,
                            Balance: {
                                create: {
                                    amount: 0,
                                    locked: 0
                                }
                            }
                        }
                    });

                    return {
                        id: user.id.toString(),
                        name: user.name,
                        email: user.number
                    }
                } catch (e) {
                    console.error(e);
                }

                return null
            },
        })
    ],
    // eslint-disable-next-line turbo/no-undeclared-env-vars
    secret: process.env.AUTH_SECRET || "secret",
    callbacks: {
        async session({ token, session }: any) {
            session.user.id = token.sub
            return session
        }

    }
}