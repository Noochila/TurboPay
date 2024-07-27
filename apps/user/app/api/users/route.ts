import { getServerSession } from "next-auth"
import { NextResponse } from "next/server";
import { authProvider } from "../../lib/auth";

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authProvider);
        if (!session)
            return NextResponse.redirect(new URL('/api/auth/signin', req.url))
        else {
            return NextResponse.json({ name: session.user.name,email:session.user.email });
        }
    } catch (error) {
        return NextResponse.json({ error: 'An error occurred while processing your request.' });
    }
}
