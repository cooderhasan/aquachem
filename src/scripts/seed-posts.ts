
import { db } from '../lib/db';
import { posts } from '../db/schema';

async function seed() {
    console.log('Seeding posts...');
    try {
        await db.insert(posts).values([
            {
                title: 'Yeni üretim tesisimiz faaliyete geçti.',
                slug: 'yeni-uretim-tesisimiz-faaliyete-gecti',
                content: 'Artan talepleri karşılamak ve üretim kapasitemizi artırmak amacıyla kurduğumuz yeni üretim tesisimiz tam kapasiteyle faaliyete başlamıştır.',
                type: 'news',
                createdAt: new Date('2025-12-18')
            },
            {
                title: 'ISO 14001 Çevre Yönetim Sistemi sertifikamızı yeniledik.',
                slug: 'iso-14001-cevre-yonetim-sistemi',
                content: 'Çevreye duyarlı üretim anlayışımızın bir parçası olan ISO 14001 sertifikamızı başarıyla yeniledik.',
                type: 'news',
                createdAt: new Date('2025-11-15')
            }
        ]);
        console.log('Seeding completed.');
    } catch (error) {
        console.error('Error seeding:', error);
    }
    process.exit(0);
}

seed();
