'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { AdminSidebar } from '@/components/AdminSidebar';
import { formatPrice } from '@/lib/priceUtils';
import { ShoppingCart, Package, IndianRupee, TrendingUp } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

interface DashboardStats {
  totalOrders: number;
  totalProducts: number;
  totalRevenue: number;
  recentOrders: any[];
  allOrders: any[];
}

const STATUS_COLORS: Record<string, string> = {
  pending: '#eab308',
  processing: '#3b82f6',
  shipped: '#8b5cf6',
  delivered: '#22c55e',
  completed: '#22c55e',
  cancelled: '#ef4444',
};

function getStatusBadgeClass(status: string) {
  switch ((status || '').toLowerCase()) {
    case 'delivered':
    case 'completed':
      return 'bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20';
    case 'shipped':
      return 'bg-violet-500/10 text-violet-400 ring-1 ring-violet-500/20';
    case 'processing':
      return 'bg-blue-500/10 text-blue-400 ring-1 ring-blue-500/20';
    case 'cancelled':
      return 'bg-red-500/10 text-red-400 ring-1 ring-red-500/20';
    default:
      return 'bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/20';
  }
}

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    totalProducts: 0,
    totalRevenue: 0,
    recentOrders: [],
    allOrders: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const adminInfo = localStorage.getItem('adminInfo');
    if (!adminInfo) {
      router.push('/admin/login');
      return;
    }
    fetchDashboardStats();
  }, [router]);

  const fetchDashboardStats = async () => {
    try {
      const [ordersRes, productsRes] = await Promise.all([
        fetch('/api/orders'),
        fetch('/api/products'),
      ]);
      const orders = await ordersRes.json();
      const products = await productsRes.json();

      const revenue = orders.reduce((acc: number, order: any) => acc + (order.totalAmount || 0), 0);

      setStats({
        totalOrders: orders.length,
        totalProducts: products.length,
        totalRevenue: revenue,
        recentOrders: orders.slice(0, 5),
        allOrders: orders,
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const revenueTrend = useMemo(() => {
    const days: { key: string; label: string; revenue: number }[] = [];
    const today = new Date();
    for (let i = 13; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      days.push({ key, label: d.toLocaleDateString('en-US', { day: '2-digit', month: 'short' }), revenue: 0 });
    }
    const byDate = new Map(days.map((d) => [d.key, d]));
    stats.allOrders.forEach((order: any) => {
      const key = order.createdAt ? String(order.createdAt).slice(0, 10) : null;
      const bucket = key && byDate.get(key);
      if (bucket) bucket.revenue += order.totalAmount || 0;
    });
    return days;
  }, [stats.allOrders]);

  const statusBreakdown = useMemo(() => {
    const counts: Record<string, number> = {};
    stats.allOrders.forEach((order: any) => {
      const status = (order.status || 'pending').toLowerCase();
      counts[status] = (counts[status] || 0) + 1;
    });
    return Object.entries(counts).map(([status, count]) => ({ status, count }));
  }, [stats.allOrders]);

  const statCards = [
    { label: 'Total Orders', value: stats.totalOrders, icon: ShoppingCart, accent: 'text-blue-400 bg-blue-500/10' },
    { label: 'Total Products', value: stats.totalProducts, icon: Package, accent: 'text-emerald-400 bg-emerald-500/10' },
    { label: 'Total Revenue', value: formatPrice(stats.totalRevenue, 'INR'), icon: IndianRupee, accent: 'text-amber-400 bg-amber-500/10' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="ml-64 flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-white">Overview</h1>
          <p className="text-sm text-slate-400 mt-1">A summary of your store's performance</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
          {statCards.map(({ label, value, icon: Icon, accent }) => (
            <div key={label} className="bg-slate-900 border border-slate-800 rounded-xl p-6">
              <div className={`inline-flex items-center justify-center h-10 w-10 rounded-lg ${accent} mb-4`}>
                <Icon className="h-5 w-5" />
              </div>
              <p className="text-sm text-slate-400">{label}</p>
              <p className="text-3xl font-semibold text-white mt-1">
                {isLoading ? '—' : value}
              </p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-8">
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="h-4 w-4 text-slate-400" />
              <h2 className="text-sm font-medium text-slate-200">Revenue — last 14 days</h2>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={revenueTrend} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#6366f1" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="label" stroke="#64748b" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis stroke="#64748b" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={70} tickFormatter={(v) => formatPrice(v, 'INR')} />
                <Tooltip
                  contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 8, fontSize: 13 }}
                  labelStyle={{ color: '#e2e8f0' }}
                  formatter={(value: number) => [formatPrice(value, 'INR'), 'Revenue']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={2} fill="url(#revenueGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h2 className="text-sm font-medium text-slate-200 mb-6">Order status</h2>
            {statusBreakdown.length === 0 ? (
              <div className="h-[260px] flex items-center justify-center text-sm text-slate-500">No orders yet</div>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={statusBreakdown}
                    dataKey="count"
                    nameKey="status"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                  >
                    {statusBreakdown.map((entry) => (
                      <Cell key={entry.status} fill={STATUS_COLORS[entry.status] || '#64748b'} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 8, fontSize: 13 }} />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    formatter={(value) => <span className="text-slate-300 text-xs capitalize">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-800">
            <h2 className="text-sm font-medium text-slate-200">Recent orders</h2>
          </div>
          <table className="min-w-full divide-y divide-slate-800">
            <thead className="bg-slate-900/60">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-sm text-slate-500">Loading...</td>
                </tr>
              ) : stats.recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-sm text-slate-500">No orders found</td>
                </tr>
              ) : (
                stats.recentOrders.map((order: any) => (
                  <tr key={order._id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4 text-sm text-slate-300 font-mono">{order._id.slice(-8)}</td>
                    <td className="px-6 py-4 text-sm text-slate-300">{order.shippingAddress?.name || 'N/A'}</td>
                    <td className="px-6 py-4 text-sm text-slate-300">{formatPrice(order.totalAmount, 'INR')}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 inline-flex text-xs font-medium rounded-full capitalize ${getStatusBadgeClass(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
