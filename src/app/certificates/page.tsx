import React from 'react';
import { Award, FileText } from 'lucide-react';

const certificates = [
    { id: 1, title: 'ISO 9001 - 2000', description: 'Kalite Yönetim Sistemi' },
    { id: 2, title: 'ISO 14001', description: 'Çevre Yönetim Sistemi' },
    { id: 3, title: 'OHSAS 18001', description: 'İşçi Sağlığı ve Güvenliği' },
    { id: 4, title: 'IQ SCC-HYB', description: 'Hizmet Yeterlilik Belgesi' },
    { id: 5, title: 'TSE', description: 'Türk Standartlarına Uygunluk' },
    { id: 6, title: 'Yerli Malı Belgesi', description: 'Yerli Üretim Sertifikası' }
];

export default function CertificatesPage() {
    return (
        <div className="bg-white min-h-screen pb-20">
            {/* Header Banner */}
            <div className="bg-primary-900 text-white pt-48 pb-16">
                <div className="container-custom">
                    <h1 className="text-3xl md:text-5xl font-bold mb-4 text-white">Belgelerimiz</h1>
                    <p className="text-primary-200 text-lg">
                        Kalite politikamızın bir parçası olan yetki ve kalite belgelerimiz.
                    </p>
                </div>
            </div>

            <div className="container-custom py-16">
                <div className="max-w-4xl mx-auto text-center mb-16">
                    <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center justify-center gap-3">
                        <Award className="text-primary-600" size={32} />
                        <span>Kalite Standartlarımız</span>
                    </h2>
                    <p className="text-slate-600 leading-relaxed text-lg">
                        Uluslararası standartlara uygun üretim anlayışımızla, sahip olduğumuz sertifikalar kalitemizin ve güvenilirliğimizin teminatıdır.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {certificates.map((cert) => (
                        <div key={cert.id} className="bg-slate-50 border border-slate-200 rounded-xl p-8 hover:shadow-lg transition-shadow group">
                            <div className="w-20 h-20 bg-white rounded-full shadow-sm flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform border border-slate-100">
                                <FileText className="text-primary-600" size={36} />
                            </div>
                            <h3 className="text-xl font-bold text-slate-800 text-center mb-3 group-hover:text-primary-700 transition-colors">
                                {cert.title}
                            </h3>
                            <p className="text-slate-500 text-center font-medium">{cert.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
