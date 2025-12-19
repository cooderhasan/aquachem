'use server';

import React from 'react';
import { getActivities } from './actions';
import ActivitiesManager from './ActivitiesManager';

export default async function ActivitiesPage() {
    const activities = await getActivities();

    return <ActivitiesManager initialActivities={activities} />;
}
