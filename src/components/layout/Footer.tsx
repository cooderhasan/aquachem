"use client";

import React from 'react';
import Link from 'next/link';
import { Droplets, MapPin, Phone, Mail, Instagram, Linkedin, Facebook, Globe } from 'lucide-react';
import { Locale } from '@/lib/i18n';
import { Dictionary } from '@/lib/dictionary';

interface ContactLocation {
    id: number;
    title: string;
    titleEn?: string | null;
    address: string;
    addressEn?: string | null;
    phone: string | null;
    email: string | null;
}

interface FooterProps {
    settings?: any;
    contactLocation?: ContactLocation | null;
    lang: Locale;
    dict: Dictionary;
}

const Footer = ({ settings, contactLocation, lang, dict }: FooterProps) => {
    const slogan = lang === 'en' ? (settings?.siteSloganEn || settings?.siteSlogan) : settings?.siteSlogan;
    const description = lang === 'en' ? (settings?.descriptionEn || settings?.description) : settings?.description;
    const address = lang === 'en' ? (contactLocation?.addressEn || contactLocation?.address) : contactLocation?.address;
    const activeFooterLogo = lang === 'en' ? (settings?.footerLogoEn || settings?.footerLogo) : settings?.footerLogo;

    return (
        <footer
            style={{ transform: 'translateZ(0)' }}
            className="bg-slate-900 text-slate-300 pt-20 pb-10 mt-auto relative z-50 overflow-hidden"
        >
            <div className="container-custom">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-16">
                    {/* Brand Info */}
                    <div className="col-span-2 lg:col-span-1 space-y-6">
                        <Link href={`/${lang}`} className="flex flex-col items-start gap-3 group">
                            {activeFooterLogo ? (
                                <div className="flex flex-col items-start">
                                    <img
                                        src={activeFooterLogo}
                                        alt="Aquachems Logo"
                                        style={{ marginTop: settings?.footerLogoPadding ? `${settings.footerLogoPadding}px` : undefined }}
                                        className="h-16 w-auto object-contain"
                                    />
                                    {slogan && (
                                        <p 
                                            style={{ fontSize: settings?.siteSloganFontSize ? `${settings.siteSloganFontSize + 2}px` : '12px' }}
                                            className="text-primary-400 font-medium tracking-wider italic font-serif mt-2"
                                        >
                                            {slogan}
                                        </p>
                                    )}
                                </div>
                            ) : (
                                <div className="flex items-center gap-3">
                                    <div className="bg-primary-600 text-white p-2.5 rounded-xl group-hover:bg-primary-500 transition-colors">
                                        <Droplets size={28} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-2xl font-bold text-white leading-none tracking-tight">AQUACHEMS</span>
                                        <span 
                                            style={{ fontSize: settings?.siteSloganFontSize ? `${settings.siteSloganFontSize}px` : '10px' }}
                                            className="text-primary-400 font-medium tracking-wider italic font-serif mt-1"
                                        >
                                            {slogan || (lang === 'en' ? 'Chemistry & Innovation' : 'Kimya & İnovasyon')}
                                        </span>
                                    </div>
                                </div>
                            )}
                        </Link>
                        <p className="text-slate-400 leading-relaxed text-sm">
                            {description || dict.footer.description}
                        </p>
                        <div className="flex gap-4 pt-2">
                            <div className="flex gap-4 pt-2">
                                {settings?.socialMedia?.instagram && (
                                    <a href={settings.socialMedia.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-primary-600 hover:text-white transition-all transform hover:scale-110">
                                        <Instagram size={18} />
                                    </a>
                                )}
                                {settings?.socialMedia?.facebook && (
                                    <a href={settings.socialMedia.facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-primary-600 hover:text-white transition-all transform hover:scale-110">
                                        <Facebook size={18} />
                                    </a>
                                )}
                                {settings?.socialMedia?.twitter && (
                                    <a href={settings.socialMedia.twitter} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-primary-600 hover:text-white transition-all transform hover:scale-110">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="lucide lucide-x"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" /></svg>
                                    </a>
                                )}
                                {settings?.socialMedia?.linkedin && (
                                    <a href={settings.socialMedia.linkedin} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-primary-600 hover:text-white transition-all transform hover:scale-110">
                                        <Linkedin size={18} />
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
                            <Globe size={16} className="text-primary-500" /> {dict.footer.quickLinks}
                        </h3>
                        <ul className="space-y-3 text-sm">
                            <li><Link href={`/${lang}`} className="hover:text-primary-400 hover:translate-x-1 transition-all inline-block">{dict.nav.home}</Link></li>
                            <li><Link href={`/${lang}/corporate`} className="hover:text-primary-400 hover:translate-x-1 transition-all inline-block">{dict.nav.corporate}</Link></li>
                            <li><Link href={`/${lang}/products`} className="hover:text-primary-400 hover:translate-x-1 transition-all inline-block">{dict.nav.products}</Link></li>
                            <li><Link href={`/${lang}/references`} className="hover:text-primary-400 hover:translate-x-1 transition-all inline-block">{dict.nav.references}</Link></li>
                            <li><Link href={`/${lang}/human-resources`} className="hover:text-primary-400 hover:translate-x-1 transition-all inline-block">{dict.nav.humanResources}</Link></li>
                            <li><Link href={`/${lang}/contact`} className="hover:text-primary-400 hover:translate-x-1 transition-all inline-block">{dict.nav.contact}</Link></li>
                        </ul>
                    </div>

                    {/* Product Groups */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-6">{dict.footer.productGroups}</h3>
                        <ul className="space-y-3 text-sm">
                            <li><Link href={`/${lang}/products/genel-temizlik`} className="hover:text-primary-400 hover:translate-x-1 transition-all inline-block">{lang === 'en' ? 'General Cleaning' : 'Genel Temizlik'}</Link></li>
                            <li><Link href={`/${lang}/products/likit-cilt-temizleme`} className="hover:text-primary-400 hover:translate-x-1 transition-all inline-block">{lang === 'en' ? 'Liquid Skin Cleaning' : 'Likit Cilt Temizleme'}</Link></li>
                            <li><Link href={`/${lang}/products/dezenfektan-grubu`} className="hover:text-primary-400 hover:translate-x-1 transition-all inline-block">{lang === 'en' ? 'Disinfectant Group' : 'Dezenfektan Grubu'}</Link></li>
                            <li><Link href={`/${lang}/products/oto-bakim-grubu`} className="hover:text-primary-400 hover:translate-x-1 transition-all inline-block">{lang === 'en' ? 'Auto Care Group' : 'Oto Bakım Grubu'}</Link></li>
                            <li><Link href={`/${lang}/products/teknik-grup`} className="hover:text-primary-400 hover:translate-x-1 transition-all inline-block">{lang === 'en' ? 'Technical Group' : 'Teknik Grup'}</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="col-span-2 lg:col-span-1">
                        <h3 className="text-white font-bold text-lg mb-6">{dict.footer.contact}</h3>
                        <ul className="space-y-4 text-sm">
                            <li className="flex items-start gap-3">
                                <div className="p-2 bg-slate-800 rounded-lg text-primary-500 shrink-0">
                                    <MapPin size={18} />
                                </div>
                                <span className="leading-relaxed">{address || 'İkitelli OSB Mah. Giyim Sanatkarları 3. Ada C Blok No:57 Başakşehir / İstanbul'}</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <div className="p-2 bg-slate-800 rounded-lg text-primary-500 shrink-0">
                                    <Phone size={18} />
                                </div>
                                <a href={`tel:${contactLocation?.phone?.replace(/\s/g, '') || '05336838563'}`} className="hover:text-primary-400 transition-colors">{contactLocation?.phone || '0533 683 85 63'}</a>
                            </li>
                            <li className="flex items-center gap-3">
                                <div className="p-2 bg-slate-800 rounded-lg text-primary-500 shrink-0">
                                    <Mail size={18} />
                                </div>
                                <a href={`mailto:${contactLocation?.email || 'info@aquachems.com'}`} className="hover:text-primary-400 transition-colors">{contactLocation?.email || 'info@aquachems.com'}</a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
                    <p>&copy; {new Date().getFullYear()} Aquachems Kimya. {dict.footer.rights} | {dict.footer.codedBy} <a href="https://www.hasandurmus.com" target="_blank" rel="noopener noreferrer" className="text-primary-400 hover:text-primary-300 transition-colors">Hasan Durmuş</a></p>
                    <div className="flex gap-6">
                        <a href={`/${lang}/terms`} className="hover:text-slate-300 transition-colors">{dict.footer.termsOfUse}</a>
                        <a href={`/${lang}/privacy`} className="hover:text-slate-300 transition-colors">{dict.footer.privacyPolicy}</a>
                        <a href={`/${lang}/cookies`} className="hover:text-slate-300 transition-colors">{dict.footer.cookiePolicy}</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
