'use server';

import { db } from '@/lib/db';
import { messages } from '@/db/schema';
import { revalidatePath } from 'next/cache';

export async function submitContactForm(formData: FormData) {
    try {
        const name = formData.get('name') as string;
        const email = formData.get('email') as string;
        const subject = formData.get('subject') as string;
        const message = formData.get('message') as string;

        if (!name || !email || !message) {
            return { success: false, error: 'Lütfen zorunlu alanları doldurunuz.' };
        }

        await db.insert(messages).values({
            name,
            email,
            subject,
            message,
        });

        revalidatePath('/admin/messages');
        return { success: true };
    } catch (error) {
        console.error('Contact form submission error:', error);
        return { success: false, error: 'Mesajınız gönderilirken bir hata oluştu.' };
    }
}
