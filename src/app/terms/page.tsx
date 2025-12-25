import React from 'react';
import { FileText, Calendar } from 'lucide-react';
import { getContactLocations } from '@/app/admin/contact/actions';

export default async function TermsPage() {
    // İç Anadolu lokasyonunu çek
    const locations = await getContactLocations();
    const icAnadoluLocation = locations.find(loc =>
        loc.title.toLowerCase().includes('iç anadolu') ||
        loc.title.toLowerCase().includes('ic anadolu')
    ) || locations[0] || null;

    return (
        <div className="bg-white min-h-screen pb-20 pt-28">
            <div className="bg-primary-900 text-white py-16">
                <div className="container-custom">
                    <div className="flex items-center gap-3 mb-4">
                        <FileText size={32} className="text-primary-400" />
                        <h1 className="text-4xl font-bold text-white">Kullanım Şartları</h1>
                    </div>
                    <p className="text-primary-200 flex items-center gap-2">
                        <Calendar size={16} />
                        Son Güncelleme: 18 Aralık 2024
                    </p>
                </div>
            </div>

            <div className="container-custom py-12 max-w-4xl">
                <div className="bg-white rounded-2xl border border-slate-200 p-8 md:p-12">
                    <div className="prose prose-slate max-w-none">
                        <h2>1. Genel Hükümler</h2>
                        <p>
                            Bu web sitesini kullanmakla, aşağıda belirtilen kullanım şartlarını kabul etmiş sayılırsınız.
                            Aquachems Kimya, bu şartları önceden haber vermeksizin değiştirme hakkını saklı tutar.
                        </p>

                        <h2>2. Hizmet Kapsamı</h2>
                        <p>
                            Web sitemiz, ürünlerimiz ve hizmetlerimiz hakkında bilgi sağlamak amacıyla oluşturulmuştur.
                            Sitede yer alan bilgiler yalnızca bilgilendirme amaçlıdır ve herhangi bir taahhüt niteliği taşımaz.
                        </p>

                        <h2>3. Fikri Mülkiyet Hakları</h2>
                        <p>
                            Bu web sitesinde yer alan tüm içerik, tasarım, logo, grafik, fotoğraf ve diğer materyaller
                            Aquachems Kimya'nın veya lisans verenlerin mülkiyetindedir. İzinsiz kullanımı yasaktır.
                        </p>

                        <h2>4. Sorumluluk Reddi</h2>
                        <p>
                            Aquachems Kimya, web sitesinde yer alan bilgilerin doğruluğu, güncelliği veya eksiksizliği
                            konusunda herhangi bir garanti vermez. Sitenin kullanımından doğabilecek zararlardan
                            sorumlu tutulamaz.
                        </p>

                        <h2>5. Dış Bağlantılar</h2>
                        <p>
                            Web sitemizde üçüncü taraf web sitelerine bağlantılar bulunabilir. Bu bağlantıların
                            içeriğinden Aquachems Kimya sorumlu değildir.
                        </p>

                        <h2>6. Değişiklikler</h2>
                        <p>
                            Aquachems Kimya, bu kullanım şartlarını herhangi bir zamanda önceden haber vermeksizin
                            değiştirme hakkını saklı tutar. Değişiklikler bu sayfada yayınlandığı anda yürürlüğe girer.
                        </p>

                        <h2>7. Uygulanacak Hukuk</h2>
                        <p>
                            Bu kullanım şartları Türkiye Cumhuriyeti yasalarına tabidir. Uyuşmazlıkların çözümünde
                            İstanbul Mahkemeleri ve İcra Daireleri yetkilidir.
                        </p>

                        <h2>8. İletişim</h2>
                        <p>
                            Kullanım şartları ile ilgili sorularınız için bizimle iletişime geçebilirsiniz:
                        </p>
                        <ul>
                            {icAnadoluLocation?.email && <li>E-posta: {icAnadoluLocation.email}</li>}
                            {icAnadoluLocation?.phone && <li>Telefon: {icAnadoluLocation.phone}</li>}
                            {icAnadoluLocation?.address && <li>Adres: {icAnadoluLocation.address}</li>}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
