
import React from 'react';
import { getMissionCards } from './actions';
import MissionManager from './MissionManager';

export const dynamic = 'force-dynamic';

export default async function MissionPage() {
    const cards = await getMissionCards();

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-800">Değerlerimiz & Yaklaşımımız (Anasayfa)</h1>
                <p className="text-slate-500">Anasayfadaki 3'lü kart alanını buradan yönetebilirsiniz.</p>
            </div>

            <MissionManager initialCards={cards} />
        </div>
    );
}
