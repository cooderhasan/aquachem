
import { db } from '@/lib/db';
import { categories } from '@/db/schema';
import { categories as mockCategories } from '@/data/mockData';
import { eq } from 'drizzle-orm';

async function main() {
    console.log('Seeding categories...');

    for (const cat of mockCategories) {
        const existing = await db.select().from(categories).where(eq(categories.slug, cat.slug)).limit(1);

        if (existing.length === 0) {
            console.log(`Creating category: ${cat.title}`);
            await db.insert(categories).values({
                title: cat.title,
                slug: cat.slug,
                image: cat.image,
                description: `${cat.title} ürünleri`,
                order: cat.id
            });
        } else {
            console.log(`Category exists: ${cat.title}`);
        }
    }

    console.log('Seeding complete!');
    process.exit(0);
}

main().catch((err) => {
    console.error('Seeding failed:', err);
    process.exit(1);
});
