import HeroForm from '../HeroForm';
import { db } from '@/lib/db';
import { heroSlides } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface EditHeroPageProps {
    params: {
        id: string;
    };
}

export default async function EditHeroPage({ params }: EditHeroPageProps) {
    // Await params as required in Next.js 15+ or strictly typed scenarios
    const { id } = await Promise.resolve(params);
    let slide = null;
    try {
        const slides = await db.select().from(heroSlides).where(eq(heroSlides.id, parseInt(id)));
        slide = slides[0];
    } catch (error) {
        console.error('Failed to fetch slide:', error);
    }

    if (!slide) {
        notFound();
    }

    return <HeroForm slide={slide} />;
}
