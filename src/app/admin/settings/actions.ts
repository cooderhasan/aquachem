'use server';

import { db } from '@/lib/db';
import { settings } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function getSettings() {
    try {
        const result = await db.select().from(settings).limit(1);
        return result[0] || null;
    } catch (error) {
        console.error('Failed to fetch settings:', error);
        return null;
    }
}

export async function updateSettings(formData: FormData) {
    try {
        const title = formData.get('siteTitle') as string;
        const description = formData.get('description') as string;
        const aboutUs = formData.get('aboutUs') as string;
        const mission = formData.get('mission') as string;
        const vision = formData.get('vision') as string;
        const humanPolicy = formData.get('humanPolicy') as string;

        // Check if settings exist
        const currentSettings = await getSettings();

        // Extract social media links
        const socialMedia = {
            facebook: formData.get('facebook') as string,
            twitter: formData.get('twitter') as string,
            instagram: formData.get('instagram') as string,
            linkedin: formData.get('linkedin') as string,
            youtube: formData.get('youtube') as string,
        };

        if (currentSettings) {
            await db.update(settings).set({
                siteTitle: title,
                description,
                aboutUs,
                mission,
                vision,
                humanPolicy,
                socialMedia,
            }).where(eq(settings.id, currentSettings.id));
        } else {
            await db.insert(settings).values({
                siteTitle: title,
                description,
                aboutUs,
                mission,
                vision,
                humanPolicy,
                socialMedia,
            });
        }

        revalidatePath('/admin/settings');
        revalidatePath('/corporate');
        return { success: true };
    } catch (error) {
        console.error('Failed to update settings:', error);
        return { success: false, error: 'Failed to update settings' };
    }
}
