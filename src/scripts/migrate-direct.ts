/**
 * MIGRATION DIRECT SCRIPT - Eski sitedeki API'den verileri doğrudan çekip aktarır.
 * 
 * Kullanım:
 *   npx tsx src/scripts/migrate-direct.ts <eski_site_adresi> <secret_key>
 * 
 * Örnek:
 *   npx tsx src/scripts/migrate-direct.ts https://aquachems.com aquachems_backup_secret_key_2026
 */

import { Pool } from 'pg';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import * as https from 'https';
import * as http from 'http';

// .env yükle
dotenv.config();
dotenv.config({ path: path.resolve(process.cwd(), '.env.production') });

const DATABASE_URL = process.env.DATABASE_URL as string;
if (!DATABASE_URL) {
    console.error('❌ DATABASE_URL bulunamadı! .env dosyasını kontrol edin.');
    process.exit(1);
}

const SOURCE_SITE = process.argv[2];
const SECRET_KEY = process.argv[3];

if (!SOURCE_SITE || !SECRET_KEY) {
    console.error('❌ Eksik parametre girdiniz!');
    console.error('   Kullanım: npx tsx src/scripts/migrate-direct.ts <eski_site_adresi> <secret_key>');
    process.exit(1);
}

const pool = new Pool({ connectionString: DATABASE_URL });

const UPLOADS_DIR = process.env.NODE_ENV === 'production'
    ? '/app/public/uploads'
    : path.join(process.cwd(), 'public', 'uploads');

// ----- YARDIMCI METOTLAR -----

