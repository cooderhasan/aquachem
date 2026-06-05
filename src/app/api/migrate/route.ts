import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import * as schema from '@/db/schema';
import fs from 'fs';
import path from 'path';
import { sql } from 'drizzle-orm';

// Resimlerin saklanacağı uploads klasörü yolu
const UPLOADS_DIR = process.env.NODE_ENV === 'production'
  ? '/app/public/uploads'
  : path.join(process.cwd(), 'public', 'uploads');

// Sırasıyla tablolar ve db schema karşılıkları
const TABLE_SCHEMAS: Record<string, any> = {
  categories: schema.categories,
  products: schema.products,
  posts: schema.posts,
  references: schema.references,
  certificates: schema.certificates,
  settings: schema.settings,
  hero_slides: schema.heroSlides,
  mission_cards: schema.missionCards,
  innovation_items: schema.innovationItems,
  contact_locations: schema.contactLocations,
  activity_items: schema.activityItems,
  stats: schema.stats,
  admins: schema.admins,
};

// Resim içeren alanlar
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

// Resmi URL'den indirip diske kaydeden fonksiyon
async function downloadFile(fileUrl: string, fileName: string): Promise<boolean> {
  const destPath = path.join(UPLOADS_DIR, fileName);
  
  if (fs.existsSync(destPath)) {
    return true; // Zaten varsa atla
  }

  try {
    const res = await fetch(fileUrl);
    if (!res.ok) return false;
    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Klasör yoksa oluştur
    if (!fs.existsSync(UPLOADS_DIR)) {
      fs.mkdirSync(UPLOADS_DIR, { recursive: true });
    }
    
    fs.writeFileSync(destPath, buffer);
    return true;
  } catch (err) {
    console.error(`Resim indirme hatası (${fileUrl}):`, err);
    return false;
  }
}

// Bir satırdaki tüm resim alanlarını tara ve indir
async function processRowImages(row: any, imageFields: string[], sourceSite: string) {
  for (const field of imageFields) {
    const value = row[field];
    if (!value) continue;

    const downloadList: string[] = [];
    if (field === 'images') {
      try {
        const parsed = typeof value === 'string' ? JSON.parse(value) : value;
        if (Array.isArray(parsed)) {
          downloadList.push(...parsed);
        }
      } catch {
        downloadList.push(value);
      }
    } else {
      downloadList.push(value);
    }

    for (const imgPath of downloadList) {
      if (typeof imgPath === 'string' && (imgPath.startsWith('/api/files/') || imgPath.startsWith('/uploads/'))) {
        const fileName = imgPath.replace('/api/files/', '').replace('/uploads/', '');
        const fullUrl = `${sourceSite.replace(/\/$/, '')}${imgPath}`;
        await downloadFile(fullUrl, fileName);
      }
    }
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const source = searchParams.get('source');
    const secret = searchParams.get('secret');

    if (!source || !secret) {
      return NextResponse.json({ error: 'Eksik parametreler (source ve secret gerekli)' }, { status: 400 });
    }

    // 1. Eski siteden verileri JSON olarak çek
    const apiUrl = `${source.replace(/\/$/, '')}/api/export-data?secret=${secret}`;
    console.log(`📡 Göç başlatılıyor: ${apiUrl}`);
    
    const res = await fetch(apiUrl);
    if (!res.ok) {
      return NextResponse.json({ 
        error: `Eski siteden veri çekilemedi. HTTP Durum Kodu: ${res.status}. Eski sitenin env ayarlarını kontrol edin.` 
      }, { status: 500 });
    }

    const json = await res.json();
    if (!json.success || !json.data) {
      return NextResponse.json({ error: 'Eski site API\'si başarısız yanıt verdi.' }, { status: 500 });
    }

    const migrationData = json.data;
    const stats: Record<string, number> = {};

    // 2. Her tabloyu sırayla içe aktar
    for (const [tableName, rows] of Object.entries(migrationData)) {
      const tableSchema = TABLE_SCHEMAS[tableName];
      if (!tableSchema || !Array.isArray(rows) || rows.length === 0) {
        continue;
      }

      console.log(`📦 ${tableName} tablosu aktarılıyor (${rows.length} kayıt)...`);
      stats[tableName] = 0;

      // Resimleri indir
      const imageFields = TABLE_IMAGE_FIELDS[tableName] || [];
      if (imageFields.length > 0) {
        for (const row of rows) {
          await processRowImages(row, imageFields, source);
        }
      }

      // Veritabanına ekle
      for (const row of rows) {
        // Obje olan alanları serialize et (features, social_media, menu_items vb.)
        const parsedRow: any = {};
        for (const [key, val] of Object.entries(row)) {
          // Snake case key dönüşümlerini Drizzle şemasına uydur
          let camelKey = key;
          if (key.includes('_')) {
            camelKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
          }

          // Drizzle şemasında bu sütun var mı kontrol et
          if (camelKey in tableSchema) {
            if (val !== null && typeof val === 'object' && !(val instanceof Date)) {
              parsedRow[camelKey] = val; // Drizzle jsonb için otomatik deserialize objeleri kabul eder
            } else if (val === 'true') {
              parsedRow[camelKey] = true;
            } else if (val === 'false') {
              parsedRow[camelKey] = false;
            } else {
              parsedRow[camelKey] = val;
            }
          }
        }

        try {
          // ON CONFLICT (id) DO NOTHING veya Drizzle insert
          await db.insert(tableSchema).values(parsedRow).onConflictDoNothing();
          stats[tableName]++;
        } catch (insertError: any) {
          console.error(`Ekleme hatası (${tableName}, ID: ${row.id}):`, insertError.message);
        }
      }

      // Auto-increment sequence sıfırla
      try {
        await db.execute(sql`SELECT setval(pg_get_serial_sequence(${tableName}, 'id'), COALESCE((SELECT MAX(id) FROM ${sql.raw(tableName)}), 0) + 1, false)`);
      } catch {
        // Sequence yoksa yoksay
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Göç işlemi başarıyla tamamlandı!',
      details: stats
    });

  } catch (error: any) {
    console.error('Migration API Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
