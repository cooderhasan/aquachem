/**
 * IMPORT SCRIPT - XML dosyasındaki verileri yeni veritabanına aktarır
 * ve resimleri eski siteden otomatik indirir.
 * 
 * Kullanım:
 *   npx tsx src/scripts/import-xml.ts https://eski-site-adresi.com
 * 
 * Örnek:
 *   npx tsx src/scripts/import-xml.ts https://aquachems.com
 * 
 * Çalıştırmadan önce .env dosyasındaki DATABASE_URL'in
 * yeni (hedef) sunucuya ait olduğundan emin olun.
 * 
 * Girdi: Proje kök dizinindeki "migration_data.xml" dosyası
 */

import { Pool } from 'pg';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import * as https from 'https';
import * as http from 'http';

// .env dosyasını yükle
dotenv.config({ path: path.resolve(process.cwd(), '.env.production') });
dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
    console.error('❌ DATABASE_URL bulunamadı! .env dosyasını kontrol edin.');
    process.exit(1);
}

// Eski sitenin URL'si (komut satırından alınır)
const OLD_SITE_URL = process.argv[2];
if (!OLD_SITE_URL) {
    console.error('❌ Eski site URL\'si belirtilmedi!');
    console.error('   Kullanım: npx tsx src/scripts/import-xml.ts https://eski-site.com');
    process.exit(1);
}

const pool = new Pool({ connectionString: DATABASE_URL });

// Uploads klasörü
const UPLOADS_DIR = process.env.NODE_ENV === 'production'
    ? '/app/public/uploads'
    : path.join(process.cwd(), 'public', 'uploads');

// ----- BASIT XML PARSER -----

function getTagContent(xml: string, tag: string): string {
    // CDATA içeriklerini de destekle
    const cdataRegex = new RegExp(`<${tag}><!\\[CDATA\\[([\\s\\S]*?)\\]\\]></${tag}>`, 'g');
    const cdataMatch = cdataRegex.exec(xml);
    if (cdataMatch) return cdataMatch[1];

    const regex = new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`, 'g');
    const match = regex.exec(xml);
    if (match) return unescapeXml(match[1]);

    // Boş etiket kontrolü (<tag/>)
    const emptyRegex = new RegExp(`<${tag}/>`, 'g');
    if (emptyRegex.test(xml)) return '';

    return '';
}

function getAllTagContents(xml: string, tag: string): string[] {
    const results: string[] = [];
    const regex = new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`, 'g');
    let match;
    while ((match = regex.exec(xml)) !== null) {
        results.push(match[1]);
    }
    return results;
}

function unescapeXml(str: string): string {
    return str
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&apos;/g, "'");
}

// ----- DOSYA İNDİRME -----

