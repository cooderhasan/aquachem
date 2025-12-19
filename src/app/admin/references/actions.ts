'use server';

import { db } from '@/lib/db';
import { references } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function getReferences() {
    try {
        const result = await db.select().from(references).orderBy(desc(references.id));
        return result;
    } catch (error) {
        console.error('Failed to fetch references:', error);
        return [];
    }
}

export async function addReference(formData: FormData) {
    try {
        const file = formData.get('file') as File;

        if (!file) {
            throw new Error('No file uploaded');
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const fileName = `${uuidv4()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`;
        const uploadDir = path.join(process.cwd(), 'public/uploads');

        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        const filePath = path.join(uploadDir, fileName);
        fs.writeFileSync(filePath, buffer);

        const imageUrl = `/uploads/${fileName}`;
        const title = (formData.get('title') as string) || 'Referans';

        await db.insert(references).values({
            title,
            image: imageUrl,
        });

        revalidatePath('/admin/references');
        return { success: true };
    } catch (error) {
        console.error('Failed to add reference:', error);
        return { success: false, error: 'Failed to add reference' };
    }
}

export async function deleteReference(id: number) {
    try {
        // Optional: Get reference to delete file
        // const ref = await db.query.references.findFirst({ where: eq(references.id, id) });

        await db.delete(references).where(eq(references.id, id));

        // If we wanted to delete the file:
        // if (ref?.image) { ... fs.unlink ... }

        revalidatePath('/admin/references');
        return { success: true };
    } catch (error) {
        console.error('Failed to delete reference:', error);
        return { success: false, error: 'Failed to delete reference' };
    }
}
