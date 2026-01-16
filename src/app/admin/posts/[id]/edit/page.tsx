
import React from 'react';
import { updatePost } from '@/app/admin/posts/actions';
import { getPost } from '@/lib/data';
import PostForm from '../../PostForm';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;
    const post = await getPost(parseInt(resolvedParams.id));

    if (!post) {
        notFound();
    }

    const handleSubmit = async (formData: FormData) => {
        "use server";
        return await updatePost(post.id, formData);
    };

    return (
        <PostForm
            title="İçeriği Düzenle"
            initialData={{
                title: post.title,
                type: post.type || 'news',
                content: post.content || '',
                image: post.image || ''
            }}
            onSubmit={handleSubmit}
        />
    );
}
