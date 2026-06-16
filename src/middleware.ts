import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decrypt } from '@/lib/auth';
import { locales, defaultLocale } from '@/lib/i18n';

function getPreferredLocale(request: NextRequest): string {
    const acceptLanguage = request.headers.get('accept-language');
    if (!acceptLanguage) return defaultLocale;

    try {
        const parsedLangs = acceptLanguage.split(',').map(lang => {
            const [code, qVal] = lang.split(';q=');
            return {
                code: code.trim().split('-')[0].toLowerCase(),
                q: qVal ? parseFloat(qVal) : 1.0
            };
        });

        parsedLangs.sort((a, b) => b.q - a.q);

        for (const lang of parsedLangs) {
            if (locales.includes(lang.code as any)) {
                return lang.code;
            }
        }
    } catch (e) {
        console.error('Error parsing accept-language header:', e);
    }

    return defaultLocale;
}

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

    // 5. No locale in path — redirect to preferred locale based on browser settings
    // e.g., / → /en or /tr, /products → /en/products or /tr/products
    const preferredLocale = getPreferredLocale(request);
    const newPath = `/${preferredLocale}${path === '/' ? '' : path}`;
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
