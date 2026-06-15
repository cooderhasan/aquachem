import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decrypt } from '@/lib/auth';
import { locales, defaultLocale } from '@/lib/i18n';

export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;

    // 1. Redirect /uploads/* to /api/files/* for file serving in standalone mode
    if (path.startsWith('/uploads/')) {
        const fileName = path.replace('/uploads/', '');
        return NextResponse.redirect(new URL(`/api/files/${fileName}`, request.url));
    }

    // 2. Protect /admin routes
    if (path.startsWith('/admin') && !path.startsWith('/admin/login')) {
        const session = request.cookies.get('session')?.value;

        if (!session) {
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }

        try {
            await decrypt(session);
        } catch (e) {
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }
    }

    // 3. Skip locale handling for admin, api, _next, static files
    if (
        path.startsWith('/admin') ||
        path.startsWith('/api') ||
        path.startsWith('/_next') ||
        path.includes('.') // static files like favicon.ico, robots.txt etc.
    ) {
        return NextResponse.next();
    }

    // 4. Check if the pathname already has a supported locale
    const pathLocale = locales.find(
        (locale) => path === `/${locale}` || path.startsWith(`/${locale}/`)
    );

    if (pathLocale) {
        // Already has a valid locale, continue
        return NextResponse.next();
    }

    // 5. No locale in path — redirect to default locale (tr)
    // e.g., / → /tr, /products → /tr/products
    const newPath = `/${defaultLocale}${path === '/' ? '' : path}`;
    return NextResponse.redirect(new URL(newPath, request.url));
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
};
