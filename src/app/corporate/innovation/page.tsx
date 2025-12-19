import React from 'react';
import { FlaskConical, Lightbulb, TrendingUp } from 'lucide-react';

export default function InnovationPage() {
    return (
        <div className="bg-white min-h-screen pb-20">
            {/* Header Banner */}
            <div className="bg-primary-900 text-white pt-48 pb-16">
                <div className="container-custom">
                    <h1 className="text-3xl md:text-5xl font-bold mb-4 text-white">AR-GE ve İnovasyon</h1>
                    <p className="text-primary-200 text-lg max-w-2xl">
                        Sektördeki standartları belirleyen, yenilikçi ve sürdürülebilir çözümler.
                    </p>
                </div>
            </div>

            <div className="container-custom py-16">
                <div className="max-w-4xl mx-auto space-y-20">

                    {/* AR-GE Section */}
                    <div id="arge" className="grid grid-cols-1 md:grid-cols-[80px_1fr] gap-8">
                        <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center shrink-0">
                            <FlaskConical size={40} />
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold text-slate-900 mb-6">AR-GE Çalışmaları</h2>
                            <div className="prose prose-lg text-slate-600">
                                <p>
                                    Aquachem laboratuvarlarında, uzman kimyagerlerimiz ve mühendislerimizle birlikte sürekli yeni formüller üzerinde çalışıyoruz.
                                    Bilimsel araştırmalar ışığında geliştirdiğimiz her ürün, çevreye duyarlılık ve yüksek performans ilkelerine dayanır.
                                </p>
                                <ul className="list-disc pl-5 mt-4 space-y-2">
                                    <li>İleri teknoloji analiz cihazlarıyla hammadde kalite kontrolü</li>
                                    <li>Çevresel etki değerlendirmesi ve biyobozunurluk testleri</li>
                                    <li>Uluslararası standartlara uygun ürün geliştirme süreçleri</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <hr className="border-slate-100" />

                    {/* ÜR-GE Section */}
                    <div id="urge" className="grid grid-cols-1 md:grid-cols-[80px_1fr] gap-8">
                        <div className="w-20 h-20 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center shrink-0">
                            <Lightbulb size={40} />
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold text-slate-900 mb-6">ÜR-GE Süreçleri</h2>
                            <div className="prose prose-lg text-slate-600">
                                <p>
                                    Müşterilerimizin özel ihtiyaçlarına yönelik, sahada uygulanabilir ve verimliliği artıran ürün geliştirme süreçlerini yönetiyoruz.
                                    Farklı endüstriyel gereksinimler için (otomotiv, tekstil, gıda, ağır sanayi vb.) terzi usulü çözümler sunuyoruz.
                                </p>
                                <ul className="list-disc pl-5 mt-4 space-y-2">
                                    <li>Sektöre özel formülasyon geliştirme</li>
                                    <li>Maliyet/Performans optimizasyonu</li>
                                    <li>Saha testleri ve uygulama desteği</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <hr className="border-slate-100" />

                    {/* İnovasyon Section */}
                    <div id="inovasyon" className="grid grid-cols-1 md:grid-cols-[80px_1fr] gap-8">
                        <div className="w-20 h-20 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center shrink-0">
                            <TrendingUp size={40} />
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold text-slate-900 mb-6">İnovasyon Kültürü</h2>
                            <div className="prose prose-lg text-slate-600">
                                <p>
                                    Değişen dünya dinamiklerine ayak uydurmakla kalmıyor, değişime öncülük ediyoruz.
                                    Üretim süreçlerimizden lojistik operasyonlarımıza kadar her alanda dijitalleşme ve verimlilik odaklı yenilikleri benimsiyoruz.
                                </p>
                                <ul className="list-disc pl-5 mt-4 space-y-2">
                                    <li>Sürdürülebilir üretim teknolojileri</li>
                                    <li>Akıllı tedarik zinciri yönetimi</li>
                                    <li>Sürekli eğitim ve gelişim programları</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
