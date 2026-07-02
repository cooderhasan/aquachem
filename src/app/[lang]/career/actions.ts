'use server';

import { db } from '@/lib/db';
import { applications } from '@/db/schema';
import { revalidatePath } from 'next/cache';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { sendMail } from '@/lib/mail';

export async function submitApplication(formData: FormData) {
    try {
        const name = formData.get('name') as string;
        const email = formData.get('email') as string;
        const phone = formData.get('phone') as string;
        const position = formData.get('position') as string;
        const cvFile = formData.get('cv') as File;

        // Validasyon
        if (!name || !email || !cvFile) {
            return { success: false, error: 'Lütfen zorunlu alanları doldurunuz.' };
        }

        // Dosya türü kontrolü
        const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        if (!allowedTypes.includes(cvFile.type)) {
            return { success: false, error: 'Lütfen geçerli bir dosya yükleyiniz (PDF, DOC, DOCX).' };
        }

        // Dosya boyutu kontrolü (2MB)
        if (cvFile.size > 2 * 1024 * 1024) {
            return { success: false, error: 'Dosya boyutu 2MB\'dan küçük olmalıdır.' };
        }

        // Dosyayı kaydet
        const buffer = Buffer.from(await cvFile.arrayBuffer());
        const uploadDir = join(process.cwd(), 'public', 'uploads', 'cvs');

        try {
            await mkdir(uploadDir, { recursive: true });
        } catch (e) {
            // Klasör zaten varsa devam et
        }

        const fileName = `${uuidv4()}-${cvFile.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;
        const filePath = join(uploadDir, fileName);
        await writeFile(filePath, buffer);

        const cvUrl = `/uploads/cvs/${fileName}`;

        // Link oluştur (Domain varsa ekle, yoksa relative kalsın - ama e-posta için domain lazım)
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://aquachem.hasandurmus.com';
        const cvFullUrl = cvUrl.startsWith('http') ? cvUrl : `${baseUrl}${cvUrl}`;

        // Veritabanına kaydet
        await db.insert(applications).values({
            name,
            email,
            phone,
            position,
            cvUrl,
        });

        console.log('CAREER_DEBUG: E-posta gönderiliyor...');

        // E-posta Gönder
        const mailResult = await sendMail({
            to: ['info@aquachems.com', 'selimvarol@aquachems.com'],
            subject: `Yeni İletişim Formu Mesajı: Kariyer Başvurusu - ${name}`,
            text: `
                Ad Soyad: ${name}
                E-posta: ${email}
                Konu: Kariyer Başvurusu (${position || '-'})
                Mesaj: Telefon: ${phone || '-'} | CV: ${cvFullUrl}
            `,
            html: `
                <h3>Yeni İletişim Formu Mesajı</h3>
                <p><strong>Ad Soyad:</strong> ${name}</p>
                <p><strong>E-posta:</strong> ${email}</p>
                <p><strong>Konu:</strong> Kariyer Başvurusu (${position || '-'})</p>
                <p><strong>Mesaj:</strong></p>
                <p>Telefon: ${phone || '-'}<br>
                <br>
                CV İndirme Linki: <a href="${cvFullUrl}">Dosyayı İndir</a></p>
            `
        });

        console.log('CAREER_DEBUG: E-posta sonucu:', JSON.stringify(mailResult, null, 2));

        if (!mailResult.success) {
            console.error('CAREER_DEBUG: E-posta GÖNDERİLEMEDİ:', mailResult.error);
            return { success: false, error: `E-posta hatası: ${JSON.stringify(mailResult.error)}` };
        }

        revalidatePath('/admin/applications');
        return { success: true };
    } catch (error) {
        console.error('CAREER_DEBUG: Catch bloguna düştü:', error);
        return { success: false, error: `Sunucu hatası: ${error instanceof Error ? error.message : JSON.stringify(error)}` };
    }
}
