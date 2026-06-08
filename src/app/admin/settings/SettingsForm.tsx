'use client';

import React, { useState } from 'react';
import { Loader2, Save, CheckCircle, XCircle } from 'lucide-react';
import { updateSettings } from './actions';
import { useRouter } from 'next/navigation';
import ImageUpload from '@/components/ui/ImageUpload';
import MenuEditor from './MenuEditor';

const defaultMenuItems = [
    { id: 'home', name: 'Ana Sayfa', href: '/' },
    { id: 'products', name: 'Ürünler', href: '/products' },
    { id: 'corporate', name: 'Kurumsal', href: '/corporate' },
    { id: 'references', name: 'Referanslar', href: '/references' },
    { id: 'certificates', name: 'Belgelerimiz', href: '/certificates' },
    { id: 'contact', name: 'İletişim', href: '/contact' },
];

interface SettingsFormProps {
    initialSettings: any;
}

export default function SettingsForm({ initialSettings }: SettingsFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
    const [logo, setLogo] = useState(initialSettings?.logo || '');
    const [favicon, setFavicon] = useState(initialSettings?.favicon || '');
    const [aboutImage, setAboutImage] = useState(initialSettings?.aboutImage || '');
    const [ogImage, setOgImage] = useState(initialSettings?.ogImage || '');
    const [footerLogo, setFooterLogo] = useState(initialSettings?.footerLogo || '');
    const [pdfUrl, setPdfUrl] = useState(initialSettings?.catalogUrl || '');

    // Menu Items State (Default to hardcoded list if empty)
    const [menuItems, setMenuItems] = useState(
        (initialSettings?.menuItems && initialSettings.menuItems.length > 0)
            ? initialSettings.menuItems
            : defaultMenuItems
    );

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsLoading(true);
        setNotification(null);

        const formData = new FormData(event.currentTarget);

        try {
            const result = await updateSettings(formData);
            if (result?.success) {
                setNotification({ type: 'success', message: 'Ayarlar başarıyla kaydedildi!' });
                router.refresh();
            } else {
                setNotification({ type: 'error', message: result?.error || 'Ayarlar kaydedilemedi.' });
            }
        } catch (error) {
            console.error('Failed to update settings', error);
            setNotification({ type: 'error', message: 'Bir hata oluştu. Lütfen tekrar deneyin.' });
        } finally {
            setIsLoading(false);
            // 5 saniye sonra bildirimi gizle
            setTimeout(() => setNotification(null), 5000);
        }
    }

    const [activeTab, setActiveTab] = useState('general');

    const tabs = [
        { id: 'general', label: 'Genel Ayarlar', icon: 'Settings' },
        { id: 'corporate', label: 'Kurumsal', icon: 'Building' },
        { id: 'design', label: 'Görünüm & Tasarım', icon: 'Palette' },
        { id: 'social', label: 'İletişim & Medya', icon: 'Share2' },
        { id: 'menu', label: 'Menü Yönetimi', icon: 'Menu' },
        { id: 'seo', label: 'SEO', icon: 'Search' },
    ];

    return (
        <>
            {/* Bildirim Toast */}
            {notification && (
                <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-6 py-4 rounded-xl shadow-lg animate-in slide-in-from-top-2 ${notification.type === 'success'
                    ? 'bg-green-500 text-white'
                    : 'bg-red-500 text-white'
                    }`}>
                    {notification.type === 'success' ? (
                        <CheckCircle size={24} />
                    ) : (
                        <XCircle size={24} />
                    )}
                    <span className="font-medium">{notification.message}</span>
                    <button
                        onClick={() => setNotification(null)}
                        className="ml-2 hover:opacity-70 transition-opacity"
                    >
                        ×
                    </button>
                </div>
            )}

            <div className="flex flex-wrap gap-2 mb-6 bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
                {tabs.map((tab) => (
                    <button
                        type="button"
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === tab.id
                            ? 'bg-primary-600 text-white shadow-md'
                            : 'text-slate-600 hover:bg-slate-50 hover:text-primary-600'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6 pb-20">
                <input type="hidden" name="logo" value={logo} />
                <input type="hidden" name="favicon" value={favicon} />
                <input type="hidden" name="footerLogo" value={footerLogo} />
                <input type="hidden" name="aboutImage" value={aboutImage} />
                <input type="hidden" name="ogImage" value={ogImage} />
                <input type="hidden" name="menuItems" value={JSON.stringify(menuItems)} />

                {/* --- GENEL AYARLAR --- */}
                <div className={activeTab === 'general' ? 'block' : 'hidden'}>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-6">
                        <h2 className="text-lg font-bold text-slate-800 mb-4 pb-2 border-b">Genel Site Bilgileri</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Site Başlığı</label>
                                <input
                                    type="text"
                                    name="siteTitle"
                                    defaultValue={initialSettings?.siteTitle || ''}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Site Açıklaması</label>
                                <input
                                    type="text"
                                    name="description"
                                    defaultValue={initialSettings?.description || ''}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-slate-700 mb-1">Site Sloganı</label>
                                <input
                                    type="text"
                                    name="siteSlogan"
                                    defaultValue={initialSettings?.siteSlogan || ''}
                                    placeholder="İnsanların yüzündeki gülümsemeyi görmek için çalışıyoruz"
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                />
                            </div>
                        </div>

                        <div className="border-t pt-6">
                            <h3 className="text-md font-bold text-slate-800 mb-4">Ana Sayfa Tanıtım Bölümü</h3>
                            <div>
                                <label htmlFor="homeIntroTitle" className="block text-sm font-medium text-slate-700 mb-1">Tanıtım Başlığı</label>
                                <input
                                    type="text"
                                    id="homeIntroTitle"
                                    name="homeIntroTitle"
                                    defaultValue={initialSettings?.homeIntroTitle || ''}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                />
                            </div>
                            <div className="mt-4">
                                <label htmlFor="homeIntroDescription" className="block text-sm font-medium text-slate-700 mb-1">Tanıtım Açıklaması</label>
                                <textarea
                                    id="homeIntroDescription"
                                    name="homeIntroDescription"
                                    rows={4}
                                    defaultValue={initialSettings?.homeIntroDescription || ''}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                ></textarea>
                            </div>
                        </div>

                        <div className="border-t pt-6">
                            <h2 className="text-lg font-bold text-slate-800 mb-4 pb-2 border-b">PDF Katalog</h2>
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-slate-700 mb-2">PDF Katalog Dosyası</label>
                                <input type="hidden" name="catalogUrl" value={pdfUrl} />

                                <div className="flex flex-col gap-3">
                                    {pdfUrl ? (
                                        <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <div className="bg-green-100 p-2 rounded-full">
                                                    <CheckCircle className="text-green-600" size={20} />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-green-900">Katalog Yüklü</p>
                                                    <a
                                                        href={pdfUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-xs text-green-700 hover:underline"
                                                    >
                                                        Dosyayı Görüntüle
                                                    </a>
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => document.getElementById('catalog-upload')?.click()}
                                                className="text-sm text-slate-600 hover:text-primary-600 font-medium px-3 py-1.5 border border-slate-300 rounded-md hover:bg-white transition-colors"
                                            >
                                                Değiştir
                                            </button>
                                        </div>
                                    ) : (
                                        <div
                                            onClick={() => document.getElementById('catalog-upload')?.click()}
                                            className="border-2 border-dashed border-slate-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors group"
                                        >
                                            <div className="bg-primary-50 text-primary-600 p-3 rounded-full mb-3 group-hover:bg-primary-100 transition-colors">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" x2="12" y1="3" y2="15" /></svg>
                                            </div>
                                            <p className="text-sm font-medium text-slate-700">PDF Kataloğu Yükle</p>
                                            <p className="text-xs text-slate-500 mt-1">Bilgisayarınızdan bir dosya seçin</p>
                                        </div>
                                    )}

                                    <input
                                        type="file"
                                        id="catalog-upload"
                                        accept=".pdf"
                                        className="hidden"
                                        onChange={async (e) => {
                                            const file = e.target.files?.[0];
                                            if (!file) return;

                                            const formData = new FormData();
                                            formData.append('file', file);

                                            setIsLoading(true);
                                            try {
                                                const res = await fetch('/api/upload', {
                                                    method: 'POST',
                                                    body: formData,
                                                });

                                                if (!res.ok) throw new Error('Upload failed');

                                                const data = await res.json();
                                                setPdfUrl(data.url);
                                                setNotification({ type: 'success', message: 'Katalog başarıyla yüklendi!' });
                                            } catch (error) {
                                                console.error('Catalog upload error:', error);
                                                alert('Katalog yüklenemedi!');
                                            } finally {
                                                setIsLoading(false);
                                            }
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- KURUMSAL --- */}
                <div className={activeTab === 'corporate' ? 'block' : 'hidden'}>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <h2 className="text-lg font-bold text-slate-800 mb-4 pb-2 border-b">Kurumsal İçerik</h2>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Hakkımızda Görseli</label>
                                <div className="max-w-md">
                                    <ImageUpload
                                        value={aboutImage}
                                        onChange={(url) => setAboutImage(url)}
                                        onRemove={() => setAboutImage('')}
                                        label="Görsel Yükle"
                                        description="Önerilen: 800x600 px • WebP/JPG • Max 2MB"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Hakkımızda</label>
                                <textarea
                                    name="aboutUs"
                                    rows={5}
                                    defaultValue={initialSettings?.aboutUs || ''}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                ></textarea>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-4 rounded-lg border border-slate-200">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Yazı Boyutu</label>
                                    <select
                                        name="aboutUsFontSize"
                                        defaultValue={initialSettings?.aboutUsFontSize || 'text-lg'}
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                                    >
                                        <option value="text-base">Normal (16px)</option>
                                        <option value="text-lg">Orta (18px)</option>
                                        <option value="text-xl">Büyük (20px)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Yazı Koyuluğu</label>
                                    <select
                                        name="aboutUsDarkness"
                                        defaultValue={initialSettings?.aboutUsDarkness || 'text-slate-600'}
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                                    >
                                        <option value="text-slate-600">Normal (Gri)</option>
                                        <option value="text-slate-700">Koyu (Koyu Gri)</option>
                                        <option value="text-slate-900">Çok Koyu (Siyahımsı)</option>
                                        <option value="text-black">Tam Siyah</option>
                                    </select>
                                </div>
                            </div>


                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Misyonumuz</label>
                                    <textarea
                                        name="mission"
                                        rows={4}
                                        defaultValue={initialSettings?.mission || ''}
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    ></textarea>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Vizyonumuz</label>
                                    <textarea
                                        name="vision"
                                        rows={4}
                                        defaultValue={initialSettings?.vision || ''}
                                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    ></textarea>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">İnsan Politikamız</label>
                                <textarea
                                    name="humanPolicy"
                                    rows={3}
                                    defaultValue={initialSettings?.humanPolicy || ''}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                ></textarea>
                            </div>

                            <div className="border-t pt-6">
                                <h3 className="text-md font-bold text-slate-800 mb-4">Kurumsal İstatistikler (Hakkımızda Sayfası)</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-slate-50 rounded-lg border border-slate-200">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">1. İstatistik Değeri</label>
                                        <input
                                            type="text"
                                            name="corporateStat1Value"
                                            defaultValue={initialSettings?.corporateStat1Value || '15+'}
                                            placeholder="Örn: 15+"
                                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">1. İstatistik Açıklaması</label>
                                        <input
                                            type="text"
                                            name="corporateStat1Label"
                                            defaultValue={initialSettings?.corporateStat1Label || 'Yıllık Tecrübe'}
                                            placeholder="Örn: Yıllık Tecrübe"
                                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">2. İstatistik Değeri</label>
                                        <input
                                            type="text"
                                            name="corporateStat2Value"
                                            defaultValue={initialSettings?.corporateStat2Value || '100+'}
                                            placeholder="Örn: 100+"
                                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">2. İstatistik Açıklaması</label>
                                        <input
                                            type="text"
                                            name="corporateStat2Label"
                                            defaultValue={initialSettings?.corporateStat2Label || 'Tamamlanan Proje'}
                                            placeholder="Örn: Tamamlanan Proje"
                                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- GÖRÜNÜM & TASARIM --- */}
                <div className={activeTab === 'design' ? 'block' : 'hidden'}>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <h2 className="text-lg font-bold text-slate-800 mb-4 pb-2 border-b">Görünüm Ayarları</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Site Logosu</label>
                                <div className="max-w-xs">
                                    <ImageUpload
                                        value={logo}
                                        onChange={(url) => setLogo(url)}
                                        onRemove={() => setLogo('')}
                                        label="Logo Yükle"
                                        description="Önerilen: 200x60 px • PNG (şeffaf) • Max 1MB"
                                    />
                                </div>
                                <div className="mt-4 p-4 bg-slate-50 rounded-lg space-y-3">
                                    <h4 className="font-semibold text-sm text-slate-900 border-b pb-1 mb-2">Header (Üst Kısım) Ayarları</h4>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Logo Yüksekliği (px)</label>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="number"
                                                name="logoHeight"
                                                defaultValue={initialSettings?.logoHeight || 48}
                                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                            />
                                            <span className="text-sm text-slate-500 whitespace-nowrap">px</span>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Menü Yazı Boyutu (px)</label>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="number"
                                                name="menuFontSize"
                                                defaultValue={initialSettings?.menuFontSize || 14}
                                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                            />
                                            <span className="text-sm text-slate-500 whitespace-nowrap">px</span>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Dikey Boşluk (Padding)</label>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="number"
                                                name="headerPadding"
                                                defaultValue={initialSettings?.headerPadding || 20}
                                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                            />
                                            <span className="text-sm text-slate-500 whitespace-nowrap">px</span>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Slogan Yazı Boyutu (px)</label>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="number"
                                                name="siteSloganFontSize"
                                                defaultValue={initialSettings?.siteSloganFontSize || 10}
                                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                            />
                                            <span className="text-sm text-slate-500 whitespace-nowrap">px</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Favicon (Site İkonu)</label>
                                    <div className="max-w-[150px]">
                                        <ImageUpload
                                            value={favicon}
                                            onChange={(url) => setFavicon(url)}
                                            onRemove={() => setFavicon('')}
                                            label="Favicon"
                                            description="Önerilen: 32x32 px • PNG/ICO"
                                        />
                                    </div>
                                </div>

                                <div className="p-4 bg-slate-50 rounded-lg space-y-3">
                                    <h4 className="font-semibold text-sm text-slate-900 border-b pb-1 mb-2">Footer (Alt Kısım) Ayarları</h4>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Footer Logosu</label>
                                        <ImageUpload
                                            value={footerLogo}
                                            onChange={(url) => setFooterLogo(url)}
                                            onRemove={() => setFooterLogo('')}
                                            label="Footer Logo"
                                            description="Önerilen: 200x60 px • PNG (şeffaf) • Max 1MB"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1">Logo Üst Boşluk (Padding)</label>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="number"
                                                name="footerLogoPadding"
                                                defaultValue={initialSettings?.footerLogoPadding || 0}
                                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                                placeholder="Örn: 10 veya -5"
                                            />
                                            <span className="text-sm text-slate-500 whitespace-nowrap">px</span>
                                        </div>
                                        <p className="text-xs text-slate-500 mt-1">Logoyı + (aşağı) veya - (yukarı) hareket ettirir.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 border-t pt-6">
                            <h3 className="text-md font-bold text-slate-800 mb-4">Referanslar (Sayan Logo)</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Kaydırma Süresi (Saniye)</label>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="number"
                                            name="referencesScrollSpeed"
                                            defaultValue={initialSettings?.referencesScrollSpeed || 30}
                                            min="5"
                                            max="300"
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        />
                                        <span className="text-sm text-slate-500 whitespace-nowrap">saniye</span>
                                    </div>
                                    <p className="text-xs text-slate-500 mt-1">Süre arttıkça kayma hızı <strong>YAVAŞLAR</strong>.</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Logo Yüksekliği (px)</label>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="number"
                                            name="referenceLogoHeight"
                                            defaultValue={initialSettings?.referenceLogoHeight || 100}
                                            min="20"
                                            max="300"
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                        />
                                        <span className="text-sm text-slate-500 whitespace-nowrap">px</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 border-t pt-6">
                            <h3 className="text-md font-bold text-slate-800 mb-4">Hero Slider Ayarları</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-4 rounded-lg border border-slate-200">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Resim Koyuluğu ({initialSettings?.heroOverlayOpacity || 60}%)</label>
                                    <input
                                        type="range"
                                        name="heroOverlayOpacity"
                                        defaultValue={initialSettings?.heroOverlayOpacity || 60}
                                        min="0"
                                        max="100"
                                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                                        onInput={(e) => {
                                            const target = e.target as HTMLInputElement;
                                            target.previousElementSibling!.textContent = `Resim Koyuluğu (${target.value}%)`;
                                        }}
                                    />
                                    <p className="text-xs text-slate-500 mt-1">Slayt resminin üzerine gelen siyahın yoğunluğu.</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Gradyan Geçişi ({initialSettings?.heroGradientOpacity || 80}%)</label>
                                    <input
                                        type="range"
                                        name="heroGradientOpacity"
                                        defaultValue={initialSettings?.heroGradientOpacity || 80}
                                        min="0"
                                        max="100"
                                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                                        onInput={(e) => {
                                            const target = e.target as HTMLInputElement;
                                            target.previousElementSibling!.textContent = `Gradyan Geçişi (${target.value}%)`;
                                        }}
                                    />
                                    <p className="text-xs text-slate-500 mt-1">Yazıların altındaki geçişli siyahın yoğunluğu (Soldan sağa).</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- İLETİŞİM & MEDYA --- */}
                <div className={activeTab === 'social' ? 'block' : 'hidden'}>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <h2 className="text-lg font-bold text-slate-800 mb-4 pb-2 border-b">Sosyal Medya & İletişim</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Facebook</label>
                                <input
                                    type="text"
                                    name="facebook"
                                    defaultValue={initialSettings?.socialMedia?.facebook || ''}
                                    placeholder="https://facebook.com/..."
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">X (Twitter)</label>
                                <div className="flex items-center gap-2">
                                    <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                                    </div>
                                    <input
                                        type="text"
                                        name="twitter"
                                        defaultValue={initialSettings?.socialMedia?.twitter || ''}
                                        placeholder="https://x.com/..."
                                        className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Instagram</label>
                                <input
                                    type="text"
                                    name="instagram"
                                    defaultValue={initialSettings?.socialMedia?.instagram || ''}
                                    placeholder="https://instagram.com/..."
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">LinkedIn</label>
                                <input
                                    type="text"
                                    name="linkedin"
                                    defaultValue={initialSettings?.socialMedia?.linkedin || ''}
                                    placeholder="https://linkedin.com/in/..."
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">YouTube</label>
                                <input
                                    type="text"
                                    name="youtube"
                                    defaultValue={initialSettings?.socialMedia?.youtube || ''}
                                    placeholder="https://youtube.com/..."
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                />
                            </div>
                            <div className="md:col-span-2 mt-4 p-4 bg-green-50 rounded-lg border border-green-100">
                                <label className="block text-sm font-medium text-green-900 mb-1">
                                    📱 WhatsApp Numarası
                                </label>
                                <input
                                    type="text"
                                    name="whatsappNumber"
                                    defaultValue={initialSettings?.whatsappNumber || ''}
                                    placeholder="905551234567 (Ülke kodu ile, başında + olmadan)"
                                    className="w-full px-4 py-2 border border-green-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                />
                                <p className="text-xs text-green-700 mt-1">
                                    Sağ altta görünen WhatsApp butonunda kullanılacak numara.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- MENÜ YÖNETİMİ --- */}
                <div className={activeTab === 'menu' ? 'block' : 'hidden'}>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <div className="flex items-center justify-between mb-4 pb-2 border-b">
                            <h2 className="text-lg font-bold text-slate-800">Menü Sıralaması</h2>
                            <button
                                type="button"
                                onClick={() => setMenuItems(defaultMenuItems)}
                                className="text-sm text-primary-600 hover:text-primary-700 font-medium hover:underline"
                            >
                                Varsayılan Sıralamaya Dön
                            </button>
                        </div>

                        <div className="max-w-xl">
                            <div className="bg-blue-50 text-blue-800 p-4 rounded-lg text-sm mb-6 flex items-start gap-3">
                                <div className="mt-0.5">ℹ️</div>
                                <div>
                                    <p className="font-semibold mb-1">Nasıl Kullanılır?</p>
                                    <p>Menü öğelerinin yerini değiştirmek için <strong>tutma simgesinden (⋮⋮)</strong> tutup sürükleyiniz. Değişiklikleri kaydetmek için sayfanın altındaki "Kaydet" butonuna basmayı unutmayınız.</p>
                                </div>
                            </div>

                            <MenuEditor
                                items={menuItems}
                                onReorder={setMenuItems}
                            />
                        </div>
                    </div>
                </div>

                {/* --- SEO --- */}
                <div className={activeTab === 'seo' ? 'block' : 'hidden'}>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <h2 className="text-lg font-bold text-slate-800 mb-4 pb-2 border-b">SEO Ayarları</h2>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Meta Başlık (Title Tag)</label>
                                <input
                                    type="text"
                                    name="metaTitle"
                                    defaultValue={initialSettings?.metaTitle || ''}
                                    placeholder="Aquachems - İnsana ve Doğaya Saygılı Üretim"
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                />
                                <p className="text-xs text-slate-500 mt-1">Google'da görünecek başlık (50-60 karakter)</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Meta Açıklama (Description)</label>
                                <textarea
                                    name="metaDescription"
                                    rows={3}
                                    defaultValue={initialSettings?.metaDescription || ''}
                                    placeholder="Site açıklaması..."
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                />
                                <p className="text-xs text-slate-500 mt-1">Google'da görünecek açıklama (150-160 karakter)</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Anahtar Kelimeler</label>
                                <input
                                    type="text"
                                    name="metaKeywords"
                                    defaultValue={initialSettings?.metaKeywords || ''}
                                    placeholder="kimya, temizlik, endüstriyel..."
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Paylaşım Görseli (OG Image)</label>
                                <div className="max-w-md">
                                    <ImageUpload
                                        value={ogImage}
                                        onChange={(url) => setOgImage(url)}
                                        onRemove={() => setOgImage('')}
                                        label="OG Image Yükle"
                                        description="Önerilen: 1200x630 px • WebP/JPG • Max 2MB"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="fixed bottom-6 right-6 z-40">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-4 rounded-full flex items-center gap-3 transition-all disabled:opacity-50 shadow-xl hover:shadow-2xl hover:scale-105"
                    >
                        {isLoading ? <Loader2 className="animate-spin" size={24} /> : <Save size={24} />}
                        <span className="font-bold text-lg">Kaydet</span>
                    </button>
                </div>
            </form>
        </>
    );
}
