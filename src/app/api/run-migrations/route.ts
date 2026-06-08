import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { sql } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get('secret');

    // Simple auth check matching project's migration pattern
    if (secret !== 'aquachems_migrate_2026') {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
    }

    console.log('Running database schema migration queries...');

    // Run migrations using raw SQL with IF NOT EXISTS to prevent errors if run multiple times
    await db.execute(sql`ALTER TABLE "settings" ADD COLUMN IF NOT EXISTS "corporate_stat1_value" text DEFAULT '15+'`);
    await db.execute(sql`ALTER TABLE "settings" ADD COLUMN IF NOT EXISTS "corporate_stat1_label" text DEFAULT 'Yıllık Tecrübe'`);
    await db.execute(sql`ALTER TABLE "settings" ADD COLUMN IF NOT EXISTS "corporate_stat2_value" text DEFAULT '100+'`);
    await db.execute(sql`ALTER TABLE "settings" ADD COLUMN IF NOT EXISTS "corporate_stat2_label" text DEFAULT 'Tamamlanan Proje'`);
    await db.execute(sql`ALTER TABLE "settings" ADD COLUMN IF NOT EXISTS "site_slogan" text DEFAULT 'İnsanların yüzündeki gülümsemeyi görmek için çalışıyoruz'`);

    return NextResponse.json({
      success: true,
      message: 'Tablo şeması başarıyla güncellendi!'
    });
  } catch (error: any) {
    console.error('Migration error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
