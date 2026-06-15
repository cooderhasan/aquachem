import React from 'react';
import Link from 'next/link';
import * as LucideIcons from 'lucide-react';
import { ArrowRight, Package } from 'lucide-react';
import { db } from '@/lib/db';
import { categories as categoriesTable } from '@/db/schema';
import { asc } from 'drizzle-orm';
import ProductGroupsClient from './ProductGroupsClient';

import { Locale } from '@/lib/i18n';
import { Dictionary } from '@/lib/dictionary';

interface ProductGroupsProps {
    lang: Locale;
    dict: Dictionary;
}

export default async function ProductGroups({ lang, dict }: ProductGroupsProps) {
    let categories: any[] = [];
    try {
        categories = await db.select().from(categoriesTable).orderBy(asc(categoriesTable.order));
    } catch (error) {
        console.error('Failed to fetch categories:', error);
    }

    // Map DB categories to match the structure expected by the UI
    const mappedCategories = categories.map(cat => ({
        ...cat,
        id: cat.id,
        title: (lang === 'en' && cat.titleEn) ? cat.titleEn : cat.title,
        slug: cat.slug,
        image: cat.image || 'https://images.unsplash.com/photo-1563453392212-326f5e854473?q=80&w=600&auto=format&fit=crop',
        iconName: 'Package', // Default icon
        color: 'bg-primary-500' // Default color
    }));

    return <ProductGroupsClient categories={mappedCategories} lang={lang} dict={dict} />;
}

