'use client'

// import { AuthProvider } from '@/context/AuthContext'
import { CartProvider } from '@/context/CartContext'
import Navbar from '@/app/layout/Navbar'
import Footer from '@/components/Footer'
import { Toaster } from 'react-hot-toast'
import { usePathname } from 'next/navigation'

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <>{children}</>
  )
} 