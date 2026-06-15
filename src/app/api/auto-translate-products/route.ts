import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { products, categories } from '@/db/schema';
import { eq } from 'drizzle-orm';

export const dynamic = 'force-dynamic';

async function translateText(text: string | null | undefined): Promise<string> {
  if (!text) return '';
  const trimmed = text.trim();
  if (!trimmed) return '';
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=tr&tl=en&dt=t&q=${encodeURIComponent(trimmed)}`;
    const res = await fetch(url);
    if (!res.ok) {
      console.error('Translation API error:', res.statusText);
      return text;
    }
    const data = await res.json();
    if (data && data[0]) {
      return data[0].map((x: any) => x[0]).join('');
    }
    return text;
  } catch (e) {
    console.error('Translation failed:', e);
    return text;
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get('secret');
    const overwrite = searchParams.get('overwrite') === 'true';

    if (secret !== 'aquachems_migrate_2026') {
      return NextResponse.json({ error: 'Yetkisiz erişim' }, { status: 401 });
    }

    console.log('Fetching products and categories for auto-translation...');
    const allProducts = await db.select().from(products);
    const allCategories = await db.select().from(categories);

    let translatedProductsCount = 0;
    let translatedCategoriesCount = 0;

    // Translate Categories
    for (const cat of allCategories) {
      const needsTitle = overwrite || !cat.titleEn;
      const needsDesc = overwrite || !cat.descriptionEn;

      if (needsTitle || needsDesc) {
        const titleEn = needsTitle ? await translateText(cat.title) : cat.titleEn;
        const descriptionEn = (needsDesc && cat.description) ? await translateText(cat.description) : cat.descriptionEn;

        await db.update(categories).set({
          titleEn,
          descriptionEn
        }).where(eq(categories.id, cat.id));
        translatedCategoriesCount++;
        // Wait 100ms between requests to avoid rate limits
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    }

    // Translate Products
    for (const prod of allProducts) {
      const needsTitle = overwrite || !prod.titleEn;
      const needsShortDesc = overwrite || !prod.shortDescriptionEn;
      const needsDesc = overwrite || !prod.descriptionEn;
      const needsUsage = overwrite || !prod.usageEn;
      const needsFeatures = overwrite || !prod.featuresEn;

      if (needsTitle || needsShortDesc || needsDesc || needsUsage || needsFeatures) {
        const titleEn = needsTitle ? await translateText(prod.title) : prod.titleEn;
        const shortDescriptionEn = (needsShortDesc && prod.shortDescription) ? await translateText(prod.shortDescription) : prod.shortDescriptionEn;
        const descriptionEn = (needsDesc && prod.description) ? await translateText(prod.description) : prod.descriptionEn;
        const usageEn = (needsUsage && prod.usage) ? await translateText(prod.usage) : prod.usageEn;

        let featuresEn = prod.featuresEn;
        if (needsFeatures && prod.features && Array.isArray(prod.features)) {
          const trFeatures = prod.features as string[];
          const enFeatures = [];
          for (const feat of trFeatures) {
            if (feat) {
              const translatedFeat = await translateText(feat);
              enFeatures.push(translatedFeat);
            } else {
              enFeatures.push('');
            }
            await new Promise((resolve) => setTimeout(resolve, 50));
          }
          featuresEn = enFeatures;
        }

        await db.update(products).set({
          titleEn,
          shortDescriptionEn,
          descriptionEn,
          usageEn,
          featuresEn
        }).where(eq(products.id, prod.id));
        translatedProductsCount++;
        // Wait 100ms between products
        await new Promise((resolve) => setTimeout(resolve, 100));
      }
    }

    return NextResponse.json({
      success: true,
      translatedCategoriesCount,
      translatedProductsCount,
      message: `Başarıyla ${translatedProductsCount} ürün ve ${translatedCategoriesCount} kategori İngilizceye çevrildi ve güncellendi!`
    });
  } catch (error: any) {
    console.error('Auto-translation route error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
