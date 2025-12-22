import React from 'react';
import { Metadata } from 'next';
import { db } from '@/lib/db';
import { references as referencesTable, categories as categoriesTable } from '@/db/schema';
import { asc } from 'drizzle-orm';
import ReferencesList from './ReferencesList';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
    title: 'Referanslarımız',
    description: 'Aquachems ile çalışan firmalar ve referanslarımız.',
};

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

    return (
        <div className="bg-slate-50 min-h-screen pb-20">
            {/* Header Banner */}
            <div className="bg-primary-900 text-white pt-48 pb-16">
                <div className="container-custom">
                    <h1 className="text-3xl md:text-5xl font-bold mb-4 text-white">Referanslarımız</h1>
                    <p className="text-primary-200 text-lg max-w-2xl">
                        Farklı sektörlerdeki iş ortaklarımızla büyümeye devam ediyoruz.
                        Hangi sektörlerde kimlerle çalıştığımızı inceleyebilirsiniz.
                    </p>
                </div>
            </div>

            <ReferencesList references={references} categories={categories} />
        </div>
    );
}
