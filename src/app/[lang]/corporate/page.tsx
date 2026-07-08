import React from 'react';
import { Metadata } from 'next';
import { getSettings } from '@/app/admin/settings/actions';
import { Building2, Target, Eye, Users, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';
import { Locale } from '@/lib/i18n';
import { getDictionary } from '@/lib/dictionary';

import { getAlternates } from '@/lib/seo';

export const revalidate = 3600;

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
    const { lang } = await params;
    const dict = getDictionary(lang);
    return {
        title: dict.seo.corporateTitle,
        description: dict.seo.corporateDescription,
        alternates: getAlternates(lang, '/corporate'),
        openGraph: {
            title: `${dict.seo.corporateTitle} | Aquachems`,
            description: dict.seo.corporateDescription,
        },
    };
}

export default async function CorporatePage({ params }: { params: Promise<{ lang: Locale }> }) {
    const { lang } = await params;
    const dict = getDictionary(lang);
    const settings = await getSettings();

    const getTranslatedStatLabel = (label: string) => {
        if (!label) return '';
        if (lang === 'en') {
            const lower = label.toLowerCase();
            if (lower.includes('yıllık') || lower.includes('tecrübe') || lower.includes('yıl')) return 'Years Experience';
            if (lower.includes('proje') || lower.includes('tamamlanan')) return 'Completed Projects';
            return label;
        }
        return label;
    };

    const pageSubtitle = lang === 'en' 
        ? (settings?.descriptionEn || dict.corporate.descriptionFallback) 
        : (settings?.description || dict.corporate.descriptionFallback);

    const aboutUsText = lang === 'en'
        ? (settings?.aboutUsEn || settings?.aboutUs || dict.corporate.aboutUsNotAdded)
        : (settings?.aboutUs || dict.corporate.aboutUsNotAdded);

    const missionText = lang === 'en'
        ? (settings?.missionEn || settings?.mission || dict.corporate.missionNotAdded)
        : (settings?.mission || dict.corporate.missionNotAdded);

    const visionText = lang === 'en'
        ? (settings?.visionEn || settings?.vision || dict.corporate.visionNotAdded)
        : (settings?.vision || dict.corporate.visionNotAdded);

    const humanPolicyText = lang === 'en'
        ? (settings?.humanPolicyEn || settings?.humanPolicy || dict.corporate.humanPolicyNotAdded)
        : (settings?.humanPolicy || dict.corporate.humanPolicyNotAdded);

    return (
        <div className="bg-white">
            {/* Hero Section */}
            <div className="relative bg-primary-900 text-white pt-48 pb-16 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-900 via-primary-900/90 to-transparent z-10" />
                <div className="absolute inset-0">
                    <Image
                        src={settings?.aboutImage || "/images/about_us.jpg"}
                        alt="Corporate Hero"
                        fill
                        className="object-cover opacity-50"
                    />
                </div>
                <div className="container-custom relative z-20">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6 !text-white">{dict.corporate.pageTitle}</h1>
                    <p className="text-xl text-primary-200 max-w-2xl">
                        {pageSubtitle}
                    </p>
                </div>
            </div>

            {/* About Us */}
            <div className="py-24 bg-gradient-to-b from-white to-slate-50">
                <div className="container-custom">
                    <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">
                        {/* Text Content */}
                        <div className="w-full lg:w-1/2 space-y-8 pt-4">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-semibold border border-blue-100">
                                <Building2 size={18} />
                                <span className="uppercase tracking-wide">{dict.corporate.aboutUs}</span>
                            </div>

                            <div className="space-y-6">
                                <h2 className="text-4xl lg:text-5xl font-bold text-slate-900 leading-tight">
                                    {settings?.siteTitle || 'Aquachems'}
                                </h2>
                                <div className="h-1 w-20 bg-blue-600 rounded-full"></div>
                            </div>

                            <div className={`prose max-w-none prose-p:leading-relaxed ${settings?.aboutUsFontSize || 'text-lg'} ${settings?.aboutUsDarkness || 'text-slate-600'}`}>
                                <p className="whitespace-pre-wrap">
                                    {aboutUsText}
                                </p>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <div className="flex flex-col">
                                    <span className="text-3xl font-bold text-blue-600">
                                        {settings?.corporateStat1Value || '15+'}
                                    </span>
                                    <span className="text-sm text-slate-500 font-medium">
                                        {getTranslatedStatLabel(settings?.corporateStat1Label || 'Yıllık Tecrübe')}
                                    </span>
                                </div>
                                <div className="w-px h-12 bg-slate-200"></div>
                                <div className="flex flex-col">
                                    <span className="text-3xl font-bold text-blue-600">
                                        {settings?.corporateStat2Value || '100+'}
                                    </span>
                                    <span className="text-sm text-slate-500 font-medium">
                                        {getTranslatedStatLabel(settings?.corporateStat2Label || 'Tamamlanan Proje')}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Image Content */}
                        <div className="w-full lg:w-1/2 relative lg:sticky lg:top-24">
                            <div className="relative group">
                                <div className="absolute -inset-4 bg-gradient-to-r from-blue-100 to-emerald-100 rounded-[2rem] opacity-50 blur-2xl group-hover:opacity-75 transition duration-500"></div>
                                <div className="relative aspect-[4/3] w-full rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white">
                                    <Image
                                        src={settings?.aboutImage || "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80"}
                                        alt={dict.corporate.aboutUs}
                                        fill
                                        className="object-cover transform group-hover:scale-105 transition duration-700"
                                    />

                                    {/* Abstract decorative element */}
                                    <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
                                    <div className="absolute bottom-6 left-6 text-white">
                                        <div className="flex items-center gap-2">
                                            <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                                            <span className="font-semibold text-lg">{dict.corporate.qualityStandards}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mission & Vision */}
            <div className="py-20 bg-slate-50">
                <div className="container-custom">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
                        {/* Mission */}
                        <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                                <Target size={32} />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-4">{dict.corporate.mission}</h3>
                            <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                                {missionText}
                            </p>
                        </div>

                        {/* Vision */}
                        <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-6">
                                <Eye size={32} />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-4">{dict.corporate.vision}</h3>
                            <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                                {visionText}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Human Policy */}
            <div className="py-20">
                <div className="container-custom">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center mx-auto mb-6">
                            <Users size={32} />
                        </div>
                        <h2 className="text-3xl font-bold text-slate-900 mb-6">{dict.corporate.humanPolicy}</h2>
                        <p className="text-lg text-slate-600 leading-relaxed whitespace-pre-wrap">
                            {humanPolicyText}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
