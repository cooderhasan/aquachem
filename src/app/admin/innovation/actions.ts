'use server';

import { db } from '@/lib/db';
import { innovationItems } from '@/db/schema';
import { eq, asc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function getInnovationItems() {
    try {
        const result = await db.select().from(innovationItems).orderBy(asc(innovationItems.order));
        return result;
    } catch (error) {
        console.error('Failed to fetch innovation items:', error);
        return [];
    }
}

export async function updateInnovationItem(id: number, formData: FormData) {
    try {
        const title = formData.get('title') as string;
        const description = formData.get('description') as string;
        const watermarkText = formData.get('watermarkText') as string;
        // Icon handling would ideally differ, but for text based updates:

        await db.update(innovationItems).set({
            title,
            description,
            watermarkText,
        }).where(eq(innovationItems.id, id));

        revalidatePath('/admin/innovation');
        revalidatePath('/');
        return { success: true };
    } catch (error) {
        console.error('Failed to update innovation item:', error);
        return { success: false, error: 'Failed to update item' };
    }
}

// Keeping it simple: Creating generic add/delete if user wants to add more cards, 
// though the design was 3 fixed cards. The prompt implied managing the section content.
// I will provide full CRUD in case.

export async function addInnovationItem(formData: FormData) {
    try {
        const title = formData.get('title') as string;
        const description = formData.get('description') as string;
        const watermarkText = formData.get('watermarkText') as string;

        await db.insert(innovationItems).values({
            title,
            description,
            watermarkText,
        });

        revalidatePath('/admin/innovation');
        revalidatePath('/');
        return { success: true };
    } catch (error) {
        console.error('Failed to add innovation item:', error);
        return { success: false, error: 'Failed to add item' };
    }
}

export async function deleteInnovationItem(id: number) {
    try {
        await db.delete(innovationItems).where(eq(innovationItems.id, id));
        revalidatePath('/admin/innovation');
        revalidatePath('/');
        return { success: true };
    } catch (error) {
        console.error('Failed to delete innovation item:', error);
        return { success: false, error: 'Failed to delete item' };
    }
}
