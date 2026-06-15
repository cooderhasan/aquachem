'use client';

import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { locales, localeNames, localeFlags, type Locale } from '@/lib/i18n';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe } from 'lucide-react';

interface LanguageSwitcherProps {
    currentLocale: Locale;
}

export default function LanguageSwitcher({ currentLocale }: LanguageSwitcherProps) {
    const pathname = usePathname();
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);

    const switchLocale = (newLocale: Locale) => {
        // Replace /tr/ or /en/ prefix in the pathname
        const segments = pathname.split('/').filter(Boolean);
        const firstSegment = segments[0];
        
        let newPath: string;
        if (locales.includes(firstSegment as Locale)) {
            // Has a locale prefix — replace it
            segments[0] = newLocale;
            newPath = '/' + segments.join('/');
        } else {
            // No locale prefix — prepend
            newPath = `/${newLocale}/${segments.join('/')}`;
        }

        setIsOpen(false);
        router.push(newPath);
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-semibold text-slate-600 hover:text-primary-700 hover:bg-slate-50 transition-all"
                aria-label="Change language"
            >
                <Globe size={16} />
                <span className="hidden sm:inline">{localeFlags[currentLocale]} {currentLocale.toUpperCase()}</span>
                <span className="sm:hidden">{localeFlags[currentLocale]}</span>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <div
                            className="fixed inset-0 z-40"
                            onClick={() => setIsOpen(false)}
                        />
                        {/* Dropdown */}
                        <motion.div
                            initial={{ opacity: 0, y: -8, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -8, scale: 0.95 }}
                            transition={{ duration: 0.15 }}
                            className="absolute right-0 top-full mt-2 w-36 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-50"
                        >
                            {locales.map((locale) => (
                                <button
                                    key={locale}
                                    onClick={() => switchLocale(locale)}
                                    className={`w-full flex items-center gap-2.5 px-4 py-3 text-sm font-medium transition-colors
                                        ${locale === currentLocale
                                            ? 'bg-primary-50 text-primary-700 font-bold'
                                            : 'text-slate-600 hover:bg-slate-50 hover:text-primary-700'
                                        }`}
                                >
                                    <span className="text-base">{localeFlags[locale]}</span>
                                    <span>{localeNames[locale]}</span>
                                    {locale === currentLocale && (
                                        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary-600" />
                                    )}
                                </button>
                            ))}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
