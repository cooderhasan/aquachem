
import { db } from '@/lib/db';
import { categories, settings, contactLocations, activityItems, innovationItems, stats } from '@/db/schema';
import { categories as mockCategories } from '@/data/mockData';
import { eq } from 'drizzle-orm';

async function main() {
    console.log('Seeding database...');

    // 1. Categories
    console.log('Seeding categories...');
    for (const cat of mockCategories) {
        const existing = await db.select().from(categories).where(eq(categories.slug, cat.slug)).limit(1);
        if (existing.length === 0) {
            await db.insert(categories).values({
                title: cat.title,
                slug: cat.slug,
                image: cat.image,
                description: `${cat.title} ürünleri`,
                order: cat.id
            });
        }
    }

    // 2. Settings
    console.log('Seeding settings...');
    const existingSettings = await db.select().from(settings).limit(1);
    if (existingSettings.length === 0) {
        await db.insert(settings).values({
            siteTitle: 'Aquachems',
            description: 'Aquachems olarak endüstriyel çözümlerimizle değer katıyoruz.',
            socialMedia: {
                facebook: 'https://facebook.com',
                instagram: 'https://instagram.com',
                linkedin: 'https://linkedin.com',
                twitter: 'https://twitter.com'
            },
            aboutUs: 'Aquachems, endüstriyel temizlik, bakım ve hijyen kimyasalları alanında yenilikçi çözümler sunan öncü bir firmadır. Sürdürülebilirlik ve kaliteyi odağımıza alarak, müşterilerimizin ihtiyaçlarına özel formüller geliştiriyoruz.',
            mission: 'Çevreye duyarlı üretim teknolojileri ile endüstriyel hijyen standartlarını yükseltmek ve müşteri memnuniyetini en üst düzeye çıkarmak.',
            vision: 'Global pazarda tanınan, güvenilir ve inovasyon lideri bir kimya markası olmak.',
            humanPolicy: 'Çalışanlarımızın gelişimine değer veren, adil, şeffaf ve katılımcı bir yönetim anlayışı benimsiyoruz.'
        });
    }

    // 3. Contact Locations
    console.log('Seeding contact locations...');
    const existingLocations = await db.select().from(contactLocations).limit(1);
    if (existingLocations.length === 0) {
        await db.insert(contactLocations).values([
            {
                title: 'Merkez Ofis',
                address: 'İkitelli OSB Mah. Giyim Sanatkarları 3. Ada C Blok No:57 Başakşehir / İstanbul',
                phone: '0533 683 85 63',
                email: 'info@aquachems.com',
                type: 'office',
                order: 1,
                mapEmbedCode: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3008.9633698339308!2d28.7979!3d41.06!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDHCsDAzJzM2LjAiTiAyOMKwNDcnNTIuNCJF!5e0!3m2!1str!2str!4v1635000000000!5m2!1str!2str" width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy"></iframe>'
            },
            {
                title: 'Fabrika',
                address: 'Velimeşe OSB, Çorlu / Tekirdağ',
                phone: '0282 000 00 00',
                email: 'uretim@aquachems.com',
                type: 'factory',
                order: 2
            }
        ]);
    }

    // 4. Activities
    console.log('Seeding activities...');
    const existingActivities = await db.select().from(activityItems).limit(1);
    if (existingActivities.length === 0) {
        const activities = [
            "Teknik bakım kimyasalları",
            "Temizleyici ve koruyucu ürünler",
            "Kaplama ürünleri",
            "Genel temizlik ve hijyen ürünleri",
            "Cilt temizleme ürünleri",
            "Kremler ve Hijyen yıkama ürünleri",
            "Oda spreyi ve Şampuanlar",
            "Dezenfektanlar",
            "Tekstil kimyasalları",
            "Kapalı ve açık devre su kimyasal ürünleri"
        ];
        await db.insert(activityItems).values(
            activities.map((title, index) => ({ title, order: index + 1, isActive: true }))
        );
    }

    // 5. Innovation Items
    console.log('Seeding innovation items...');
    const existingInnovation = await db.select().from(innovationItems).limit(1);
    if (existingInnovation.length === 0) {
        await db.insert(innovationItems).values([
            {
                title: 'AR-GE Çalışmaları',
                description: 'Bünyemizdeki profesyonel ekiplerle sürekli araştırma ve geliştirme yaparak, karşılaşılan sorunlara en etkili bilimsel çözümleri üretiyoruz.',
                watermarkText: '01',
                order: 1
            },
            {
                title: 'ÜR-GE Süreçleri',
                description: 'Standart kalıpların dışına çıkarak, otomotivden havacılığa her sektör için tamamen müşteriye özel formüller ve ürünler geliştiriyoruz.',
                watermarkText: '02',
                order: 2
            },
            {
                title: 'İnovasyon Kültürü',
                description: 'Değişen rekabet ortamına uyum sağlamak için üretim yöntemlerimizi ve hizmetlerimizi sürekli yeniliyor, gelişimi bir kültür haline getiriyoruz.',
                watermarkText: '03',
                order: 3
            }
        ]);
    }

    // 6. Stats
    console.log('Seeding stats...');
    const existingStats = await db.select().from(stats).limit(1);
    if (existingStats.length === 0) {
        await db.insert(stats).values([
            { label: 'Yıllık Deneyim', value: '15+', icon: 'Calendar', order: 1 },
            { label: 'Mutlu Müşteri', value: '500+', icon: 'Users', order: 2 },
            { label: 'Ürün Çeşidi', value: '150+', icon: 'Package', order: 3 },
            { label: 'Kalite Belgesi', value: '10+', icon: 'Award', order: 4 }
        ]);
    }

    console.log('Seeding complete!');
    process.exit(0);
}

main().catch((err) => {
    console.error('Seeding failed:', err);
    process.exit(1);
});
