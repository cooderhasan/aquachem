'use server';

import { db } from '@/lib/db';
import { categories } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function getCategories() {
    try {
        const result = await db.select().from(categories).orderBy(categories.order);
        return result;
    } catch (error) {
        console.error('Failed to fetch categories:', error);
        return [];
    }
}

export async function createCategory(formData: FormData) {
    try {
        const title = formData.get('title') as string;
        const image = formData.get('image') as string || '';
        const description = formData.get('description') as string || '';

        // Generating slug from title
        const slug = title.toLowerCase()
            .replace(/ğ/g, 'g')
            .replace(/ü/g, 'u')
            .replace(/ş/g, 's')
            .replace(/ı/g, 'i')
            .replace(/ö/g, 'o')
            .replace(/ç/g, 'c')
            .replace(/ /g, '-')
            .replace(/[^\w-]+/g, '');

        // Get max order
        const existing = await db.select().from(categories).orderBy(categories.order);
        const maxOrder = existing.length > 0 ? Math.max(...existing.map(c => c.order || 0)) + 1 : 0;

        await db.insert(categories).values({
            title,
            slug,
            description,
            image,
            order: maxOrder,
        });

        revalidatePath('/admin/categories');
        revalidatePath('/admin/products');
        revalidatePath('/products');

        return { success: true };
    } catch (error) {
        console.error('Failed to create category:', error);
        return { success: false, error: 'Kategori oluşturulamadı' };
    }
}

export async function updateCategory(formData: FormData) {
    try {
        const id = parseInt(formData.get('id') as string);
        const title = formData.get('title') as string;
        const image = formData.get('image') as string || '';
        const description = formData.get('description') as string || '';

        // Generating slug from title
        const slug = title.toLowerCase()
            .replace(/ğ/g, 'g')
            .replace(/ü/g, 'u')
            .replace(/ş/g, 's')
            .replace(/ı/g, 'i')
            .replace(/ö/g, 'o')
            .replace(/ç/g, 'c')
            .replace(/ /g, '-')
            .replace(/[^\w-]+/g, '');

        await db.update(categories)
            .set({
                title,
                slug,
                description,
                image,
            })
            .where(eq(categories.id, id));

        revalidatePath('/admin/categories');
        revalidatePath('/admin/products');
        revalidatePath('/products');

        return { success: true };
    } catch (error) {
        console.error('Failed to update category:', error);
        return { success: false, error: 'Kategori güncellenemedi' };
    }
}

export async function deleteCategory(id: number) {
    try {
        await db.delete(categories).where(eq(categories.id, id));

        revalidatePath('/admin/categories');
        revalidatePath('/admin/products');
        revalidatePath('/products');

        return { success: true };
    } catch (error) {
        console.error('Failed to delete category:', error);
        return { success: false, error: 'Kategori silinemedi' };
    }
}
