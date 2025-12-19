import React from 'react';
import { ShoppingBag, Users, Activity, TrendingUp, Package, FileText } from 'lucide-react';

export default function AdminDashboard() {
    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Genel Bakış</h1>
                <p className="text-slate-500">Aquachems Yönetim Paneli - Hoş Geldiniz</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-lg transition-shadow group">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-blue-100 text-blue-600 p-3 rounded-xl group-hover:scale-110 transition-transform">
                            <ShoppingBag size={24} />
                        </div>
                        <span className="text-blue-600 text-sm font-bold">+12%</span>
                    </div>
                    <p className="text-sm text-slate-500 font-medium mb-1">Toplam Ürün</p>
                    <h3 className="text-3xl font-bold text-slate-900">150</h3>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-lg transition-shadow group">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-emerald-100 text-emerald-600 p-3 rounded-xl group-hover:scale-110 transition-transform">
                            <Activity size={24} />
                        </div>
                        <span className="text-emerald-600 text-sm font-bold">Aktif</span>
                    </div>
                    <p className="text-sm text-slate-500 font-medium mb-1">Yayındaki Haberler</p>
                    <h3 className="text-3xl font-bold text-slate-900">8</h3>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-lg transition-shadow group">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-purple-100 text-purple-600 p-3 rounded-xl group-hover:scale-110 transition-transform">
                            <Users size={24} />
                        </div>
                        <span className="text-purple-600 text-sm font-bold">+5%</span>
                    </div>
                    <p className="text-sm text-slate-500 font-medium mb-1">Referans Firma</p>
                    <h3 className="text-3xl font-bold text-slate-900">42</h3>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-lg transition-shadow group">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-amber-100 text-amber-600 p-3 rounded-xl group-hover:scale-110 transition-transform">
                            <Package size={24} />
                        </div>
                        <span className="text-amber-600 text-sm font-bold">10</span>
                    </div>
                    <p className="text-sm text-slate-500 font-medium mb-1">Ürün Kategorisi</p>
                    <h3 className="text-3xl font-bold text-slate-900">10</h3>
                </div>
            </div>

            {/* Quick Actions & Welcome */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Welcome Section */}
                <div className="lg:col-span-2 bg-gradient-to-br from-primary-600 to-primary-800 p-8 rounded-2xl shadow-lg text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 opacity-10">
                        <TrendingUp size={200} />
                    </div>
                    <div className="relative z-10">
                        <h2 className="text-2xl font-bold mb-3">Hoş Geldiniz!</h2>
                        <p className="text-primary-100 leading-relaxed mb-6">
                            Admin paneliniz üzerinden tüm içeriklerinizi yönetebilir,
                            ürün ve kategori ekleyebilir, haberler paylaşabilir ve referanslarınızı güncelleyebilirsiniz.
                        </p>
                        <div className="flex gap-4">
                            <a href="/admin/products" className="bg-white text-primary-700 px-6 py-2.5 rounded-lg font-semibold hover:bg-primary-50 transition-colors">
                                Ürün Ekle
                            </a>
                            <a href="/admin/posts" className="bg-white/10 backdrop-blur-sm text-white border border-white/20 px-6 py-2.5 rounded-lg font-semibold hover:bg-white/20 transition-colors">
                                Haber Ekle
                            </a>
                        </div>
                    </div>
                </div>

                {/* Quick Links */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <FileText size={20} className="text-primary-600" />
                        Hızlı Bağlantılar
                    </h3>
                    <div className="space-y-3">
                        <a href="/admin/products" className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors group">
                            <span className="text-slate-700 font-medium">Ürün Yönetimi</span>
                            <span className="text-slate-400 group-hover:text-primary-600">→</span>
                        </a>
                        <a href="/admin/categories" className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors group">
                            <span className="text-slate-700 font-medium">Kategori Yönetimi</span>
                            <span className="text-slate-400 group-hover:text-primary-600">→</span>
                        </a>
                        <a href="/admin/posts" className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors group">
                            <span className="text-slate-700 font-medium">Haber & Blog</span>
                            <span className="text-slate-400 group-hover:text-primary-600">→</span>
                        </a>
                        <a href="/admin/references" className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors group">
                            <span className="text-slate-700 font-medium">Referanslar</span>
                            <span className="text-slate-400 group-hover:text-primary-600">→</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
