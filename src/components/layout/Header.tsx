"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Phone, Droplets, Mail, MapPin, Facebook, Instagram, Linkedin, Twitter, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SearchModal from '@/components/ui/SearchModal';
import QuoteModal from '@/components/shared/QuoteModal';
import LanguageSwitcher from '@/components/ui/LanguageSwitcher';
import { Locale } from '@/lib/i18n';
import { Dictionary } from '@/lib/dictionary';

interface HeaderProps {
    settings?: any;
    contactLocation?: any;
    lang: Locale;
    dict: Dictionary;
}

const Header = ({ settings, contactLocation, lang, dict }: HeaderProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isQuoteOpen, setIsQuoteOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const pathname = usePathname();

    // Scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 40);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const defaultNavigation = [
        { name: dict.nav.home, href: `/${lang}` },
        { name: dict.nav.products, href: `/${lang}/products` },
        { name: dict.nav.corporate, href: `/${lang}/corporate` },
        { name: dict.nav.references, href: `/${lang}/references` },
        { name: dict.nav.certificates, href: `/${lang}/certificates` },
        { name: dict.nav.contact, href: `/${lang}/contact` },
    ];

    const localizeMenuItem = (item: any) => {
        const hrefWithoutPrefix = item.href.replace(/^\/(tr|en)/, '') || '/';
        const key = hrefWithoutPrefix === '/' ? 'home' : hrefWithoutPrefix.replace(/^\//, '');
        
        let translatedName = item.name;
        // Normalize humanResources keys, etc.
        let dictKey = key;
        if (key === 'human-resources') dictKey = 'humanResources';

        if (dictKey in dict.nav) {
            translatedName = dict.nav[dictKey as keyof typeof dict.nav];
        }
        
        return {
            name: translatedName,
            href: `/${lang}${hrefWithoutPrefix === '/' ? '' : hrefWithoutPrefix}`
        };
    };

    const navigation: any[] = (settings?.menuItems && settings.menuItems.length > 0)
        ? settings.menuItems
            .filter((item: any) => item.href !== '/certificates')
            .map(localizeMenuItem)
        : defaultNavigation
            .filter((item) => item.href !== `/${lang}/certificates`)
            .map(localizeMenuItem);

    return (
        <div className="fixed top-0 left-0 right-0 z-50 flex flex-col">
            {/* Top Bar - Hidden on scroll for cleanliness, visible at top */}
            <div className={`bg-slate-900 text-slate-300 text-xs py-2 transition-all duration-300 overflow-hidden ${scrolled ? 'h-0 opacity-0' : 'h-10 opacity-100'}`}>
                <div className="container-custom flex justify-end items-center h-full">
                    <div className="flex items-center gap-4 md:gap-6">
                        <a href={`mailto:${contactLocation?.email || 'info@aquachems.com'}`} className="hidden sm:flex items-center gap-2 hover:text-white transition-colors">
                            <Mail size={14} />
                            <span>{contactLocation?.email || 'info@aquachems.com'}</span>
                        </a>
                        <a href={`tel:${contactLocation?.phone?.replace(/\s/g, '') || '05336838563'}`} className="flex items-center gap-2 hover:text-white transition-colors whitespace-nowrap">
                            <Phone size={14} />
                            <span>{contactLocation?.phone || '0533 683 85 63'}</span>
                        </a>
                        <div className="hidden md:flex items-center gap-2 hover:text-white transition-colors cursor-default">
                            <MapPin size={14} />
                            <span className="truncate max-w-[300px]">
                                {(() => {
                                    const addr = contactLocation?.address;
                                    if (!addr) return 'İstanbul, Türkiye';

                                    const lower = addr.toLowerCase();
                                    if (lower.includes('konya')) return 'Konya, Türkiye';
                                    if (lower.includes('izmir')) return 'İzmir, Türkiye';
                                    if (lower.includes('istanbul') || lower.includes('istanbul')) return 'İstanbul, Türkiye';
                                    if (lower.includes('ankara')) return 'Ankara, Türkiye';

                                    if (addr.includes('/')) {
                                        return addr.split('/').pop()?.trim() + ', Türkiye';
                                    }

                                    return 'Türkiye';
                                })()}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Header */}
            <header
                style={!scrolled && settings?.headerPadding ? { paddingTop: `${settings.headerPadding}px`, paddingBottom: `${settings.headerPadding}px` } : undefined}
                className={`transition-all duration-300 w-full ${scrolled
                    ? 'bg-white/95 backdrop-blur-md shadow-md py-3'
                    : 'bg-white border-b border-slate-100'
                    }`}
            >
                <div className="container-custom flex justify-between items-center">
                    {/* Logo */}
                    <Link href={`/${lang}`} className="flex items-center gap-3 group">
                        {settings?.logo ? (
                            <div className="flex flex-col items-start">
                                <div
                                    className="relative w-auto min-w-[120px]"
                                    style={{ height: settings?.logoHeight ? `${settings.logoHeight}px` : '48px' }}
                                >
                                    <img
                                        src={settings.logo}
                                        alt={(lang === 'en' ? settings?.siteTitleEn : settings?.siteTitle) || settings?.siteTitle || 'Logo'}
                                        className="h-full w-auto object-contain"
                                    />
                                </div>
                                {((lang === 'en' ? settings?.siteSloganEn : settings?.siteSlogan) || settings?.siteSlogan) && (
                                     <span 
                                         style={{ fontSize: settings?.siteSloganFontSize ? `${settings.siteSloganFontSize}px` : '10px' }}
                                         className={`text-slate-500 font-medium tracking-wider italic font-serif transition-all duration-300 ${
                                             scrolled ? 'max-h-0 opacity-0 overflow-hidden mt-0' : 'max-h-8 opacity-100 mt-1'
                                         } hidden sm:inline-block`}
                                     >
                                         {(lang === 'en' ? settings?.siteSloganEn : settings?.siteSlogan) || settings?.siteSlogan}
                                     </span>
                                 )}
                            </div>
                        ) : (
                            <>
                                <div className={`p-2.5 rounded-xl transition-all duration-300 shadow-lg ${scrolled
                                    ? 'bg-primary-600 text-white shadow-primary-600/20'
                                    : 'bg-gradient-to-br from-primary-600 to-primary-800 text-white shadow-primary-900/20'
                                    }`}>
                                    <Droplets size={scrolled ? 24 : 28} className="transform group-hover:rotate-12 transition-transform duration-500" />
                                </div>
                                <div className="flex flex-col">
                                    <span className={`font-bold text-slate-900 leading-none tracking-tight transition-all ${scrolled ? 'text-xl' : 'text-2xl'}`}>
                                        {(lang === 'en' ? settings?.siteTitleEn : settings?.siteTitle) || settings?.siteTitle || 'AQUACHEMS'}
                                    </span>
                                    <span 
                                        style={{ fontSize: settings?.siteSloganFontSize ? `${settings.siteSloganFontSize}px` : '10px' }}
                                        className="text-slate-500 font-medium tracking-wider italic font-serif mt-1"
                                    >
                                        {(lang === 'en' ? settings?.siteSloganEn : settings?.siteSlogan) || settings?.siteSlogan || (lang === 'en' ? 'Chemistry & Innovation' : 'Kimya & İnovasyon')}
                                    </span>
                                </div>
                            </>
                        )}
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden xl:flex items-center gap-8">
                        {navigation.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    style={{ fontSize: settings?.menuFontSize ? `${settings.menuFontSize}px` : '14px' }}
                                    className={`font-bold transition-all relative py-1 hover:text-primary-700 ${isActive ? 'text-primary-700' : 'text-slate-600'
                                        }`}
                                >
                                    {item.name}
                                    {isActive && (
                                        <motion.div
                                            layoutId="underline"
                                            className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-600 rounded-full"
                                        />
                                    )}
                                </Link>
                            );
                        })}

                        {/* Search Icon */}
                        <button
                            onClick={() => setIsSearchOpen(true)}
                            className="text-slate-600 hover:text-primary-600 transition-colors p-2 rounded-full hover:bg-slate-50"
                            aria-label={dict.header.search}
                        >
                            <Search size={24} />
                        </button>

                        {/* Language Switcher */}
                        <LanguageSwitcher currentLocale={lang} />

                        <button
                            onClick={() => setIsQuoteOpen(true)}
                            className={`
                                ml-4 px-7 py-3 rounded-full font-bold text-sm transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5
                                ${scrolled
                                    ? 'bg-primary-600 text-white hover:bg-primary-700 shadow-primary-600/30'
                                    : 'bg-slate-900 text-white hover:bg-slate-800 shadow-slate-900/30'
                                }
                            `}
                        >
                            {dict.header.getQuote}
                        </button>
                    </nav>

                    {/* Mobile Menu Button */}
                    <div className="flex items-center gap-2 xl:hidden">
                        <LanguageSwitcher currentLocale={lang} />
                        <button
                            onClick={() => setIsSearchOpen(true)}
                            className="text-slate-600 hover:text-primary-600 transition-colors p-2"
                            aria-label={dict.header.search}
                        >
                            <Search size={24} />
                        </button>
                        <button
                            className="text-slate-600 hover:text-primary-600 transition-colors p-2"
                            onClick={() => setIsOpen(!isOpen)}
                        >
                            {isOpen ? <X size={28} /> : <Menu size={28} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Overlay */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="xl:hidden bg-white border-t border-slate-100 absolute w-full left-0 top-full shadow-2xl overflow-hidden"
                        >
                            <div className="container-custom py-6 flex flex-col gap-2">
                                {navigation.map((item) => (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={`px-4 py-3 rounded-xl font-bold transition-colors hover:bg-slate-50 ${pathname === item.href ? 'text-primary-700 bg-primary-50' : 'text-slate-600'
                                            }`}
                                        onClick={() => setIsOpen(false)}
                                    >
                                        {item.name}
                                    </Link>
                                ))}
                                <button
                                    className="bg-primary-600 text-white px-5 py-4 rounded-xl font-bold text-center hover:bg-primary-700 transition-colors mt-4 shadow-lg shadow-primary-600/20"
                                    onClick={() => {
                                        setIsOpen(false);
                                        setIsQuoteOpen(true);
                                    }}
                                >
                                    {dict.header.getQuoteMobile}
                                </button>

                                <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col gap-4 text-slate-500 text-sm font-medium">
                                    <div className="flex items-center justify-center gap-2">
                                        <Phone size={16} />
                                        <a href={`tel:${contactLocation?.phone?.replace(/\s/g, '') || '05336838563'}`}>{contactLocation?.phone || '0533 683 85 63'}</a>
                                    </div>
                                    <div className="flex items-center justify-center gap-2">
                                        <Mail size={16} />
                                        <a href={`mailto:${contactLocation?.email || 'info@aquachems.com'}`}>{contactLocation?.email || 'info@aquachems.com'}</a>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>

            {/* Search Modal */}
            <SearchModal
                isOpen={isSearchOpen}
                onClose={() => setIsSearchOpen(false)}
            />

            {/* Quote Modal */}
            <QuoteModal
                isOpen={isQuoteOpen}
                onClose={() => setIsQuoteOpen(false)}
                productName="Genel Bilgi / Teklif"
                dict={dict}
            />
        </div >
    );
};

export default Header;


