import NextAuth from "next-auth/next";
import { authProvider } from "../../../lib/auth";

const fn=NextAuth(authProvider)


export const GET=fn;
export const POST=fn;


