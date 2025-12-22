'use client';

import React, { useState } from 'react';
import { Trash2, Loader2 } from 'lucide-react';
import { deleteProduct } from './actions';
import { toast } from 'sonner';

interface DeleteProductButtonProps {
    id: number;
}

export default function DeleteProductButton({ id }: DeleteProductButtonProps) {
    const [loading, setLoading] = useState(false);

    async function handleDelete() {
        if (!confirm('Bu ürünü silmek istediğinize emin misiniz?')) return;

        setLoading(true);
        try {
            const result = await deleteProduct(id);
            if (result.success) {
                toast.success(result.message);
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            toast.error('Bir hata oluştu');
        } finally {
            setLoading(false);
        }
    }

    return (
        <button
            onClick={handleDelete}
            disabled={loading}
            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
            title="Sil"
        >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
        </button>
    );
}
