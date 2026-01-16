"use client";

import React from 'react';
import Link from 'next/link';
import { Plus, Trash2, Edit, FileText } from 'lucide-react';

// Helper component for deleting
import { DeletePostButton } from './DeletePostButton';
import { getPosts } from './actions';

export default async function PostsPage() {
    const allPosts = await getPosts();

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-slate-800">Haberler & Yazılar</h1>
                <Link
                    href="/admin/posts/new"
                    className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                    <Plus size={20} />
                    Yeni Ekle
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="p-4 font-semibold text-slate-600 w-20">ID</th>
                            <th className="p-4 font-semibold text-slate-600">Başlık</th>
                            <th className="p-4 font-semibold text-slate-600">Tarih</th>
                            <th className="p-4 font-semibold text-slate-600">Tür</th>
                            <th className="p-4 font-semibold text-slate-600 text-right">İşlemler</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {allPosts.length > 0 ? (
                            allPosts.map((post) => (
                                <tr key={post.id} className="hover:bg-slate-50">
                                    <td className="p-4 text-slate-500">#{post.id}</td>
                                    <td className="p-4 font-medium text-slate-800">{post.title}</td>
                                    <td className="p-4 text-slate-500">
                                        {post.createdAt ? new Date(post.createdAt).toLocaleDateString('tr-TR') : '-'}
                                    </td>
                                    <td className="p-4">
                                        <span className="px-2 py-1 text-xs font-bold rounded-full bg-blue-100 text-blue-700">
                                            {post.type === 'news' ? 'Haber' : 'Duyuru'}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link href={`/admin/posts/${post.id}/edit`} className="p-2 text-slate-400 hover:text-primary-600 transition-colors">
                                                <Edit size={18} />
                                            </Link>
                                            <DeletePostButton id={post.id} />
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-slate-500 flex flex-col items-center">
                                    <FileText size={48} className="text-slate-200 mb-4" />
                                    <p>Henüz haber veya duyuru eklenmemiş.</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
