import React from 'react';
import ActivityForm from '../ActivityForm';
import { getActivity } from '../actions';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function EditActivityPage({ params }: { params: { id: string } }) {
    const activity = await getActivity(parseInt(params.id));

    if (!activity) {
        notFound();
    }

    return <ActivityForm initialData={activity} isEdit />;
}
