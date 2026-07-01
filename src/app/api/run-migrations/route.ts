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
    await db.execute(sql`ALTER TABLE "settings" ADD COLUMN IF NOT EXISTS "site_slogan_font_size" integer DEFAULT 10`);
    await db.execute(sql`ALTER TABLE "settings" ADD COLUMN IF NOT EXISTS "home_section_order" jsonb DEFAULT '[]'`);
    await db.execute(sql`ALTER TABLE "settings" ADD COLUMN IF NOT EXISTS "hero_title_font_size" integer DEFAULT 48`);
    await db.execute(sql`ALTER TABLE "settings" ADD COLUMN IF NOT EXISTS "hero_title_color" text DEFAULT '#ffffff'`);
    await db.execute(sql`ALTER TABLE "settings" ADD COLUMN IF NOT EXISTS "hero_desc_font_size" integer DEFAULT 18`);
    await db.execute(sql`ALTER TABLE "settings" ADD COLUMN IF NOT EXISTS "hero_desc_color" text DEFAULT '#f1f5f9'`);
    await db.execute(sql`ALTER TABLE "settings" ADD COLUMN IF NOT EXISTS "hero_text_shadow_enabled" boolean DEFAULT true`);

    // Settings English columns
    await db.execute(sql`ALTER TABLE "settings" ADD COLUMN IF NOT EXISTS "site_title_en" text`);
    await db.execute(sql`ALTER TABLE "settings" ADD COLUMN IF NOT EXISTS "description_en" text`);
    await db.execute(sql`ALTER TABLE "settings" ADD COLUMN IF NOT EXISTS "about_us_en" text`);
    await db.execute(sql`ALTER TABLE "settings" ADD COLUMN IF NOT EXISTS "mission_en" text`);
    await db.execute(sql`ALTER TABLE "settings" ADD COLUMN IF NOT EXISTS "vision_en" text`);
    await db.execute(sql`ALTER TABLE "settings" ADD COLUMN IF NOT EXISTS "human_policy_en" text`);
    await db.execute(sql`ALTER TABLE "settings" ADD COLUMN IF NOT EXISTS "meta_title_en" text`);
    await db.execute(sql`ALTER TABLE "settings" ADD COLUMN IF NOT EXISTS "meta_description_en" text`);
    await db.execute(sql`ALTER TABLE "settings" ADD COLUMN IF NOT EXISTS "home_intro_title_en" text`);
    await db.execute(sql`ALTER TABLE "settings" ADD COLUMN IF NOT EXISTS "home_intro_description_en" text`);
    await db.execute(sql`ALTER TABLE "settings" ADD COLUMN IF NOT EXISTS "site_slogan_en" text DEFAULT 'We work to see the smile on people''s faces'`);
    await db.execute(sql`ALTER TABLE "settings" ADD COLUMN IF NOT EXISTS "logo_en" text`);
    await db.execute(sql`ALTER TABLE "settings" ADD COLUMN IF NOT EXISTS "footer_logo_en" text`);

    // Categories English columns
    await db.execute(sql`ALTER TABLE "categories" ADD COLUMN IF NOT EXISTS "title_en" text`);
    await db.execute(sql`ALTER TABLE "categories" ADD COLUMN IF NOT EXISTS "description_en" text`);

    // Products English columns
    await db.execute(sql`ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "title_en" text`);
    await db.execute(sql`ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "short_description_en" text`);
    await db.execute(sql`ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "description_en" text`);
    await db.execute(sql`ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "usage_en" text`);
    await db.execute(sql`ALTER TABLE "products" ADD COLUMN IF NOT EXISTS "features_en" jsonb`);

    // Posts English columns
    await db.execute(sql`ALTER TABLE "posts" ADD COLUMN IF NOT EXISTS "title_en" text`);
    await db.execute(sql`ALTER TABLE "posts" ADD COLUMN IF NOT EXISTS "content_en" text`);

    // Hero Slides English columns
    await db.execute(sql`ALTER TABLE "hero_slides" ADD COLUMN IF NOT EXISTS "title_en" text`);
    await db.execute(sql`ALTER TABLE "hero_slides" ADD COLUMN IF NOT EXISTS "description_en" text`);

    // Contact Locations English columns
    await db.execute(sql`ALTER TABLE "contact_locations" ADD COLUMN IF NOT EXISTS "title_en" text`);
    await db.execute(sql`ALTER TABLE "contact_locations" ADD COLUMN IF NOT EXISTS "address_en" text`);

    // Mission Cards English columns
    await db.execute(sql`ALTER TABLE "mission_cards" ADD COLUMN IF NOT EXISTS "title_en" text`);
    await db.execute(sql`ALTER TABLE "mission_cards" ADD COLUMN IF NOT EXISTS "description_en" text`);
    await db.execute(sql`ALTER TABLE "mission_cards" ADD COLUMN IF NOT EXISTS "features_en" jsonb`);

    // Innovation Items English columns
    await db.execute(sql`ALTER TABLE "innovation_items" ADD COLUMN IF NOT EXISTS "title_en" text`);
    await db.execute(sql`ALTER TABLE "innovation_items" ADD COLUMN IF NOT EXISTS "description_en" text`);

    // Activity Items English columns
    await db.execute(sql`ALTER TABLE "activity_items" ADD COLUMN IF NOT EXISTS "title_en" text`);

    return NextResponse.json({
      success: true,
      message: 'Tablo şeması başarıyla güncellendi!'
    });
  } catch (error: any) {
    console.error('Migration error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
