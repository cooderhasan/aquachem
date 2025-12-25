"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';
import WhatsAppButton from './WhatsAppButton';

interface ContactLocation {
    id: number;
    title: string;
    address: string;
    phone: string | null;
    email: string | null;
}

interface ConditionalLayoutProps {
    children: React.ReactNode;
    settings?: any;
    contactLocation?: ContactLocation | null;
}

const ConditionalLayout = ({ children, settings, contactLocation }: ConditionalLayoutProps) => {
    const pathname = usePathname();
    const isAuthPage = pathname?.startsWith('/admin') || pathname?.startsWith('/login');

    // WhatsApp telefon numarasını settings'ten al veya varsayılan kullan
    const whatsappNumber = settings?.whatsappNumber || contactLocation?.phone?.replace(/\D/g, '') || "905551234567";

    return (
        <>
            {!isAuthPage && <Header settings={settings} />}
            {children}
            {!isAuthPage && <Footer settings={settings} contactLocation={contactLocation} />}
            {!isAuthPage && <WhatsAppButton phoneNumber={whatsappNumber} />}
        </>
    );
};

export default ConditionalLayout;

