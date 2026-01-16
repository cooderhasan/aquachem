'use client';

import { Trash2 } from 'lucide-react';
import { deletePost } from './actions';
import { useRouter } from 'next/navigation';

export function DeletePostButton({ id }: { id: number }) {
    const router = useRouter();

    const handleDelete = async () => {
        if (confirm('Bu içeriği silmek istediğinize emin misiniz?')) {
            await deletePost(id);
            router.refresh();
        }
    };

    return (
        <button onClick={handleDelete} className="p-2 text-slate-400 hover:text-red-600 transition-colors">
            <Trash2 size={18} />
        </button>
    );
}
