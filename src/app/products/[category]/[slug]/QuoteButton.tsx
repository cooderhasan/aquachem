'use client';

import React, { useState } from 'react';
import { FileText } from 'lucide-react';
import QuoteModal from '@/components/shared/QuoteModal';

interface QuoteButtonProps {
    productName: string;
}

export default function QuoteButton({ productName }: QuoteButtonProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-xl font-bold transition-all active:scale-95 text-center flex-1 md:flex-none flex items-center gap-2 justify-center"
            >
                <FileText size={18} />
                Teklif İste
            </button>
            <QuoteModal
                isOpen={isOpen}
                onClose={() => setIsOpen(false)}
                productName={productName}
            />
        </>
    );
}
