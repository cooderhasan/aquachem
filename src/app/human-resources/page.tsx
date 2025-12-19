"use client";

import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Upload, CheckCircle2, Send, User, Mail, Phone, Briefcase, FileText } from 'lucide-react';

export default function HumanResourcesPage() {
    const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const [fileName, setFileName] = useState<string>('');

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFileName(e.target.files[0].name);
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setFormStatus('submitting');

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));

        setFormStatus('success');
    };

    return (
        <div className="bg-slate-50 min-h-screen pb-20">
            {/* Header Banner */}
            <div className="bg-primary-900 text-white pt-32 pb-16">
                <div className="container-custom">
                    <h1 className="text-3xl md:text-5xl font-bold mb-4 text-white">İnsan Kaynakları</h1>
                    <p className="text-primary-200 text-lg">
                        Aramıza katılın, geleceği birlikte şekillendirelim.
                    </p>
                </div>
            </div>

            <div className="container-custom py-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

                    {/* Info Side */}
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800 mb-6">Kariyer Fırsatları</h2>
                        <div className="prose prose-slate text-slate-600 mb-8">
                            <p>
                                Aquachems olarak, başarımızın en büyük anahtarının insan kaynağımız olduğuna inanıyoruz.
                                Yenilikçi, dinamik ve gelişime açık bir çalışma ortamında, potansiyelinizi en üst düzeye
                                çıkarmanız için sizi destekliyoruz.
                            </p>
                            <p>
                                Takımımıza katılmak, sürekli öğrenen ve gelişen bir organizasyonun parçası olmak istiyorsanız,
                                başvuru formunu doldurarak CV'nizi bize iletebilirsiniz.
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <CheckCircle2 className="text-primary-600" size={20} />
                                Neden Aquachems?
                            </h3>
                            <ul className="space-y-3">
                                <li className="flex items-center gap-3 text-slate-600 text-sm">
                                    <span className="w-1.5 h-1.5 bg-primary-500 rounded-full"></span>
                                    Kariyer ve gelişim fırsatları
                                </li>
                                <li className="flex items-center gap-3 text-slate-600 text-sm">
                                    <span className="w-1.5 h-1.5 bg-primary-500 rounded-full"></span>
                                    Yenilikçi çalışma kültürü
                                </li>
                                <li className="flex items-center gap-3 text-slate-600 text-sm">
                                    <span className="w-1.5 h-1.5 bg-primary-500 rounded-full"></span>
                                    Sürdürülebilirlik odaklı projeler
                                </li>
                                <li className="flex items-center gap-3 text-slate-600 text-sm">
                                    <span className="w-1.5 h-1.5 bg-primary-500 rounded-full"></span>
                                    Güçlü takım ruhu
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Form Side */}
                    <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100">
                        {formStatus === 'success' ? (
                            <div className="text-center py-12">
                                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <CheckCircle2 size={40} />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-800 mb-2">Başvurunuz Alındı!</h3>
                                <p className="text-slate-500">
                                    CV'niz başarıyla sistemimize yüklendi. İnsan kaynakları departmanımız başvurunuzu
                                    inceleyip en kısa sürede sizinle iletişime geçecektir.
                                </p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <h3 className="text-xl font-bold text-slate-800 mb-2">İş Başvuru Formu</h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                                            <User size={16} /> Ad Soyad
                                        </label>
                                        <input type="text" required className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all" placeholder="Adınız Soyadınız" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                                            <Phone size={16} /> Telefon
                                        </label>
                                        <input type="tel" required className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all" placeholder="05XX XXX XX XX" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                                        <Mail size={16} /> E-posta Adresi
                                    </label>
                                    <input type="email" required className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all" placeholder="ornek@email.com" />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                                        <Briefcase size={16} /> Başvurulan Pozisyon / Alan
                                    </label>
                                    <select className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all bg-white">
                                        <option value="">Seçiniz...</option>
                                        <option value="genel">Genel Başvuru</option>
                                        <option value="satis">Satış ve Pazarlama</option>
                                        <option value="uretim">Üretim / İmalat</option>
                                        <option value="arge">Ar-Ge / Laboratuvar</option>
                                        <option value="muhasebe">Muhasebe / Finans</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                                        <FileText size={16} /> Özgeçmiş (CV) Yükle
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="file"
                                            accept=".pdf,.doc,.docx"
                                            onChange={handleFileChange}
                                            id="cv-upload"
                                            className="hidden"
                                        />
                                        <label
                                            htmlFor="cv-upload"
                                            className="flex items-center justify-center gap-3 w-full px-4 py-8 border-2 border-dashed border-slate-300 rounded-xl cursor-pointer hover:border-primary-500 hover:bg-primary-50 transition-all group"
                                        >
                                            <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center group-hover:bg-white transition-colors">
                                                <Upload size={20} className="text-slate-500 group-hover:text-primary-600" />
                                            </div>
                                            <span className="text-slate-500 font-medium group-hover:text-primary-700">
                                                {fileName || "Dosya seçmek için tıklayın veya sürükleyin"}
                                            </span>
                                        </label>
                                        <p className="text-xs text-slate-400 mt-2 text-center">PDF, DOC veya DOCX (Maks. 5MB)</p>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={formStatus === 'submitting'}
                                    className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-primary-600/20"
                                >
                                    {formStatus === 'submitting' ? (
                                        <>Gönderiliyor...</>
                                    ) : (
                                        <>
                                            Başvuruyu Tamamla <Send size={18} />
                                        </>
                                    )}
                                </button>
                            </form>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
}
