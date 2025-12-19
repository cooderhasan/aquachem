import React from 'react';
import { Cookie, Calendar } from 'lucide-react';

export default function CookiesPage() {
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
                            <li>E-posta: info@aquachems.com</li>
                            <li>Telefon: 0533 683 85 63</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
