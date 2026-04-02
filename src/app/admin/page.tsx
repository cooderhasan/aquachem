import React from 'react';
import { ShoppingBag, Users, Activity, Package, FileText, TrendingUp, Mail, ClipboardList, ArrowRight } from 'lucide-react';
import { db } from '@/lib/db';
import { products, posts, references, categories, messages, quoteRequests } from '@/db/schema';
import { count, eq } from 'drizzle-orm';

export default async function AdminDashboard() {
    const [productData] = await db.select({ count: count() }).from(products);
    const [postData] = await db.select({ count: count() }).from(posts);
    const [referenceData] = await db.select({ count: count() }).from(references);
    const [categoryData] = await db.select({ count: count() }).from(categories);

    // Mesaj ve Teklif Talebi Verileri
    const [messageTotal] = await db.select({ count: count() }).from(messages);
    const [messageUnread] = await db.select({ count: count() }).from(messages).where(eq(messages.isRead, false));
    const [quoteTotal] = await db.select({ count: count() }).from(quoteRequests);
    const [quoteUnread] = await db.select({ count: count() }).from(quoteRequests).where(eq(quoteRequests.isRead, false));

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Genel Bakış</h1>
                <p className="text-slate-500">Aquachems Yönetim Paneli - Hoş Geldiniz</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-lg transition-shadow group">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-blue-100 text-blue-600 p-3 rounded-xl group-hover:scale-110 transition-transform">
                            <ShoppingBag size={24} />
                        </div>
                    </div>
                    <p className="text-sm text-slate-500 font-medium mb-1">Toplam Ürün</p>
                    <h3 className="text-3xl font-bold text-slate-900">{productData?.count || 0}</h3>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-lg transition-shadow group">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-emerald-100 text-emerald-600 p-3 rounded-xl group-hover:scale-110 transition-transform">
                            <Activity size={24} />
                        </div>
                    </div>
                    <p className="text-sm text-slate-500 font-medium mb-1">Haberler</p>
                    <h3 className="text-3xl font-bold text-slate-900">{postData?.count || 0}</h3>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-lg transition-shadow group">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-purple-100 text-purple-600 p-3 rounded-xl group-hover:scale-110 transition-transform">
                            <Users size={24} />
                        </div>
                    </div>
                    <p className="text-sm text-slate-500 font-medium mb-1">Referanslar</p>
                    <h3 className="text-3xl font-bold text-slate-900">{referenceData?.count || 0}</h3>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-lg transition-shadow group">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-amber-100 text-amber-600 p-3 rounded-xl group-hover:scale-110 transition-transform">
                            <Package size={24} />
                        </div>
                    </div>
                    <p className="text-sm text-slate-500 font-medium mb-1">Kategoriler</p>
                    <h3 className="text-3xl font-bold text-slate-900">{categoryData?.count || 0}</h3>
                </div>

                {/* Teklif Talepleri Card */}
                <a href="/admin/quotes" className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-lg transition-shadow group relative overflow-hidden">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-rose-100 text-rose-600 p-3 rounded-xl group-hover:scale-110 transition-transform">
                            <ClipboardList size={24} />
                        </div>
                        {quoteUnread.count > 0 && (
                            <span className="bg-rose-600 text-white text-[10px] font-bold px-2 py-1 rounded-lg animate-pulse">
                                {quoteUnread.count} YENİ
                            </span>
                        )}
                    </div>
                    <p className="text-sm text-slate-500 font-medium mb-1">Teklif Talebi</p>
                    <h3 className="text-3xl font-bold text-slate-900">{quoteTotal?.count || 0}</h3>
                </a>

                {/* İletişim Mesajları Card */}
                <a href="/admin/messages" className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-lg transition-shadow group relative overflow-hidden">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-indigo-100 text-indigo-600 p-3 rounded-xl group-hover:scale-110 transition-transform">
                            <Mail size={24} />
                        </div>
                        {messageUnread.count > 0 && (
                            <span className="bg-indigo-600 text-white text-[10px] font-bold px-2 py-1 rounded-lg animate-pulse">
                                {messageUnread.count} YENİ
                            </span>
                        )}
                    </div>
                    <p className="text-sm text-slate-500 font-medium mb-1">Mesajlar</p>
                    <h3 className="text-3xl font-bold text-slate-900">{messageTotal?.count || 0}</h3>
                </a>
            </div>

            {/* Quick Actions & Welcome */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Welcome Section */}
                <div className="lg:col-span-2 bg-gradient-to-br from-primary-600 to-primary-800 bg-primary-600 p-8 rounded-2xl shadow-lg text-white relative overflow-hidden">
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
                        <a href="/admin/quotes" className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors group">
                            <div className="flex items-center gap-3">
                                <ClipboardList size={18} className="text-slate-400" />
                                <span className="text-slate-700 font-medium">Teklif Talepleri</span>
                                {quoteUnread.count > 0 && (
                                    <span className="bg-rose-100 text-rose-600 text-[10px] font-bold px-2 py-0.5 rounded-md">
                                        {quoteUnread.count} Yeni
                                    </span>
                                )}
                            </div>
                            <ArrowRight size={16} className="text-slate-300 group-hover:text-primary-600 opacity-0 group-hover:opacity-100 transition-all" />
                        </a>
                        <a href="/admin/messages" className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors group">
                            <div className="flex items-center gap-3">
                                <Mail size={18} className="text-slate-400" />
                                <span className="text-slate-700 font-medium">Gelen Kutusu</span>
                                {messageUnread.count > 0 && (
                                    <span className="bg-indigo-100 text-indigo-600 text-[10px] font-bold px-2 py-0.5 rounded-md">
                                        {messageUnread.count} Yeni
                                    </span>
                                )}
                            </div>
                            <ArrowRight size={16} className="text-slate-300 group-hover:text-primary-600 opacity-0 group-hover:opacity-100 transition-all" />
                        </a>
                        <div className="border-t border-slate-100 my-2 pt-2"></div>
                        <a href="/admin/products" className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors group">
                            <div className="flex items-center gap-3">
                                <ShoppingBag size={18} className="text-slate-400" />
                                <span className="text-slate-700 font-medium">Ürün Yönetimi</span>
                            </div>
                            <ArrowRight size={16} className="text-slate-300 group-hover:text-primary-600 opacity-0 group-hover:opacity-100 transition-all" />
                        </a>
                        <a href="/admin/categories" className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-50 transition-colors group">
                            <div className="flex items-center gap-3">
                                <FolderTree size={18} className="text-slate-400" />
                                <span className="text-slate-700 font-medium">Kategori Yönetimi</span>
                            </div>
                            <ArrowRight size={16} className="text-slate-300 group-hover:text-primary-600 opacity-0 group-hover:opacity-100 transition-all" />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Ensure FolderTree is imported as it was used in replacement but not in original
import { FolderTree } from 'lucide-react';
