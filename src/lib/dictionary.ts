import { Locale } from './i18n';

export interface Dictionary {
    // Navigation
    nav: {
        home: string;
        products: string;
        corporate: string;
        references: string;
        certificates: string;
        contact: string;
        humanResources: string;
        news: string;
        career: string;
    };

    // Header
    header: {
        getQuote: string;
        getQuoteMobile: string;
        search: string;
        openMenu: string;
        closeMenu: string;
    };

    // Footer
    footer: {
        quickLinks: string;
        productGroups: string;
        contact: string;
        rights: string;
        codedBy: string;
        termsOfUse: string;
        privacyPolicy: string;
        cookiePolicy: string;
        description: string;
    };

    // Common
    common: {
        readMore: string;
        contactUs: string;
        getQuote: string;
        browseProducts: string;
        noData: string;
        mapNotFound: string;
        close: string;
        ok: string;
    };

    // Products page
    products: {
        pageTitle: string;
        pageSubtitle: string;
        browseProducts: string;
        noCategories: string;
    };

    // Corporate page
    corporate: {
        pageTitle: string;
        aboutUs: string;
        aboutUsNotAdded: string;
        mission: string;
        missionNotAdded: string;
        vision: string;
        visionNotAdded: string;
        humanPolicy: string;
        humanPolicyNotAdded: string;
        qualityStandards: string;
        descriptionFallback: string;
    };

    // Contact page
    contact: {
        pageTitle: string;
        pageDescription: string;
        formTitle: string;
        name: string;
        email: string;
        subject: string;
        message: string;
        send: string;
        sending: string;
        successMessage: string;
        errorMessage: string;
        noContactInfo: string;
    };

    // References page
    references: {
        pageTitle: string;
        pageDescription: string;
        noReferences: string;
    };

    // Certificates page
    certificates: {
        pageTitle: string;
        pageDescription: string;
        noCertificates: string;
    };

    // Human Resources page
    humanResources: {
        pageTitle: string;
        pageDescription: string;
        applyNow: string;
        uploadCV: string;
        position: string;
        phone: string;
        applying: string;
        successMessage: string;
        errorMessage: string;
    };

    // Career page
    career: {
        pageTitle: string;
        pageDescription: string;
    };

    // News page
    news: {
        pageTitle: string;
        pageDescription: string;
        noNews: string;
        readMore: string;
    };

    // Quote Modal
    quote: {
        title: string;
        subtitle: string;
        name: string;
        namePlaceholder: string;
        company: string;
        companyPlaceholder: string;
        email: string;
        emailPlaceholder: string;
        phone: string;
        phonePlaceholder: string;
        quantityNote: string;
        quantityPlaceholder: string;
        submit: string;
        submitting: string;
        successTitle: string;
        successMessage: string;
        errorDefault: string;
        errorConnection: string;
        requiredNote: string;
    };

    // Hero
    hero: {
        prevSlide: string;
        nextSlide: string;
    };

    // SEO
    seo: {
        homeTitle: string;
        homeDescription: string;
        productsTitle: string;
        productsDescription: string;
        corporateTitle: string;
        corporateDescription: string;
        contactTitle: string;
        contactDescription: string;
        referencesTitle: string;
        certificatesTitle: string;
    };
}

