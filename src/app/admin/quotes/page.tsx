import React from 'react';
import { getQuoteRequests, markQuoteAsRead, updateQuoteStatus, deleteQuoteRequest } from './actions';
import { Trash2, Mail, MailOpen, Phone, Building2, Package, Clock, CheckCircle, PlayCircle } from 'lucide-react';

export const dynamic = 'force-dynamic';

const statusConfig: Record<string, { label: string; color: string }> = {
    new: { label: 'Yeni', color: 'bg-blue-100 text-blue-700 border-blue-200' },
    inProgress: { label: 'İşlemde', color: 'bg-amber-100 text-amber-700 border-amber-200' },
    done: { label: 'Tamamlandı', color: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
};

export default async function QuotesPage() {
    const quotes = await getQuoteRequests();
    const newCount = quotes.filter(q => q.status === 'new').length;

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Teklif Talepleri</h1>
                    <p className="text-slate-500 text-sm mt-1">Toplam {quotes.length} talep · {newCount} yeni</p>
                </div>
            </div>

            {quotes.length === 0 ? (
                <div className="bg-white p-12 rounded-xl text-center text-slate-500 border border-slate-200">
                    <Package size={48} className="mx-auto mb-4 text-slate-300" />
                    <p className="font-medium">Henüz teklif talebi bulunmuyor.</p>
                    <p className="text-sm mt-1">Ürün sayfalarındaki "Teklif Al" butonu üzerinden gelen talepler burada görünecek.</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {quotes.map((quote) => {
                        const statusInfo = statusConfig[quote.status || 'new'] || statusConfig.new;
                        return (
                            <div
                                key={quote.id}
                                className={`bg-white rounded-xl shadow-sm border p-6 transition-colors ${!quote.isRead ? 'border-primary-200 bg-primary-50/20' : 'border-slate-200'}`}
                            >
                                <div className="flex flex-col lg:flex-row gap-6">
                                    {/* Left: Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-wrap items-center gap-3 mb-3">
                                            <div className={`p-2 rounded-full shrink-0 ${!quote.isRead ? 'bg-primary-100 text-primary-600' : 'bg-slate-100 text-slate-400'}`}>
                                                {quote.isRead ? <MailOpen size={18} /> : <Mail size={18} />}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-slate-800">{quote.name}</h3>
                                                {quote.company && (
                                                    <p className="text-sm text-slate-500 flex items-center gap-1">
                                                        <Building2 size={12} /> {quote.company}
                                                    </p>
                                                )}
                                            </div>
                                            <span className={`ml-auto text-xs font-semibold px-3 py-1 rounded-full border ${statusInfo.color}`}>
                                                {statusInfo.label}
                                            </span>
                                        </div>

                                        {/* Product */}
                                        <div className="bg-primary-50 border border-primary-100 rounded-lg px-4 py-3 mb-3 flex items-center gap-2">
                                            <Package size={16} className="text-primary-600 shrink-0" />
                                            <span className="font-semibold text-primary-800 text-sm">{quote.productName}</span>
                                        </div>

                                        {/* Contact Info */}
                                        <div className="flex flex-wrap gap-4 text-sm text-slate-600 mb-3">
                                            <a href={`mailto:${quote.email}`} className="flex items-center gap-1.5 hover:text-primary-600 transition-colors">
                                                <Mail size={14} /> {quote.email}
                                            </a>
                                            <a href={`tel:${quote.phone}`} className="flex items-center gap-1.5 hover:text-primary-600 transition-colors">
                                                <Phone size={14} /> {quote.phone}
                                            </a>
                                        </div>

                                        {/* Quantity Note */}
                                        {quote.quantity && (
                                            <div className="bg-slate-50 border border-slate-100 rounded-lg p-3 text-sm text-slate-600 whitespace-pre-wrap">
                                                {quote.quantity}
                                            </div>
                                        )}

                                        <p className="text-xs text-slate-400 mt-3 flex items-center gap-1">
                                            <Clock size={12} />
                                            {new Date(quote.createdAt || Date.now()).toLocaleDateString('tr-TR', {
                                                day: 'numeric', month: 'long', year: 'numeric',
                                                hour: '2-digit', minute: '2-digit'
                                            })}
                                        </p>
                                    </div>

                                    {/* Right: Actions */}
                                    <div className="flex lg:flex-col gap-2 border-t lg:border-t-0 lg:border-l border-slate-100 pt-4 lg:pt-0 lg:pl-4 justify-end lg:justify-start">
                                        {!quote.isRead && (
                                            <form action={async () => {
                                                'use server';
                                                await markQuoteAsRead(quote.id);
                                            }}>
                                                <button className="flex items-center gap-2 text-sm text-primary-600 hover:bg-primary-50 px-3 py-2 rounded-lg transition-colors w-full whitespace-nowrap">
                                                    <MailOpen size={15} /> Okundu İşaretle
                                                </button>
                                            </form>
                                        )}

                                        {quote.status === 'new' && (
                                            <form action={async () => {
                                                'use server';
                                                await updateQuoteStatus(quote.id, 'inProgress');
                                            }}>
                                                <button className="flex items-center gap-2 text-sm text-amber-600 hover:bg-amber-50 px-3 py-2 rounded-lg transition-colors w-full whitespace-nowrap">
                                                    <PlayCircle size={15} /> İşleme Al
                                                </button>
                                            </form>
                                        )}

                                        {quote.status === 'inProgress' && (
                                            <form action={async () => {
                                                'use server';
                                                await updateQuoteStatus(quote.id, 'done');
                                            }}>
                                                <button className="flex items-center gap-2 text-sm text-emerald-600 hover:bg-emerald-50 px-3 py-2 rounded-lg transition-colors w-full whitespace-nowrap">
                                                    <CheckCircle size={15} /> Tamamlandı
                                                </button>
                                            </form>
                                        )}

                                        <form action={async () => {
                                            'use server';
                                            await deleteQuoteRequest(quote.id);
                                        }}>
                                            <button className="flex items-center gap-2 text-sm text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors w-full whitespace-nowrap">
                                                <Trash2 size={15} /> Sil
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
