'use server';

import React from 'react';
import { getSettings } from './actions';
import SettingsForm from './SettingsForm';

export default async function SettingsPage() {
    const settings = await getSettings();

    return (
        <div>
            <h1 className="text-2xl font-bold text-slate-800 mb-8">Ayarlar & Kurumsal</h1>
            <SettingsForm initialSettings={settings} />
        </div>
    );
}
