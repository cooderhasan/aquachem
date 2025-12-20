import React from 'react';
import ActivityForm from '../ActivityForm';
import { getActivity } from '../actions';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function EditActivityPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const activity = await getActivity(parseInt(id));

    if (!activity) {
        notFound();
    }

    return <ActivityForm initialData={activity} isEdit />;
}

