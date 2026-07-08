'use server';

import { db } from '@/lib/db';
import { settings } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { cache } from 'react';

// cache() ile aynı request içinde birden fazla çağırılsa bile DB'ye tek sorgu gider
export const getSettings = cache(async () => {
    try {
        const result = await db.select().from(settings).limit(1);
        return result[0] || null;
    } catch (error) {
        console.error('Failed to fetch settings:', error);
        return null;
    }
});

export async function updateSettings(formData: FormData) {
    try {
        const title = formData.get('siteTitle') as string;
        const siteTitleEn = formData.get('siteTitleEn') as string;
        const description = formData.get('description') as string;
        const descriptionEn = formData.get('descriptionEn') as string;
        const aboutUs = formData.get('aboutUs') as string;
        const aboutUsEn = formData.get('aboutUsEn') as string;
        const mission = formData.get('mission') as string;
        const missionEn = formData.get('missionEn') as string;
        const vision = formData.get('vision') as string;
        const visionEn = formData.get('visionEn') as string;
        const humanPolicy = formData.get('humanPolicy') as string;
        const humanPolicyEn = formData.get('humanPolicyEn') as string;
        const aboutUsFontSize = formData.get('aboutUsFontSize') as string;
        const aboutUsDarkness = formData.get('aboutUsDarkness') as string;

        const homeIntroTitle = formData.get('homeIntroTitle') as string;
        const homeIntroTitleEn = formData.get('homeIntroTitleEn') as string;
        const homeIntroDescription = formData.get('homeIntroDescription') as string;
        const homeIntroDescriptionEn = formData.get('homeIntroDescriptionEn') as string;

        const corporateStat1Value = formData.get('corporateStat1Value') as string;
        const corporateStat1Label = formData.get('corporateStat1Label') as string;
        const corporateStat2Value = formData.get('corporateStat2Value') as string;
        const corporateStat2Label = formData.get('corporateStat2Label') as string;
        const siteSlogan = formData.get('siteSlogan') as string;
        const siteSloganEn = formData.get('siteSloganEn') as string;
        const siteSloganFontSize = parseInt(formData.get('siteSloganFontSize') as string) || 10;

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
        const logoEn = formData.get('logoEn') as string;
        const favicon = formData.get('favicon') as string;
        const aboutImage = formData.get('aboutImage') as string;
        const catalogUrl = formData.get('catalogUrl') as string;

        // SEO fields
        const metaTitle = formData.get('metaTitle') as string;
        const metaTitleEn = formData.get('metaTitleEn') as string;
        const metaDescription = formData.get('metaDescription') as string;
        const metaDescriptionEn = formData.get('metaDescriptionEn') as string;
        const metaKeywords = formData.get('metaKeywords') as string;
        const ogImage = formData.get('ogImage') as string;
        const whatsappNumber = formData.get('whatsappNumber') as string;
        const footerLogo = formData.get('footerLogo') as string;
        const footerLogoEn = formData.get('footerLogoEn') as string;
        const logoHeight = parseInt(formData.get('logoHeight') as string) || 48;
        const menuFontSize = parseInt(formData.get('menuFontSize') as string) || 14;
        const headerPadding = parseInt(formData.get('headerPadding') as string) || 20;
        const footerLogoPadding = parseInt(formData.get('footerLogoPadding') as string) || 0;

        const referencesScrollSpeed = parseInt(formData.get('referencesScrollSpeed') as string) || 30;

        // Parse menu items
        let menuItems = [];
        try {
            const menuItemsJson = formData.get('menuItems') as string;
            if (menuItemsJson) {
                menuItems = JSON.parse(menuItemsJson);
            }
        } catch (e) {
            console.error('Failed to parse menu items', e);
        }

        // Parse section order
        let homeSectionOrder: string[] = [];
        try {
            const sectionOrderJson = formData.get('homeSectionOrder') as string;
            if (sectionOrderJson) {
                homeSectionOrder = JSON.parse(sectionOrderJson);
            }
        } catch (e) {
            console.error('Failed to parse section order', e);
        }

        if (currentSettings) {
            await db.update(settings).set({
                siteTitle: title,
                siteTitleEn,
                description,
                descriptionEn,
                logo: logo || currentSettings.logo,
                logoEn: logoEn || currentSettings.logoEn,
                favicon: favicon || currentSettings.favicon,
                aboutImage: aboutImage || currentSettings.aboutImage,
                catalogUrl: catalogUrl || currentSettings.catalogUrl,
                aboutUs,
                aboutUsEn,
                mission,
                missionEn,
                vision,
                visionEn,
                humanPolicy,
                humanPolicyEn,
                aboutUsFontSize,
                aboutUsDarkness,
                socialMedia,
                // SEO fields
                metaTitle: metaTitle || currentSettings.metaTitle,
                metaTitleEn: metaTitleEn || currentSettings.metaTitleEn,
                metaDescription: metaDescription || currentSettings.metaDescription,
                metaDescriptionEn: metaDescriptionEn || currentSettings.metaDescriptionEn,
                metaKeywords: metaKeywords || currentSettings.metaKeywords,
                ogImage: ogImage || currentSettings.ogImage,
                whatsappNumber: whatsappNumber || currentSettings.whatsappNumber,
                footerLogo: footerLogo || currentSettings.footerLogo,
                footerLogoEn: footerLogoEn || currentSettings.footerLogoEn,
                logoHeight: logoHeight || currentSettings.logoHeight,
                menuFontSize: menuFontSize || currentSettings.menuFontSize,
                headerPadding: headerPadding || currentSettings.headerPadding,
                footerLogoPadding: footerLogoPadding || currentSettings.footerLogoPadding,

                referencesScrollSpeed: referencesScrollSpeed || currentSettings.referencesScrollSpeed,
                referenceLogoHeight: parseInt(formData.get('referenceLogoHeight') as string) || 100,
                heroOverlayOpacity: parseInt(formData.get('heroOverlayOpacity') as string) || 60,
                heroGradientOpacity: parseInt(formData.get('heroGradientOpacity') as string) || 80,
                heroTitleFontSize: parseInt(formData.get('heroTitleFontSize') as string) || 48,
                heroTitleColor: (formData.get('heroTitleColor') as string) || '#ffffff',
                heroDescFontSize: parseInt(formData.get('heroDescFontSize') as string) || 18,
                heroDescColor: (formData.get('heroDescColor') as string) || '#f1f5f9',
                heroTextShadowEnabled: formData.get('heroTextShadowEnabled') === 'true' || formData.get('heroTextShadowEnabled') === 'on',
                menuItems,
                homeIntroTitle,
                homeIntroTitleEn,
                homeIntroDescription,
                homeIntroDescriptionEn,
                corporateStat1Value,
                corporateStat1Label,
                corporateStat2Value,
                corporateStat2Label,
                siteSlogan,
                siteSloganEn,
                siteSloganFontSize,
                homeSectionOrder,
            }).where(eq(settings.id, currentSettings.id));
        } else {
            await db.insert(settings).values({
                siteTitle: title,
                siteTitleEn,
                description,
                descriptionEn,
                favicon,
                aboutImage,
                aboutUs,
                aboutUsEn,
                mission,
                missionEn,
                vision,
                visionEn,
                humanPolicy,
                humanPolicyEn,
                aboutUsFontSize,
                aboutUsDarkness,
                catalogUrl,
                socialMedia,
                // SEO fields
                metaTitle,
                metaTitleEn,
                metaDescription,
                metaDescriptionEn,
                metaKeywords,
                ogImage,
                whatsappNumber,
                logo,
                logoEn,
                footerLogo,
                footerLogoEn,
                logoHeight,
                menuFontSize,
                headerPadding,
                footerLogoPadding,

                referencesScrollSpeed,
                referenceLogoHeight: parseInt(formData.get('referenceLogoHeight') as string) || 100,
                heroOverlayOpacity: parseInt(formData.get('heroOverlayOpacity') as string) || 60,
                heroGradientOpacity: parseInt(formData.get('heroGradientOpacity') as string) || 80,
                heroTitleFontSize: parseInt(formData.get('heroTitleFontSize') as string) || 48,
                heroTitleColor: (formData.get('heroTitleColor') as string) || '#ffffff',
                heroDescFontSize: parseInt(formData.get('heroDescFontSize') as string) || 18,
                heroDescColor: (formData.get('heroDescColor') as string) || '#f1f5f9',
                heroTextShadowEnabled: formData.get('heroTextShadowEnabled') === 'true' || formData.get('heroTextShadowEnabled') === 'on',
                menuItems,
                homeIntroTitle,
                homeIntroTitleEn,
                homeIntroDescription,
                homeIntroDescriptionEn,
                corporateStat1Value,
                corporateStat1Label,
                corporateStat2Value,
                corporateStat2Label,
                siteSlogan,
                siteSloganEn,
                siteSloganFontSize,
                homeSectionOrder,
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
