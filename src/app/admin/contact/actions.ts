'use server';

import { db } from '@/lib/db';
import { contactLocations } from '@/db/schema';
import { eq, asc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function getContactLocations() {
    try {
        const result = await db.select().from(contactLocations).orderBy(asc(contactLocations.order));
        return result;
    } catch (error) {
        console.error('Failed to fetch contact locations:', error);
        return [];
    }
}

export async function getMainContactLocation() {
    try {
        const locations = await getContactLocations();

        // 1. Adres ve Telefon için "İç Anadolu"yu bul
        const icAnadoluLocation = locations.find(loc => {
            const title = loc.title.toLowerCase();
            return title.includes('iç anadolu') || title.includes('ic anadolu');
        });

        // 2. E-posta için "Fabrika"yı bul
        const fabrikaLocation = locations.find(loc => {
            const title = loc.title.toLowerCase();
            return title.includes('fabrika');
        });

        // Temel lokasyon (Varsayılan: İç Anadolu veya ilk kayıt)
        const main = icAnadoluLocation || locations[0] || null;

        // Eğer e-posta kaynağı (Fabrika) varsa, sadece e-posta bilgisini ez
        if (main && fabrikaLocation && fabrikaLocation.email) {
            return {
                ...main,
                email: fabrikaLocation.email
            };
        }

        return main;
    } catch (error) {
        console.error('Failed to fetch main contact location:', error);
        return null;
    }
}

export async function addContactLocation(formData: FormData) {
    try {
        const title = formData.get('title') as string;
        const titleEn = formData.get('titleEn') as string;
        const address = formData.get('address') as string;
        const addressEn = formData.get('addressEn') as string;
        const phone = formData.get('phone') as string;
        const email = formData.get('email') as string;
        const type = formData.get('type') as string;
        const mapEmbedCode = formData.get('mapEmbedCode') as string;

        await db.insert(contactLocations).values({
            title,
            titleEn,
            address,
            addressEn,
            phone,
            email,
            type,
            mapEmbedCode,
        });

        revalidatePath('/', 'layout'); // Tüm siteyi yenile
        revalidatePath('/admin/contact');
        revalidatePath('/contact');
        revalidatePath('/privacy');
        revalidatePath('/terms');
        revalidatePath('/cookies');
        return { success: true };
    } catch (error) {
        console.error('Failed to add contact location:', error);
        return { success: false, error: 'Failed to add location' };
    }
}

export async function deleteContactLocation(id: number) {
    try {
        await db.delete(contactLocations).where(eq(contactLocations.id, id));
        revalidatePath('/', 'layout');
        revalidatePath('/admin/contact');
        revalidatePath('/contact');
        revalidatePath('/privacy');
        revalidatePath('/terms');
        revalidatePath('/cookies');
        return { success: true };
    } catch (error) {
        console.error('Failed to delete contact location:', error);
        return { success: false, error: 'Failed to delete location' };
    }
}

export async function updateContactLocation(id: number, formData: FormData) {
    try {
        const title = formData.get('title') as string;
        const titleEn = formData.get('titleEn') as string;
        const address = formData.get('address') as string;
        const addressEn = formData.get('addressEn') as string;
        const phone = formData.get('phone') as string;
        const email = formData.get('email') as string;
        const type = formData.get('type') as string;
        const mapEmbedCode = formData.get('mapEmbedCode') as string;

        await db.update(contactLocations).set({
            title,
            titleEn,
            address,
            addressEn,
            phone,
            email,
            type,
            mapEmbedCode,
        }).where(eq(contactLocations.id, id));

        revalidatePath('/', 'layout');
        revalidatePath('/admin/contact');
        revalidatePath('/contact');
        revalidatePath('/privacy');
        revalidatePath('/terms');
        revalidatePath('/cookies');
        return { success: true };
    } catch (error) {
        console.error('Failed to update contact location:', error);
        return { success: false, error: 'Failed to update location' };
    }
}
