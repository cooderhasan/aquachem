"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, ShoppingBag, FolderTree, FileText, Image as ImageIcon, Settings, GalleryHorizontal, MapPin, Mail, Briefcase, FileCheck, LogOut, Activity, BarChart3, Lightbulb, Menu, X } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Don't show layout on login page
    if (pathname === '/admin/login') {
        return <>{children}</>;
    }

    const menuItems = [
        { name: 'Genel Bakış', href: '/admin', icon: LayoutDashboard },
        { name: 'Ürünler', href: '/admin/products', icon: ShoppingBag },
        { name: 'Kategoriler', href: '/admin/categories', icon: FolderTree },
        { name: 'Haberler & Yazılar', href: '/admin/posts', icon: FileText },
        { name: 'Referanslar', href: '/admin/references', icon: ImageIcon },
        { name: 'Faaliyet Alanları', href: '/admin/activities', icon: Activity },
        { name: 'İstatistikler', href: '/admin/stats', icon: BarChart3 },
        { name: 'İnovasyon', href: '/admin/innovation', icon: Lightbulb },
        { name: 'Belgeler', href: '/admin/certificates', icon: FileCheck },
        { name: 'Hero Slider', href: '/admin/hero', icon: GalleryHorizontal },
        { name: 'İletişim Bilgileri', href: '/admin/contact', icon: MapPin },
        { name: 'Gelen Kutusu', href: '/admin/messages', icon: Mail },
        { name: 'İş Başvuruları', href: '/admin/applications', icon: Briefcase },
        { name: 'Genel Ayarlar', href: '/admin/settings', icon: Settings },
    ];

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/admin/login');
    };

    const closeMobileMenu = () => setIsMobileMenuOpen(false);

    return (
        <div className="flex min-h-screen bg-slate-100 font-sans">
            {/* Mobile Header */}
            <div className="fixed top-0 left-0 right-0 z-40 bg-slate-900 text-white p-4 flex items-center justify-between md:hidden">
                <div>
                    <h1 className="text-lg font-bold">AQUACHEMS</h1>
                    <span className="text-xs text-slate-400">Yönetim Paneli</span>
                </div>
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={closeMobileMenu}
                />
            )}

            {/* Mobile Sidebar */}
            <aside className={`fixed top-0 left-0 bottom-0 w-72 bg-slate-900 text-white z-50 transform transition-transform duration-300 md:hidden overflow-y-auto ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold text-white tracking-wide">AQUACHEMS</h1>
                        <span className="text-xs text-slate-400">Yönetim Paneli</span>
                    </div>
                    <button
                        onClick={closeMobileMenu}
                        className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={closeMobileMenu}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                    ? 'bg-primary-600 text-white'
                                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                    }`}
                            >
                                <item.icon size={20} />
                                <span className="font-medium">{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <button
                        onClick={() => {
                            closeMobileMenu();
                            handleLogout();
                        }}
                        className="flex items-center gap-3 w-full px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                        <LogOut size={20} />
                        <span className="font-medium">Çıkış Yap</span>
                    </button>
                </div>
            </aside>

            {/* Desktop Sidebar */}
            <aside className="w-64 bg-slate-900 text-white flex-shrink-0 hidden md:flex flex-col">
                <div className="p-6 border-b border-slate-800">
                    <h1 className="text-xl font-bold text-white tracking-wide">AQUACHEMS</h1>
                    <span className="text-xs text-slate-400">Yönetim Paneli</span>
                </div>

                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                                    ? 'bg-primary-600 text-white'
                                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                    }`}
                            >
                                <item.icon size={20} />
                                <span className="font-medium">{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-slate-800">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                        <LogOut size={20} />
                        <span className="font-medium">Çıkış Yap</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Spacer for mobile header */}
                <div className="h-16 md:hidden flex-shrink-0" />
                <div className="flex-1 overflow-y-auto p-4 md:p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
