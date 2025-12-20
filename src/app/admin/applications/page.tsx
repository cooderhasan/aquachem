import { Trash2, Download, FileText, User, Phone, Mail } from 'lucide-react';
import { getApplications, deleteApplication, updateApplicationStatus } from './actions';

export const dynamic = 'force-dynamic';

export default async function ApplicationsPage() {
    const applications = await getApplications();

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'new': return <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-semibold">Yeni</span>;
            case 'reviewed': return <span className="bg-amber-100 text-amber-700 px-2 py-1 rounded-full text-xs font-semibold">İncelendi</span>;
            case 'interviewed': return <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs font-semibold">Görüşüldü</span>;
            case 'rejected': return <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-semibold">Reddedildi</span>;
            case 'hired': return <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full text-xs font-semibold">İşe Alındı</span>;
            default: return <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded-full text-xs font-semibold">{status}</span>;
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-slate-800">
                    İş Başvuruları ({applications.length})
                </h1>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {applications.length === 0 ? (
                    <div className="bg-white p-8 rounded-xl text-center text-slate-500 border border-slate-200">
                        Henüz hiç başvuru yok.
                    </div>
                ) : (
                    applications.map((app) => (
                        <div key={app.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col md:flex-row gap-6">
                            <div className="flex-1 min-w-0 space-y-3">
                                <div className="flex items-center gap-3 flex-wrap">
                                    <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                                        <User size={18} className="text-primary-600" />
                                        {app.name}
                                    </h3>
                                    {getStatusBadge(app.status || 'new')}
                                    <span className="text-xs text-slate-400 ml-auto md:ml-2">
                                        {new Date(app.createdAt || Date.now()).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>

                                <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                                    <div className="flex items-center gap-1.5">
                                        <Mail size={16} className="text-slate-400" />
                                        <a href={`mailto:${app.email}`} className="hover:text-primary-600">{app.email}</a>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Phone size={16} className="text-slate-400" />
                                        <a href={`tel:${app.phone}`} className="hover:text-primary-600">{app.phone}</a>
                                    </div>
                                </div>

                                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 flex items-center justify-between gap-4">
                                    <div>
                                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pozisyon</span>
                                        <div className="font-medium text-slate-800">{app.position || 'Genel Başvuru'}</div>
                                    </div>
                                    {app.cvUrl && (
                                        <a
                                            href={app.cvUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 bg-white border border-slate-200 hover:border-primary-500 text-slate-600 hover:text-primary-600 px-4 py-2 rounded-lg transition-colors shadow-sm"
                                        >
                                            <FileText size={18} />
                                            <span>CV Görüntüle / İndir</span>
                                            <Download size={16} />
                                        </a>
                                    )}
                                </div>
                            </div>

                            <div className="flex md:flex-col justify-end gap-2 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-4 min-w-[140px]">
                                <form action={async () => {
                                    'use server';
                                    await updateApplicationStatus(app.id, 'reviewed');
                                }} className="w-full">
                                    <button className="w-full text-left px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
                                        İncelendi Yap
                                    </button>
                                </form>
                                <form action={async () => {
                                    'use server';
                                    await updateApplicationStatus(app.id, 'interviewed');
                                }} className="w-full">
                                    <button className="w-full text-left px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
                                        Görüşüldü Yap
                                    </button>
                                </form>
                                <form action={async () => {
                                    'use server';
                                    await deleteApplication(app.id);
                                }} className="w-full mt-auto">
                                    <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                        <Trash2 size={16} />
                                        Sil
                                    </button>
                                </form>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