function downloadFile(url: string, destPath: string): Promise<boolean> {
    return new Promise((resolve) => {
        const client = url.startsWith('https') ? https : http;

        const dir = path.dirname(destPath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        // Zaten varsa indirme
        if (fs.existsSync(destPath)) {
            resolve(true);
            return;
        }

        const file = fs.createWriteStream(destPath);
        client.get(url, { timeout: 30000 }, (response) => {
            // Redirect takibi
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

// Resim URL'sinden dosya adını çıkar ve indir
async function downloadImage(imageUrl: string): Promise<boolean> {
    if (!imageUrl || imageUrl === '') return true;

    // /api/files/dosya-adi.ext formatını yakala
    let fileName = '';
    if (imageUrl.startsWith('/api/files/')) {
        fileName = imageUrl.replace('/api/files/', '');
    } else if (imageUrl.startsWith('/uploads/')) {
        fileName = imageUrl.replace('/uploads/', '');
    } else {
        return true; // Tanınmayan format, atla
    }

    const fullUrl = `${OLD_SITE_URL.replace(/\/$/, '')}${imageUrl}`;
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

// ----- TABLO İMPORT FONKSİYONLARI -----

function parseValue(val: string): unknown {
    if (val === '') return null;
    return val;
}

function parseRow(rowXml: string, columns: string[]): Record<string, unknown> {
    const row: Record<string, unknown> = {};
    for (const col of columns) {
        const value = getTagContent(rowXml, col);
        row[col] = parseValue(value);
    }
    return row;
}

// Bir satırdaki tüm resim alanlarını indir
async function downloadImagesFromRow(row: Record<string, unknown>, imageFields: string[]) {
    for (const field of imageFields) {
        const value = row[field];
        if (typeof value === 'string' && value !== '') {
            // "images" alanı JSON array olabilir
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
        }
    }
}

// Tabloyu INSERT et (id dahil)
async function insertRows(tableName: string, rows: Record<string, unknown>[]): Promise<number> {
    if (rows.length === 0) return 0;
    let count = 0;

    for (const row of rows) {
        // Boş satırları atla
        const keys = Object.keys(row).filter(k => row[k] !== null && row[k] !== undefined);
        if (keys.length === 0) continue;

        const values = keys.map(k => row[k]);
        const placeholders = keys.map((_, i) => `$${i + 1}`);
        const columns = keys.map(k => `"${k}"`);

        const query = `INSERT INTO "${tableName}" (${columns.join(', ')}) VALUES (${placeholders.join(', ')}) ON CONFLICT DO NOTHING`;

        try {
            await pool.query(query, values);
            count++;
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : String(err);
            console.error(`\n  ⚠️  INSERT hatası (${tableName}): ${msg}`);
        }
    }

    return count;
}

// Sequence (auto-increment) değerini güncelle
async function resetSequence(tableName: string) {
    try {
        await pool.query(`SELECT setval(pg_get_serial_sequence('"${tableName}"', 'id'), COALESCE((SELECT MAX(id) FROM "${tableName}"), 0) + 1, false)`);
    } catch {
        // Sequence yoksa sorun değil
    }
}

// ----- ANA İŞLEM -----

// Tablo yapılandırması: hangi sütunlar var, hangileri resim
interface TableConfig {
    xmlTag: string;
    dbTable: string;
    columns: string[];
    imageFields: string[];
}

const TABLE_CONFIGS: TableConfig[] = [
    {
        xmlTag: 'categories',
        dbTable: 'categories',
        columns: ['id', 'title', 'slug', 'description', 'image', 'order'],
        imageFields: ['image'],
    },
    {
        xmlTag: 'products',
        dbTable: 'products',
        columns: ['id', 'category_id', 'title', 'slug', 'short_description', 'description', 'usage', 'image', 'images', 'features', 'is_new', 'created_at'],
        imageFields: ['image', 'images'],
    },
    {
        xmlTag: 'posts',
        dbTable: 'posts',
        columns: ['id', 'title', 'slug', 'content', 'image', 'type', 'created_at'],
        imageFields: ['image'],
    },
    {
        xmlTag: 'references',
        dbTable: 'references',
        columns: ['id', 'title', 'category_id', 'image', 'order'],
        imageFields: ['image'],
    },
    {
        xmlTag: 'certificates',
        dbTable: 'certificates',
        columns: ['id', 'title', 'image', 'description'],
        imageFields: ['image'],
    },
    {
        xmlTag: 'settings',
        dbTable: 'settings',
        columns: ['id', 'site_title', 'description', 'logo', 'favicon', 'contact_email', 'contact_phone', 'address', 'social_media', 'about_us', 'mission', 'vision', 'human_policy', 'about_image', 'catalog_url', 'meta_title', 'meta_description', 'meta_keywords', 'og_image', 'whatsapp_number', 'footer_logo', 'logo_height', 'menu_font_size', 'header_padding', 'footer_logo_padding', 'references_scroll_speed', 'about_us_font_size', 'about_us_darkness', 'menu_items', 'reference_logo_height', 'hero_overlay_opacity', 'hero_gradient_opacity', 'home_intro_title', 'home_intro_description'],
        imageFields: ['logo', 'favicon', 'about_image', 'og_image', 'footer_logo', 'catalog_url'],
    },
    {
        xmlTag: 'hero_slides',
        dbTable: 'hero_slides',
        columns: ['id', 'title', 'description', 'image', 'link', 'button_text', 'order', 'is_active'],
        imageFields: ['image'],
    },
    {
        xmlTag: 'mission_cards',
        dbTable: 'mission_cards',
        columns: ['id', 'title', 'description', 'icon', 'image', 'features', 'order'],
        imageFields: ['image'],
    },
    {
        xmlTag: 'innovation_items',
        dbTable: 'innovation_items',
        columns: ['id', 'title', 'description', 'image', 'watermark_text', 'order'],
        imageFields: ['image'],
    },
    {
        xmlTag: 'contact_locations',
        dbTable: 'contact_locations',
        columns: ['id', 'title', 'address', 'phone', 'email', 'type', 'map_embed_code', 'order'],
        imageFields: [],
    },
    {
        xmlTag: 'activity_items',
        dbTable: 'activity_items',
        columns: ['id', 'title', 'order', 'is_active'],
        imageFields: [],
    },
    {
        xmlTag: 'stats',
        dbTable: 'stats',
        columns: ['id', 'label', 'value', 'icon', 'order'],
        imageFields: [],
    },
    {
        xmlTag: 'admins',
        dbTable: 'admins',
        columns: ['id', 'username', 'password', 'created_at'],
        imageFields: [],
    },
];

async function main() {
    console.log('');
    console.log('🚀 AquaChems Veri İçe Aktarma Başlıyor...');
    console.log('📦 Hedef DB:', DATABASE_URL?.replace(/:[^:@]+@/, ':***@'));
    console.log('🌐 Eski Site:', OLD_SITE_URL);
    console.log('📁 Uploads:', UPLOADS_DIR);
    console.log('');

    // Uploads klasörünü oluştur
    if (!fs.existsSync(UPLOADS_DIR)) {
        fs.mkdirSync(UPLOADS_DIR, { recursive: true });
        console.log('📁 Uploads klasörü oluşturuldu');
    }

    // XML dosyasını oku
    const xmlPath = path.join(process.cwd(), 'migration_data.xml');
    if (!fs.existsSync(xmlPath)) {
        console.error('❌ migration_data.xml bulunamadı!');
        console.error('   Önce export scriptini çalıştırın: npx tsx src/scripts/export-xml.ts');
        process.exit(1);
    }

    const xmlContent = fs.readFileSync(xmlPath, 'utf-8');
    console.log(`📄 XML dosyası okundu (${(Buffer.byteLength(xmlContent) / 1024).toFixed(1)} KB)`);
    console.log('');

    let totalRecords = 0;
    let totalImages = 0;

    for (const config of TABLE_CONFIGS) {
        const tableXml = getTagContent(xmlContent, config.xmlTag);
        if (!tableXml || tableXml.trim() === '') {
            console.log(`  ⏭️  ${config.dbTable}: XML'de veri yok, atlanıyor`);
            continue;
        }

        const rowXmls = getAllTagContents(tableXml, 'row');
        if (rowXmls.length === 0) {
            console.log(`  ⏭️  ${config.dbTable}: 0 kayıt`);
            continue;
        }

        // Satırları parse et
        const rows = rowXmls.map(r => parseRow(r, config.columns));

        // Resimleri indir
        if (config.imageFields.length > 0) {
            process.stdout.write(`  📥 ${config.dbTable}: Resimler indiriliyor `);
            for (const row of rows) {
                await downloadImagesFromRow(row, config.imageFields);
                totalImages++;
            }
            console.log('');
        }

        // features ve social_media gibi JSON alanlarını parse et
        for (const row of rows) {
            for (const key of Object.keys(row)) {
                if (key === 'features' || key === 'social_media' || key === 'menu_items') {
                    const val = row[key];
                    if (typeof val === 'string' && val !== '') {
                        try {
                            row[key] = JSON.parse(val);
                        } catch { /* string olarak bırak */ }
                    }
                }
                // Boolean alanları
                if (key === 'is_new' || key === 'is_read' || key === 'is_active') {
                    const val = row[key];
                    if (val === 'true') row[key] = true;
                    else if (val === 'false') row[key] = false;
                }
                // Integer alanları
                if (['id', 'category_id', 'order', 'logo_height', 'menu_font_size', 'header_padding',
                     'footer_logo_padding', 'references_scroll_speed', 'reference_logo_height',
                     'hero_overlay_opacity', 'hero_gradient_opacity'].includes(key)) {
                    const val = row[key];
                    if (typeof val === 'string' && val !== '' && !isNaN(Number(val))) {
                        row[key] = parseInt(val, 10);
                    }
                }
            }
        }

        // Veritabanına ekle
        const inserted = await insertRows(config.dbTable, rows);
        totalRecords += inserted;
        console.log(`  ✅ ${config.dbTable}: ${inserted}/${rowXmls.length} kayıt eklendi`);

        // Sequence'ı güncelle
        await resetSequence(config.dbTable);
    }

    console.log('');
    console.log('══════════════════════════════════════');
    console.log(`✅ Tamamlandı!`);
    console.log(`   📊 Toplam ${totalRecords} kayıt aktarıldı`);
    console.log(`   🖼️  Resim indirme işlemi tamamlandı`);
    console.log('══════════════════════════════════════');
    console.log('');

    await pool.end();
    process.exit(0);
}

main().catch((err) => {
    console.error('❌ Hata:', err);
    process.exit(1);
});
