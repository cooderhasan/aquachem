'use server';

import { db } from '@/lib/db';
import { quoteRequests } from '@/db/schema';
import { revalidatePath } from 'next/cache';
import { sendMail } from '@/lib/mail';

export async function submitQuoteRequest(formData: FormData) {
    try {
        const name = formData.get('name') as string;
        const email = formData.get('email') as string;
        const phone = formData.get('phone') as string;
        const company = formData.get('company') as string;
        const productName = formData.get('productName') as string;
        const quantity = formData.get('quantity') as string;

        if (!name || !email || !phone || !productName) {
            return { success: false, error: 'Lütfen zorunlu alanları doldurunuz.' };
        }

        await db.insert(quoteRequests).values({
            name,
            email,
            phone,
            company: company || null,
            productName,
            quantity: quantity || null,
        });

        // E-posta bildirimi
        await sendMail({
            to: ['info@aquachems.com', 'onurvarol@aquachems.com', 'selimvarol@aquachems.com'],
            subject: `🔔 Yeni Teklif Talebi: ${productName}`,
            text: `
                Yeni Teklif Talebi

                Ad Soyad: ${name}
                E-posta: ${email}
                Telefon: ${phone}
                Şirket: ${company || '-'}
                Ürün / Kategori: ${productName}
                Miktar / Açıklama: ${quantity || '-'}
            `,
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                    <div style="background: #1e40af; color: white; padding: 24px; border-radius: 8px 8px 0 0;">
                        <h2 style="margin:0">🔔 Yeni Teklif Talebi</h2>
                        <p style="margin:4px 0 0; opacity:0.8">Aquachems - ${productName}</p>
                    </div>
                    <div style="background:#f8fafc; padding: 24px; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 8px 8px;">
                        <table style="width:100%; border-collapse: collapse;">
                            <tr><td style="padding:8px 0; color:#64748b; width:140px;">Ad Soyad</td><td style="padding:8px 0; font-weight:600; color:#1e293b;">${name}</td></tr>
                            <tr><td style="padding:8px 0; color:#64748b;">E-posta</td><td style="padding:8px 0; font-weight:600; color:#1e293b;"><a href="mailto:${email}">${email}</a></td></tr>
                            <tr><td style="padding:8px 0; color:#64748b;">Telefon</td><td style="padding:8px 0; font-weight:600; color:#1e293b;"><a href="tel:${phone}">${phone}</a></td></tr>
                            <tr><td style="padding:8px 0; color:#64748b;">Şirket</td><td style="padding:8px 0; font-weight:600; color:#1e293b;">${company || '-'}</td></tr>
                            <tr><td style="padding:8px 0; color:#64748b;">Ürün / Kategori</td><td style="padding:8px 0; font-weight:600; color:#1e40af;">${productName}</td></tr>
                            <tr><td style="padding:8px 0; color:#64748b; vertical-align:top;">Miktar / Açıklama</td><td style="padding:8px 0; color:#1e293b;">${quantity || '-'}</td></tr>
                        </table>
                    </div>
                </div>
            `
        });

        revalidatePath('/admin/quotes');
        return { success: true };
    } catch (error) {
        console.error('Quote request submission error:', error);
        return { success: false, error: 'Talebiniz gönderilirken bir hata oluştu. Lütfen tekrar deneyin.' };
    }
}
