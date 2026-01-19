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
import { GripVertical } from 'lucide-react';

interface MenuItem {
    id: string;
    name: string;
    href: string;
}

interface MenuEditorProps {
    items: MenuItem[];
    onReorder: (items: MenuItem[]) => void;
}

export function SortableMenuItem({ id, item }: { id: string; item: MenuItem }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            className="flex items-center gap-4 p-3 bg-white border border-slate-200 rounded-lg shadow-sm mb-2 group hover:border-primary-300 transition-colors"
        >
            <div {...listeners} className="cursor-grab text-slate-400 hover:text-primary-600">
                <GripVertical size={20} />
            </div>
            <div className="flex-1 grid grid-cols-2 gap-4">
                <div className="flex flex-col">
                    <span className="text-xs text-slate-500 font-medium">Başlık</span>
                    <span className="text-sm font-semibold text-slate-700">{item.name}</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-xs text-slate-500 font-medium">Link</span>
                    <span className="text-sm text-slate-600 font-mono bg-slate-50 px-2 py-0.5 rounded">{item.href}</span>
                </div>
            </div>
        </div>
    );
}

export default function MenuEditor({ items, onReorder }: MenuEditorProps) {
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    function handleDragEnd(event: DragEndEvent) {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = items.findIndex((item) => item.id === active.id);
            const newIndex = items.findIndex((item) => item.id === over.id);

            onReorder(arrayMove(items, oldIndex, newIndex));
        }
    }

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
        >
            <SortableContext
                items={items}
                strategy={verticalListSortingStrategy}
            >
                <div className="space-y-2">
                    {items.map((item) => (
                        <SortableMenuItem key={item.id} id={item.id} item={item} />
                    ))}
                </div>
            </SortableContext>
        </DndContext>
    );
}
