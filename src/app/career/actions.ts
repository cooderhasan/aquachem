'use server';

import { db } from '@/lib/db';
import { applications } from '@/db/schema';
import { revalidatePath } from 'next/cache';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

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

        revalidatePath('/admin/applications');
        return { success: true };
    } catch (error) {
        console.error('Application submission error:', error);
        return { success: false, error: 'Başvurunuz gönderilirken bir hata oluştu.' };
    }
}
