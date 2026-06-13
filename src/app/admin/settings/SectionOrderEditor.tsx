"use client";

import React from 'react';
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Eye } from 'lucide-react';

export interface SectionItem {
    id: string;
    name: string;
    description: string;
    icon: string;
}

export const ALL_SECTIONS: SectionItem[] = [
    { id: 'products', name: 'Ürün Grupları', description: 'Endüstriyel kimyasal ürün grupları', icon: '🧪' },
    { id: 'mission', name: 'Değerlerimiz & Yaklaşımımız', description: 'Çevre bilinci, insan odaklı, inovatif üretim kartları', icon: '💚' },
    { id: 'innovation', name: 'İnovatif Üretim', description: 'Ar-Ge ve inovasyon bölümü', icon: '💡' },
    { id: 'activities', name: 'Haberler & Faaliyetler', description: 'Blog yazıları ve etkinlikler', icon: '📋' },
    { id: 'stats', name: 'İstatistikler', description: 'Sayısal başarı istatistikleri', icon: '📊' },
    { id: 'references', name: 'Referanslar', description: 'Müşteri logoları karusel', icon: '🤝' },
];

function SortableSectionItem({ section }: { section: SectionItem }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: section.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 999 : undefined,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-lg shadow-sm mb-2 group hover:border-primary-300 hover:shadow-md transition-all"
        >
            <div {...listeners} className="cursor-grab text-slate-400 hover:text-primary-600 active:cursor-grabbing">
                <GripVertical size={20} />
            </div>
            <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center text-xl flex-shrink-0">
                {section.icon}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-800">{section.name}</p>
                <p className="text-xs text-slate-500 truncate">{section.description}</p>
            </div>
            <div className="flex items-center gap-1 text-xs text-slate-400 bg-slate-50 px-2 py-1 rounded-md">
                <Eye size={12} />
                <span>Görünür</span>
            </div>
        </div>
    );
}

interface SectionOrderEditorProps {
    sections: SectionItem[];
    onReorder: (sections: SectionItem[]) => void;
}

export default function SectionOrderEditor({ sections, onReorder }: SectionOrderEditorProps) {
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            const oldIndex = sections.findIndex((s) => s.id === active.id);
            const newIndex = sections.findIndex((s) => s.id === over.id);
            onReorder(arrayMove(sections, oldIndex, newIndex));
        }
    }

    return (
        <div>
            <div className="mb-3 p-3 bg-blue-50 border border-blue-100 rounded-lg">
                <p className="text-xs text-blue-700">
                    🎯 <strong>Hero Slider</strong> her zaman en üstte sabit kalır. Aşağıdaki bölümleri sürükleyerek sıralayabilirsiniz.
                </p>
            </div>

            {/* Fixed Hero item */}
            <div className="flex items-center gap-3 p-3 bg-slate-100 border border-slate-300 rounded-lg mb-2 opacity-60 cursor-not-allowed">
                <div className="text-slate-300">
                    <GripVertical size={20} />
                </div>
                <div className="w-10 h-10 rounded-lg bg-slate-200 flex items-center justify-center text-xl flex-shrink-0">
                    🎠
                </div>
                <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-600">Hero Slider</p>
                    <p className="text-xs text-slate-400">Ana sayfa slayt gösterisi (sabit - taşınamaz)</p>
                </div>
                <div className="flex items-center gap-1 text-xs text-slate-400 bg-slate-200 px-2 py-1 rounded-md">
                    <span>🔒 Sabit</span>
                </div>
            </div>

            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={sections.map(s => s.id)}
                    strategy={verticalListSortingStrategy}
                >
                    {sections.map((section) => (
                        <SortableSectionItem key={section.id} section={section} />
                    ))}
                </SortableContext>
            </DndContext>
        </div>
    );
}
