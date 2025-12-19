'use server';

import React from 'react';
import { getInnovationItems } from './actions';
import InnovationManager from './InnovationManager';

export default async function InnovationPage() {
    const items = await getInnovationItems();

    return <InnovationManager initialItems={items} />;
}
