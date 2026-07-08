import React from 'react';
import { Metadata } from 'next';
import { Locale } from '@/lib/i18n';
import { getDictionary } from '@/lib/dictionary';
import { getAlternates } from '@/lib/seo';
import HumanResourcesClient from './HumanResourcesClient';

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
    const { lang } = await params;
    const dict = getDictionary(lang);
    return {
        title: dict.humanResources.pageTitle,
        description: dict.humanResources.pageDescription,
        alternates: getAlternates(lang, '/human-resources'),
    };
}

export default async function HumanResourcesPage({ params }: { params: Promise<{ lang: Locale }> }) {
    const { lang } = await params;
    return <HumanResourcesClient lang={lang} />;
}
