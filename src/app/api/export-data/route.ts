import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { 
  categories, 
  products, 
  posts, 
  references, 
  certificates, 
  settings, 
  heroSlides, 
  missionCards, 
  innovationItems, 
  contactLocations, 
  activityItems, 
  stats, 
  admins 
} from '@/db/schema';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get('secret');

    // Güvenlik anahtarı kontrolü (.env'deki MIGRATION_SECRET veya varsayılan bir değer)
    const systemSecret = process.env.MIGRATION_SECRET || 'aquachems_backup_secret_key_2026';
    if (!secret || secret !== systemSecret) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('⏳ Veritabanı tabloları dışa aktarılmak üzere sorgulanıyor...');

    // Tüm verileri çek
    const [
      categoriesData,
      productsData,
      postsData,
      referencesData,
      certificatesData,
      settingsData,
      heroSlidesData,
      missionCardsData,
      innovationItemsData,
      contactLocationsData,
      activityItemsData,
      statsData,
      adminsData
    ] = await Promise.all([
      db.select().from(categories),
      db.select().from(products),
      db.select().from(posts),
      db.select().from(references),
      db.select().from(certificates),
      db.select().from(settings),
      db.select().from(heroSlides),
      db.select().from(missionCards),
      db.select().from(innovationItems),
      db.select().from(contactLocations),
      db.select().from(activityItems),
      db.select().from(stats),
      db.select().from(admins),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        categories: categoriesData,
        products: productsData,
        posts: postsData,
        references: referencesData,
        certificates: certificatesData,
        settings: settingsData,
        hero_slides: heroSlidesData,
        mission_cards: missionCardsData,
        innovation_items: innovationItemsData,
        contact_locations: contactLocationsData,
        activity_items: activityItemsData,
        stats: statsData,
        admins: adminsData,
      }
    });

  } catch (error: any) {
    console.error('Export API Error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error.message || 'Veriler çekilirken hata oluştu' 
    }, { status: 500 });
  }
}
