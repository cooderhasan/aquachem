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

        const logo = formData.get('logo') as string;
        const favicon = formData.get('favicon') as string;
        const aboutImage = formData.get('aboutImage') as string;
        const catalogUrl = formData.get('catalogUrl') as string;

        // SEO fields
        const metaTitle = formData.get('metaTitle') as string;
        const metaDescription = formData.get('metaDescription') as string;
        const metaKeywords = formData.get('metaKeywords') as string;
        const ogImage = formData.get('ogImage') as string;
        const whatsappNumber = formData.get('whatsappNumber') as string;
        const footerLogo = formData.get('footerLogo') as string;
        const logoHeight = parseInt(formData.get('logoHeight') as string) || 48;
        const menuFontSize = parseInt(formData.get('menuFontSize') as string) || 14;
        const headerPadding = parseInt(formData.get('headerPadding') as string) || 20;
        const footerLogoPadding = parseInt(formData.get('footerLogoPadding') as string) || 0;
        const referencesScrollSpeed = parseInt(formData.get('referencesScrollSpeed') as string) || 30;

        if (currentSettings) {
            await db.update(settings).set({
                siteTitle: title,
                description,
                logo: logo || currentSettings.logo,
                favicon: favicon || currentSettings.favicon,
                aboutImage: aboutImage || currentSettings.aboutImage,
                catalogUrl: catalogUrl || currentSettings.catalogUrl,
                aboutUs,
                mission,
                vision,
                humanPolicy,
                socialMedia,
                // SEO fields
                metaTitle: metaTitle || currentSettings.metaTitle,
                metaDescription: metaDescription || currentSettings.metaDescription,
                metaKeywords: metaKeywords || currentSettings.metaKeywords,
                ogImage: ogImage || currentSettings.ogImage,
                whatsappNumber: whatsappNumber || currentSettings.whatsappNumber,
                footerLogo: footerLogo || currentSettings.footerLogo,
                logoHeight: logoHeight || currentSettings.logoHeight,
                menuFontSize: menuFontSize || currentSettings.menuFontSize,
                headerPadding: headerPadding || currentSettings.headerPadding,
                footerLogoPadding: footerLogoPadding || currentSettings.footerLogoPadding,
                referencesScrollSpeed: referencesScrollSpeed || currentSettings.referencesScrollSpeed,
            }).where(eq(settings.id, currentSettings.id));
        } else {
            await db.insert(settings).values({
                siteTitle: title,
                description,
                favicon,
                aboutImage,
                aboutUs,
                mission,
                vision,
                humanPolicy,
                catalogUrl,
                socialMedia,
                // SEO fields
                metaTitle,
                metaDescription,
                metaKeywords,
                ogImage,
                whatsappNumber,
                footerLogo,
                logoHeight,
                menuFontSize,
                headerPadding,
                footerLogoPadding,
                referencesScrollSpeed,
            });
        }

        revalidatePath('/admin/settings');
        revalidatePath('/corporate');
        revalidatePath('/', 'layout');
        return { success: true };
    } catch (error) {
        console.error('Failed to update settings:', error);
        return { success: false, error: 'Failed to update settings' };
    }
}
