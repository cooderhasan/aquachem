'use server';

import { db } from '@/lib/db';
import { posts } from '@/db/schema';
import { desc, eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function getPosts() {
    try {
        const data = await db.query.posts.findMany({
            orderBy: [desc(posts.createdAt)],
        });
        return data;
    } catch (error) {
        console.error('Error fetching posts:', error);
        return [];
    }
}

export async function getPost(id: number) {
    try {
        const data = await db.query.posts.findFirst({
            where: eq(posts.id, id),
        });
        return data;
    } catch (error) {
        console.error('Error fetching post:', error);
        return null;
    }
}

export async function getPostBySlug(slug: string) {
    try {
        const data = await db.query.posts.findFirst({
            where: eq(posts.slug, slug),
        });
        return data;
    } catch (error) {
        console.error('Error fetching post by slug:', error);
        return null;
    }
}

export async function createPost(formData: FormData) {
    try {
        const title = formData.get('title') as string;
        const content = formData.get('content') as string;
        const type = formData.get('type') as string || 'news';
        const image = formData.get('image') as string;

        await db.insert(posts).values({
            title,
            slug: title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
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
