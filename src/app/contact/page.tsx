import React from 'react';
import { MapPin, Phone, Mail, Building2, Factory } from 'lucide-react';

export default function ContactPage() {
    return (
        <div className="bg-slate-50 min-h-screen pb-20">
            <div className="bg-primary-900 text-white pt-48 pb-16">
                <div className="container-custom">
                    <h1 className="text-4xl font-bold mb-4 text-white">İletişim</h1>
                    <p className="text-primary-200">Bize ulaşın, sorularınızı cevaplayalım.</p>
                </div>
            </div>

            <div className="container-custom py-12">
                {/* Adres Kartları */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">

                    {/* İç Anadolu Bölge Müdürlüğü */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 hover:shadow-lg transition-shadow">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-14 h-14 bg-primary-100 text-primary-600 rounded-xl flex items-center justify-center">
                                <Building2 size={28} />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-slate-800">İç Anadolu Bölge Müdürlüğü</h2>
                                <span className="text-sm text-primary-500 font-medium">Satış & Pazarlama</span>
                            </div>
                        </div>
                        <div className="space-y-4 text-slate-600">
                            <div className="flex items-start gap-3">
                                <MapPin size={20} className="text-primary-500 shrink-0 mt-1" />
                                <p>
                                    (Bölge Müdürlüğü adresi buraya yazılacak)
                                    <br />Konya, Türkiye
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <Phone size={20} className="text-primary-500 shrink-0" />
                                <a href="tel:05336838563" className="hover:text-primary-600 font-medium">0533 683 85 63</a>
                            </div>
                            <div className="flex items-center gap-3">
                                <Mail size={20} className="text-primary-500 shrink-0" />
                                <a href="mailto:anadolu@aquachems.com" className="hover:text-primary-600">anadolu@aquachems.com</a>
                            </div>
                        </div>
                    </div>

                    {/* Fabrika Adresi */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 hover:shadow-lg transition-shadow">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-14 h-14 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center">
                                <Factory size={28} />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-slate-800">Fabrika / Üretim Tesisi</h2>
                                <span className="text-sm text-amber-500 font-medium">Üretim & Ar-Ge</span>
                            </div>
                        </div>
                        <div className="space-y-4 text-slate-600">
                            <div className="flex items-start gap-3">
                                <MapPin size={20} className="text-amber-500 shrink-0 mt-1" />
                                <p>
                                    İkitelli OSB Mah. Giyim Sanatkarları 3. Ada C Blok No:57
                                    <br />Başakşehir / İstanbul
                                </p>
                            </div>
                            <div className="flex items-center gap-3">
                                <Phone size={20} className="text-amber-500 shrink-0" />
                                <a href="tel:02128765432" className="hover:text-amber-600 font-medium">0212 876 54 32</a>
                            </div>
                            <div className="flex items-center gap-3">
                                <Mail size={20} className="text-amber-500 shrink-0" />
                                <a href="mailto:fabrika@aquachems.com" className="hover:text-amber-600">fabrika@aquachems.com</a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Map Placeholder */}
                <div className="bg-slate-200 rounded-2xl overflow-hidden h-[400px] flex items-center justify-center">
                    <span className="text-slate-500 font-bold">Google Maps Alanı</span>
                    {/* <iframe src="..." className="w-full h-full" ... /> */}
                </div>
            </div>
        </div>
    );
}
