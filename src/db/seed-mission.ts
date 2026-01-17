
import { db } from '@/lib/db';
import { missionCards } from '@/db/schema';

async function seed() {
    console.log('Seeding mission cards...');

    const cards = [
        {
            title: 'Çevre Bilinci',
            description: 'Ürünlerimizde çevre dostu formüller kullanarak, gelecek nesillere temiz bir dünya bırakıyoruz.',
            icon: 'Leaf',
            image: 'https://images.unsplash.com/photo-1473448912268-2022ce9509d8?q=80&w=800&auto=format&fit=crop',
            features: ['Doğa dostu ham maddeler', 'Sürdürülebilir üretim'],
            order: 1
        },
        {
            title: 'İnsan Odaklı',
            description: 'İnsan sağlığını her zaman ön planda tutarak, güvenli ve etkili çözümler sunuyoruz.',
            icon: 'Smile',
            image: 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?q=80&w=800&auto=format&fit=crop',
            features: ['%100 Müşteri Memnuniyeti', 'Sağlık odaklı yaklaşım'],
            order: 2
        },
        {
            title: 'İnovatif Üretim',
            description: 'Ar-Ge laboratuvarlarımızda geliştirdiğimiz yeni nesil teknolojilerle sektöre yön veriyoruz.',
            icon: 'Radio', // Changed from TrendingUp to match typical innovation icons or keep close to original
            image: 'https://images.unsplash.com/photo-1532601224476-15c79f2f7a51?q=80&w=800&auto=format&fit=crop',
            features: ['Modern laboratuvarlar', 'Sürekli gelişim'],
            order: 3
        }
    ];

    try {
        await db.delete(missionCards);
        await db.insert(missionCards).values(cards);
        console.log('Mission cards seeded successfully!');
    } catch (error) {
        console.error('Error seeding mission cards:', error);
    }
    process.exit(0);
}

seed();
