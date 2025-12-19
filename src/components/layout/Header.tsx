"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Phone, Droplets, Mail, MapPin, Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Header = ({ settings }: { settings?: any }) => {
    const [isOpen, setIsOpen] = useState(false);
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

    const navigation = [
        { name: 'Ana Sayfa', href: '/' },
        { name: 'Kurumsal', href: '/corporate' },
        { name: 'Referanslar', href: '/references' },
        { name: 'Belgelerimiz', href: '/certificates' },
        { name: 'Ürünler', href: '/products' },
        { name: 'İletişim', href: '/contact' },
    ];

    return (
        <div className="fixed top-0 left-0 right-0 z-50 flex flex-col">
            {/* Top Bar - Hidden on scroll for cleanliness, visible at top */}
            <div className={`bg-slate-900 text-slate-300 text-xs py-2 transition-all duration-300 overflow-hidden ${scrolled ? 'h-0 opacity-0' : 'h-10 opacity-100'}`}>
                <div className="container-custom flex justify-between items-center h-full">
                    <div className="flex items-center gap-6">
                        <a href="mailto:info@aquachems.com" className="flex items-center gap-2 hover:text-white transition-colors">
                            <Mail size={14} />
                            <span>info@aquachems.com</span>
                        </a>
                        <a href="tel:05336838563" className="flex items-center gap-2 hover:text-white transition-colors">
                            <Phone size={14} />
                            <span>0533 683 85 63</span>
                        </a>
                        <div className="hidden md:flex items-center gap-2 hover:text-white transition-colors cursor-default">
                            <MapPin size={14} />
                            <span>İstanbul, Türkiye</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        {settings?.socialMedia?.linkedin && <a href={settings.socialMedia.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors"><Linkedin size={14} /></a>}
                        {settings?.socialMedia?.instagram && <a href={settings.socialMedia.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors"><Instagram size={14} /></a>}
                        {settings?.socialMedia?.twitter && <a href={settings.socialMedia.twitter} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors"><Twitter size={14} /></a>}
                        {settings?.socialMedia?.facebook && <a href={settings.socialMedia.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors"><Facebook size={14} /></a>}
                    </div>
                </div>
            </div>

            {/* Main Header */}
            <header
                className={`transition-all duration-300 w-full ${scrolled
                    ? 'bg-white/95 backdrop-blur-md shadow-md py-3'
                    : 'bg-white py-5 border-b border-slate-100'
                    }`}
            >
                <div className="container-custom flex justify-between items-center">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className={`p-2.5 rounded-xl transition-all duration-300 shadow-lg ${scrolled
                            ? 'bg-primary-600 text-white shadow-primary-600/20'
                            : 'bg-gradient-to-br from-primary-600 to-primary-800 text-white shadow-primary-900/20'
                            }`}>
                            <Droplets size={scrolled ? 24 : 28} className="transform group-hover:rotate-12 transition-transform duration-500" />
                        </div>
                        <div className="flex flex-col">
                            <span className={`font-bold text-slate-900 leading-none tracking-tight transition-all ${scrolled ? 'text-xl' : 'text-2xl'}`}>
                                AQUACHEMS
                            </span>
                            <span className="text-[10px] text-slate-500 font-bold tracking-[0.2em] uppercase mt-0.5">Kimya & İnovasyon</span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden xl:flex items-center gap-8">
                        {navigation.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`text-sm font-bold transition-all relative py-1 hover:text-primary-700 ${isActive ? 'text-primary-700' : 'text-slate-600'
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

                        <Link
                            href="/contact"
                            className={`
                                ml-4 px-7 py-3 rounded-full font-bold text-sm transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5
                                ${scrolled
                                    ? 'bg-primary-600 text-white hover:bg-primary-700 shadow-primary-600/30'
                                    : 'bg-slate-900 text-white hover:bg-slate-800 shadow-slate-900/30'
                                }
                            `}
                        >
                            Teklif Al
                        </Link>
                    </nav>

                    {/* Mobile Menu Button */}
                    <button
                        className="xl:hidden text-slate-600 hover:text-primary-600 transition-colors p-2"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? <X size={28} /> : <Menu size={28} />}
                    </button>
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
                                <Link
                                    href="/contact"
                                    className="bg-primary-600 text-white px-5 py-4 rounded-xl font-bold text-center hover:bg-primary-700 transition-colors mt-4 shadow-lg shadow-primary-600/20"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Teklif İsteyin
                                </Link>

                                <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col gap-4 text-slate-500 text-sm font-medium">
                                    <div className="flex items-center justify-center gap-2">
                                        <Phone size={16} />
                                        <a href="tel:05336838563">0533 683 85 63</a>
                                    </div>
                                    <div className="flex items-center justify-center gap-2">
                                        <Mail size={16} />
                                        <a href="mailto:info@aquachems.com">info@aquachems.com</a>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>
        </div>
    );
};

export default Header;

