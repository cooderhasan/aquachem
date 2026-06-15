'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Loader2, CheckCircle2, AlertCircle, FileText, Phone, Mail, Building2, Package, ClipboardList } from 'lucide-react';
import { submitQuoteRequest } from '@/app/[lang]/quote/actions';
import { Dictionary } from '@/lib/dictionary';

interface QuoteModalProps {
    isOpen: boolean;
    onClose: () => void;
    productName: string; // Ürün veya kategori adı
    dict?: Dictionary;
}

export default function QuoteModal({ isOpen, onClose, productName, dict }: QuoteModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState('');

    const t = dict?.quote || {
        title: 'Teklif Talebi',
        subtitle: 'Formu doldurun, en kısa sürede dönelim',
        name: 'Ad Soyad',
        company: 'Şirket Adı',
        email: 'E-posta',
        phone: 'Telefon',
        quantityNote: 'Miktar / Açıklama',
        quantityPlaceholder: 'İhtiyaç duyduğunuz miktar, kullanım alanı veya özel notlarınız...',
        submit: 'Teklif Talebi Gönder',
        submitting: 'Gönderiliyor...',
        successTitle: 'Talebiniz Alındı!',
        successMessage: 'En kısa sürede ekibimiz sizi arayacak veya e-posta ile dönüş yapacak.',
        errorDefault: 'Bir hata oluştu.',
        errorConnection: 'Bağlantı hatası. Lütfen tekrar deneyin.',
        requiredNote: '* ile işaretli alanlar zorunludur. Bilgileriniz gizli tutulur.',
    };

    // ESC ile kapat
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (e.key === 'Escape') onClose();
    }, [onClose]);

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [isOpen, handleKeyDown]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setStatus('idle');

        const formData = new FormData(e.currentTarget);
        formData.set('productName', productName);

        try {
            const result = await submitQuoteRequest(formData);
            if (result.success) {
                setStatus('success');
            } else {
                setStatus('error');
                setErrorMessage(result.error || t.errorDefault);
            }
        } catch {
            setStatus('error');
            setErrorMessage(t.errorConnection);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        setStatus('idle');
        setErrorMessage('');
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[99]"
                        onClick={handleClose}
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.92, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.92, y: 20 }}
                        transition={{ duration: 0.25, ease: 'easeOut' }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">

                            {/* Header */}
                            <div className="relative bg-gradient-to-r from-primary-700 to-primary-900 rounded-t-2xl p-6 text-white">
                                <button
                                    onClick={handleClose}
                                    className="absolute top-4 right-4 p-2 rounded-full hover:bg-white/20 transition-colors"
                                    aria-label={dict?.common?.close || 'Kapat'}
                                >
                                    <X size={20} />
                                </button>
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                                        <FileText size={22} />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold">{t.title}</h2>
                                        <p className="text-primary-200 text-sm">{t.subtitle}</p>
                                    </div>
                                </div>
                                {/* Ürün badge */}
                                <div className="mt-3 flex items-center gap-2 bg-white/10 rounded-xl px-3 py-2 w-fit">
                                    <Package size={14} className="text-primary-200" />
                                    <span className="text-sm font-semibold text-white">{productName}</span>
                                </div>
                            </div>

                            {/* Body */}
                            <div className="p-6">
                                {status === 'success' ? (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="text-center py-8"
                                    >
                                        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <CheckCircle2 size={36} className="text-emerald-600" />
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-800 mb-2">{t.successTitle}</h3>
                                        <p className="text-slate-500 mb-6">
                                            {t.successMessage}
                                        </p>
                                        <button
                                            onClick={handleClose}
                                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-xl font-semibold transition-colors"
                                        >
                                            {dict?.common?.ok || 'Tamam'}
                                        </button>
                                    </motion.div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        {status === 'error' && (
                                            <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-2 text-sm">
                                                <AlertCircle size={16} />
                                                {errorMessage}
                                            </div>
                                        )}

                                        {/* Ad Soyad + Şirket */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                                                    {t.name} <span className="text-red-500">*</span>
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        name="name"
                                                        type="text"
                                                        required
                                                        placeholder="Ahmet Yılmaz"
                                                        className="w-full pl-4 pr-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-slate-800 placeholder-slate-400 text-sm"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                                                    {t.company}
                                                </label>
                                                <div className="relative">
                                                    <Building2 size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                                    <input
                                                        name="company"
                                                        type="text"
                                                        placeholder="Firma Adı A.Ş."
                                                        className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-slate-800 placeholder-slate-400 text-sm"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* E-posta + Telefon */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                                                    {t.email} <span className="text-red-500">*</span>
                                                </label>
                                                <div className="relative">
                                                    <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                                    <input
                                                        name="email"
                                                        type="email"
                                                        required
                                                        placeholder="ahmet@firma.com"
                                                        className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-slate-800 placeholder-slate-400 text-sm"
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                                                    {t.phone} <span className="text-red-500">*</span>
                                                </label>
                                                <div className="relative">
                                                    <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                                    <input
                                                        name="phone"
                                                        type="tel"
                                                        required
                                                        placeholder="0532 000 00 00"
                                                        className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-slate-800 placeholder-slate-400 text-sm"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Miktar / Açıklama */}
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                                                {t.quantityNote}
                                            </label>
                                            <div className="relative">
                                                <ClipboardList size={16} className="absolute left-3 top-3.5 text-slate-400" />
                                                <textarea
                                                    name="quantity"
                                                    rows={3}
                                                    placeholder={t.quantityPlaceholder}
                                                    className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-slate-800 placeholder-slate-400 text-sm resize-none"
                                                />
                                            </div>
                                        </div>

                                        {/* Submit */}
                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className="w-full bg-primary-600 hover:bg-primary-700 disabled:opacity-70 disabled:cursor-not-allowed text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors text-base mt-2"
                                        >
                                            {isLoading ? (
                                                <><Loader2 size={18} className="animate-spin" /> {t.submitting}</>
                                            ) : (
                                                <><Send size={18} /> {t.submit}</>
                                            )}
                                        </button>

                                        <p className="text-xs text-slate-400 text-center">
                                            {t.requiredNote}
                                        </p>
                                    </form>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
