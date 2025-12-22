'use server';

import { db } from '@/lib/db';
import { products, categories } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { categories as mockCategories, products as mockProducts } from '@/data/mockData';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { slugify } from '@/lib/utils';
// ... existing imports

export async function createProduct(formData: FormData) {
    try {
        const title = formData.get('title') as string;
        const categoryId = parseInt(formData.get('categoryId') as string);
        const description = formData.get('description') as string;
        const usage = formData.get('usage') as string;
        const image = formData.get('image') as string;

        // Use custom slugify
        const slug = slugify(title);

        await db.insert(products).values({
            title,
            slug,
            categoryId,
            description,
            usage,
            image,
        });

        revalidatePath('/admin/products');
        revalidatePath('/products');
        return { success: true, message: 'Ürün başarıyla eklendi' };
    } catch (error) {
        console.error('Failed to create product:', error);
        return { success: false, message: 'Ürün eklenirken bir hata oluştu' };
    }
}

// ... existing code

export async function getCategories() {
    try {
        const result = await db.select().from(categories).orderBy(categories.order);
        return result;
    } catch (error) {
        console.error('Database connection failed in getCategories:', error);
        return [];
    }
}

export async function getProducts() {
    try {
        // Left Join to get category name
        const result = await db.select({
            id: products.id,
            title: products.title,
            categoryTitle: categories.title,
            image: products.image,
        })
            .from(products)
            .leftJoin(categories, eq(products.categoryId, categories.id))
            .orderBy(products.createdAt);

        return { products: result, isMock: false };
    } catch (error) {
        console.error('Database connection failed, using mock products:', error);
        return { products: [], isMock: true, error: 'Database error' };
    }
}

export async function getProduct(id: number) {
    try {
        const result = await db.select().from(products).where(eq(products.id, id)).limit(1);
        return result[0];
    } catch (error) {
        return null;
    }
}

export async function updateProduct(formData: FormData) {
    try {
        const id = parseInt(formData.get('id') as string);
        const title = formData.get('title') as string;
        const categoryId = parseInt(formData.get('categoryId') as string);
        const description = formData.get('description') as string;
        const usage = formData.get('usage') as string;
        const image = formData.get('image') as string;

        // Use custom slugify
        const slug = slugify(title);

        await db.update(products)
            .set({
                title,
                slug,
                categoryId,
                description,
                usage,
                image,
            })
            .where(eq(products.id, id));

        revalidatePath('/admin/products');
        revalidatePath('/products');
        return { success: true, message: 'Ürün başarıyla güncellendi' };
    } catch (error) {
        console.error('Failed to update product:', error);
        return { success: false, message: 'Ürün güncellenirken bir hata oluştu' };
    }
}

export async function deleteProduct(id: number) {
    try {
        await db.delete(products).where(eq(products.id, id));
        revalidatePath('/admin/products');
        revalidatePath('/products');
        return { success: true, message: 'Ürün başarıyla silindi' };
    } catch (error) {
        console.error('Failed to delete product:', error);
        return { success: false, message: 'Silme işlemi başarısız oldu' };
    }
}
