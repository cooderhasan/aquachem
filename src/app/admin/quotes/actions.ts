'use server';

import { db } from '@/lib/db';
import { quoteRequests } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function getQuoteRequests() {
    try {
        return await db.select().from(quoteRequests).orderBy(quoteRequests.createdAt);
    } catch (error) {
        console.error('Failed to fetch quote requests:', error);
        return [];
    }
}

export async function markQuoteAsRead(id: number) {
    await db.update(quoteRequests).set({ isRead: true }).where(eq(quoteRequests.id, id));
    revalidatePath('/admin/quotes');
}

export async function updateQuoteStatus(id: number, status: string) {
    await db.update(quoteRequests).set({ status }).where(eq(quoteRequests.id, id));
    revalidatePath('/admin/quotes');
}

export async function deleteQuoteRequest(id: number) {
    await db.delete(quoteRequests).where(eq(quoteRequests.id, id));
    revalidatePath('/admin/quotes');
}
