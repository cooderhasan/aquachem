import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { categories, products } from '@/db/schema';

export async function GET() {
    try {
        const allCategories = await db.select().from(categories);
        const allProducts = await db.select().from(products);
        return NextResponse.json({ categories: allCategories, products: allProducts });
    } catch (error) {
        return NextResponse.json({ error: error }, { status: 500 });
    }
}
