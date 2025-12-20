import HeroForm from '../HeroForm';
import { getHeroSlide } from '../actions';
import { notFound } from 'next/navigation';

interface EditHeroPageProps {
    params: {
        id: string;
    };
}

export default async function EditHeroPage({ params }: EditHeroPageProps) {
    // Await params as required in Next.js 15+ or strictly typed scenarios
    const { id } = await Promise.resolve(params);
    const slide = await getHeroSlide(parseInt(id));

    if (!slide) {
        notFound();
    }

    return <HeroForm slide={slide} />;
}
