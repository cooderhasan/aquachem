'use server';

import { db } from '@/lib/db';
import { messages } from '@/db/schema';
import { revalidatePath } from 'next/cache';
import { sendMail } from '@/lib/mail';

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

        // Send Email Notification
        await sendMail({
            to: ['info@aquachems.com', 'selimvarol@aquachems.com'],
            subject: `Yeni İletişim Formu Mesajı: ${subject}`,
            text: `
                Ad Soyad: ${name}
                E-posta: ${email}
                Konu: ${subject}
                Mesaj: ${message}
            `,
            html: `
                <h3>Yeni İletişim Formu Mesajı</h3>
                <p><strong>Ad Soyad:</strong> ${name}</p>
                <p><strong>E-posta:</strong> ${email}</p>
                <p><strong>Konu:</strong> ${subject}</p>
                <p><strong>Mesaj:</strong></p>
                <p>${message}</p>
            `
        });

        revalidatePath('/admin/messages');
        return { success: true };
    } catch (error) {
        console.error('Contact form submission error:', error);
        return { success: false, error: 'Mesajınız gönderilirken bir hata oluştu.' };
    }
}
