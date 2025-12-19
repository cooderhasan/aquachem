'use client';

import React, { useState } from 'react';
import { Plus, Trash2, MapPin, Building2, Factory, Pencil, Save, X } from 'lucide-react';
import { addContactLocation, deleteContactLocation, updateContactLocation } from './actions';
import { useRouter } from 'next/navigation';

interface Location {
    id: number;
    title: string;
    address: string;
    phone: string | null;
    email: string | null;
    type: string | null;
    mapEmbedCode: string | null;
    order: number | null;
}

interface ContactManagerProps {
    initialLocations: Location[];
}

export default function ContactManager({ initialLocations }: ContactManagerProps) {
    const [locations, setLocations] = useState<Location[]>(initialLocations);
    const [isEditing, setIsEditing] = useState<number | null>(null);
    const [showForm, setShowForm] = useState(false);
    const router = useRouter();

    const handleDelete = async (id: number) => {
        if (!confirm('Silmek istediğinize emin misiniz?')) return;
        try {
            await deleteContactLocation(id);
            router.refresh(); // Sync server data
            setLocations(prev => prev.filter(l => l.id !== id)); // Optimistic
        } catch (error) {
            console.error(error);
            alert('Silme başarısız');
        }
    };

    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>, id?: number) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        try {
            if (id) {
                await updateContactLocation(id, formData);
                setIsEditing(null);
            } else {
                await addContactLocation(formData);
                setShowForm(false);
            }
            router.refresh();
            // We rely on router.refresh() to get new data for the list
            // For smoother UX, we could also fetch manually or assume success
            window.location.reload();
        } catch (error) {
            console.error(error);
            alert('İşlem başarısız');
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-slate-800">İletişim Noktaları</h1>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                    {showForm ? <X size={20} /> : <Plus size={20} />}
                    {showForm ? 'Vazgeç' : 'Yeni Ekle'}
                </button>
            </div>

            {/* Add Form */}
            {showForm && (
                <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 mb-8 animate-in fade-in slide-in-from-top-4">
                    <h3 className="font-bold text-slate-700 mb-4">Yeni İletişim Noktası</h3>
                    <form onSubmit={(e) => handleFormSubmit(e)} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input name="title" placeholder="Başlık (Örn: Merkez Ofis)" required className="p-2 border rounded" />
                            <select name="type" className="p-2 border rounded">
                                <option value="office">Ofis</option>
                                <option value="factory">Fabrika</option>
                                <option value="store">Mağaza</option>
                            </select>
                        </div>
                        <input name="address" placeholder="Adres" required className="w-full p-2 border rounded" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input name="phone" placeholder="Telefon" className="p-2 border rounded" />
                            <input name="email" placeholder="E-posta" className="p-2 border rounded" />
                        </div>
                        <textarea name="mapEmbedCode" placeholder='Google Maps Embed Kodu (<iframe src="..." ...>)' rows={3} className="w-full p-2 border rounded text-sm font-mono" />
                        <div className="flex justify-end">
                            <button type="submit" className="bg-emerald-600 text-white px-4 py-2 rounded flex items-center gap-2">
                                <Save size={18} /> Kaydet
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* List */}
            <div className="grid grid-cols-1 gap-6">
                {locations.length === 0 && !showForm && (
                    <div className="text-center p-8 text-slate-500 bg-slate-50 rounded-xl">
                        Henüz iletişim noktası eklenmemiş.
                    </div>
                )}

                {locations.map((loc) => (
                    <div key={loc.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        {isEditing === loc.id ? (
                            <form onSubmit={(e) => handleFormSubmit(e, loc.id)} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input name="title" defaultValue={loc.title} required className="p-2 border rounded" />
                                    <select name="type" defaultValue={loc.type || 'office'} className="p-2 border rounded">
                                        <option value="office">Ofis</option>
                                        <option value="factory">Fabrika</option>
                                        <option value="store">Mağaza</option>
                                    </select>
                                </div>
                                <input name="address" defaultValue={loc.address} required className="w-full p-2 border rounded" />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input name="phone" defaultValue={loc.phone || ''} className="p-2 border rounded" />
                                    <input name="email" defaultValue={loc.email || ''} className="p-2 border rounded" />
                                </div>
                                <textarea name="mapEmbedCode" defaultValue={loc.mapEmbedCode || ''} rows={3} className="w-full p-2 border rounded text-sm font-mono" />
                                <div className="flex justify-end gap-2">
                                    <button type="button" onClick={() => setIsEditing(null)} className="px-4 py-2 text-slate-500">İptal</button>
                                    <button type="submit" className="bg-emerald-600 text-white px-4 py-2 rounded">Güncelle</button>
                                </div>
                            </form>
                        ) : (
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                <div className="flex items-start gap-4">
                                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${loc.type === 'factory' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'}`}>
                                        {loc.type === 'factory' ? <Factory size={24} /> : <Building2 size={24} />}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg text-slate-800">{loc.title}</h3>
                                        <p className="text-slate-600 flex items-center gap-1 mt-1">
                                            <MapPin size={16} className="shrink-0" />
                                            {loc.address}
                                        </p>
                                        <div className="flex flex-wrap gap-4 mt-2 text-sm text-slate-500">
                                            {loc.phone && <span>Tel: {loc.phone}</span>}
                                            {loc.email && <span>Mail: {loc.email}</span>}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 self-end md:self-center">
                                    <button
                                        onClick={() => setIsEditing(loc.id)}
                                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                    >
                                        <Pencil size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(loc.id)}
                                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
