import { NextResponse } from 'next/server';
import { SITE_URL } from '@/lib/seo';

export function GET() {
    return NextResponse.redirect(`${SITE_URL}/tr/products`, 301);
}
