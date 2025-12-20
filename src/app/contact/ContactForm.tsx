'use client';

import React, { useState } from 'react';
import { Send, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { submitContactForm } from './actions';

export default function ContactForm() {
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setStatus('idle');

        const formData = new FormData(e.currentTarget);

        try {
            const result = await submitContactForm(formData);
            if (result.success) {
                setStatus('success');
                (e.target as HTMLFormElement).reset();
            } else {
                setStatus('error');
                setErrorMessage(result.error || 'Bir hata oluştu.');
            }
        } catch (error) {
            setStatus('error');
            setErrorMessage('Bir hata oluştu.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100">
            <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <Send className="text-primary-500" />
                İletişim Formu
            </h3>

            {status === 'success' && (
                <div className="bg-emerald-50 text-emerald-600 p-4 rounded-lg mb-6 flex items-center gap-2">
                    <CheckCircle size={20} />
                    Mesajınız başarıyla gönderildi. En kısa sürede dönüş yapacağız.
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
                        <label className="block text-sm font-medium text-slate-700 mb-1">Adınız Soyadınız</label>
                        <input name="name" type="text" required className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">E-posta Adresiniz</label>
                        <input name="email" type="email" required className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Konu</label>
                    <input name="subject" type="text" className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Mesajınız</label>
                    <textarea name="message" required rows={4} className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"></textarea>
                </div>
                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                        {isLoading ? 'Gönderiliyor...' : 'Gönder'}
                    </button>
                </div>
            </form>
        </div>
    );
}
