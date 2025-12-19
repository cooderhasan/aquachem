'use server';

import React from 'react';
import { getStats } from './actions';
import StatsManager from './StatsManager';

export default async function StatsPage() {
    const stats = await getStats();

    return <StatsManager initialStats={stats} />;
}
