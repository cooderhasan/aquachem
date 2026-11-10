import type { Metadata } from 'next';
import '../globals.css';
import { bodyClassName } from '../fonts';
import AdminShell from './AdminShell';

// Admin pages read the DB and the session cookie on every request; never prerender them.
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Aquachems Yönetim Paneli',
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className={bodyClassName}>
        <AdminShell>{children}</AdminShell>
      </body>
    </html>
  );
}
