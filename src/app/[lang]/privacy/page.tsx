import React from 'react';
import { Shield, Calendar } from 'lucide-react';
import { getMainContactLocation } from '@/app/admin/contact/actions';
import { Locale } from '@/lib/i18n';
import { Metadata } from 'next';

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ lang: Locale }> }): Promise<Metadata> {
    const { lang } = await params;
    return {
        title: lang === 'en' ? 'Privacy Policy' : 'Gizlilik Politikası',
        description: lang === 'en' 
            ? 'Aquachems privacy policy regarding your personal data.' 
            : 'Kişisel verilerinizin korunması ile ilgili Aquachems gizlilik politikası.',
    };
}

export default async function PrivacyPage({ params }: { params: Promise<{ lang: Locale }> }) {
    const { lang } = await params;
    const icAnadoluLocation = await getMainContactLocation();

    if (lang === 'en') {
        return (
            <div className="bg-white min-h-screen pb-20 pt-28">
                <div className="bg-primary-900 text-white py-16">
                    <div className="container-custom">
                        <div className="flex items-center gap-3 mb-4">
                            <Shield size={32} className="text-primary-400" />
                            <h1 className="text-4xl font-bold text-white">Privacy Policy</h1>
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
                            <h2>1. Data Controller</h2>
                            <p>
                                As Aquachems Chemistry, we place great importance on protecting your personal data.
                                This privacy policy explains what data we collect, how we use and protect it.
                            </p>

                            <h2>2. Data Collected</h2>
                            <p>
                                When you visit our website or contact us, the following information may be collected:
                            </p>
                            <ul>
                                <li>Name, surname, and contact details</li>
                                <li>Email address and phone number</li>
                                <li>IP address and browser information</li>
                                <li>Website usage statistics</li>
                            </ul>

                            <h2>3. Purpose of Using Data</h2>
                            <p>
                                Collected personal data is used for the following purposes:
                            </p>
                            <ul>
                                <li>Responding to customer inquiries</li>
                                <li>Providing product and service information</li>
                                <li>Improving website performance</li>
                                <li>Fulfilling legal obligations</li>
                            </ul>

                            <h2>4. Data Security</h2>
                            <p>
                                Your personal data is protected against unauthorized access, loss, or misuse
                                with technical and administrative security measures. SSL certificates and
                                encryption technologies are used.
                            </p>

                            <h2>5. Data Sharing</h2>
                            <p>
                                Your personal data is not shared with third parties except for legal obligations.
                                In cases where sharing is done with our business partners, necessary contracts
                                are signed for the protection of your data.
                            </p>

                            <h2>6. Cookies</h2>
                            <p>
                                Our website uses cookies to improve the user experience.
                                You can review our Cookie Policy for detailed information on cookie usage.
                            </p>

                            <h2>7. Your Rights</h2>
                            <p>
                                Within the scope of personal data protection regulations (GDPR/KVKK), you have the following rights:
                            </p>
                            <ul>
                                <li>Learning whether your personal data is processed</li>
                                <li>Requesting information if your personal data is processed</li>
                                <li>Requesting the correction or deletion of personal data</li>
                                <li>Knowing the third parties to whom personal data is transferred</li>
                            </ul>

                            <h2>8. Contact</h2>
                            <p>
                                For questions about our privacy policy or your personal data:
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
