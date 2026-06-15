"use client";

import React from 'react';
import Link from 'next/link';
import { CheckCircle2, FileDown, Newspaper } from 'lucide-react';

import { Locale } from '@/lib/i18n';
import { Dictionary } from '@/lib/dictionary';

interface Activity {
    id: number;
    title: string;
    isActive: boolean | null;
}

interface ActivitiesSectionProps {
    activities: Activity[];
    posts?: any[];
    catalogUrl?: string | null;
    lang: Locale;
    dict: Dictionary;
}

const ActivitiesSection = ({ activities, posts = [], catalogUrl, lang, dict }: ActivitiesSectionProps) => {
    // Filter active items if needed, or assume server returns all and we filter here
    const activeActivities = activities.filter(a => a.isActive !== false);

    return (
        <section className="py-20 bg-slate-50">
            <div className="container-custom">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

                    {/* Column 1: Faaliyet Alanlarımız (Wider - 2 cols on LG) */}
                    <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-8 border border-slate-200">
                        <h3 className="text-2xl font-bold text-slate-800 mb-6 border-b pb-4">
                            {lang === 'en' ? 'Our Fields of Activity' : 'Faaliyet Alanlarımız'}
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {activeActivities.length > 0 ? (
                                activeActivities.map((item) => (
                                    <div key={item.id} className="flex items-start gap-2">
                                        <CheckCircle2 size={20} className="text-primary-500 shrink-0 mt-0.5" />
                                        <span className="text-slate-600 text-sm">{item.title}</span>
                                    </div>
                                ))
                            ) : (
                                <p className="text-slate-500 text-sm">
                                    {lang === 'en' ? 'No activity fields found.' : 'Faaliyet alanı bulunamadı.'}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Column 2: Bizden Haberler */}
                    <div className="lg:col-span-1 bg-white rounded-xl shadow-sm p-8 border border-slate-200">
                        <h3 className="text-2xl font-bold text-slate-800 mb-6 border-b pb-4 flex items-center gap-2">
                            <Newspaper size={24} className="text-primary-500" />
                            {lang === 'en' ? 'Latest News' : 'Bizden Haberler'}
                        </h3>
                        <div className="space-y-4">
                            {posts && posts.length > 0 ? (
                                posts.map((post: any) => {
                                    const postTitle = (lang === 'en' && post.titleEn) ? post.titleEn : post.title;
                                    return (
                                        <React.Fragment key={post.id}>
                                            <Link href={`/${lang}/news/${post.slug}`} className="group cursor-pointer block">
                                                <span className="text-xs text-primary-500 font-bold block mb-1">
                                                    {new Date(post.createdAt).toLocaleDateString(lang === 'en' ? 'en-US' : 'tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                </span>
                                                <p className="text-slate-700 font-medium group-hover:text-primary-600 transition-colors line-clamp-3">
                                                    {postTitle}
                                                </p>
                                            </Link>
                                            <hr className="border-slate-100 last:hidden" />
                                        </React.Fragment>
                                    );
                                })
                            ) : (
                                <p className="text-slate-500 text-sm">
                                    {lang === 'en' ? 'No news added yet.' : 'Henüz haber eklenmemiş.'}
                                </p>
                            )}

                            <Link href={`/${lang}/news`} className="inline-block mt-4 text-sm text-primary-600 font-bold hover:underline">
                                {lang === 'en' ? 'All News →' : 'Tüm Haberler →'}
                            </Link>
                        </div>
                    </div>

                    {/* Column 3: Online Katalog */}
                    <div className="lg:col-span-1 bg-primary-600 rounded-xl shadow-lg p-8 text-white flex flex-col items-center justify-center text-center">
                        <div className="bg-white/10 p-4 rounded-full mb-6">
                            <FileDown size={48} />
                        </div>
                        <h3 className="text-2xl font-bold mb-4">
                            {lang === 'en' ? 'E-Catalog' : 'E-Katalog'}
                        </h3>
                        <p className="text-primary-100 mb-8 text-sm">
                            {lang === 'en' 
                                ? 'You can download our current product catalog to your device in PDF format.' 
                                : 'Güncel ürün kataloğumuzu PDF formatında cihazınıza indirebilirsiniz.'}
                        </p>
                        {catalogUrl ? (
                            <a
                                href={catalogUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-white text-primary-600 px-6 py-3 rounded-full font-bold hover:bg-primary-50 transition-colors w-full inline-block"
                            >
                                {lang === 'en' ? 'Download Catalog' : 'Kataloğu İndir'}
                            </a>
                        ) : (
                            <button className="bg-white/50 text-white/50 px-6 py-3 rounded-full font-bold cursor-not-allowed w-full">
                                {lang === 'en' ? 'Catalog Not Found' : 'Katalog Bulunamadı'}
                            </button>
                        )}
                    </div>

                </div>
            </div>
        </section>
    );
};

export default ActivitiesSection;
