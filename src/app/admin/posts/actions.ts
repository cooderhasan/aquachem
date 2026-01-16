'use server';

import { db } from '@/lib/db';
import { posts } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';


export async function createPost(formData: FormData) {
    try {
        const title = formData.get('title') as string;
        const content = formData.get('content') as string;
        const type = formData.get('type') as string || 'news';
        const image = formData.get('image') as string;

        await db.insert(posts).values({
            title,
            slug: title
                .toLowerCase()
                .replace(/ğ/g, 'g')
                .replace(/ü/g, 'u')
                .replace(/ş/g, 's')
                .replace(/ı/g, 'i')
                .replace(/ö/g, 'o')
                .replace(/ç/g, 'c')
                .replace(/[^a-z0-9-]/g, '-')
                .replace(/-+/g, '-')
                .replace(/^-|-$/g, ''),
            content,
            type,
            image,
        });

        revalidatePath('/admin/posts');
        revalidatePath('/');
        return { success: true };
    } catch (error) {
        console.error('Error creating post:', error);
        return { success: false, error: 'Haber oluşturulurken bir hata oluştu.' };
    }
}

export async function updatePost(id: number, formData: FormData) {
    try {
        const title = formData.get('title') as string;
        const content = formData.get('content') as string;
        const type = formData.get('type') as string;
        const image = formData.get('image') as string;

        await db.update(posts)
            .set({
                title,
                slug: title
                    .toLowerCase()
                    .replace(/ğ/g, 'g')
                    .replace(/ü/g, 'u')
                    .replace(/ş/g, 's')
                    .replace(/ı/g, 'i')
                    .replace(/ö/g, 'o')
                    .replace(/ç/g, 'c')
                    .replace(/[^a-z0-9-]/g, '-')
                    .replace(/-+/g, '-')
                    .replace(/^-|-$/g, ''),
                content,
                type,
                image,
            })
            .where(eq(posts.id, id));

        revalidatePath('/admin/posts');
        revalidatePath('/');
        return { success: true };
    } catch (error) {
        console.error('Error updating post:', error);
        return { success: false, error: 'Haber güncellenirken bir hata oluştu.' };
    }
}

export async function deletePost(id: number) {
    try {
        await db.delete(posts).where(eq(posts.id, id));
        revalidatePath('/admin/posts');
        revalidatePath('/');
        return { success: true };
    } catch (error) {
        console.error('Error deleting post:', error);
        return { success: false, error: 'Haber silinirken bir hata oluştu.' };
    }
}
