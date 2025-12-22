import React from 'react';
import Link from 'next/link';
import * as LucideIcons from 'lucide-react';
import { ArrowRight, Package } from 'lucide-react';
import { db } from '@/lib/db';
import { categories as categoriesTable } from '@/db/schema';
import { asc } from 'drizzle-orm';
import ProductGroupsClient from './ProductGroupsClient';

export default async function ProductGroups() {
    let categories = [];
    try {
        categories = await db.select().from(categoriesTable).orderBy(asc(categoriesTable.order));
    } catch (error) {
        console.error('Failed to fetch categories:', error);
    }

    // Map DB categories to match the structure expected by the UI
    // Note: DB doesn't store icon name or color class yet. We can map them by ID or slug if needed, 
    // or just use generic icons/colors for now.
    const mappedCategories = categories.map(cat => ({
        ...cat,
        id: cat.id,
        title: cat.title,
        slug: cat.slug,
        image: cat.image || 'https://images.unsplash.com/photo-1563453392212-326f5e854473?q=80&w=600&auto=format&fit=crop',
        iconName: 'Package', // Default icon
        color: 'bg-primary-500' // Default color
    }));

    return <ProductGroupsClient categories={mappedCategories} />;
}

