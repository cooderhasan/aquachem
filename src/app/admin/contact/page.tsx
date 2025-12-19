'use server';

import React from 'react';
import { getContactLocations } from './actions';
import ContactManager from './ContactManager';

export default async function ContactPage() {
    const locations = await getContactLocations();

    return <ContactManager initialLocations={locations} />;
}
