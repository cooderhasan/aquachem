import React from 'react';
import { Metadata } from 'next';
import { Award, FileText } from 'lucide-react';
import Image from 'next/image';
import { db } from '@/lib/db';
import { certificates } from '@/db/schema';
import { desc } from 'drizzle-orm';

export const metadata: Metadata = {
    title: 'Belgelerimiz',
    description: 'Aquachems kalite belgeleri - ISO 9001, ISO 14001, OHSAS 18001, TSE ve diğer sertifikalarımız.',
    openGraph: {
        title: 'Belgelerimiz | Aquachems',
        description: 'Aquachems kalite belgeleri - ISO 9001, ISO 14001, OHSAS 18001, TSE ve diğer sertifikalarımız.',
    },
};

async function getCertificates() {
    try {
        const items = await db.select().from(certificates).orderBy(desc(certificates.id));
        return items;
    } catch (error) {
        console.error("Failed to fetch certificates:", error);
        return [];
    }
}

export default async function CertificatesPage() {
    const certificateList = await getCertificates();
    return (
        <div className="bg-white min-h-screen pb-20">
            {/* Header Banner */}
            <div className="bg-primary-900 text-white pt-48 pb-16">
                <div className="container-custom">
                    <h1 className="text-3xl md:text-5xl font-bold mb-4 text-white">Belgelerimiz</h1>
                    <p className="text-primary-200 text-lg">
                        Kalite politikamızın bir parçası olan yetki ve kalite belgelerimiz.
                    </p>
                </div>
            </div>

            <div className="container-custom py-16">
                <div className="max-w-4xl mx-auto text-center mb-16">
                    <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center justify-center gap-3">
                        <Award className="text-primary-600" size={32} />
                        <span>Kalite Standartlarımız</span>
                    </h2>
                    <p className="text-slate-600 leading-relaxed text-lg">
                        Uluslararası standartlara uygun üretim anlayışımızla, sahip olduğumuz sertifikalar kalitemizin ve güvenilirliğimizin teminatıdır.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {certificateList.length > 0 ? (
                        certificateList.map((cert) => (
                            <div key={cert.id} className="bg-slate-50 border border-slate-200 rounded-xl p-8 hover:shadow-lg transition-shadow group">
                                <div className="w-full h-48 relative mb-6 rounded-lg overflow-hidden bg-white border border-slate-100">
                                    <Image
                                        src={cert.image}
                                        alt={cert.title}
                                        fill
                                        className="object-contain p-4 group-hover:scale-105 transition-transform"
                                    />
                                </div>
                                <h3 className="text-xl font-bold text-slate-800 text-center mb-3 group-hover:text-primary-700 transition-colors">
                                    {cert.title}
                                </h3>
                                {cert.description && (
                                    <p className="text-slate-500 text-center font-medium">{cert.description}</p>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-12">
                            <FileText className="mx-auto text-slate-300 mb-4" size={48} />
                            <p className="text-slate-500">Henüz belge eklenmemiş.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
