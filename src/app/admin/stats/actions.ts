'use server';

import { db } from '@/lib/db';
import { stats } from '@/db/schema';
import { eq, desc, asc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function getStats() {
    try {
        const items = await db.select().from(stats).orderBy(asc(stats.order));
        return items;
    } catch (error) {
        console.error('Failed to fetch stats:', error);
        return [];
    }
}

export async function getStat(id: number) {
    try {
        const item = await db.select().from(stats).where(eq(stats.id, id)).limit(1);
        return item[0];
    } catch (error) {
        console.error('Failed to fetch stat:', error);
        return null;
    }
}

export async function createStat(formData: FormData) {
    return addStat(formData);
}

export async function addStat(formData: FormData) {
    const label = formData.get('label') as string;
    const value = formData.get('value') as string;
    const icon = formData.get('icon') as string;
    const order = parseInt(formData.get('order') as string) || 0;

    try {
        await db.insert(stats).values({
            label,
            value,
            icon,
            order
        });
        revalidatePath('/admin/stats');
        revalidatePath('/');
        return { success: true };
    } catch (error) {
        console.error('Failed to create stat:', error);
        return { success: false, error: 'Failed to create stat' };
    }
}

export async function updateStat(id: number, formData: FormData) {
    const label = formData.get('label') as string;
    const value = formData.get('value') as string;
    const icon = formData.get('icon') as string;
    const order = parseInt(formData.get('order') as string) || 0;

    try {
        await db.update(stats)
            .set({
                label,
                value,
                icon,
                order
            })
            .where(eq(stats.id, id));
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
