import React from 'react';
import { db } from '@/lib/db';
import { references as referencesTable } from '@/db/schema';
import { asc } from 'drizzle-orm';
import ReferencesGrid from './ReferencesGrid';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ReferencesPage() {
    let references = [];
    try {
        references = await db.select().from(referencesTable).orderBy(asc(referencesTable.order));
    } catch (e) {
        console.error('Failed to fetch references:', e);
    }

    return <ReferencesGrid initialReferences={references} />;
}
