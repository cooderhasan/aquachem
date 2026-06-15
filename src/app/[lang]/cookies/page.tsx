import React from 'react';
import { Cookie, Calendar } from 'lucide-react';
import { getMainContactLocation } from '@/app/admin/contact/actions';
import { Locale } from '@/lib/i18n';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
    const { lang } = await params;
    return {
        title: lang === 'en' ? 'Cookie Policy' : 'Çerez Politikası',
        description: lang === 'en' 
            ? 'Information about the cookies used on the Aquachems website.' 
            : 'Aquachems web sitesinde kullanılan çerezler hakkında bilgilendirme.',
    };
}

export default async function CookiesPage({ params }: { params: Promise<{ lang: Locale }> }) {
    const { lang } = await params;
    // İç Anadolu lokasyonunu çek
    const icAnadoluLocation = await getMainContactLocation();

    if (lang === 'en') {
        return (
            <div className="bg-white min-h-screen pb-20 pt-28">
                <div className="bg-primary-900 text-white py-16">
                    <div className="container-custom">
                        <div className="flex items-center gap-3 mb-4">
                            <Cookie size={32} className="text-primary-400" />
                            <h1 className="text-4xl font-bold text-white">Cookie Policy</h1>
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
                            <h2>1. What is a Cookie?</h2>
                            <p>
                                Cookies are small text files stored on users' devices (computer, tablet, smartphone)
                                by websites. These files are used to improve website functionality
                                and enhance the user experience.
                            </p>

                            <h2>2. Types of Cookies</h2>
                            <p>
                                Types of cookies used on our website:
                            </p>

                            <h3>Necessary Cookies</h3>
                            <p>
                                Required for the website to perform its basic functions.
                                Without these cookies, the site will not function properly.
                            </p>

                            <h3>Performance Cookies</h3>
                            <p>
                                Help us understand how visitors use the website.
                                Collects statistical data such as the number of page views,
                                traffic sources, and visit durations.
                            </p>

                            <h3>Functionality Cookies</h3>
                            <p>
                                Offers a more personalized experience by remembering user preferences.
                                Stores information such as language preferences and regional settings.
                            </p>

                            <h3>Targeting/Advertising Cookies</h3>
                            <p>
                                Used to show you relevant content and advertisements based on your interests.
                            </p>

                            <h2>3. Cookies We Use</h2>
                            <p>
                                Cookies used on the Aquachems website:
                            </p>
                            <ul>
                                <li><strong>Session Cookies:</strong> Deleted when the browser is closed</li>
                                <li><strong>Persistent Cookies:</strong> Remain on your device for a certain period of time</li>
                                <li><strong>First-Party Cookies:</strong> Created directly by our website</li>
                                <li><strong>Third-Party Cookies:</strong> Created by external services such as Google Analytics</li>
                            </ul>

                            <h2>4. Cookie Management</h2>
                            <p>
                                You can use your browser settings to control or delete cookies:
                            </p>
                            <ul>
                                <li><strong>Chrome:</strong> Settings → Privacy and Security → Cookies</li>
                                <li><strong>Firefox:</strong> Options → Privacy and Security → Cookies and Site Data</li>
                                <li><strong>Safari:</strong> Preferences → Privacy → Manage Cookies</li>
                                <li><strong>Edge:</strong> Settings → Privacy, search, and services → Cookies</li>
                            </ul>

                            <h2>5. Effects of Rejecting Cookies</h2>
                            <p>
                                If you completely reject cookies, some features of the website
                                may not work properly. For example:
                            </p>
                            <ul>
                                <li>Your preferences may not be remembered</li>
                                <li>Some pages may not load</li>
                                <li>User experience may be negatively affected</li>
                            </ul>

                            <h2>6. Changes</h2>
                            <p>
                                This cookie policy may be updated depending on legal regulations or application changes.
                                Changes will be published on this page.
                            </p>

                            <h2>7. Contact</h2>
                            <p>
                                You can contact us for questions about cookie usage:
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
                        <Cookie size={32} className="text-primary-400" />
                        <h1 className="text-4xl font-bold text-white">Çerez Politikası</h1>
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
                        <h2>1. Çerez Nedir?</h2>
                        <p>
                            Çerezler, web sitelerinin kullanıcıların cihazlarında (bilgisayar, tablet, akıllı telefon)
                            sakladığı küçük metin dosyalarıdır. Bu dosyalar, web sitesinin işlevselliğini artırmak
                            ve kullanıcı deneyimini iyileştirmek için kullanılır.
                        </p>

                        <h2>2. Çerez Türleri</h2>
                        <p>
                            Web sitemizde kullanılan çerez türleri:
                        </p>

                        <h3>Zorunlu Çerezler</h3>
                        <p>
                            Web sitesinin temel işlevlerini yerine getirmesi için gereklidir.
                            Bu çerezler olmadan site düzgün çalışmaz.
                        </p>

                        <h3>Performans Çerezleri</h3>
                        <p>
                            Ziyaretçilerin siteyi nasıl kullandığını anlamamıza yardımcı olur.
                            Sayfa görüntüleme sayısı, trafik kaynakları ve ziyaret süreleri gibi
                            istatistiksel verileri toplar.
                        </p>

                        <h3>İşlevsellik Çerezleri</h3>
                        <p>
                            Kullanıcı tercihlerini hatırlayarak daha kişiselleştirilmiş bir deneyim sunar.
                            Dil tercihi, bölge ayarları gibi bilgileri saklar.
                        </p>

                        <h3>Hedefleme/Reklam Çerezleri</h3>
                        <p>
                            İlgi alanlarınıza göre size uygun içerik ve reklamları göstermek için kullanılır.
                        </p>

                        <h2>3. Kullandığımız Çerezler</h2>
                        <p>
                            Aquachems web sitesinde kullanılan çerezler:
                        </p>
                        <ul>
                            <li><strong>Oturum Çerezleri:</strong> Tarayıcı kapatıldığında silinir</li>
                            <li><strong>Kalıcı Çerezler:</strong> Belirli bir süre cihazınızda kalır</li>
                            <li><strong>Birinci Taraf Çerezleri:</strong> Doğrudan web sitemiz tarafından oluşturulur</li>
                            <li><strong>Üçüncü Taraf Çerezleri:</strong> Google Analytics gibi dış hizmetler tarafından oluşturulur</li>
                        </ul>

                        <h2>4. Çerez Yönetimi</h2>
                        <p>
                            Çerezleri kontrol etmek veya silmek için tarayıcı ayarlarınızı kullanabilirsiniz:
                        </p>
                        <ul>
                            <li><strong>Chrome:</strong> Ayarlar → Gizlilik ve Güvenlik → Çerezler</li>
                            <li><strong>Firefox:</strong> Seçenekler → Gizlilik ve Güvenlik → Çerezler ve Site Verileri</li>
                            <li><strong>Safari:</strong> Tercihler → Gizlilik → Çerezleri Yönet</li>
                            <li><strong>Edge:</strong> Ayarlar → Gizlilik, arama ve hizmetler → Çerezler</li>
                        </ul>

                        <h2>5. Çerezleri Reddetmenin Etkileri</h2>
                        <p>
                            Çerezleri tamamen reddetmeniz durumunda, web sitesinin bazı özellikleri
                            düzgün çalışmayabilir. Örneğin:
                        </p>
                        <ul>
                            <li>Tercihleriniz hatırlanmayabilir</li>
                            <li>Bazı sayfalar yüklenemeyebilir</li>
                            <li>Kullanıcı deneyimi olumsuz etkilenebilir</li>
                        </ul>

                        <h2>6. Değişiklikler</h2>
                        <p>
                            Bu çerez politikası, yasal düzenlemelere veya uygulama değişikliklerine bağlı olarak
                            güncellenebilir. Değişiklikler bu sayfada yayınlanacaktır.
                        </p>

                        <h2>7. İletişim</h2>
                        <p>
                            Çerez kullanımı hakkında sorularınız için bizimle iletişime geçebilirsiniz:
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
