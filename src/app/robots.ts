import { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                // Uploaded product/news images are served from /api/files — allow them explicitly
                // (more specific rule wins over the /api disallow).
                allow: ['/', '/api/files/'],
                disallow: ['/admin', '/api/'],
            },
        ],
        sitemap: `${SITE_URL}/sitemap.xml`,
        host: SITE_URL,
    };
}
