'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { locales, localeNames, localeFlags, type Locale } from '@/lib/i18n';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe } from 'lucide-react';

interface LanguageSwitcherProps {
    currentLocale: Locale;
}

/** Same page in another language: swaps (or prepends) the /tr|/en prefix. */
function localizedHref(pathname: string, locale: Locale) {
    const segments = pathname.split('/').filter(Boolean);
    if (locales.includes(segments[0] as Locale)) {
        segments[0] = locale;
    } else {
        segments.unshift(locale);
    }
    return '/' + segments.join('/');
}

export default function LanguageSwitcher({ currentLocale }: LanguageSwitcherProps) {
    const pathname = usePathname() || '/';
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-semibold text-slate-600 hover:text-primary-700 hover:bg-slate-50 transition-all"
                aria-label="Change language"
                aria-expanded={isOpen}
            >
                <Globe size={16} />
                <span className="hidden sm:inline">{localeFlags[currentLocale]} {currentLocale.toUpperCase()}</span>
                <span className="sm:hidden">{localeFlags[currentLocale]}</span>
            </button>

            {/* Crawlable links to the other language versions (hidden visually; the dropdown below is the UI). */}
            <nav aria-label="Language" className="sr-only">
                {locales.filter((l) => l !== currentLocale).map((locale) => (
                    <a key={locale} href={localizedHref(pathname, locale)} hrefLang={locale} lang={locale}>
                        {localeNames[locale]}
                    </a>
                ))}
            </nav>

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
                                <Link
                                    key={locale}
                                    href={localizedHref(pathname, locale)}
                                    hrefLang={locale}
                                    lang={locale}
                                    onClick={() => setIsOpen(false)}
                                    aria-current={locale === currentLocale ? 'true' : undefined}
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
                                </Link>
                            ))}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
