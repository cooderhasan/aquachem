'use server';

import { db } from '@/lib/db';
import { missionCards } from '@/db/schema';
import { eq, asc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function getMissionCards() {
    try {
        const result = await db.select().from(missionCards).orderBy(asc(missionCards.order));
        return result;
    } catch (error) {
        console.error('Failed to fetch mission cards:', error);
        return [];
    }
}

export async function updateMissionCard(id: number, formData: FormData) {
    try {
        const title = formData.get('title') as string;
        const titleEn = formData.get('titleEn') as string;
        const description = formData.get('description') as string;
        const descriptionEn = formData.get('descriptionEn') as string;
        const image = formData.get('image') as string;

        // Handle features (list items)
        const featuresJson = formData.get('features') as string;
        let features = [];
        try {
            features = JSON.parse(featuresJson);
        } catch (e) {
            features = [];
        }

        // Handle featuresEn (English list items)
        const featuresEnJson = formData.get('featuresEn') as string;
        let featuresEn = [];
        try {
            featuresEn = JSON.parse(featuresEnJson);
        } catch (e) {
            featuresEn = [];
        }

        await db.update(missionCards).set({
            title,
            titleEn,
            description,
            descriptionEn,
            image,
            features,
            featuresEn,
        }).where(eq(missionCards.id, id));

        revalidatePath('/');
        revalidatePath('/admin/mission');
        return { success: true };
    } catch (error) {
        console.error('Failed to update mission card:', error);
        return { success: false, error: 'Failed to update card' };
    }
}
