'use server';

import { db } from '@/lib/db';
import { applications } from '@/db/schema';
import { revalidatePath } from 'next/cache';
import { sendMail } from '@/lib/mail';

export async function submitApplication(formData: FormData) {
    const name = formData.get('name') as string;
    const phone = formData.get('phone') as string;
    const email = formData.get('email') as string;
    const position = formData.get('position') as string;
    const cvUrl = formData.get('cvUrl') as string;

    if (!name || !email || !cvUrl) {
        return { success: false, error: 'Eksik bilgi girdiniz.' };
    }

    try {
        await db.insert(applications).values({
            name,
            phone,
            email,
            position,
            cvUrl,
            status: 'new'
        });

        // E-posta bildirimi gönder
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://aquachem.hasandurmus.com';
        const cvFullUrl = cvUrl.startsWith('http') ? cvUrl : `${baseUrl}${cvUrl}`;

        await sendMail({
            to: ['info@aquachems.com', 'selimvarol@aquachems.com'],
            subject: `Yeni İş Başvurusu: ${name} - ${position || 'Genel'}`,
            text: `
                Yeni İş Başvurusu
                
                Ad Soyad: ${name}
                E-posta: ${email}
                Telefon: ${phone || '-'}
                Pozisyon: ${position || '-'}
                CV İndirme Linki: ${cvFullUrl}
            `,
            html: `
                <h3>Yeni İş Başvurusu</h3>
                <p><strong>Ad Soyad:</strong> ${name}</p>
                <p><strong>E-posta:</strong> ${email}</p>
                <p><strong>Telefon:</strong> ${phone || '-'}</p>
                <p><strong>Pozisyon:</strong> ${position || '-'}</p>
                <p><strong>CV İndirme Linki:</strong> <a href="${cvFullUrl}">Dosyayı İndir</a></p>
            `
        });

        revalidatePath('/admin/applications');
        return { success: true };
    } catch (error) {
        console.error('Application submission failed:', error);
        return { success: false, error: 'Başvuru gönderilirken bir hata oluştu.' };
    }
}
