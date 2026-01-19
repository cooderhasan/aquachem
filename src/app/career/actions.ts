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

        // Validate file size (max 2MB)
        if (cvFile.size > 2 * 1024 * 1024) {
            return { success: false, error: 'Dosya boyutu 2MB\'dan küçük olmalıdır.' };
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
            subject: `Yeni İş Başvurusu: ${position || 'Belirtilmedi'}`,
            text: `
                Yeni bir iş başvurusu alındı.
                
                Ad Soyad: ${name}
                E-posta: ${email}
                Telefon: ${phone || 'Belirtilmedi'}
                Pozisyon: ${position || 'Belirtilmedi'}
                
                CV İndirme Linki: ${cvFullUrl}
            `,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #1e40af; border-bottom: 2px solid #1e40af; padding-bottom: 10px;">Yeni İş Başvurusu</h2>
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;"><strong>Ad Soyad:</strong></td>
                            <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;">${name}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;"><strong>E-posta:</strong></td>
                            <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;"><a href="mailto:${email}">${email}</a></td>
                        </tr>
                        <tr>
                            <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;"><strong>Telefon:</strong></td>
                            <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;">${phone || 'Belirtilmedi'}</td>
                        </tr>
                        <tr>
                            <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;"><strong>Pozisyon:</strong></td>
                            <td style="padding: 10px 0; border-bottom: 1px solid #e5e7eb;">${position || 'Belirtilmedi'}</td>
                        </tr>
                    </table>
                    <div style="margin-top: 20px; padding: 15px; background-color: #f0f9ff; border-radius: 8px;">
                        <p style="margin: 0 0 10px 0;"><strong>📎 CV Dosyası:</strong></p>
                        <a href="${cvFullUrl}" style="display: inline-block; background-color: #1e40af; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">CV'yi İndir</a>
                    </div>
                    <p style="color: #6b7280; font-size: 12px; margin-top: 20px;">Bu e-posta aquachems.com kariyer formu üzerinden gönderilmiştir.</p>
                </div>
            `
        });

        console.log('CAREER FORM: EMAIL RESULT:', emailResult);

        if (!emailResult.success) {
            console.error('CAREER FORM: Email sending failed:', emailResult.error);
            return { success: false, error: 'E-posta gönderilemedi. Lütfen daha sonra tekrar deneyiniz.' };
        }

        revalidatePath('/admin/applications');
        return { success: true };
    } catch (error) {
        console.error('Application submission error:', error);
        return { success: false, error: 'Başvurunuz gönderilirken bir hata oluştu.' };
    }
}
