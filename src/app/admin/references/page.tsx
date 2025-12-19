'use server';

import React from 'react';
import { getReferences } from './actions';
import ReferencesGrid from './ReferencesGrid';

export default async function ReferencesPage() {
    const references = await getReferences();

    return <ReferencesGrid initialReferences={references} />;
}
