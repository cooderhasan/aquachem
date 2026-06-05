/**
 * FIX IMAGE URLS SCRIPT
 * 
 * DB'deki tüm "/api/files/..." ve "/uploads/..." URL'lerini
 * eski sitenin tam adresiyle günceller.
 * 
 * Kullanım:
 *   npx tsx src/scripts/fix-image-urls.ts
 * 
 * Örnek: "/api/files/abc.webp" → "https://aquachem.hasandurmus.com/api/files/abc.webp"
 */

import { Pool } from 'pg';
import * as dotenv from 'dotenv';
import * as path from 'path';

// .env yükle
dotenv.config();
dotenv.config({ path: path.resolve(process.cwd(), '.env.production') });

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
    console.error('❌ DATABASE_URL bulunamadı!');
    process.exit(1);
}

const OLD_SITE = 'https://aquachem.hasandurmus.com';
const pool = new Pool({ connectionString: DATABASE_URL });

// Hangi tablolarda hangi sütunlar resim içeriyor
const IMAGE_COLUMNS: Array<{ table: string; columns: string[] }> = [
    { table: 'references',       columns: ['image'] },
    { table: 'products',         columns: ['image', 'images'] },
    { table: 'categories',       columns: ['image'] },
    { table: 'posts',            columns: ['image'] },
    { table: 'certificates',     columns: ['image'] },
    { table: 'hero_slides',      columns: ['image'] },
    { table: 'mission_cards',    columns: ['image'] },
    { table: 'innovation_items', columns: ['image'] },
    { table: 'settings',         columns: ['logo', 'footer_logo', 'about_image', 'og_image', 'favicon'] },
];

/**
 * Tek bir URL'yi düzelt:
 * "/api/files/abc.webp" → "https://aquachem.hasandurmus.com/api/files/abc.webp"
 * "/uploads/abc.webp"   → "https://aquachem.hasandurmus.com/uploads/abc.webp"
 * Eğer zaten tam URL ise dokunma.
 */
function fixUrl(url: string | null): string | null {
    if (!url) return url;
    if (url.startsWith('/api/files/') || url.startsWith('/uploads/')) {
        return `${OLD_SITE}${url}`;
    }
    return url; // Zaten tam URL veya başka format, dokunma
}

/**
 * JSON array içindeki URL'leri düzelt (products.images gibi)
 */
function fixJsonArrayUrls(jsonStr: string | null): string | null {
    if (!jsonStr) return jsonStr;
    try {
        const arr = JSON.parse(jsonStr);
        if (Array.isArray(arr)) {
            const fixed = arr.map((item: any) => {
                if (typeof item === 'string') return fixUrl(item) ?? item;
                return item;
            });
            return JSON.stringify(fixed);
        }
    } catch {
        // JSON değilse düz URL olarak düzelt
        return fixUrl(jsonStr);
    }
    return jsonStr;
}

async function main() {
    console.log('');
    console.log('🔧 Resim URL Düzeltme Scripti Başlıyor...');
    console.log(`📡 Eski Site: ${OLD_SITE}`);
    console.log(`🗄️  Hedef DB: ${DATABASE_URL!.replace(/:[^:@]+@/, ':***@')}`);
    console.log('');

    let totalUpdated = 0;

    for (const { table, columns } of IMAGE_COLUMNS) {
        console.log(`\n📋 Tablo: ${table}`);

        for (const col of columns) {
            try {
                // Önce kaç kayıt etkilenecek görelim
                const countRes = await pool.query(
                    `SELECT COUNT(*) as cnt FROM "${table}" WHERE "${col}" IS NOT NULL AND ("${col}" LIKE '/api/files/%' OR "${col}" LIKE '/uploads/%')`
                );
                const count = parseInt(countRes.rows[0].cnt);
                
                if (count === 0) {
                    console.log(`  ✅ ${col}: Güncelleme gerektiren kayıt yok`);
                    continue;
                }

                console.log(`  🔄 ${col}: ${count} kayıt güncellenecek...`);

                // JSON array olan sütunlar (products.images) için özel işlem
                if (col === 'images') {
                    const rows = await pool.query(
                        `SELECT id, "${col}" FROM "${table}" WHERE "${col}" IS NOT NULL AND ("${col}" LIKE '%/api/files/%' OR "${col}" LIKE '%/uploads/%')`
                    );
                    
                    for (const row of rows.rows) {
                        const fixed = fixJsonArrayUrls(row[col]);
                        if (fixed !== row[col]) {
                            await pool.query(
                                `UPDATE "${table}" SET "${col}" = $1 WHERE id = $2`,
                                [fixed, row.id]
                            );
                        }
                    }
                    console.log(`  ✅ ${col}: ${rows.rows.length} kayıt güncellendi`);
                    totalUpdated += rows.rows.length;
                } else {
                    // Tekil URL sütunları için tek SQL ile güncelle
                    const result = await pool.query(
                        `UPDATE "${table}"
                         SET "${col}" = CASE
                             WHEN "${col}" LIKE '/api/files/%' THEN '${OLD_SITE}' || "${col}"
                             WHEN "${col}" LIKE '/uploads/%'   THEN '${OLD_SITE}' || "${col}"
                             ELSE "${col}"
                         END
                         WHERE "${col}" IS NOT NULL 
                           AND ("${col}" LIKE '/api/files/%' OR "${col}" LIKE '/uploads/%')`
                    );
                    console.log(`  ✅ ${col}: ${result.rowCount} kayıt güncellendi`);
                    totalUpdated += result.rowCount ?? 0;
                }
            } catch (err: any) {
                console.error(`  ❌ ${table}.${col} hata: ${err.message}`);
            }
        }
    }

    console.log('\n══════════════════════════════════════');
    console.log(`🎉 Tamamlandı! Toplam ${totalUpdated} alan güncellendi.`);
    console.log('══════════════════════════════════════\n');

    await pool.end();
    process.exit(0);
}

main().catch((err) => {
    console.error('❌ Script hatası:', err);
    process.exit(1);
});
