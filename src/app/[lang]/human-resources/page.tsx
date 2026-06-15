"use client";

import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Upload, CheckCircle2, Send, User, Mail, Phone, Briefcase, FileText, Loader2 } from 'lucide-react';
import { submitApplication } from './actions';
import { useParams } from 'next/navigation';
import { Locale } from '@/lib/i18n';
import { getDictionary } from '@/lib/dictionary';

export default function HumanResourcesPage() {
    const params = useParams();
    const lang = (params?.lang as Locale) || 'tr';
    const dict = getDictionary(lang);

    const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const [fileName, setFileName] = useState<string>('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFileName(e.target.files[0].name);
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setFormStatus('submitting');

        const formData = new FormData(e.currentTarget);

        try {
            let cvUrl = '';

            // 1. Upload CV if selected
            if (selectedFile) {
                const uploadFormData = new FormData();
                uploadFormData.append('file', selectedFile);

                const uploadRes = await fetch('/api/upload', {
                    method: 'POST',
                    body: uploadFormData
                });

                if (!uploadRes.ok) throw new Error(lang === 'en' ? 'CV upload failed' : 'CV yüklenemedi');

                const uploadData = await uploadRes.json();
                cvUrl = uploadData.url;
            } else {
                setFormStatus('error');
                alert(lang === 'en' ? 'Please upload a CV.' : 'Lütfen bir CV yükleyiniz.');
                setFormStatus('idle');
                return;
            }

            // 2. Submit Application
            formData.append('cvUrl', cvUrl);

            const result = await submitApplication(formData);

            if (result.success) {
                setFormStatus('success');
            } else {
                throw new Error(result.error || (lang === 'en' ? 'Application failed' : 'Başvuru başarısız'));
            }

        } catch (error) {
            console.error(error);
            setFormStatus('error');
            alert(dict.humanResources.errorMessage);
        }
    };

    return (
        <div className="bg-slate-50 min-h-screen pb-20">
            {/* Header Banner */}
            <div className="bg-primary-900 text-white pt-32 pb-16">
                <div className="container-custom">
                    <h1 className="text-3xl md:text-5xl font-bold mb-4 text-white">{dict.humanResources.pageTitle}</h1>
                    <p className="text-primary-200 text-lg">
                        {dict.humanResources.pageDescription}
                    </p>
                </div>
            </div>

            <div className="container-custom py-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

                    {/* Info Side */}
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800 mb-6">
                            {lang === 'en' ? 'Career Opportunities' : 'Kariyer Fırsatları'}
                        </h2>
                        <div className="prose prose-slate text-slate-600 mb-8">
                            <p>
                                {lang === 'en'
                                    ? 'At Aquachems, we believe that the key to our success is our human resources. We support you to maximize your potential in an innovative, dynamic and development-oriented working environment.'
                                    : 'Aquachems olarak, başarımızın en büyük anahtarının insan kaynağımız olduğuna inanıyoruz. Yenilikçi, dinamik ve gelişime açık bir çalışma ortamında, potansiyelinizi en üst düzeye çıkarmanız için sizi destekliyoruz.'}
                            </p>
                            <p>
                                {lang === 'en'
                                    ? 'If you want to join our team and be a part of an organization that continuously learns and develops, you can submit your CV by filling out the application form.'
                                    : 'Takımımıza katılmak, sürekli öğrenen ve gelişen bir organizasyonun parçası olmak istiyorsanız, başvuru formunu doldurarak CV\'nizi bize iletebilirsiniz.'}
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                            <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                                <CheckCircle2 className="text-primary-600" size={20} />
                                {lang === 'en' ? 'Why Aquachems?' : 'Neden Aquachems?'}
                            </h3>
                            <ul className="space-y-3">
                                <li className="flex items-center gap-3 text-slate-600 text-sm">
                                    <span className="w-1.5 h-1.5 bg-primary-500 rounded-full"></span>
                                    {lang === 'en' ? 'Career and development opportunities' : 'Kariyer ve gelişim fırsatları'}
                                </li>
                                <li className="flex items-center gap-3 text-slate-600 text-sm">
                                    <span className="w-1.5 h-1.5 bg-primary-500 rounded-full"></span>
                                    {lang === 'en' ? 'Innovative working culture' : 'Yenilikçi çalışma kültürü'}
                                </li>
                                <li className="flex items-center gap-3 text-slate-600 text-sm">
                                    <span className="w-1.5 h-1.5 bg-primary-500 rounded-full"></span>
                                    {lang === 'en' ? 'Sustainability-focused projects' : 'Sürdürülebilirlik odaklı projeler'}
                                </li>
                                <li className="flex items-center gap-3 text-slate-600 text-sm">
                                    <span className="w-1.5 h-1.5 bg-primary-500 rounded-full"></span>
                                    {lang === 'en' ? 'Strong team spirit' : 'Güçlü takım ruhu'}
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
                                <h3 className="text-2xl font-bold text-slate-800 mb-2">
                                    {lang === 'en' ? 'Application Received!' : 'Başvurunuz Alındı!'}
                                </h3>
                                <p className="text-slate-500">
                                    {dict.humanResources.successMessage}
                                </p>
                                <button
                                    onClick={() => { setFormStatus('idle'); setFileName(''); setSelectedFile(null); }}
                                    className="mt-6 text-primary-600 font-medium hover:underline"
                                >
                                    {lang === 'en' ? 'Submit New Application' : 'Yeni Başvuru Yap'}
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <h3 className="text-xl font-bold text-slate-800 mb-2">
                                    {lang === 'en' ? 'Job Application Form' : 'İş Başvuru Formu'}
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                                            <User size={16} /> {lang === 'en' ? 'Full Name' : 'Ad Soyad'}
                                        </label>
                                        <input
                                            name="name"
                                            type="text"
                                            required
                                            className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                                            placeholder={lang === 'en' ? 'Your Full Name' : 'Adınız Soyadınız'}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                                            <Phone size={16} /> {dict.humanResources.phone}
                                        </label>
                                        <input
                                            name="phone"
                                            type="tel"
                                            required
                                            className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                                            placeholder="05XX XXX XX XX"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                                        <Mail size={16} /> {lang === 'en' ? 'Email Address' : 'E-posta Adresi'}
                                    </label>
                                    <input
                                        name="email"
                                        type="email"
                                        required
                                        className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all"
                                        placeholder="ornek@email.com"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                                        <Briefcase size={16} /> {dict.humanResources.position}
                                    </label>
                                    <select name="position" className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 outline-none transition-all bg-white">
                                        <option value="">{lang === 'en' ? 'Select...' : 'Seçiniz...'}</option>
                                        <option value="Genel Başvuru">{lang === 'en' ? 'General Application' : 'Genel Başvuru'}</option>
                                        <option value="Satış ve Pazarlama">{lang === 'en' ? 'Sales and Marketing' : 'Satış ve Pazarlama'}</option>
                                        <option value="Üretim / İmalat">{lang === 'en' ? 'Production / Manufacturing' : 'Üretim / İmalat'}</option>
                                        <option value="Ar-Ge / Laboratuvar">{lang === 'en' ? 'R&D / Laboratory' : 'Ar-Ge / Laboratuvar'}</option>
                                        <option value="Muhasebe / Finans">{lang === 'en' ? 'Accounting / Finance' : 'Muhasebe / Finans'}</option>
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                                        <FileText size={16} /> {dict.humanResources.uploadCV}
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
                                                {fileName || (lang === 'en' ? 'Click or drag to select file' : 'Dosya seçmek için tıklayın veya sürükleyin')}
                                            </span>
                                        </label>
                                        <p className="text-xs text-slate-400 mt-2 text-center">
                                            {lang === 'en' ? 'PDF, DOC or DOCX (Max. 5MB)' : 'PDF, DOC veya DOCX (Maks. 5MB)'}
                                        </p>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={formStatus === 'submitting'}
                                    className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-primary-600/20"
                                >
                                    {formStatus === 'submitting' ? (
                                        <>
                                            <Loader2 className="animate-spin" size={18} />
                                            {dict.humanResources.applying}
                                        </>
                                    ) : (
                                        <>
                                            {dict.humanResources.applyNow} <Send size={18} />
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
