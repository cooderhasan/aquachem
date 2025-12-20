'use server';

import { db } from '@/lib/db';
import { activityItems } from '@/db/schema';
import { eq, desc, asc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function getActivities() {
    try {
        const items = await db.select().from(activityItems).orderBy(asc(activityItems.order));
        return items;
    } catch (error) {
        console.error('Failed to fetch activities:', error);
        return [];
    }
}

export async function getActivity(id: number) {
    try {
        const item = await db.select().from(activityItems).where(eq(activityItems.id, id)).limit(1);
        return item[0];
    } catch (error) {
        console.error('Failed to fetch activity:', error);
        return null;
    }
}

export async function createActivity(formData: FormData) {
    return addActivity(formData);
}

export async function addActivity(formData: FormData) {
    const title = formData.get('title') as string;
    const order = parseInt(formData.get('order') as string) || 0;
    const isActive = formData.get('isActive') === 'on';

    try {
        await db.insert(activityItems).values({
            title,
            order,
            isActive
        });
        revalidatePath('/admin/activities');
        revalidatePath('/');
        return { success: true };
    } catch (error) {
        console.error('Failed to create activity:', error);
        return { success: false, error: 'Failed to create activity' };
    }
}

export async function updateActivity(id: number, formData: FormData) {
    const title = formData.get('title') as string;
    const order = parseInt(formData.get('order') as string) || 0;
    const isActive = formData.get('isActive') === 'on';

    try {
        await db.update(activityItems)
            .set({
                title,
                order,
                isActive
            })
            .where(eq(activityItems.id, id));
        revalidatePath('/admin/activities');
        revalidatePath('/');
        return { success: true };
    } catch (error) {
        console.error('Failed to update activity:', error);
        return { success: false, error: 'Failed to update activity' };
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
