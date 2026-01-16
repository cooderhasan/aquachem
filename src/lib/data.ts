import 'server-only';
import { db } from '@/lib/db';
import { posts } from '@/db/schema';
import { desc, eq } from 'drizzle-orm';

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
