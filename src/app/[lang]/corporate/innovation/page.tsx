import React from 'react';
import { Metadata } from 'next';
import { FlaskConical, Lightbulb, TrendingUp } from 'lucide-react';
import { Locale } from '@/lib/i18n';

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
    const { lang } = await params;
    return {
        title: lang === 'en' ? 'R&D and Innovation' : 'AR-GE ve İnovasyon',
        description: lang === 'en' 
            ? 'Learn about Aquachems R&D studies, P&D processes and innovation culture.' 
            : 'Aquachems AR-GE çalışmaları, ÜR-GE süreçleri ve inovasyon kültürü hakkında bilgi edinin.',
    };
}

export default async function InnovationPage({ params }: { params: Promise<{ lang: Locale }> }) {
    const { lang } = await params;

    if (lang === 'en') {
        return (
            <div className="bg-white min-h-screen pb-20">
                {/* Header Banner */}
                <div className="bg-primary-900 text-white pt-48 pb-16">
                    <div className="container-custom">
                        <h1 className="text-3xl md:text-5xl font-bold mb-4 text-white">R&D and Innovation</h1>
                        <p className="text-primary-200 text-lg max-w-2xl">
                            Innovative and sustainable solutions that set the standards in the industry.
                        </p>
                    </div>
                </div>

                <div className="container-custom py-16">
                    <div className="max-w-4xl mx-auto space-y-20">

                        {/* AR-GE Section */}
                        <div id="arge" className="grid grid-cols-1 md:grid-cols-[80px_1fr] gap-8 scroll-mt-40">
                            <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center shrink-0">
                                <FlaskConical size={40} />
                            </div>
                            <div>
                                <h2 className="text-3xl font-bold text-slate-900 mb-6">R&D Studies</h2>
                                <div className="prose prose-lg text-slate-600">
                                    <p>
                                        In Aquachem laboratories, we constantly work on new formulas with our expert chemists and engineers. Every product we develop in the light of scientific research is based on environmental sensitivity and high-performance principles.
                                    </p>
                                    <ul className="list-disc pl-5 mt-4 space-y-2">
                                        <li>Raw material quality control with high-tech analysis devices</li>
                                        <li>Environmental impact assessment and biodegradability tests</li>
                                        <li>Product development processes in compliance with international standards</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <hr className="border-slate-100" />

                        {/* ÜR-GE Section */}
                        <div id="urge" className="grid grid-cols-1 md:grid-cols-[80px_1fr] gap-8 scroll-mt-40">
                            <div className="w-20 h-20 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center shrink-0">
                                <Lightbulb size={40} />
                            </div>
                            <div>
                                <h2 className="text-3xl font-bold text-slate-900 mb-6">P&D Processes</h2>
                                <div className="prose prose-lg text-slate-600">
                                    <p>
                                        We manage product development processes that are applicable in the field and increase efficiency, tailored to the specific needs of our customers. We offer tailor-made solutions for different industrial requirements (automotive, textile, food, heavy industry, etc.).
                                    </p>
                                    <ul className="list-disc pl-5 mt-4 space-y-2">
                                        <li>Sector-specific formulation development</li>
                                        <li>Cost/Performance optimization</li>
                                        <li>Field tests and application support</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <hr className="border-slate-100" />

                        {/* İnovasyon Section */}
                        <div id="inovasyon" className="grid grid-cols-1 md:grid-cols-[80px_1fr] gap-8 scroll-mt-40">
                            <div className="w-20 h-20 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center shrink-0">
                                <TrendingUp size={40} />
                            </div>
                            <div>
                                <h2 className="text-3xl font-bold text-slate-900 mb-6">Innovation Culture</h2>
                                <div className="prose prose-lg text-slate-600">
                                    <p>
                                        We not only keep up with changing world dynamics, but we also lead the change. We adopt digitalization and efficiency-oriented innovations in every field from our production processes to our logistics operations.
                                    </p>
                                    <ul className="list-disc pl-5 mt-4 space-y-2">
                                        <li>Sustainable production technologies</li>
                                        <li>Smart supply chain management</li>
                                        <li>Continuous training and development programs</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        );
    }

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
                    <div id="arge" className="grid grid-cols-1 md:grid-cols-[80px_1fr] gap-8 scroll-mt-40">
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
                    <div id="urge" className="grid grid-cols-1 md:grid-cols-[80px_1fr] gap-8 scroll-mt-40">
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
                    <div id="inovasyon" className="grid grid-cols-1 md:grid-cols-[80px_1fr] gap-8 scroll-mt-40">
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
