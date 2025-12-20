'use server';

import { db } from '@/lib/db';
import { products, categories } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { categories as mockCategories, products as mockProducts } from '@/data/mockData';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createProduct(formData: FormData) {
    try {
        const title = formData.get('title') as string;
        const categoryId = parseInt(formData.get('categoryId') as string);
        const description = formData.get('description') as string;
        const usage = formData.get('usage') as string;
        // For now, image handling is omitted or simplified as strict upload logic is separate
        // Assuming handling image upload returns a URL or we just placeholder it if not implemented fully yet
        // In a real scenario, we'd handle the file upload here or receive a compiled URL

        // Generating a simple slug from title
        const slug = title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

        await db.insert(products).values({
            title,
            slug,
            categoryId,
            description,
            usage,
            image: 'https://placehold.co/600x400', // Placeholder or handle actual upload
        });

        revalidatePath('/admin/products');
        revalidatePath('/products');
        redirect('/admin/products');
    } catch (error) {
        console.error('Failed to create product:', error);
        // In a real app we would return an error state, but for now we just log
        // and maybe redirect to an error page or show a toast if we were client-side.
        // Since this is a server action called by a form, we can't easily alert.
        // For fallback mode, we can't really "create" into mock data permanently.
        throw error; // Re-throw to let the UI know, or handle gracefully 
    }
}

export async function getCategories() {
    console.log('getCategories called');
    try {
        console.log('Attempting DB select...');
        const result = await db.select().from(categories).orderBy(categories.order);
        console.log('DB select successful');
        return result;
    } catch (error) {
        console.error('Database connection failed in getCategories:', error);

        if (!mockCategories) {
            console.error('Mock categories not found!');
            return [];
        }

        return mockCategories.map(c => ({
            id: c.id,
            title: c.title,
            slug: c.slug,
            description: '',
            image: c.image,
            order: c.id
        }));
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
        return {
            products: mockProducts.map(p => {
                const cat = mockCategories.find(c => c.id === p.categoryId);
                return {
                    id: p.id,
                    title: p.title,
                    categoryTitle: cat ? cat.title : 'Unknown',
                    image: p.image,
                };
            }),
            isMock: true
        };
    }
}

export async function getProduct(id: number) {
    try {
        const result = await db.select().from(products).where(eq(products.id, id)).limit(1);
        return result[0];
    } catch (error) {
        console.error('Database connection failed, using mock product:', error);
        return mockProducts.find(p => p.id === id);
    }
}

export async function updateProduct(formData: FormData) {
    try {
        const id = parseInt(formData.get('id') as string);
        const title = formData.get('title') as string;
        const categoryId = parseInt(formData.get('categoryId') as string);
        const description = formData.get('description') as string;
        const usage = formData.get('usage') as string;
        const slug = title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

        await db.update(products)
            .set({
                title,
                slug,
                categoryId,
                description,
                usage,
            })
            .where(eq(products.id, id));

        revalidatePath('/admin/products');
        revalidatePath('/products');
        redirect('/admin/products');
    } catch (error) {
        console.error('Failed to update product:', error);
        throw error;
    }
}
