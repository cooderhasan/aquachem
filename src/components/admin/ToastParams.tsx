"use client";

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'sonner';

export default function ToastParams() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const success = searchParams.get('success');
        const error = searchParams.get('error');

        if (success) {
            toast.success(success);
            // URL'i temizle ama sayfa yenileme
            const params = new URLSearchParams(searchParams.toString());
            params.delete('success');
            router.replace(`${pathname}?${params.toString()}`);
        }

        if (error) {
            toast.error(error);
            const params = new URLSearchParams(searchParams.toString());
            params.delete('error');
            router.replace(`${pathname}?${params.toString()}`);
        }
    }, [searchParams, router, pathname]);

    return null;
}
