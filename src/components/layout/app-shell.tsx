
'use client';
import { usePathname } from 'next/navigation';
import { Footer } from './footer';
import { Header } from './header';

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const noHeaderFooterRoutes = [
    '/subscriptions/add',
    '/subhub/checkout',
    '/subscriptions/receipt',
  ];
  
  const showHeaderFooter = !noHeaderFooterRoutes.some(path => pathname.startsWith(path));


  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto bg-background shadow-lg">
      {showHeaderFooter && <Header />}
      <main className="flex-grow">
        {children}
      </main>
      {showHeaderFooter && <Footer />}
    </div>
  );
}

    