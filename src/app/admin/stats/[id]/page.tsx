import React from 'react';
import StatsForm from '../StatsForm';
import { getStat } from '../actions';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function EditStatsPage({ params }: { params: { id: string } }) {
    const stat = await getStat(parseInt(params.id));

    if (!stat) {
        notFound();
    }

    return <StatsForm initialData={stat} isEdit />;
}
