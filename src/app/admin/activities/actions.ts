'use server';

import { db } from '@/lib/db';
import { activityItems } from '@/db/schema';
import { eq, asc, desc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function getActivities() {
    try {
        const result = await db.select().from(activityItems).orderBy(asc(activityItems.order));
        return result;
    } catch (error) {
        console.error('Failed to fetch activities:', error);
        return [];
    }
}

export async function addActivity(formData: FormData) {
    try {
        const title = formData.get('title') as string;

        await db.insert(activityItems).values({
            title,
        });

        revalidatePath('/admin/activities');
        revalidatePath('/'); // Homepage
        return { success: true };
    } catch (error) {
        console.error('Failed to add activity:', error);
        return { success: false, error: 'Failed to add activity' };
    }
}

export async function deleteActivity(id: number) {
    try {
        await db.delete(activityItems).where(eq(activityItems.id, id));
        revalidatePath('/admin/activities');
        revalidatePath('/');
        return { success: true };
    } catch (error) {
        console.error('Failed to delete activity:', error);
        return { success: false, error: 'Failed to delete activity' };
    }
}

export async function updateActivity(id: number, formData: FormData) {
    try {
        const title = formData.get('title') as string;
        const isActive = formData.get('isActive') === 'on';

        await db.update(activityItems).set({
            title,
            isActive
        }).where(eq(activityItems.id, id));

        revalidatePath('/admin/activities');
        revalidatePath('/');
        return { success: true };
    } catch (error) {
        console.error('Failed to update activity:', error);
        return { success: false, error: 'Failed to update activity' };
    }
}
