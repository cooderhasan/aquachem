'use client';

import React, { useState } from 'react';
import { updateMissionCard } from './actions';
import ImageUpload from '@/components/ui/ImageUpload';
import { Loader2, Plus, Trash2, Check, X, GripVertical } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface MissionCard {
    id: number;
    title: string;
    description: string;
    icon: string;
    image: string | null;
    features: any; // jsonb
    order: number | null;
}

// Sortable Feature Item Component
function SortableFeatureItem({
    id,
    feature,
    onRemove
}: {
    id: string;
    feature: string;
    onRemove: () => void;
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="flex items-center gap-2 bg-slate-50 p-2 rounded-lg border border-slate-200"
        >
            <button
                type="button"
                {...attributes}
                {...listeners}
                className="cursor-grab active:cursor-grabbing p-1 text-slate-400 hover:text-slate-600"
            >
                <GripVertical size={16} />
            </button>
            <span className="flex-1 text-sm text-slate-700">{feature}</span>
            <button
                onClick={onRemove}
                className="text-red-500 hover:bg-red-50 p-1 rounded"
            >
                <Trash2 size={16} />
            </button>
        </div>
    );
}

export default function MissionManager({ initialCards }: { initialCards: MissionCard[] }) {
    const [cards, setCards] = useState<MissionCard[]>(initialCards);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Form states
    const [editForm, setEditForm] = useState<Partial<MissionCard>>({});
    const [tempFeatures, setTempFeatures] = useState<string[]>([]);
    const [newFeature, setNewFeature] = useState('');

    const router = useRouter();

    // DnD sensors
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleEdit = (card: MissionCard) => {
        setEditingId(card.id);
        setEditForm(card);
        setTempFeatures(Array.isArray(card.features) ? card.features : []);
        setNewFeature('');
    };

    const handleCancel = () => {
        setEditingId(null);
        setEditForm({});
        setTempFeatures([]);
    };

    const handleAddFeature = () => {
        if (!newFeature.trim()) return;
        setTempFeatures([...tempFeatures, newFeature.trim()]);
        setNewFeature('');
    };

    const handleRemoveFeature = (index: number) => {
        setTempFeatures(tempFeatures.filter((_, i) => i !== index));
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            setTempFeatures((items) => {
                const oldIndex = items.findIndex((_, i) => `feature-${i}` === active.id);
                const newIndex = items.findIndex((_, i) => `feature-${i}` === over.id);
                return arrayMove(items, oldIndex, newIndex);
            });
        }
    };

    const handleSave = async (id: number) => {
        setIsLoading(true);
        try {
            const formData = new FormData();
            formData.append('title', editForm.title || '');
            formData.append('description', editForm.description || '');
            formData.append('image', editForm.image || '');
            formData.append('features', JSON.stringify(tempFeatures));

            const result = await updateMissionCard(id, formData);
            if (result.success) {
                toast.success('Kart başarıyla güncellendi');
                setEditingId(null);
                router.refresh();
            } else {
                toast.error(result.error || 'Güncelleme başarısız oldu');
            }
        } catch (error) {
            console.error(error);
            toast.error('Bir hata oluştu');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-8 pb-20">
            {cards.map((card) => (
                <div key={card.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    {editingId === card.id ? (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center border-b pb-4">
                                <h3 className="text-lg font-bold text-slate-800">Kart Düzenle: {card.title}</h3>
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleCancel}
                                        disabled={isLoading}
                                        className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg"
                                    >
                                        <X size={20} />
                                    </button>
                                    <button
                                        onClick={() => handleSave(card.id)}
                                        disabled={isLoading}
                                        className="px-4 py-2 bg-primary-600 text-white rounded-lg flex items-center gap-2 hover:bg-primary-700"
                                    >
                                        {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Check size={20} />}
                                        Kaydet
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Başlık</label>
                                        <input
                                            type="text"
                                            value={editForm.title || ''}
                                            onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Açıklama</label>
                                        <textarea
                                            rows={3}
                                            value={editForm.description || ''}
                                            onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">
                                            Maddeler (Özellikler)
                                            <span className="text-xs text-slate-400 ml-2">Sürükleyerek sıralayabilirsiniz</span>
                                        </label>
                                        <DndContext
                                            sensors={sensors}
                                            collisionDetection={closestCenter}
                                            onDragEnd={handleDragEnd}
                                        >
                                            <SortableContext
                                                items={tempFeatures.map((_, i) => `feature-${i}`)}
                                                strategy={verticalListSortingStrategy}
                                            >
                                                <div className="space-y-2 mb-2">
                                                    {tempFeatures.map((feature, idx) => (
                                                        <SortableFeatureItem
                                                            key={`feature-${idx}`}
                                                            id={`feature-${idx}`}
                                                            feature={feature}
                                                            onRemove={() => handleRemoveFeature(idx)}
                                                        />
                                                    ))}
                                                </div>
                                            </SortableContext>
                                        </DndContext>
                                        <div className="flex gap-2">
                                            <input
                                                type="text"
                                                value={newFeature}
                                                onChange={(e) => setNewFeature(e.target.value)}
                                                onKeyDown={(e) => e.key === 'Enter' && handleAddFeature()}
                                                placeholder="Yeni madde ekle..."
                                                className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                            />
                                            <button
                                                onClick={handleAddFeature}
                                                type="button"
                                                className="p-2 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-lg"
                                            >
                                                <Plus size={20} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Kart Görseli</label>
                                    <ImageUpload
                                        value={editForm.image || ''}
                                        onChange={(url) => setEditForm({ ...editForm, image: url })}
                                        onRemove={() => setEditForm({ ...editForm, image: '' })}
                                        label="Görsel Değiştir"
                                    />
                                    <p className="text-xs text-slate-500 mt-2">Bu kart için kullanılan arka plan görseli.</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col md:flex-row gap-6">
                            <div className="w-full md:w-1/4 aspect-video rounded-lg overflow-hidden relative">
                                {card.image ? (
                                    <img src={card.image} alt={card.title} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-400">Görsel Yok</div>
                                )}
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-xl font-bold text-slate-900">{card.title}</h3>
                                    <button
                                        onClick={() => handleEdit(card)}
                                        className="text-sm font-medium text-primary-600 hover:underline"
                                    >
                                        Düzenle
                                    </button>
                                </div>
                                <p className="text-slate-600 mb-4">{card.description}</p>

                                {Array.isArray(card.features) && card.features.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {card.features.map((f: string, i: number) => (
                                            <span key={i} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                {f}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
