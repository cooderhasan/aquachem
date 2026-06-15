import React from 'react';
import { Metadata } from 'next';
import { db } from '@/lib/db';
import { references as referencesTable, categories as categoriesTable } from '@/db/schema';
import { asc } from 'drizzle-orm';
import ReferencesList from './ReferencesList';
import { Locale } from '@/lib/i18n';
import { getDictionary } from '@/lib/dictionary';

interface PageProps {
    params: Promise<{ lang: string }>;
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { lang: rawLang } = await params;
    const lang = (rawLang === 'en' ? 'en' : 'tr') as Locale;
    const dict = getDictionary(lang);
    return {
        title: dict.seo.referencesTitle,
        description: dict.references.pageDescription,
    };
}

export default async function ReferencesPage({ params }: PageProps) {
    const { lang: rawLang } = await params;
    const lang = (rawLang === 'en' ? 'en' : 'tr') as Locale;
    const dict = getDictionary(lang);

    let references: any[] = [];
    let categories: any[] = [];

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
                    <h1 className="text-3xl md:text-5xl font-bold mb-4 text-white">{dict.references.pageTitle}</h1>
                    <p className="text-primary-200 text-lg max-w-2xl">
                        {dict.references.pageDescription}
                    </p>
                </div>
            </div>

            <ReferencesList 
                references={references} 
                categories={categories} 
                lang={lang} 
                dict={dict} 
            />
        </div>
    );
}
