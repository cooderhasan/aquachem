'use server';

import { db } from '@/lib/db';
import { messages } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function getMessages() {
    try {
        const result = await db.select().from(messages).orderBy(desc(messages.createdAt));
        return result;
    } catch (error) {
        console.error('Failed to fetch messages:', error);
        return [];
    }
}

export async function deleteMessage(id: number) {
    try {
        await db.delete(messages).where(eq(messages.id, id));
        revalidatePath('/admin/messages');
        return { success: true };
    } catch (error) {
        console.error('Failed to delete message:', error);
        return { success: false, error: 'Silme işlemi başarısız' };
    }
}

export async function markAsRead(id: number) {
    try {
        await db.update(messages).set({ isRead: true }).where(eq(messages.id, id));
        revalidatePath('/admin/messages');
        return { success: true };
    } catch (error) {
        console.error('Failed to update message status:', error);
        return { success: false };
    }
}
