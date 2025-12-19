"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';

interface ConditionalLayoutProps {
    children: React.ReactNode;
    settings?: any; // Define a proper type if possible, or use 'any' for now to match current state
}

const ConditionalLayout = ({ children, settings }: ConditionalLayoutProps) => {
    const pathname = usePathname();
    const isAuthPage = pathname?.startsWith('/admin') || pathname?.startsWith('/login');

    return (
        <>
            {!isAuthPage && <Header settings={settings} />}
            {children}
            {!isAuthPage && <Footer settings={settings} />}
        </>
    );
};

export default ConditionalLayout;
