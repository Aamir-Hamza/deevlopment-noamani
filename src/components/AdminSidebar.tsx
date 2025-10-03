"use client";

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { useCountry } from '@/hooks/useCountry';
import Image from 'next/image';
import locationGif from '/public/icon/location.gif';

interface AdminSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export function AdminSidebar({ activeTab, setActiveTab }: AdminSidebarProps) {
  const router = useRouter();
  const { country, setCountry } = useCountry();
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const earthRef = useRef<HTMLDivElement>(null);
  const countryList = [
    { code: 'US', flag: '/America.jpg', label: 'America' },
    { code: 'EU', flag: '/Europe.webp', label: 'Europe' },
    { code: 'ME', flag: '/Middle-east.jpg', label: 'Middle East' },
    { code: 'IN', flag: '/India.jpg', label: 'India' },
  ];

  const handleCountrySelect = (code: string) => {
    setCountry(code);
    localStorage.setItem('selectedCountry', code);
    setShowCountryDropdown(false);
    window.dispatchEvent(new Event('countryChange'));
  };

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (earthRef.current && !earthRef.current.contains(event.target as Node)) {
        setShowCountryDropdown(false);
      }
    }
    if (showCountryDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showCountryDropdown]);

  const handleLogout = () => {
    try {
      localStorage.removeItem('adminInfo');
      window.dispatchEvent(new Event('adminLogout'));
      router.push('/');
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout');
    }
  };

  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
      className="fixed w-64 h-full bg-gray-800 shadow-lg flex flex-col border-r border-gray-700 bg-gradient-to-b from-gray-800 to-gray-900"
    >
      <div className="p-6 border-b border-gray-700 flex flex-col items-center">
        <div className="flex flex-col items-center mb-2 w-full">
          <div className="flex items-center justify-center gap-3 w-full">
            <span className="relative flex items-center justify-center">
              <motion.button
                className="rounded-full p-2 bg-gray-900 border-2 border-cyan-400 shadow-lg"
                aria-label="Select country"
                onClick={() => setShowCountryDropdown((v) => !v)}
                style={{ outline: country ? '2px solid #FFD700' : undefined }}
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
              >
                <Image src={locationGif} alt="Location" width={44} height={44} className="rounded-full animate-glow object-cover" />
              </motion.button>
              {showCountryDropdown && (
                <div className="absolute left-0 right-0 top-full mt-3 mx-auto flex flex-col items-center z-50 bg-gray-900/95 rounded-2xl shadow-2xl p-4 border border-cyan-400 w-60" style={{ transform: 'none' }}>
                  <div className="flex gap-4 mb-2 flex-row flex-nowrap overflow-x-auto w-full justify-start">
                    {countryList.map((c) => (
                      <button
                        key={c.code}
                        onClick={() => handleCountrySelect(c.code)}
                        className={`rounded-full border-2 ${country === c.code ? 'border-yellow-400' : 'border-white'} p-1 bg-white shadow-lg transition-all`}
                        style={{ width: 44, height: 44 }}
                      >
                        <Image src={c.flag} alt={c.label} width={38} height={38} className="rounded-full object-cover" />
                      </button>
                    ))}
                  </div>
                  <span className="text-xs text-cyan-200 font-semibold tracking-wide">Select your country</span>
                </div>
              )}
            </span>
            <div className="flex flex-col items-start ml-2">
              <span className="admin-luxury-heading">Admin</span>
              <span className="panel-luxury-subheading">Panel</span>
            </div>
          </div>
        </div>
        <span className="text-xs text-cyan-200 font-semibold tracking-wide bg-gray-900/60 px-3 py-1 rounded-full shadow mt-1">Country-based pricing active</span>
      </div>
      <nav className="mt-6 flex-1 space-y-2 px-4">
        <Link
          href="/admin/dashboard"
          className={`relative flex items-center px-4 py-3 rounded-lg transition-all duration-300 group overflow-hidden 
            ${activeTab === 'overview' ? 'bg-purple-600 text-white shadow-lg before:absolute before:inset-0 before:bg-gradient-to-r before:from-purple-500 before:to-pink-500 before:z-0 before:opacity-75 before:scale-x-105 before:rounded-lg' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}
          `}
          onClick={() => setActiveTab('overview')}
        >
          <span className="mr-3 text-lg group-hover:scale-110 transition-transform relative z-10">📊</span>
          <span className="relative z-10">Overview</span>
        </Link>
        <Link
          href="/admin/products"
          className={`relative flex items-center px-4 py-3 rounded-lg transition-all duration-300 group overflow-hidden 
            ${activeTab === 'products' ? 'bg-purple-600 text-white shadow-lg before:absolute before:inset-0 before:bg-gradient-to-r before:from-purple-500 before:to-pink-500 before:z-0 before:opacity-75 before:scale-x-105 before:rounded-lg' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}
          `}
          onClick={() => setActiveTab('products')}
        >
          <span className="mr-3 text-lg group-hover:scale-110 transition-transform relative z-10">📦</span>
          <span className="relative z-10">Products</span>
        </Link>
        <Link
          href="/admin/orders"
          className={`relative flex items-center px-4 py-3 rounded-lg transition-all duration-300 group overflow-hidden 
            ${activeTab === 'orders' ? 'bg-purple-600 text-white shadow-lg before:absolute before:inset-0 before:bg-gradient-to-r before:from-purple-500 before:to-pink-500 before:z-0 before:opacity-75 before:scale-x-105 before:rounded-lg' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}
          `}
          onClick={() => setActiveTab('orders')}
        >
          <span className="mr-3 text-lg group-hover:scale-110 transition-transform relative z-10">🛒</span>
          <span className="relative z-10">Orders</span>
        </Link>
        <Link
          href="/admin/transactions"
          className={`relative flex items-center px-4 py-3 rounded-lg transition-all duration-300 group overflow-hidden 
            ${activeTab === 'transactions' ? 'bg-purple-600 text-white shadow-lg before:absolute before:inset-0 before:bg-gradient-to-r before:from-purple-500 before:to-pink-500 before:z-0 before:opacity-75 before:scale-x-105 before:rounded-lg' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}
          `}
          onClick={() => setActiveTab('transactions')}
        >
          <span className="mr-3 text-lg group-hover:scale-110 transition-transform relative z-10">💸</span>
          <span className="relative z-10">Transactions</span>
        </Link>
        <Link
          href="/admin/analytics"
          className={`relative flex items-center px-4 py-3 rounded-lg transition-all duration-300 group overflow-hidden 
            ${activeTab === 'analytics' ? 'bg-purple-600 text-white shadow-lg before:absolute before:inset-0 before:bg-gradient-to-r before:from-purple-500 before:to-pink-500 before:z-0 before:opacity-75 before:scale-x-105 before:rounded-lg' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}
          `}
          onClick={() => setActiveTab('analytics')}
        >
          <span className="mr-3 text-lg group-hover:scale-110 transition-transform relative z-10">📊</span>
          <span className="relative z-10">Analytics</span>
        </Link>
      </nav>
      <div className="mt-auto p-4 border-t border-gray-700">
        <Link href="/" className="block mb-4">
          <button
            className="w-full flex items-center justify-center gap-3 py-3 px-5 rounded-2xl bg-gradient-to-r from-blue-500 via-pink-500 to-yellow-400 text-white font-extrabold text-xl shadow-xl transition-all duration-200 hover:scale-105 hover:shadow-[0_0_24px_4px_rgba(255,193,7,0.25)] hover:ring-4 hover:ring-pink-200 focus:outline-none focus:ring-4 focus:ring-pink-300 border-2 border-transparent hover:border-yellow-400"
            style={{ letterSpacing: '0.05em' }}
          >
            <span className="text-3xl drop-shadow">🏠</span>
            <span className="tracking-wide">Home</span>
          </button>
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center px-4 py-3 rounded-lg text-gray-300 bg-gray-700 hover:bg-red-600 hover:text-white transition-colors duration-300 group"
        >
          <span className="mr-2 text-lg group-hover:scale-110 transition-transform">➡️</span>
          Logout
        </button>
      </div>
    </motion.div>
  );
} 