import React from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { Locale } from '@/lib/i18n';
import { getDictionary } from '@/lib/dictionary';

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string[]; lang: Locale }> }) {
    const { lang } = await params;
    const dict = getDictionary(lang);

    return (
        <div className="bg-white min-h-screen pb-20 pt-36">
            <div className="bg-slate-100 py-8 border-b border-slate-200">
                <div className="container-custom flex items-center gap-4">
                    <Link href={`/${lang}/products`} className="flex items-center text-slate-500 hover:text-primary-600 font-medium transition-colors">
                        <ArrowLeft size={20} className="mr-2" />
                        {lang === 'en' ? 'Return to All Products' : 'Tüm Ürünlere Dön'}
                    </Link>
                    <span className="text-slate-300">/</span>
                    <span className="text-slate-800 font-bold">
                        {lang === 'en' ? 'Sample Product Detail' : 'Örnek Ürün Detayı'}
                    </span>
                </div>
            </div>

            <div className="container-custom py-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Image Gallery */}
                    <div className="bg-slate-50 rounded-2xl border border-slate-200 aspect-square flex items-center justify-center">
                        <span className="text-slate-400 font-medium">
                            {lang === 'en' ? 'Product Image' : 'Ürün Görseli'}
                        </span>
                    </div>

                    {/* Info */}
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
                            {lang === 'en' ? 'Industrial Cleaner X' : 'Endüstriyel Temizleyici X'}
                        </h1>
                        <p className="text-slate-600 text-lg leading-relaxed mb-8">
                            {lang === 'en' 
                                ? 'Detailed product description will be placed here. Our products provide superior cleaning without harming humans or nature. With its special formula, it easily removes tough dirt.'
                                : 'Bu kısımda ürünün detaylı açıklaması yer alacak. Ürünlerimiz insana ve doğaya zarar vermeden üstün temizlik sağlar. Özel formülü sayesinde zorlu kirleri kolayca çıkarır.'}
                        </p>

                        <div className="space-y-8">
                            <div>
                                <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                                    <span className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-sm">1</span>
                                    {lang === 'en' ? 'Product Features' : 'Ürün Özellikleri'}
                                </h3>
                                <ul className="space-y-3 pl-10">
                                    <li className="flex items-center gap-2 text-slate-700">
                                        <CheckCircle2 size={18} className="text-green-500" />
                                        {lang === 'en' ? 'Eco-friendly formula' : 'Doğa dostu formül'}
                                    </li>
                                    <li className="flex items-center gap-2 text-slate-700">
                                        <CheckCircle2 size={18} className="text-green-500" />
                                        {lang === 'en' ? 'High performance cleaning' : 'Yüksek performanslı temizlik'}
                                    </li>
                                </ul>
                            </div>

                            <div>
                                <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                                    <span className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-sm">2</span>
                                    {lang === 'en' ? 'Usage Method' : 'Kullanım Şekli'}
                                </h3>
                                <p className="text-slate-600 leading-relaxed pl-10">
                                    {lang === 'en'
                                        ? 'Apply to the dirty surface and wait for a while. Then wipe with a clean cloth or sponge. No rinsing required.'
                                        : 'Kirli yüzeye uygulayın ve bir süre bekleyin. Ardından temiz bir bez veya sünger yardımıyla silin. Durulama gerektirmez.'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
