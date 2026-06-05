/**
 * EXPORT SCRIPT - Eski sunucudaki verileri XML'e aktarır
 * 
 * Kullanım:
 *   npx tsx src/scripts/export-xml.ts
 * 
 * Çalıştırmadan önce .env dosyasındaki DATABASE_URL'in
 * eski (kaynak) sunucuya ait olduğundan emin olun.
 * 
 * Çıktı: Proje kök dizininde "migration_data.xml" dosyası oluşturur.
 */

import { Pool } from 'pg';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// .env dosyasını yükle
// Önce .env yükle (dış IP), sonra .env.production (sadece eksik değişkenler için)
dotenv.config();
dotenv.config({ path: path.resolve(process.cwd(), '.env.production') });

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
    console.error('❌ DATABASE_URL bulunamadı! .env dosyasını kontrol edin.');
    process.exit(1);
}

const pool = new Pool({ connectionString: DATABASE_URL });

// XML'de özel karakterleri escape et
function escapeXml(str: string | null | undefined): string {
    if (str == null) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

// Bir satırı XML etiketlerine dönüştür
function rowToXml(row: Record<string, unknown>, indent: string = '      '): string {
    let xml = '';
    for (const [key, value] of Object.entries(row)) {
        if (value === null || value === undefined) {
            xml += `${indent}<${key}/>\n`;
        } else if (typeof value === 'object') {
            // JSON verileri (features, socialMedia vb.)
            xml += `${indent}<${key}><![CDATA[${JSON.stringify(value)}]]></${key}>\n`;
        } else {
            xml += `${indent}<${key}>${escapeXml(String(value))}</${key}>\n`;
        }
    }
    return xml;
}

// Bir tabloyu sorguala ve XML'e dönüştür
async function exportTable(tableName: string): Promise<string> {
    try {
        const result = await pool.query(`SELECT * FROM "${tableName}" ORDER BY id ASC`);
        if (result.rows.length === 0) {
            console.log(`  ⚠️  ${tableName}: Boş tablo (0 kayıt)`);
            return `  <${tableName}>\n  </${tableName}>\n`;
        }
        
        let xml = `  <${tableName}>\n`;
        for (const row of result.rows) {
            xml += `    <row>\n`;
            xml += rowToXml(row);
            xml += `    </row>\n`;
        }
        xml += `  </${tableName}>\n`;
        
        console.log(`  ✅ ${tableName}: ${result.rows.length} kayıt aktarıldı`);
        return xml;
    } catch (error: unknown) {
        const msg = error instanceof Error ? error.message : String(error);
        console.log(`  ⚠️  ${tableName}: Tablo bulunamadı veya hata oluştu (${msg})`);
        return `  <${tableName}>\n  </${tableName}>\n`;
    }
}

async function main() {
    console.log('');
    console.log('🚀 AquaChems Veri Dışa Aktarma Başlıyor...');
    console.log('📦 Veritabanı:', DATABASE_URL?.replace(/:[^:@]+@/, ':***@'));
    console.log('');

    // Aktarılacak tablolar
    const tables = [
        'categories',
        'products',
        'posts',
        'references',
        'certificates',
        'settings',
        'hero_slides',
        'mission_cards',
        'innovation_items',
        'contact_locations',
        'activity_items',
        'stats',
        'admins',
        'messages',
        'quote_requests',
        'applications',
    ];

    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<migration>\n';
    xml += `  <exportDate>${new Date().toISOString()}</exportDate>\n`;

    for (const table of tables) {
        xml += await exportTable(table);
    }

    xml += '</migration>\n';

    // Dosyayı kaydet
    const outputPath = path.join(process.cwd(), 'migration_data.xml');
    fs.writeFileSync(outputPath, xml, 'utf-8');

    console.log('');
    console.log(`✅ Tamamlandı! Dosya: ${outputPath}`);
    console.log(`📁 Dosya boyutu: ${(fs.statSync(outputPath).size / 1024).toFixed(1)} KB`);
    console.log('');

    await pool.end();
    process.exit(0);
}

main().catch((err) => {
    console.error('❌ Hata:', err);
    process.exit(1);
});
