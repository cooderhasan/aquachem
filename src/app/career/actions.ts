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

        if (!name || !email || !cvFile) {
            return { success: false, error: 'Lütfen zorunlu alanları doldurunuz.' };
        }

        // Validate file type (PDF or Word)
        const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
        if (!allowedTypes.includes(cvFile.type)) {
            return { success: false, error: 'Lütfen geçerli bir dosya yükleyiniz (PDF, DOC, DOCX).' };
        }

        // Validate file size (max 5MB)
        if (cvFile.size > 5 * 1024 * 1024) {
            return { success: false, error: 'Dosya boyutu 5MB\'dan küçük olmalıdır.' };
        }

        // Save file
        const buffer = Buffer.from(await cvFile.arrayBuffer());
        const uploadDir = join(process.cwd(), 'public', 'uploads', 'cvs');

        // Ensure directory exists
        try {
            await mkdir(uploadDir, { recursive: true });
        } catch (e) {
            // ignore if exists
        }

        const fileName = `${uuidv4()}-${cvFile.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;
        const filePath = join(uploadDir, fileName);
        await writeFile(filePath, buffer);

        const cvUrl = `/uploads/cvs/${fileName}`;

        await db.insert(applications).values({
            name,
            email,
            phone,
            position,
            cvUrl,
        });

        // Send Email Notification
        // Note: process.env.NEXT_PUBLIC_APP_URL should be defined, fallback to window location if client-side but this is server action
        // We'll use a relative path or construct full URL if domain is known, here assuming simple link
        const cvFullUrl = process.env.NEXT_PUBLIC_APP_URL ? `${process.env.NEXT_PUBLIC_APP_URL}${cvUrl}` : cvUrl;

        console.log('CAREER FORM: ACTION STARTED - Processing application for:', email);

        const emailResult = await sendMail({
            to: ['info@aquachems.com', 'onurvarol@aquachems.com', 'selimvarol@aquachems.com'],
            subject: `Yeni İş Başvurusu: ${position}`,
            text: `
                Ad Soyad: ${name}
                E-posta: ${email}
                Telefon: ${phone}
                Pozisyon: ${position}
                CV: Dosya ektedir (${cvFile.name})
            `,
            html: `
                <h3>Yeni İş Başvurusu</h3>
                <p><strong>Ad Soyad:</strong> ${name}</p>
                <p><strong>E-posta:</strong> ${email}</p>
                <p><strong>Telefon:</strong> ${phone}</p>
                <p><strong>Pozisyon:</strong> ${position}</p>
                <p><strong>CV:</strong> Dosya ektedir (${cvFile.name})</p>
            `,
            attachments: [
                {
                    filename: cvFile.name,
                    content: buffer
                }
            ]
        });

        console.log('CAREER FORM: EMAIL RESULT:', emailResult);

        revalidatePath('/admin/applications');
        return { success: true };
    } catch (error) {
        console.error('Application submission error:', error);
        return { success: false, error: 'Başvurunuz gönderilirken bir hata oluştu.' };
    }
}
