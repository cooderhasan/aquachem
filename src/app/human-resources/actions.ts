'use server';

import { db } from '@/lib/db';
import { applications } from '@/db/schema';
import { revalidatePath } from 'next/cache';

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

        revalidatePath('/admin/applications');
        return { success: true };
    } catch (error) {
        console.error('Application submission failed:', error);
        return { success: false, error: 'Başvuru gönderilirken bir hata oluştu.' };
    }
}
