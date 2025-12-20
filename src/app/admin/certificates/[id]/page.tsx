
import React from 'react';
import { notFound } from 'next/navigation';
import CertificateForm from '../CertificateForm';
import { getCertificate } from '../actions';

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

export const dynamic = 'force-dynamic';

export default async function EditCertificatePage({ params }: PageProps) {
    const resolvedParams = await params;

    // Ensure id is parsed as a number safely
    const id = parseInt(resolvedParams.id, 10);

    if (isNaN(id)) {
        notFound();
    }

    const certificate = await getCertificate(id);

    if (!certificate) {
        notFound();
    }

    // Convert potential null description to empty string or keep as is if form handles null
    return <CertificateForm initialData={{
        ...certificate,
        description: certificate.description ?? ''
    }} />;
}