function downloadFile(url: string, destPath: string): Promise<boolean> {
    return new Promise((resolve) => {
        const client = url.startsWith('https') ? https : http;

        const dir = path.dirname(destPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        // Dosya zaten varsa tekrar indirme
        if (fs.existsSync(destPath)) {
            resolve(true);
            return;
        }

        const file = fs.createWriteStream(destPath);
        client.get(url, { timeout: 30000 }, (response) => {
            // Redirect takibi (301/302)
            if (response.statusCode === 301 || response.statusCode === 302) {
                const redirectUrl = response.headers.location;
                if (redirectUrl) {
                    file.close();
                    fs.unlinkSync(destPath);
                    downloadFile(redirectUrl, destPath).then(resolve);
                    return;
                }
            }

            if (response.statusCode !== 200) {
                file.close();
                try { fs.unlinkSync(destPath); } catch { /* ignore */ }
                resolve(false);
                return;
            }

            response.pipe(file);
            file.on('finish', () => {
                file.close();
                resolve(true);
            });
        }).on('error', () => {
            file.close();
            try { fs.unlinkSync(destPath); } catch { /* ignore */ }
            resolve(false);
        });
    });
}

async function downloadImage(imageUrl: string): Promise<boolean> {
    if (!imageUrl || imageUrl === '') return true;

    let fileName = '';
    if (imageUrl.startsWith('/api/files/')) {
        fileName = imageUrl.replace('/api/files/', '');
    } else if (imageUrl.startsWith('/uploads/')) {
        fileName = imageUrl.replace('/uploads/', '');
    } else {
        return true; // Bilinmeyen format
    }

    const fullUrl = `${SOURCE_SITE.replace(/\/$/, '')}${imageUrl}`;
    const destPath = path.join(UPLOADS_DIR, fileName);

    const success = await downloadFile(fullUrl, destPath);
    if (success) {
        process.stdout.write('.');
    } else {
        process.stdout.write('✗');
        console.error(`\n  ⚠️  İndirilemedi: ${fullUrl}`);
    }
    return success;
}

async function downloadImagesFromRow(row: Record<string, any>, imageFields: string[]) {
    for (const field of imageFields) {
        const value = row[field];
        if (value && typeof value === 'string') {
            if (field === 'images') {
                try {
                    const imgs = JSON.parse(value) as string[];
                    for (const img of imgs) {
                        await downloadImage(img);
                    }
                } catch {
                    await downloadImage(value);
                }
            } else {
                await downloadImage(value);
            }
        } else if (value && Array.isArray(value)) {
            for (const img of value) {
                if (typeof img === 'string') {
                    await downloadImage(img);
                }
            }
        }
    }
}

async function insertRows(tableName: string, rows: Record<string, any>[]): Promise<number> {
    if (rows.length === 0) return 0;
    let count = 0;

    for (const row of rows) {
        const keys = Object.keys(row).filter(k => row[k] !== null && row[k] !== undefined);
        if (keys.length === 0) continue;

        const values = keys.map(k => {
            const val = row[k];
            // Objeleri JSON string olarak DB'ye yaz
            if (typeof val === 'object' && !(val instanceof Date)) {
                return JSON.stringify(val);
            }
            return val;
        });

        const placeholders = keys.map((_, i) => `$${i + 1}`);
        const columns = keys.map(k => {
            const snakeKey = k.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
            return `"${snakeKey}"`;
        });

        const query = `INSERT INTO "${tableName}" (${columns.join(', ')}) VALUES (${placeholders.join(', ')}) ON CONFLICT (id) DO NOTHING`;

        try {
            await pool.query(query, values);
            count++;
        } catch (err: any) {
            console.error(`\n  ⚠️  INSERT hatası (${tableName}): ${err.message}`);
        }
    }

    return count;
}

async function resetSequence(tableName: string) {
    try {
        await pool.query(`SELECT setval(pg_get_serial_sequence('"${tableName}"', 'id'), COALESCE((SELECT MAX(id) FROM "${tableName}"), 0) + 1, false)`);
    } catch {
        // Hata durumunda yoksay (Sequence yoksa)
    }
}

// ----- TABLO İMAJ EŞLEŞTİRMELERİ -----
const TABLE_IMAGE_FIELDS: Record<string, string[]> = {
    categories: ['image'],
    products: ['image', 'images'],
    posts: ['image'],
    references: ['image'],
    certificates: ['image'],
    settings: ['logo', 'favicon', 'about_image', 'og_image', 'footer_logo', 'catalog_url'],
    hero_slides: ['image'],
    mission_cards: ['image'],
    innovation_items: ['image'],
};

async function main() {
    console.log('');
    console.log('🚀 Doğrudan API Göçü (Migration) Başlıyor...');
    console.log('🌐 Kaynak Site:', SOURCE_SITE);
    console.log('📦 Hedef Veritabanı:', DATABASE_URL.replace(/:[^:@]+@/, ':***@'));
    console.log('📁 Uploads Klasörü:', UPLOADS_DIR);
    console.log('');

    if (!fs.existsSync(UPLOADS_DIR)) {
        fs.mkdirSync(UPLOADS_DIR, { recursive: true });
        console.log('📁 Uploads klasörü oluşturuldu.');
    }

    // 1. Eski siteden verileri JSON olarak çek
    const apiUrl = `${SOURCE_SITE.replace(/\/$/, '')}/api/export-data?secret=${SECRET_KEY}`;
    console.log(`📡 Veriler eski siteden çekiliyor...`);

    const fetchData = (): Promise<any> => {
        return new Promise((resolve, reject) => {
            const client = apiUrl.startsWith('https') ? https : http;
            client.get(apiUrl, (res) => {
                let data = '';
                if (res.statusCode !== 200) {
                    reject(new Error(`API HTTP Durum Kodu: ${res.statusCode}`));
                    return;
                }
                res.on('data', (chunk) => data += chunk);
                res.on('end', () => {
                    try {
                        resolve(JSON.parse(data));
                    } catch (e) {
                        reject(new Error('API yanıtı geçerli bir JSON değil.'));
                    }
                });
            }).on('error', (err) => reject(err));
        });
    };

    let response;
    try {
        response = await fetchData();
    } catch (err: any) {
        console.error(`❌ Eski siteden veriler çekilemedi!`);
        console.error(`   Hata detay: ${err.message}`);
        console.error(`   Eski sitedeki uygulamanın güncel olduğundan ve yayında olduğundan emin olun.`);
        process.exit(1);
    }

    if (!response.success || !response.data) {
        console.error(`❌ API hatası:`, response.error || 'Veri bulunamadı.');
        process.exit(1);
    }

    const migrationData = response.data;
    let totalRecords = 0;

    // 2. Her tabloyu işle
    for (const [tableName, rows] of Object.entries(migrationData)) {
        if (!Array.isArray(rows) || rows.length === 0) {
            console.log(`  ⏭️  ${tableName}: 0 kayıt, atlanıyor`);
            continue;
        }

        console.log(`\n  📦 Tablo işleniyor: ${tableName} (${rows.length} kayıt)`);

        // Resimleri indir
        const imageFields = TABLE_IMAGE_FIELDS[tableName] || [];
        if (imageFields.length > 0) {
            process.stdout.write(`  📥 Resimler indiriliyor `);
            for (const row of rows) {
                await downloadImagesFromRow(row, imageFields);
            }
            console.log(' [Bitti]');
        }

        // Veritabanına yaz
        const inserted = await insertRows(tableName, rows);
        totalRecords += inserted;
        console.log(`  ✅ ${tableName}: ${inserted} kayıt eklendi`);

        // Auto-increment sequence sıfırla
        await resetSequence(tableName);
    }

    console.log('\n══════════════════════════════════════');
    console.log(`🎉 Tebrikler! Göç işlemi başarıyla tamamlandı.`);
    console.log(`📊 Toplam ${totalRecords} kayıt aktarıldı ve resimler indirildi.`);
    console.log('══════════════════════════════════════\n');

    await pool.end();
    process.exit(0);
}

main().catch((err) => {
    console.error('❌ Çalışma zamanı hatası:', err);
    process.exit(1);
});