const dictionaries: Record<Locale, Dictionary> = {
    tr: {
        nav: {
            home: 'Ana Sayfa',
            products: 'Ürünler',
            corporate: 'Kurumsal',
            references: 'Referanslar',
            certificates: 'Belgelerimiz',
            contact: 'İletişim',
            humanResources: 'İnsan Kaynakları',
            news: 'Haberler',
            career: 'Kariyer',
        },
        header: {
            getQuote: 'Teklif Al',
            getQuoteMobile: 'Teklif İsteyin',
            search: 'Arama Yap',
            openMenu: 'Menüyü aç',
            closeMenu: 'Menüyü kapat',
        },
        footer: {
            quickLinks: 'Hızlı Erişim',
            productGroups: 'Ürün Grupları',
            contact: 'İletişim',
            rights: 'Tüm hakları saklıdır.',
            codedBy: 'Coded by',
            termsOfUse: 'Kullanım Şartları',
            privacyPolicy: 'Gizlilik Politikası',
            cookiePolicy: 'Çerez Politikası',
            description: 'Endüstriyel temizlik ve hijyen çözümlerinde yenilikçi yaklaşımlarımızla, işletmenizin verimliliğini artırıyor ve sürdürülebilir bir gelecek için çalışıyoruz.',
        },
        common: {
            readMore: 'Devamını Oku',
            contactUs: 'Bize Ulaşın',
            getQuote: 'Teklif Al',
            browseProducts: 'Ürünleri İncele',
            noData: 'Veri bulunamadı.',
            mapNotFound: 'Harita bulunamadı',
            close: 'Kapat',
            ok: 'Tamam',
        },
        products: {
            pageTitle: 'Ürün Grupları',
            pageSubtitle: 'İncelemek istediğiniz ürün grubunu seçiniz.',
            browseProducts: 'Ürünleri İncele',
            noCategories: 'Henüz kategori eklenmemiş.',
        },
        corporate: {
            pageTitle: 'Kurumsal',
            aboutUs: 'Hakkımızda',
            aboutUsNotAdded: 'Hakkımızda yazısı henüz eklenmedi.',
            mission: 'Misyonumuz',
            missionNotAdded: 'Misyon yazısı henüz eklenmedi.',
            vision: 'Vizyonumuz',
            visionNotAdded: 'Vizyon yazısı henüz eklenmedi.',
            humanPolicy: 'İnsan Kaynakları Politikamız',
            humanPolicyNotAdded: 'İnsan kaynakları politikası henüz eklenmedi.',
            qualityStandards: 'Kalite Standartları',
            descriptionFallback: 'Aquachems olarak endüstriyel çözümlerimizle değer katıyoruz.',
        },
        contact: {
            pageTitle: 'İletişim',
            pageDescription: 'Sorularınız, önerileriniz veya işbirliği talepleriniz için bize ulaşın.',
            formTitle: 'İletişim Formu',
            name: 'Adınız Soyadınız',
            email: 'E-posta Adresiniz',
            subject: 'Konu',
            message: 'Mesajınız',
            send: 'Gönder',
            sending: 'Gönderiliyor...',
            successMessage: 'Mesajınız başarıyla gönderildi. En kısa sürede dönüş yapacağız.',
            errorMessage: 'Bir hata oluştu.',
            noContactInfo: 'İletişim bilgisi bulunamadı.',
        },
        references: {
            pageTitle: 'Referanslar',
            pageDescription: 'Birlikte çalıştığımız firmalar ve projeler.',
            noReferences: 'Henüz referans eklenmemiş.',
        },
        certificates: {
            pageTitle: 'Belgelerimiz',
            pageDescription: 'Kalite ve uyumluluk sertifikalarımız.',
            noCertificates: 'Henüz belge eklenmemiş.',
        },
        humanResources: {
            pageTitle: 'İnsan Kaynakları',
            pageDescription: 'Aramıza katılmak için başvurunuzu yapın.',
            applyNow: 'Başvur',
            uploadCV: 'CV Yükle',
            position: 'Başvurulan Pozisyon',
            phone: 'Telefon',
            applying: 'Gönderiliyor...',
            successMessage: 'Başvurunuz alındı. En kısa sürede size dönüş yapacağız.',
            errorMessage: 'Bir hata oluştu. Lütfen tekrar deneyin.',
        },
        career: {
            pageTitle: 'Kariyer',
            pageDescription: 'Aquachems ailesine katılın.',
        },
        news: {
            pageTitle: 'Haberler',
            pageDescription: 'Aquachems\'ten son haberler ve duyurular.',
            noNews: 'Henüz haber eklenmemiş.',
            readMore: 'Devamını Oku',
        },
        quote: {
            title: 'Teklif Talebi',
            subtitle: 'Formu doldurun, en kısa sürede dönelim',
            name: 'Ad Soyad',
            namePlaceholder: 'Ahmet Yılmaz',
            company: 'Şirket Adı',
            companyPlaceholder: 'Firma Adı A.Ş.',
            email: 'E-posta',
            emailPlaceholder: 'ahmet@firma.com',
            phone: 'Telefon',
            phonePlaceholder: '0532 000 00 00',
            quantityNote: 'Miktar / Açıklama',
            quantityPlaceholder: 'İhtiyaç duyduğunuz miktar, kullanım alanı veya özel notlarınız...',
            submit: 'Teklif Talebi Gönder',
            submitting: 'Gönderiliyor...',
            successTitle: 'Talebiniz Alındı!',
            successMessage: 'En kısa sürede ekibimiz sizi arayacak veya e-posta ile dönüş yapacak.',
            errorDefault: 'Bir hata oluştu.',
            errorConnection: 'Bağlantı hatası. Lütfen tekrar deneyin.',
            requiredNote: '* ile işaretli alanlar zorunludur. Bilgileriniz gizli tutulur.',
        },
        hero: {
            prevSlide: 'Önceki slayt',
            nextSlide: 'Sonraki slayt',
        },
        seo: {
            homeTitle: 'Aquachems - İnsana ve Doğaya Saygılı Üretim',
            homeDescription: 'Aquachems, çevre bilinci ve insan sağlığını ön planda tutan kimyasal üretim çözümleri sunar.',
            productsTitle: 'Ürün Grupları',
            productsDescription: 'Aquachems endüstriyel ve bireysel ürün gruplarını inceleyin.',
            corporateTitle: 'Kurumsal',
            corporateDescription: 'Aquachems hakkında bilgi edinin. Misyonumuz, vizyonumuz ve insan kaynakları politikamız.',
            contactTitle: 'İletişim',
            contactDescription: 'Aquachems ile iletişime geçin.',
            referencesTitle: 'Referanslar',
            certificatesTitle: 'Belgelerimiz',
        },
    },

    en: {
        nav: {
            home: 'Home',
            products: 'Products',
            corporate: 'Corporate',
            references: 'References',
            certificates: 'Certificates',
            contact: 'Contact',
            humanResources: 'Human Resources',
            news: 'News',
            career: 'Career',
        },
        header: {
            getQuote: 'Get a Quote',
            getQuoteMobile: 'Request a Quote',
            search: 'Search',
            openMenu: 'Open menu',
            closeMenu: 'Close menu',
        },
        footer: {
            quickLinks: 'Quick Links',
            productGroups: 'Product Groups',
            contact: 'Contact',
            rights: 'All rights reserved.',
            codedBy: 'Coded by',
            termsOfUse: 'Terms of Use',
            privacyPolicy: 'Privacy Policy',
            cookiePolicy: 'Cookie Policy',
            description: 'With our innovative approaches in industrial cleaning and hygiene solutions, we improve your business efficiency and work towards a sustainable future.',
        },
        common: {
            readMore: 'Read More',
            contactUs: 'Contact Us',
            getQuote: 'Get a Quote',
            browseProducts: 'Browse Products',
            noData: 'No data found.',
            mapNotFound: 'Map not found',
            close: 'Close',
            ok: 'OK',
        },
        products: {
            pageTitle: 'Product Groups',
            pageSubtitle: 'Select the product group you want to explore.',
            browseProducts: 'Browse Products',
            noCategories: 'No categories added yet.',
        },
        corporate: {
            pageTitle: 'Corporate',
            aboutUs: 'About Us',
            aboutUsNotAdded: 'About us section not added yet.',
            mission: 'Our Mission',
            missionNotAdded: 'Mission statement not added yet.',
            vision: 'Our Vision',
            visionNotAdded: 'Vision statement not added yet.',
            humanPolicy: 'Human Resources Policy',
            humanPolicyNotAdded: 'Human resources policy not added yet.',
            qualityStandards: 'Quality Standards',
            descriptionFallback: 'At Aquachems, we add value with our industrial solutions.',
        },
        contact: {
            pageTitle: 'Contact',
            pageDescription: 'Contact us for your questions, suggestions or cooperation requests.',
            formTitle: 'Contact Form',
            name: 'Full Name',
            email: 'Email Address',
            subject: 'Subject',
            message: 'Your Message',
            send: 'Send',
            sending: 'Sending...',
            successMessage: 'Your message has been sent successfully. We will get back to you as soon as possible.',
            errorMessage: 'An error occurred.',
            noContactInfo: 'No contact information found.',
        },
        references: {
            pageTitle: 'References',
            pageDescription: 'Companies and projects we have worked with.',
            noReferences: 'No references added yet.',
        },
        certificates: {
            pageTitle: 'Certificates',
            pageDescription: 'Our quality and compliance certificates.',
            noCertificates: 'No certificates added yet.',
        },
        humanResources: {
            pageTitle: 'Human Resources',
            pageDescription: 'Apply to join our team.',
            applyNow: 'Apply',
            uploadCV: 'Upload CV',
            position: 'Position Applied For',
            phone: 'Phone',
            applying: 'Sending...',
            successMessage: 'Your application has been received. We will get back to you as soon as possible.',
            errorMessage: 'An error occurred. Please try again.',
        },
        career: {
            pageTitle: 'Career',
            pageDescription: 'Join the Aquachems family.',
        },
        news: {
            pageTitle: 'News',
            pageDescription: 'Latest news and announcements from Aquachems.',
            noNews: 'No news added yet.',
            readMore: 'Read More',
        },
        quote: {
            title: 'Quote Request',
            subtitle: 'Fill out the form and we will get back to you soon',
            name: 'Full Name',
            namePlaceholder: 'John Doe',
            company: 'Company Name',
            companyPlaceholder: 'Company Name Inc.',
            email: 'Email',
            emailPlaceholder: 'john@company.com',
            phone: 'Phone',
            phonePlaceholder: '+1 (555) 000-0000',
            quantityNote: 'Quantity / Description',
            quantityPlaceholder: 'Required quantity, usage area or special notes...',
            submit: 'Send Quote Request',
            submitting: 'Sending...',
            successTitle: 'Request Received!',
            successMessage: 'Our team will call you or reply via email as soon as possible.',
            errorDefault: 'An error occurred.',
            errorConnection: 'Connection error. Please try again.',
            requiredNote: 'Fields marked with * are required. Your information is kept confidential.',
        },
        hero: {
            prevSlide: 'Previous slide',
            nextSlide: 'Next slide',
        },
        seo: {
            homeTitle: 'Aquachems - Respectful Production for People and Nature',
            homeDescription: 'Aquachems provides chemical production solutions that prioritize environmental awareness and human health.',
            productsTitle: 'Product Groups',
            productsDescription: 'Explore Aquachems industrial and consumer product groups.',
            corporateTitle: 'Corporate',
            corporateDescription: 'Learn about Aquachems. Our mission, vision and human resources policy.',
            contactTitle: 'Contact',
            contactDescription: 'Get in touch with Aquachems.',
            referencesTitle: 'References',
            certificatesTitle: 'Certificates',
        },
    },
};

export function getDictionary(locale: Locale): Dictionary {
    return dictionaries[locale] || dictionaries.tr;
}
