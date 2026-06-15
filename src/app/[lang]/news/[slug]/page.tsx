import React from 'react';
import Link from 'next/link';
import { getPostBySlug } from '@/lib/data';
import { Calendar, ChevronLeft, User, Clock, Share2 } from 'lucide-react';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { Locale } from '@/lib/i18n';
import { getDictionary } from '@/lib/dictionary';

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale; slug: string }> }): Promise<Metadata> {
    const resolvedParams = await params;
    const post = await getPostBySlug(resolvedParams.slug);
    if (!post) {
        return {
            title: resolvedParams.lang === 'en' ? 'News Not Found' : 'Haber Bulunamadı'
        };
    }
    const title = (resolvedParams.lang === 'en' && post.titleEn) ? post.titleEn : post.title;
    const content = (resolvedParams.lang === 'en' && post.contentEn) ? post.contentEn : post.content;
    return {
        title: title,
        description: content?.substring(0, 160),
    };
}

export default async function NewsDetailPage({ params }: { params: Promise<{ lang: Locale; slug: string }> }) {
    const resolvedParams = await params;
    const { lang, slug } = resolvedParams;
    const dict = getDictionary(lang);
    const post = await getPostBySlug(slug);

    if (!post) {
        notFound();
    }

    const postTitle = (lang === 'en' && post.titleEn) ? post.titleEn : post.title;
    const postContent = (lang === 'en' && post.contentEn) ? post.contentEn : post.content;

    return (
        <div className="bg-white min-h-screen pb-20 pt-36">
            <div className="container-custom max-w-4xl">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 text-sm text-slate-500 mb-6">
                    <Link href={`/${lang}`} className="hover:text-slate-800">{dict.nav.home}</Link>
                    <span>/</span>
                    <Link href={`/${lang}/news`} className="hover:text-slate-800">{dict.nav.news}</Link>
                    <span>/</span>
                    <span className="text-slate-800 font-medium truncate max-w-[200px]">{postTitle}</span>
                </div>

                <article>
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center gap-4 text-sm text-slate-400 mb-4">
                            <span className="flex items-center gap-1 bg-slate-100 px-3 py-1 rounded-full text-slate-600 font-medium">
                                {post.type === 'news' 
                                    ? (lang === 'en' ? 'News' : 'Haber') 
                                    : (lang === 'en' ? 'Announcement' : 'Duyuru')}
                            </span>
                            <span className="flex items-center gap-1">
                                <Calendar size={14} />
                                {post.createdAt ? new Date(post.createdAt).toLocaleDateString(lang === 'en' ? 'en-US' : 'tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}
                            </span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-bold text-slate-900 leading-tight mb-6">
                            {postTitle}
                        </h1>
                    </div>

                    {/* Featured Image */}
                    {post.image && (
                        <div className="relative w-full aspect-video rounded-2xl overflow-hidden mb-10 shadow-lg">
                            <img
                                src={post.image}
                                alt={postTitle}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}

                    {/* Content */}
                    <div className="prose prose-lg prose-slate max-w-none prose-headings:font-bold prose-headings:text-slate-800 prose-p:text-slate-600 prose-img:rounded-xl">
                        {postContent ? (
                            postContent.split('\n').map((paragraph: string, index: number) => (
                                <p key={index}>{paragraph}</p>
                            ))
                        ) : (
                            <p className="text-slate-500 italic">
                                {lang === 'en' ? 'Content not found.' : 'İçerik bulunamadı.'}
                            </p>
                        )}
                    </div>
                </article>

                {/* Back Button */}
                <div className="mt-12 pt-8 border-t border-slate-100">
                    <Link
                        href={`/${lang}/news`}
                        className="inline-flex items-center gap-2 text-slate-600 hover:text-primary-600 font-medium transition-colors"
                    >
                        <ChevronLeft size={20} />
                        {lang === 'en' ? 'Back to News' : 'Haberlere Dön'}
                    </Link>
                </div>
            </div>
        </div>
    );
}
