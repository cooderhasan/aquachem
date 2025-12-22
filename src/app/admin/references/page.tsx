import React from 'react';
import { db } from '@/lib/db';
import { references as referencesTable, categories as categoriesTable } from '@/db/schema';
import { asc } from 'drizzle-orm';
import ReferencesGrid from './ReferencesGrid';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ReferencesPage() {
    let references = [];
    let categories = [];
    try {
        [references, categories] = await Promise.all([
            db.select().from(referencesTable).orderBy(asc(referencesTable.order)),
            db.select().from(categoriesTable).orderBy(asc(categoriesTable.order))
        ]);
    } catch (e) {
        console.error('Failed to fetch data:', e);
    }

    return <ReferencesGrid initialReferences={references} categories={categories} />;
}
