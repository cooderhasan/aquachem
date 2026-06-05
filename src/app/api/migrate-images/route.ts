import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import * as schema from '@/db/schema';
import fs from 'fs';
import path from 'path';

const UPLOADS_DIR = process.env.NODE_ENV === 'production'
    ? '/app/public/uploads'
    : path.join(process.cwd(), 'public', 'uploads');

const OLD_SITE = 'https://aquachem.hasandurmus.com';

// Hangi tablolarda hangi sütunlar resim içeriyor
const IMAGE_COLUMNS: Array<{ table: any; name: string; columns: string[] }> = [
    { table: schema.references,      name: 'references',       columns: ['image'] },
    { table: schema.products,        name: 'products',          columns: ['image', 'images'] },
    { table: schema.categories,      name: 'categories',        columns: ['image'] },
    { table: schema.posts,           name: 'posts',             columns: ['image'] },
    { table: schema.certificates,    name: 'certificates',      columns: ['image'] },
    { table: schema.heroSlides,      name: 'hero_slides',       columns: ['image'] },
    { table: schema.missionCards,    name: 'mission_cards',     columns: ['image'] },
    { table: schema.innovationItems, name: 'innovation_items',  columns: ['image'] },
    { table: schema.settings,        name: 'settings',          columns: ['logo', 'footerLogo', 'aboutImage', 'ogImage', 'favicon'] },
];

async function downloadFile(url: string, destPath: string): Promise<{ ok: boolean; size?: number; error?: string }> {
    if (fs.existsSync(destPath)) {
        const stat = fs.statSync(destPath);
        return { ok: true, size: stat.size };
    }

    try {
        const res = await fetch(url, { signal: AbortSignal.timeout(15000) });
        if (!res.ok) return { ok: false, error: `HTTP ${res.status}` };

        const buf = Buffer.from(await res.arrayBuffer());
        if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });
        fs.writeFileSync(destPath, buf);
        return { ok: true, size: buf.length };
    } catch (err: any) {
        return { ok: false, error: err.message };
    }
}

function extractImageUrls(value: any): string[] {
    if (!value) return [];
    if (typeof value === 'string') {
        // JSON array olabilir (products.images)
        if (value.startsWith('[')) {
            try {
                const arr = JSON.parse(value);
                if (Array.isArray(arr)) return arr.filter((x: any) => typeof x === 'string');
            } catch { /* not json */ }
        }
        return [value];
    }
    if (Array.isArray(value)) return value.filter((x: any) => typeof x === 'string');
    return [];
}

function getFileName(imgPath: string): string | null {
    if (imgPath.startsWith('/api/files/')) return imgPath.replace('/api/files/', '');
    if (imgPath.startsWith('/uploads/')) return imgPath.replace('/uploads/', '');
    return null;
}

export async function GET(request: NextRequest) {
    const secret = request.nextUrl.searchParams.get('secret');
    if (secret !== process.env.MIGRATION_SECRET && secret !== 'aquachems_migrate_2026') {
        return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
    }

    if (!fs.existsSync(UPLOADS_DIR)) {
        fs.mkdirSync(UPLOADS_DIR, { recursive: true });
    }

    const log: string[] = [];
    let downloaded = 0;
    let skipped = 0;
    let failed = 0;

    log.push(`📁 Uploads klasörü: ${UPLOADS_DIR}`);
    log.push(`📡 Kaynak site: ${OLD_SITE}`);
    log.push('');

    for (const { table, name, columns } of IMAGE_COLUMNS) {
        try {
            const rows = await db.select().from(table);
            log.push(`📋 ${name}: ${rows.length} kayıt`);

            for (const row of rows) {
                for (const col of columns) {
                    const val = (row as any)[col];
                    const urls = extractImageUrls(val);

                    for (const imgUrl of urls) {
                        const fileName = getFileName(imgUrl);
                        if (!fileName) {
                            // Zaten tam URL veya bilinmeyen format
                            if (imgUrl.startsWith('http')) {
                                skipped++;
                            }
                            continue;
                        }

                        const srcUrl = `${OLD_SITE}/api/files/${fileName}`;
                        const destPath = path.join(UPLOADS_DIR, fileName);
                        const result = await downloadFile(srcUrl, destPath);

                        if (result.ok) {
                            if (result.size !== undefined) {
                                downloaded++;
                                log.push(`  ✅ ${fileName} (${Math.round(result.size / 1024)}KB)`);
                            } else {
                                skipped++;
                            }
                        } else {
                            failed++;
                            log.push(`  ❌ ${fileName}: ${result.error}`);
                        }
                    }
                }
            }
        } catch (err: any) {
            log.push(`  ⚠️  ${name} hatası: ${err.message}`);
        }
    }

    log.push('');
    log.push(`✅ İndirilen: ${downloaded} | Atlanılan (zaten var): ${skipped} | Başarısız: ${failed}`);

    // Klasördeki dosya sayısını da göster
    try {
        const files = fs.readdirSync(UPLOADS_DIR);
        log.push(`📦 Uploads klasöründe toplam ${files.length} dosya var`);
    } catch { /* ignore */ }

    return NextResponse.json({
        success: true,
        downloaded,
        skipped,
        failed,
        uploadsDir: UPLOADS_DIR,
        log,
    });
}
