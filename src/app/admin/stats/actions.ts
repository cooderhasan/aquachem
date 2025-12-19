'use server';

import { db } from '@/lib/db';
import { stats } from '@/db/schema';
import { eq, asc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function getStats() {
    try {
        const result = await db.select().from(stats).orderBy(asc(stats.order));
        return result;
    } catch (error) {
        console.error('Failed to fetch stats:', error);
        return [];
    }
}

export async function addStat(formData: FormData) {
    try {
        const label = formData.get('label') as string;
        const value = formData.get('value') as string;
        const icon = formData.get('icon') as string;

        await db.insert(stats).values({
            label,
            value,
            icon: icon || 'Target', // Default icon
        });

        revalidatePath('/admin/stats');
        revalidatePath('/');
        return { success: true };
    } catch (error) {
        console.error('Failed to add stat:', error);
        return { success: false, error: 'Failed to add stat' };
    }
}

export async function updateStat(id: number, formData: FormData) {
    try {
        const label = formData.get('label') as string;
        const value = formData.get('value') as string;
        // icon update logic if needed

        await db.update(stats).set({
            label,
            value,
        }).where(eq(stats.id, id));

        revalidatePath('/admin/stats');
        revalidatePath('/');
        return { success: true };
    } catch (error) {
        console.error('Failed to update stat:', error);
        return { success: false, error: 'Failed to update stat' };
    }
}

export async function deleteStat(id: number) {
    try {
        await db.delete(stats).where(eq(stats.id, id));
        revalidatePath('/admin/stats');
        revalidatePath('/');
        return { success: true };
    } catch (error) {
        console.error('Failed to delete stat:', error);
        return { success: false, error: 'Failed to delete stat' };
    }
}
