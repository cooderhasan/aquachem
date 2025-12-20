import React from 'react';
import Link from 'next/link';
import { Plus, Trash2, Edit2, Award } from 'lucide-react';
import { getCertificates, deleteCertificate } from './actions';
import Image from 'next/image';

export const dynamic = 'force-dynamic';

export default async function CertificatesPage() {
    const certificates = await getCertificates();

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Belgeler</h1>
                    <p className="text-slate-500">Kalite ve yetki belgelerinizi yönetin</p>
                </div>
                <Link
                    href="/admin/certificates/new"
                    className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-colors shadow-lg shadow-primary-500/20 font-semibold"
                >
                    <Plus size={20} />
                    Yeni Belge Ekle
                </Link>
            </div>

            {/* Certificates Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {certificates.length > 0 ? (
                    certificates.map((cert) => (
                        <div key={cert.id} className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-lg transition-all group h-full flex flex-col">
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-14 h-14 bg-slate-100 rounded-xl overflow-hidden relative border border-slate-200">
                                    {cert.image ? (
                                        <Image
                                            src={cert.image}
                                            alt={cert.title}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-400">
                                            <Award size={28} />
                                        </div>
                                    )}
                                </div>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Link
                                        href={`/admin/certificates/${cert.id}`}
                                        className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                                    >
                                        <Edit2 size={16} />
                                    </Link>
                                    <form action={async () => {
                                        "use server";
                                        await deleteCertificate(cert.id);
                                    }}>
                                        <button
                                            type="submit"
                                            className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </form>
                                </div>
                            </div>
                            <h3 className="text-lg font-bold text-slate-800 mb-2 line-clamp-1">{cert.title}</h3>
                            <p className="text-sm text-slate-500 line-clamp-2">{cert.description}</p>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full py-12 text-center text-slate-500">
                        Henüz hiç belge eklenmemiş.
                    </div>
                )}

                {/* Add New Card */}
                <Link
                    href="/admin/certificates/new"
                    className="border-2 border-dashed border-slate-300 rounded-2xl p-6 hover:bg-slate-50 hover:border-primary-500 transition-all group flex flex-col items-center justify-center min-h-[180px]"
                >
                    <div className="w-14 h-14 bg-slate-100 text-slate-400 group-hover:bg-primary-100 group-hover:text-primary-600 rounded-xl flex items-center justify-center mb-3 transition-colors">
                        <Plus size={28} />
                    </div>
                    <span className="text-slate-500 font-semibold group-hover:text-primary-600 transition-colors">Yeni Belge Ekle</span>
                </Link>
            </div>
        </div>
    );
}
