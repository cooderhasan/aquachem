import React from 'react';
import { FileText, Calendar } from 'lucide-react';
import { getMainContactLocation } from '@/app/admin/contact/actions';
import { Locale } from '@/lib/i18n';
import { Metadata } from 'next';

import { getAlternates } from '@/lib/seo';

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
    const { lang } = await params;
    return {
        title: lang === 'en' ? 'Terms of Use' : 'Kullanım Şartları',
        description: lang === 'en' 
            ? 'Aquachems terms of use and legal provisions.' 
            : 'Aquachems kullanım şartları ve yasal hükümler.',
        alternates: getAlternates(lang, '/terms'),
    };
}

export default async function TermsPage({ params }: { params: Promise<{ lang: Locale }> }) {
    const { lang } = await params;
    // İç Anadolu lokasyonunu çek
    const icAnadoluLocation = await getMainContactLocation();

    if (lang === 'en') {
        return (
            <div className="bg-white min-h-screen pb-20 pt-28">
                <div className="bg-primary-900 text-white py-16">
                    <div className="container-custom">
                        <div className="flex items-center gap-3 mb-4">
                            <FileText size={32} className="text-primary-400" />
                            <h1 className="text-4xl font-bold text-white">Terms of Use</h1>
                        </div>
                        <p className="text-primary-200 flex items-center gap-2">
                            <Calendar size={16} />
                            Last Updated: December 18, 2024
                        </p>
                    </div>
                </div>

                <div className="container-custom py-12 max-w-4xl">
                    <div className="bg-white rounded-2xl border border-slate-200 p-8 md:p-12">
                        <div className="prose prose-slate max-w-none">
                            <h2>1. General Provisions</h2>
                            <p>
                                By using this website, you are deemed to have accepted the terms of use stated below.
                                Aquachems Chemistry reserves the right to change these terms without prior notice.
                            </p>

                            <h2>2. Scope of Service</h2>
                            <p>
                                Our website is created to provide information about our products and services.
                                The information on the site is for informational purposes only and does not constitute any commitment.
                            </p>

                            <h2>3. Intellectual Property Rights</h2>
                            <p>
                                All content, design, logos, graphics, photos, and other materials on this website
                                are the property of Aquachems Chemistry or its licensors. Unauthorized use is prohibited.
                            </p>

                            <h2>4. Disclaimer</h2>
                            <p>
                                Aquachems Chemistry does not guarantee the accuracy, currency, or completeness
                                of the information on the website. It cannot be held responsible for damages
                                that may arise from using the site.
                            </p>

                            <h2>5. External Links</h2>
                            <p>
                                Our website may contain links to third-party websites. Aquachems Chemistry is not
                                responsible for the content of these links.
                            </p>

                            <h2>6. Changes</h2>
                            <p>
                                Aquachems Chemistry reserves the right to change these terms of use at any time
                                without prior notice. Changes take effect as soon as they are published on this page.
                            </p>

                            <h2>7. Governing Law</h2>
                            <p>
                                These terms of use are subject to the laws of the Republic of Turkey. Istanbul Courts and
                                Execution Offices are authorized to resolve disputes.
                            </p>

                            <h2>8. Contact</h2>
                            <p>
                                For questions about our terms of use:
                            </p>
                            <ul>
                                {icAnadoluLocation?.email && <li>Email: {icAnadoluLocation.email}</li>}
                                {icAnadoluLocation?.phone && <li>Phone: {icAnadoluLocation.phone}</li>}
                                {icAnadoluLocation?.address && <li>Address: {icAnadoluLocation.address}</li>}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

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
