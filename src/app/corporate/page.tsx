
import React from 'react';
import { Metadata } from 'next';
import { getSettings } from '@/app/admin/settings/actions';
import { Building2, Target, Eye, Users, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';

export const metadata: Metadata = {
    title: 'Kurumsal',
    description: 'Aquachems hakkında bilgi edinin. Misyonumuz, vizyonumuz ve insan kaynakları politikamız.',
    openGraph: {
        title: 'Kurumsal | Aquachems',
        description: 'Aquachems hakkında bilgi edinin. Misyonumuz, vizyonumuz ve insan kaynakları politikamız.',
    },
};

export default async function CorporatePage() {
    const settings = await getSettings();

    return (
        <div className="bg-white">
            {/* Hero Section */}
            <div className="relative bg-slate-900 text-white py-24 md:py-32 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/90 to-transparent z-10" />
                <div className="absolute inset-0">
                    <Image
                        src="/images/corporate-hero.jpg" // You might want to make this dynamic too later
                        alt="Corporate Hero"
                        fill
                        className="object-cover opacity-50"
                    />
                </div>
                <div className="container mx-auto px-4 relative z-20">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">Kurumsal</h1>
                    <p className="text-xl text-slate-300 max-w-2xl">
                        {settings?.description || 'Aquachems olarak endüstriyel çözümlerimizle değer katıyoruz.'}
                    </p>
                </div>
            </div>

            {/* About Us */}
            <div className="py-20">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col lg:flex-row gap-16 items-center">
                        <div className="flex-1 space-y-6">
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-semibold">
                                <Building2 size={18} />
                                Hakkımızda
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">
                                {settings?.siteTitle || 'Aquachems'}
                            </h2>
                            <p className="text-lg text-slate-600 leading-relaxed whitespace-pre-wrap">
                                {settings?.aboutUs || 'Hakkımızda yazısı henüz eklenmedi.'}
                            </p>
                        </div>
                        <div className="flex-1 relative">
                            <div className="relative h-[400px] w-full rounded-2xl overflow-hidden shadow-2xl">
                                <Image
                                    src={settings?.aboutImage || "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80"}
                                    alt="About Us"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            {/* Stats or Decorative elements could go here */}
                        </div>
                    </div>
                </div>
            </div>

            {/* Mission & Vision */}
            <div className="py-20 bg-slate-50">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16">
                        {/* Mission */}
                        <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                                <Target size={32} />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-4">Misyonumuz</h3>
                            <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                                {settings?.mission || 'Misyon yazısı henüz eklenmedi.'}
                            </p>
                        </div>

                        {/* Vision */}
                        <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-6">
                                <Eye size={32} />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-4">Vizyonumuz</h3>
                            <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                                {settings?.vision || 'Vizyon yazısı henüz eklenmedi.'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Human Policy */}
            <div className="py-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center mx-auto mb-6">
                            <Users size={32} />
                        </div>
                        <h2 className="text-3xl font-bold text-slate-900 mb-6">İnsan Kaynakları Politikamız</h2>
                        <p className="text-lg text-slate-600 leading-relaxed whitespace-pre-wrap">
                            {settings?.humanPolicy || 'İnsan kaynakları politikası henüz eklenmedi.'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

