'use server';

import { db } from '@/lib/db';
import { applications } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function getApplications() {
    try {
        const result = await db.select().from(applications).orderBy(desc(applications.createdAt));
        return result;
    } catch (error) {
        console.error('Failed to fetch applications:', error);
        return [];
    }
}

export async function deleteApplication(id: number) {
    try {
        await db.delete(applications).where(eq(applications.id, id));
        revalidatePath('/admin/applications');
        return { success: true };
    } catch (error) {
        console.error('Failed to delete application:', error);
        return { success: false, error: 'Silme işlemi başarısız' };
    }
}

export async function updateApplicationStatus(id: number, status: string) {
    try {
        await db.update(applications).set({ status }).where(eq(applications.id, id));
        revalidatePath('/admin/applications');
        return { success: true };
    } catch (error) {
        console.error('Failed to update application status:', error);
        return { success: false };
    }
}
