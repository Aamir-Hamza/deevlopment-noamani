'use client'

import { CartProvider } from '@/context/CartContext'
import Navbar from './layout/Navbar'
import Footer from '@/components/Footer'
import { usePathname } from 'next/navigation'

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return <>{children}</>;
} 