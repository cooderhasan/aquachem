'use server';

import { db } from '@/lib/db';
import { heroSlides } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function getHeroSlides() {
    try {
        const slides = await db.select().from(heroSlides).orderBy(desc(heroSlides.order), desc(heroSlides.id));
        return slides;
    } catch (error) {
        console.error('Failed to fetch hero slides:', error);
        return [];
    }
}

export async function getHeroSlide(id: number) {
    try {
        const result = await db.select().from(heroSlides).where(eq(heroSlides.id, id)).limit(1);
        return result[0] || null;
    } catch (error) {
        console.error('Failed to fetch hero slide:', error);
        return null;
    }
}

export async function createHeroSlide(formData: FormData) {
    try {
        const title = formData.get('title') as string;
        const description = formData.get('description') as string;
        const image = formData.get('image') as string;
        const link = formData.get('link') as string;
        const buttonText = formData.get('buttonText') as string;
        const order = parseInt(formData.get('order') as string) || 0;
        const isActive = formData.get('isActive') === 'on';

        await db.insert(heroSlides).values({
            title,
            description,
            image,
            link,
            buttonText,
            order,
            isActive
        });

        revalidatePath('/admin/hero');
        revalidatePath('/');
        redirect('/admin/hero');
    } catch (error) {
        console.error('Failed to create hero slide:', error);
        throw error;
    }
}

export async function updateHeroSlide(formData: FormData) {
    try {
        const id = parseInt(formData.get('id') as string);
        const title = formData.get('title') as string;
        const description = formData.get('description') as string;
        const image = formData.get('image') as string;
        const link = formData.get('link') as string;
        const buttonText = formData.get('buttonText') as string;
        const order = parseInt(formData.get('order') as string) || 0;
        const isActive = formData.get('isActive') === 'on';

        await db.update(heroSlides).set({
            title,
            description,
            image,
            link,
            buttonText,
            order,
            isActive
        }).where(eq(heroSlides.id, id));

        revalidatePath('/admin/hero');
        revalidatePath('/');
        redirect('/admin/hero');
    } catch (error) {
        console.error('Failed to update hero slide:', error);
        throw error;
    }
}

export async function deleteHeroSlide(id: number) {
    try {
        await db.delete(heroSlides).where(eq(heroSlides.id, id));
        revalidatePath('/admin/hero');
        revalidatePath('/');
    } catch (error) {
        console.error('Failed to delete hero slide:', error);
        throw error;
    }
}
