"use client";
import { CartProvider } from '@/context/CartContext'
import Navbar from '@/app/layout/Navbar'
import { useState } from 'react'
import { LoginModal } from '@/components/LoginModal'
import { Toaster } from 'react-hot-toast'
import { usePathname } from 'next/navigation'

export default function ClientRootLayout({ children }: { children: React.ReactNode }) {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [pendingCartItem, setPendingCartItem] = useState(null);

  const handleRequireLogin = (item: any) => {
    setPendingCartItem(item);
    setShowLoginModal(true);
  };

  function AfterCartProvider() {
    // useCart logic here if needed
    const handleLoginSuccess = () => {
      setShowLoginModal(false);
      // addToCart logic if needed
      setPendingCartItem(null);
    };
    const pathname = usePathname();
    // Hide navbar on these routes
    const hideNavbarRoutes = [
      '/checkout',
      '/order-confirmation',
      '/find-a-boutique',
      '/maison-noamani',
      '/legal/general-sales-conditions',
      '/login',
      '/signup'
    ];
    const hideNavbar = hideNavbarRoutes.includes(pathname ?? "");
    return (
      <>
        {!hideNavbar && <Navbar />}
        <main>{children}</main>
        {showLoginModal && (
          <LoginModal onClose={() => setShowLoginModal(false)} onLoginSuccess={handleLoginSuccess} />
        )}
        <Toaster position="top-right" />
        <script src="https://accounts.google.com/gsi/client" async defer></script>
        <script type="text/javascript" src="https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid.auth.js"></script>
      </>
    );
  }

  return (
    <CartProvider onRequireLogin={handleRequireLogin}>
      <AfterCartProvider />
    </CartProvider>
  );
} 