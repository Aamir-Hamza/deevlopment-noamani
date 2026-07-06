"use client";
import { CartProvider } from '@/context/CartContext'
import { LanguageProvider } from '@/context/LanguageContext'
import { AuthModalProvider, useAuthModal } from '@/context/AuthModalContext'
import Navbar from '@/app/layout/Navbar'
import { useEffect } from 'react'
import { LoginModal } from '@/components/LoginModal'
import { Toaster } from 'react-hot-toast'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

// Hide navbar on these routes
const hideNavbarRoutes = [
  '/checkout',
  '/order-confirmation',
  '/find-a-boutique',
  '/maison-noamani',
  '/legal/general-sales-conditions',
];

function RootShell({ children }: { children: React.ReactNode }) {
  const { isOpen, mode, openAuthModal, closeAuthModal } = useAuthModal();
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Lets any page open the auth modal via `?authModal=login|signup|forgot`
  // (used by pages that used to redirect to the now-removed /login, /signup, /forgot-password routes)
  useEffect(() => {
    const requested = searchParams.get('authModal');
    if (requested === 'login' || requested === 'signup' || requested === 'forgot') {
      openAuthModal(requested);
      const params = new URLSearchParams(searchParams.toString());
      params.delete('authModal');
      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname ?? '/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const hideNavbar = hideNavbarRoutes.includes(pathname ?? "");

  return (
    <>
      {!hideNavbar && <Navbar />}
      <main>{children}</main>
      {isOpen && <LoginModal initialMode={mode} onClose={closeAuthModal} />}
      <Toaster position="top-center" />
      <script src="https://accounts.google.com/gsi/client" async defer></script>
    </>
  );
}

function CartProviderWithModal({ children }: { children: React.ReactNode }) {
  const { openAuthModal } = useAuthModal();
  return (
    <CartProvider onRequireLogin={() => openAuthModal('login')}>
      <RootShell>{children}</RootShell>
    </CartProvider>
  );
}

export default function ClientRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <AuthModalProvider>
        <CartProviderWithModal>{children}</CartProviderWithModal>
      </AuthModalProvider>
    </LanguageProvider>
  );
}
