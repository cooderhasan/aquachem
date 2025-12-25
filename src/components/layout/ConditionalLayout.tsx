"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';

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

    return (
        <>
            {!isAuthPage && <Header settings={settings} />}
            {children}
            {!isAuthPage && <Footer settings={settings} contactLocation={contactLocation} />}
        </>
    );
};

export default ConditionalLayout;

