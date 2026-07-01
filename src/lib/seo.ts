import { Metadata } from 'next';

export function getAlternates(lang: string, path: string) {
    const cleanPath = path === '/' ? '' : (path.startsWith('/') ? path : `/${path}`);
    return {
        canonical: `/${lang}${cleanPath}`,
        languages: {
            tr: `/tr${cleanPath}`,
            en: `/en${cleanPath}`,
        }
    };
}
