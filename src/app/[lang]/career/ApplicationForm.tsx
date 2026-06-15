'use client';

import React, { useState } from 'react';
import { Send, Loader2, CheckCircle, AlertCircle, Upload } from 'lucide-react';


import { Locale } from '@/lib/i18n';
import { Dictionary } from '@/lib/dictionary';

interface ApplicationFormProps {
    lang: Locale;
    dict: Dictionary;
}

export default function ApplicationForm({ lang, dict }: ApplicationFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');
    const [fileName, setFileName] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log('CLIENT: Form submission started');
        setIsLoading(true);
        setStatus('idle');

        const formData = new FormData(e.currentTarget);

        try {
            console.log('CLIENT: Calling API route...');
            const response = await fetch('/api/career', {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();
            console.log('CLIENT: API result:', result);

            if (response.ok && result.success) {
                setStatus('success');
                (e.target as HTMLFormElement).reset();
                setFileName('');
            } else {
                setStatus('error');
                setErrorMessage(result.error || dict.humanResources.errorMessage);
                console.error('CLIENT: Server returned error:', result.error);
            }
        } catch (error) {
            console.error('CLIENT: Submission error caught:', error);
            setStatus('error');
            setErrorMessage(dict.humanResources.errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFileName(e.target.files[0].name);
        }
    };

    return (
        <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100">
            <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <Send className="text-primary-500" />
                {lang === 'en' ? 'Job Application Form' : 'İş Başvuru Formu'}
            </h3>

            {status === 'success' && (
                <div className="bg-emerald-50 text-emerald-600 p-4 rounded-lg mb-6 flex items-center gap-2">
                    <CheckCircle size={20} />
                    {dict.humanResources.successMessage}
                </div>
            )}

            {status === 'error' && (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 flex items-center gap-2">
                    <AlertCircle size={20} />
                    {errorMessage}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            {lang === 'en' ? 'Full Name *' : 'Adınız Soyadınız *'}
                        </label>
                        <input name="name" type="text" required className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            {dict.humanResources.phone} *
                        </label>
                        <input name="phone" type="tel" required placeholder="05XX XXX XX XX" className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            {lang === 'en' ? 'Email Address *' : 'E-posta Adresiniz *'}
                        </label>
                        <input name="email" type="email" required className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            {dict.humanResources.position}
                        </label>
                        <input name="position" type="text" placeholder={lang === 'en' ? 'e.g. Sales Representative' : 'Örn: Satış Temsilcisi'} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                        {dict.humanResources.uploadCV} (PDF, Word - Max 2MB) *
                    </label>
                    <div className="relative">
                        <input
                            type="file"
                            name="cv"
                            accept=".pdf,.doc,.docx"
                            required
                            onChange={handleFileChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div className="w-full px-4 py-3 border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center gap-2 text-slate-500 hover:bg-slate-50 transition-colors">
                            <Upload size={20} />
                            {fileName ? <span className="text-primary-600 font-medium">{fileName}</span> : <span>{lang === 'en' ? 'Select or Drag File' : 'Dosya Seçin veya Sürükleyin'}</span>}
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                        {isLoading ? dict.humanResources.applying : dict.humanResources.applyNow}
                    </button>
                </div>
            </form>
        </div>
    );
}
