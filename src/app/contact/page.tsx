
import React from 'react';
import { getContactLocations } from '@/app/admin/contact/actions';
import { Mail, Phone, MapPin, MessageSquare, Send } from 'lucide-react';
import ContactForm from './ContactForm';

export default async function ContactPage() {
    const locations = await getContactLocations();
    const primaryMap = locations.find(l => l.mapEmbedCode)?.mapEmbedCode;

    return (
        <div className="bg-slate-50 min-h-screen">
            {/* Header */}
            <div className="bg-primary-900 text-white py-20">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl font-bold mb-4">İletişim</h1>
                    <p className="text-primary-200 text-lg max-w-2xl mx-auto">
                        Sorularınız, önerileriniz veya işbirliği talepleriniz için bize ulaşın.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 -mt-10 mb-20">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Locations List */}
                    <div className="lg:col-span-1 space-y-6">
                        {locations.length > 0 ? (
                            locations.map(loc => (
                                <div key={loc.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                                    <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
                                        <div className="w-2 h-8 bg-primary-500 rounded-full" />
                                        {loc.title}
                                    </h3>
                                    <div className="space-y-4 text-slate-600">
                                        <div className="flex items-start gap-3">
                                            <MapPin className="text-primary-500 shrink-0 mt-1" size={20} />
                                            <p className="text-sm">{loc.address}</p>
                                        </div>
                                        {loc.phone && (
                                            <div className="flex items-center gap-3">
                                                <Phone className="text-primary-500 shrink-0" size={20} />
                                                <a href={'tel:' + loc.phone.replace(/\s/g, '')} className="hover:text-primary-600 transition-colors">
                                                    {loc.phone}
                                                </a>
                                            </div>
                                        )}
                                        {loc.email && (
                                            <div className="flex items-center gap-3">
                                                <Mail className="text-primary-500 shrink-0" size={20} />
                                                <a href={'mailto:' + loc.email} className="hover:text-primary-600 transition-colors">
                                                    {loc.email}
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="bg-white p-6 rounded-xl shadow-sm">
                                <p className="text-slate-500">İletişim bilgisi bulunamadı.</p>
                            </div>
                        )}
                    </div>

                    {/* Map & Form */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Map */}
                        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 h-[400px] overflow-hidden">
                            {primaryMap ? (
                                <div dangerouslySetInnerHTML={{ __html: primaryMap }} className="w-full h-full [&>iframe]:w-full [&>iframe]:h-full [&>iframe]:rounded-lg" />
                            ) : (
                                <div className="w-full h-full bg-slate-100 rounded-lg flex items-center justify-center text-slate-400">
                                    <MapPin size={48} className="opacity-20" />
                                    <span className="ml-2">Harita bulunamadı</span>
                                </div>
                            )}
                        </div>

                        {/* Contact Form */}
                        <ContactForm />
                    </div>
                </div>
            </div>
        </div>
    );
}

