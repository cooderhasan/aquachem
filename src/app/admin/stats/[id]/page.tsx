import React from 'react';
import StatsForm from '../StatsForm';
import { getStat } from '../actions';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function EditStatsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const stat = await getStat(parseInt(id));

    if (!stat) {
        notFound();
    }

    return <StatsForm initialData={stat} isEdit />;
}

