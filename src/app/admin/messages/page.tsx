import { Trash2, Mail, MailOpen } from 'lucide-react';
import { getMessages, deleteMessage, markAsRead } from './actions';

export const dynamic = 'force-dynamic';

export default async function MessagesPage() {
    const messages = await getMessages();

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-slate-800">
                    Gelen Kutusu ({messages.length})
                </h1>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {messages.length === 0 ? (
                    <div className="bg-white p-8 rounded-xl text-center text-slate-500 border border-slate-200">
                        Henüz hiç mesajınız yok.
                    </div>
                ) : (
                    messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`bg-white rounded-xl shadow-sm border p-6 flex flex-col md:flex-row gap-6 transition-colors ${msg.isRead ? 'border-slate-200' : 'border-primary-200 bg-primary-50/30'
                                }`}
                        >
                            <div className="flex-1 min-w-0 space-y-2">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-full shrink-0 ${msg.isRead ? 'bg-slate-100 text-slate-400' : 'bg-primary-100 text-primary-600'}`}>
                                        {msg.isRead ? <MailOpen size={20} /> : <Mail size={20} />}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-800">{msg.name}</h3>
                                        <p className="text-sm text-slate-500">{msg.email}</p>
                                    </div>
                                    <div className="ml-auto text-xs text-slate-400 whitespace-nowrap">
                                        {new Date(msg.createdAt || Date.now()).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                    </div>
                                </div>

                                <h4 className="font-semibold text-slate-700 mt-2">{msg.subject || 'Konusuz'}</h4>
                                <p className="text-slate-600 text-sm whitespace-pre-wrap bg-slate-50 p-3 rounded-lg border border-slate-100">
                                    {msg.message}
                                </p>
                            </div>

                            <div className="flex md:flex-col justify-end gap-2 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-4">
                                {!msg.isRead && (
                                    <form action={async () => {
                                        'use server';
                                        await markAsRead(msg.id);
                                    }}>
                                        <button className="flex items-center gap-2 text-sm text-primary-600 hover:bg-primary-50 px-3 py-2 rounded-lg transition-colors w-full whitespace-nowrap">
                                            <MailOpen size={16} />
                                            Okundu İşaretle
                                        </button>
                                    </form>
                                )}
                                <form action={async () => {
                                    'use server';
                                    await deleteMessage(msg.id);
                                }}>
                                    <button className="flex items-center gap-2 text-sm text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors w-full whitespace-nowrap">
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
