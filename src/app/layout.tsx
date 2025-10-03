import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import ClientRootLayout from './ClientRootLayout'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Noamani-Perfumes',
  description: 'Your one-stop shop for luxury perfumes',
  icons: {
    icon: [
      { url: '/Brand_logo/nlogo.png', sizes: '192x192', type: 'image/png' },
      { url: '/Brand_logo/nlogo.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: '/Brand_logo/nlogo.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientRootLayout>{children}</ClientRootLayout>
      </body>
    </html>
  )
}