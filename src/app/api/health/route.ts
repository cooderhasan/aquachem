import { NextResponse } from 'next/server';

// DB sorgusu yapmayan basit health check endpoint'i
// Docker HEALTHCHECK ve warmup bu endpoint'i kullanır
export async function GET() {
    return NextResponse.json({ status: 'ok' }, { status: 200 });
}
