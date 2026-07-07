"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Receipt,
  BarChart3,
  UserCircle,
  LogOut,
  ShieldCheck,
} from 'lucide-react';

interface AdminSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const navItems = [
  { key: 'overview', href: '/admin/dashboard', label: 'Overview', icon: LayoutDashboard },
  { key: 'products', href: '/admin/products', label: 'Products', icon: Package },
  { key: 'orders', href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  { key: 'transactions', href: '/admin/transactions', label: 'Transactions', icon: Receipt },
  { key: 'analytics', href: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { key: 'security', href: '/admin/security', label: 'Security', icon: ShieldCheck },
];

export function AdminSidebar({ activeTab, setActiveTab }: AdminSidebarProps) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
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
    <div className="fixed inset-y-0 left-0 w-64 flex flex-col bg-slate-950 border-r border-slate-800">
      <div className="h-16 flex items-center gap-2.5 px-6 border-b border-slate-800">
        <Image src="/Brand_logo/nlogo-dark.png" alt="" width={24} height={24} className="shrink-0" />
        <span className="text-white font-semibold text-lg tracking-tight">Noamani</span>
        <span className="ml-1 text-xs font-medium text-slate-500 uppercase tracking-wide">Admin</span>
      </div>

      <nav className="flex-1 py-4 px-3 space-y-0.5">
        {navItems.map(({ key, href, label, icon: Icon }) => {
          const isActive = activeTab === key;
          return (
            <Link
              key={key}
              href={href}
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
              }`}
            >
              <Icon className="h-[18px] w-[18px]" strokeWidth={2} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-slate-800 space-y-1">
        <Link
          href="/admin/profile"
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            activeTab === 'profile'
              ? 'bg-slate-800 text-white'
              : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
          }`}
        >
          <UserCircle className="h-[18px] w-[18px]" strokeWidth={2} />
          Profile
        </Link>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:bg-red-950 hover:text-red-400 transition-colors"
        >
          <LogOut className="h-[18px] w-[18px]" strokeWidth={2} />
          Logout
        </button>
      </div>
    </div>
  );
}
