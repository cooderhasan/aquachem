"use client";

import React from 'react';
import Link from 'next/link';
import { Droplets, MapPin, Phone, Mail, Instagram, Linkedin, Facebook, Globe } from 'lucide-react';

interface ContactLocation {
    id: number;
    title: string;
    address: string;
    phone: string | null;
    email: string | null;
}

const Footer = ({ settings, contactLocation }: { settings?: any; contactLocation?: ContactLocation | null }) => {
    return (
        <footer className="bg-slate-900 text-slate-300 pt-20 pb-10 mt-auto">
            <div className="container-custom">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand Info */}
                    <div className="space-y-6">
                        <Link href="/" className="flex items-center gap-3 group">
                            {settings?.footerLogo ? (
                                <img
                                    src={settings.footerLogo}
                                    alt="Aquachems Logo"
                                    className="h-16 w-auto object-contain"
                                />
                            ) : (
                                <>
                                    <div className="bg-primary-600 text-white p-2.5 rounded-xl group-hover:bg-primary-500 transition-colors">
                                        <Droplets size={28} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-2xl font-bold text-white leading-none tracking-tight">AQUACHEMS</span>
                                        <span className="text-[10px] text-primary-400 font-bold tracking-widest uppercase">Kimya & İnovasyon</span>
                                    </div>
                                </>
                            )}
                        </Link>
                        <p className="text-slate-400 leading-relaxed text-sm">
                            {settings?.description || 'Endüstriyel temizlik ve hijyen çözümlerinde yenilikçi yaklaşımlarımızla, işletmenizin verimliliğini artırıyor ve sürdürülebilir bir gelecek için çalışıyoruz.'}
                        </p>
                        <div className="flex gap-4 pt-2">
                            {settings?.socialMedia?.instagram && (
                                <a href={settings.socialMedia.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-primary-600 hover:text-white transition-all transform hover:scale-110">
                                    <Instagram size={18} />
                                </a>
                            )}
                            {settings?.socialMedia?.linkedin && (
                                <a href={settings.socialMedia.linkedin} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-primary-600 hover:text-white transition-all transform hover:scale-110">
                                    <Linkedin size={18} />
                                </a>
                            )}
                            {settings?.socialMedia?.facebook && (
                                <a href={settings.socialMedia.facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-primary-600 hover:text-white transition-all transform hover:scale-110">
                                    <Facebook size={18} />
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
                            <Globe size={16} className="text-primary-500" /> Hızlı Erişim
                        </h3>
                        <ul className="space-y-3 text-sm">
                            <li><Link href="/" className="hover:text-primary-400 hover:translate-x-1 transition-all inline-block">Ana Sayfa</Link></li>
                            <li><Link href="/corporate" className="hover:text-primary-400 hover:translate-x-1 transition-all inline-block">Kurumsal</Link></li>
                            <li><Link href="/products" className="hover:text-primary-400 hover:translate-x-1 transition-all inline-block">Ürünlerimiz</Link></li>
                            <li><Link href="/references" className="hover:text-primary-400 hover:translate-x-1 transition-all inline-block">Referanslarımız</Link></li>
                            <li><Link href="/certificates" className="hover:text-primary-400 hover:translate-x-1 transition-all inline-block">Belgelerimiz</Link></li>
                            <li><Link href="/human-resources" className="hover:text-primary-400 hover:translate-x-1 transition-all inline-block">İnsan Kaynakları</Link></li>
                            <li><Link href="/contact" className="hover:text-primary-400 hover:translate-x-1 transition-all inline-block">İletişim</Link></li>
                        </ul>
                    </div>

                    {/* Product Groups */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-6">Ürün Grupları</h3>
                        <ul className="space-y-3 text-sm">
                            <li><Link href="/products/genel-temizlik" className="hover:text-primary-400 hover:translate-x-1 transition-all inline-block">Genel Temizlik</Link></li>
                            <li><Link href="/products/likit-cilt-temizleme" className="hover:text-primary-400 hover:translate-x-1 transition-all inline-block">Likit Cilt Temizleme</Link></li>
                            <li><Link href="/products/dezenfektan-grubu" className="hover:text-primary-400 hover:translate-x-1 transition-all inline-block">Dezenfektan Grubu</Link></li>
                            <li><Link href="/products/oto-bakim-grubu" className="hover:text-primary-400 hover:translate-x-1 transition-all inline-block">Oto Bakım Grubu</Link></li>
                            <li><Link href="/products/teknik-grup" className="hover:text-primary-400 hover:translate-x-1 transition-all inline-block">Teknik Grup</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-6">İletişim</h3>
                        <ul className="space-y-4 text-sm">
                            <li className="flex items-start gap-3">
                                <div className="p-2 bg-slate-800 rounded-lg text-primary-500 shrink-0">
                                    <MapPin size={18} />
                                </div>
                                <span className="leading-relaxed">{contactLocation?.address || 'İkitelli OSB Mah. Giyim Sanatkarları 3. Ada C Blok No:57 Başakşehir / İstanbul'}</span>
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
                    <p>&copy; {new Date().getFullYear()} Aquachems Kimya. Tüm hakları saklıdır. | Coded by <a href="https://www.hasandurmus.com" target="_blank" rel="noopener noreferrer" className="text-primary-400 hover:text-primary-300 transition-colors">Hasan Durmuş</a></p>
                    <div className="flex gap-6">
                        <a href="/terms" className="hover:text-slate-300 transition-colors">Kullanım Şartları</a>
                        <a href="/privacy" className="hover:text-slate-300 transition-colors">Gizlilik Politikası</a>
                        <a href="/cookies" className="hover:text-slate-300 transition-colors">Çerez Politikası</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
