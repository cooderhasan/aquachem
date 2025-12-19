import React from 'react';
import { Shield, Calendar } from 'lucide-react';

export default function PrivacyPage() {
    return (
        <div className="bg-white min-h-screen pb-20 pt-28">
            <div className="bg-primary-900 text-white py-16">
                <div className="container-custom">
                    <div className="flex items-center gap-3 mb-4">
                        <Shield size={32} className="text-primary-400" />
                        <h1 className="text-4xl font-bold text-white">Gizlilik Politikası</h1>
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
                        <h2>1. Veri Sorumlusu</h2>
                        <p>
                            Aquachems Kimya olarak, kişisel verilerinizin korunmasına büyük önem veriyoruz.
                            Bu gizlilik politikası, hangi verileri topladığımızı, nasıl kullandığımızı ve
                            koruduğumuzu açıklar.
                        </p>

                        <h2>2. Toplanan Veriler</h2>
                        <p>
                            Web sitemizi ziyaret ettiğinizde veya bizimle iletişime geçtiğinizde aşağıdaki
                            bilgiler toplanabilir:
                        </p>
                        <ul>
                            <li>Ad, soyad ve iletişim bilgileri</li>
                            <li>E-posta adresi ve telefon numarası</li>
                            <li>IP adresi ve tarayıcı bilgileri</li>
                            <li>Site kullanım istatistikleri</li>
                        </ul>

                        <h2>3. Verilerin Kullanım Amacı</h2>
                        <p>
                            Toplanan kişisel veriler aşağıdaki amaçlarla kullanılır:
                        </p>
                        <ul>
                            <li>Müşteri taleplerine yanıt vermek</li>
                            <li>Ürün ve hizmet bilgilendirmesi yapmak</li>
                            <li>Web sitesi performansını iyileştirmek</li>
                            <li>Yasal yükümlülükleri yerine getirmek</li>
                        </ul>

                        <h2>4. Veri Güvenliği</h2>
                        <p>
                            Kişisel verileriniz, yetkisiz erişime, kayba veya kötüye kullanıma karşı
                            teknik ve idari güvenlik önlemleri ile korunmaktadır. SSL sertifikası ve
                            şifreleme teknolojileri kullanılmaktadır.
                        </p>

                        <h2>5. Veri Paylaşımı</h2>
                        <p>
                            Kişisel verileriniz, yasal zorunluluklar dışında üçüncü taraflarla
                            paylaşılmamaktadır. İş ortaklarımız ile paylaşım yapılması durumunda,
                            verilerinizin korunması için gerekli sözleşmeler imzalanmaktadır.
                        </p>

                        <h2>6. Çerezler (Cookies)</h2>
                        <p>
                            Web sitemiz, kullanıcı deneyimini iyileştirmek için çerezler kullanmaktadır.
                            Çerez kullanımı hakkında detaylı bilgi için Çerez Politikamızı inceleyebilirsiniz.
                        </p>

                        <h2>7. Haklarınız</h2>
                        <p>
                            KVKK kapsamında aşağıdaki haklara sahipsiniz:
                        </p>
                        <ul>
                            <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
                            <li>Kişisel verileriniz işlenmişse buna ilişkin bilgi talep etme</li>
                            <li>Kişisel verilerin düzeltilmesini veya silinmesini talep etme</li>
                            <li>Kişisel verilerin aktarıldığı üçüncü kişileri bilme</li>
                        </ul>

                        <h2>8. İletişim</h2>
                        <p>
                            Gizlilik politikamız veya kişisel verileriniz hakkında sorularınız için:
                        </p>
                        <ul>
                            <li>E-posta: kvkk@aquachems.com</li>
                            <li>Telefon: 0533 683 85 63</li>
                            <li>Adres: İkitelli OSB Mah. Giyim Sanatkarları 3. Ada C Blok No:57 Başakşehir / İstanbul</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
