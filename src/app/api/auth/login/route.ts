import { NextResponse } from 'next/server';
import { encrypt } from '@/lib/auth';
import type { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
    const body = await request.json();
    const { username, password } = body;

    // HARDCODED ADMIN FOR NOW (Move to DB later if needed)
    if (username === 'admin' && password === 'Aqua@Chems2024!') {
        const session = await encrypt({ user: 'admin', expires: new Date(Date.now() + 24 * 60 * 60 * 1000) });

        const response = NextResponse.json({ success: true });
        response.cookies.set('session', session, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/'
        });

        return response;
    }

    return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
}
