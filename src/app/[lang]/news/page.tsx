import React from 'react';
import Link from 'next/link';
import { getPosts } from '@/lib/data';
import { Calendar, ChevronRight, Newspaper } from 'lucide-react';
import { Metadata } from 'next';
import { Locale } from '@/lib/i18n';
import { getDictionary } from '@/lib/dictionary';

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
    const { lang } = await params;
    const dict = getDictionary(lang);
    return {
        title: dict.news.pageTitle,
        description: dict.news.pageDescription,
    };
}

export default async function NewsPage({ params }: { params: Promise<{ lang: Locale }> }) {
    const { lang } = await params;
    const dict = getDictionary(lang);
    const posts = await getPosts();

    return (
        <div className="bg-slate-50 min-h-screen pb-20 pt-36">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 pb-12 pt-8 mb-12">
                <div className="container-custom">
                    <h1 className="text-4xl font-bold text-slate-800 mb-4">{dict.news.pageTitle}</h1>
                    <p className="text-slate-600 max-w-2xl text-lg">
                        {dict.news.pageDescription}
                    </p>
                </div>
            </div>

            <div className="container-custom">
                {posts && posts.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {posts.map((post: any) => {
                            const postTitle = (lang === 'en' && post.titleEn) ? post.titleEn : post.title;
                            const postContent = (lang === 'en' && post.contentEn) ? post.contentEn : post.content;
                            return (
                                <Link
                                    key={post.id}
                                    href={`/${lang}/news/${post.slug}`}
                                    className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 flex flex-col h-full"
                                >
                                    {/* Image Placeholder or Actual Image */}
                                    <div className="h-48 bg-slate-100 relative overflow-hidden">
                                        {post.image ? (
                                            <img
                                                src={post.image}
                                                alt={postTitle}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-300 bg-slate-50">
                                                <Newspaper size={48} />
                                            </div>
                                        )}
                                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-primary-600 shadow-sm uppercase tracking-wider">
                                            {post.type === 'news' 
                                                ? (lang === 'en' ? 'News' : 'Haber') 
                                                : (lang === 'en' ? 'Announcement' : 'Duyuru')}
                                        </div>
                                    </div>

                                    <div className="p-6 flex flex-col flex-1">
                                        <div className="flex items-center gap-2 text-slate-400 text-sm mb-3">
                                            <Calendar size={14} />
                                            <span>
                                                {new Date(post.createdAt).toLocaleDateString(lang === 'en' ? 'en-US' : 'tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                            </span>
                                        </div>
                                        <h2 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-primary-600 transition-colors line-clamp-2">
                                            {postTitle}
                                        </h2>
                                        <p className="text-slate-600 text-sm line-clamp-3 mb-4 flex-1">
                                            {postContent}
                                        </p>
                                        <span className="flex items-center gap-1 text-primary-600 font-bold text-sm mt-auto group-hover:translate-x-1 transition-transform">
                                            {dict.news.readMore} <ChevronRight size={16} />
                                        </span>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
                        <Newspaper size={64} className="mx-auto text-slate-200 mb-6" />
                        <h3 className="text-xl font-bold text-slate-700 mb-2">{dict.news.noNews}</h3>
                        <p className="text-slate-500">
                            {lang === 'en' 
                                ? 'There is no news or announcement to display at the moment.' 
                                : 'Şu anda görüntülenecek bir haber veya duyuru bulunmuyor.'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
