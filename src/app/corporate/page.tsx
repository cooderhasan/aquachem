import React from 'react';
import { Target, Heart, Leaf } from 'lucide-react';
import Image from 'next/image';

export default function CorporatePage() {
    return (
        <div className="bg-white min-h-screen pb-20">
            {/* Header Banner */}
            <div className="bg-primary-900 text-white pt-48 pb-16">
                <div className="container-custom">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">Kurumsal</h1>
                    <p className="text-primary-200 text-lg max-w-2xl">
                        Kalite, güven ve sürdürülebilirlik üzerine kurulu bir gelecek.
                    </p>
                </div>
            </div>

            <div className="container-custom py-16">
                {/* Hakkımızda */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-900 mb-6">Hakkımızda</h2>
                        <div className="space-y-4 text-slate-600 text-lg leading-relaxed">
                            <p>
                                Aquachem olarak, endüstriyel hijyen ve kimyasal çözümler sektöründe yıllardır süregelen tecrübemizle hizmet veriyoruz.
                            </p>
                            <p>
                                Kurulduğumuz günden bu yana amacımız; en son teknolojiyi kullanarak çevreye duyarlı, insan sağlığına zararsız ve yüksek performanslı ürünler geliştirmektir.
                                Sektördeki yenilikleri yakından takip eden uzman kadromuzla, müşterilerimizin ihtiyaçlarına özel çözümler sunuyoruz.
                            </p>
                            <p>
                                Yerli üretim gücümüzü uluslararası kalite standartlarıyla birleştirerek, hem iç pazarda hem de ihracatta ülkemizi gururla temsil ediyoruz.
                            </p>
                        </div>
                    </div>
                    <div className="bg-slate-100 rounded-2xl h-[400px] flex items-center justify-center">
                        {/* Image Placeholder */}
                        <span className="text-slate-400 font-bold">Kurumsal Görsel</span>
                    </div>
                </div>

                {/* Misyon & Vizyon */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-slate-50 p-8 rounded-xl border border-slate-200">
                        <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-6">
                            <Target size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-4">Misyonumuz</h3>
                        <p className="text-slate-600">
                            Müşterilerimize en kaliteli ve doğru kimyasal çözümleri sunarken, doğayı korumak ve topluma değer katmak.
                        </p>
                    </div>

                    <div className="bg-slate-50 p-8 rounded-xl border border-slate-200">
                        <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center mb-6">
                            <Leaf size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-4">Değerlerimiz</h3>
                        <p className="text-slate-600">
                            Sürdürülebilirlik, şeffaflık, inovasyon ve insan odaklılık, tüm iş süreçlerimizin temelini oluşturur.
                        </p>
                    </div>

                    <div className="bg-slate-50 p-8 rounded-xl border border-slate-200">
                        <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-lg flex items-center justify-center mb-6">
                            <Heart size={24} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-4">İnsan Politikamız</h3>
                        <p className="text-slate-600">
                            Çalışanlarımızın güvenliği, gelişimi ve mutluluğu bizim için en büyük önceliktir.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
