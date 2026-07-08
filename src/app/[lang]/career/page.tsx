import React from 'react';
import ApplicationForm from './ApplicationForm';
import { Users, Target, Heart } from 'lucide-react';
import { Locale } from '@/lib/i18n';
import { getDictionary } from '@/lib/dictionary';
import { Metadata } from 'next';
import { getAlternates } from '@/lib/seo';

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
    const { lang } = await params;
    const dict = getDictionary(lang);
    return {
        title: dict.career.pageTitle,
        description: dict.career.pageDescription,
        alternates: getAlternates(lang, '/career'),
    };
}

export default async function CareerPage({ params }: { params: Promise<{ lang: Locale }> }) {
    const { lang } = await params;
    const dict = getDictionary(lang);

    return (
        <div className="bg-slate-50 min-h-screen pt-28 pb-12">
            {/* Header */}
            <div className="bg-primary-900 text-white py-20">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl font-bold mb-4">{dict.career.pageTitle}</h1>
                    <p className="text-primary-200 text-lg max-w-2xl mx-auto">
                        {dict.career.pageDescription}
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 -mt-10 mb-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Sidebar Info */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                            <h3 className="text-xl font-bold text-slate-800 mb-4">
                                {lang === 'en' ? 'Why Aquachems?' : 'Neden Aquachems?'}
                            </h3>
                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                                        <Users size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-800">
                                            {lang === 'en' ? 'A Great Team' : 'Harika Bir Takım'}
                                        </h4>
                                        <p className="text-sm text-slate-600 mt-1">
                                            {lang === 'en' 
                                                ? 'Opportunity to work with an expert, dynamic and supportive team.' 
                                                : 'Alanında uzman, dinamik ve destekleyici bir ekiple çalışma fırsatı.'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                                        <Target size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-800">
                                            {lang === 'en' ? 'Continuous Development' : 'Sürekli Gelişim'}
                                        </h4>
                                        <p className="text-sm text-slate-600 mt-1">
                                            {lang === 'en'
                                                ? 'Training and development opportunities supporting you in your career journey.'
                                                : 'Kariyer yolculuğunuzda sizi destekleyen eğitim ve gelişim imkanları.'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                                        <Heart size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-800">
                                            {lang === 'en' ? 'Value to People' : 'İnsana Değer'}
                                        </h4>
                                        <p className="text-sm text-slate-600 mt-1">
                                            {lang === 'en'
                                                ? 'A corporate culture that prioritizes employee happiness and health.'
                                                : 'Çalışan mutluluğunu ve sağlığını önceliklendiren bir kurum kültürü.'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Application Form */}
                    <div className="lg:col-span-2">
                        <ApplicationForm lang={lang} dict={dict} />
                    </div>
                </div>
            </div>
        </div>
    );
}
