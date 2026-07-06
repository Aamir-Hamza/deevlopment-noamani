"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts";
import { AdminSidebar } from "@/components/AdminSidebar";
import { formatPrice } from "@/lib/priceUtils";
import { Users, Package, ShoppingCart, IndianRupee } from "lucide-react";

export default function AnalyticsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('analytics');
  const [userCount, setUserCount] = useState(0);
  const [productCount, setProductCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [revenue, setRevenue] = useState(0);
  const [productSales, setProductSales] = useState<any[]>([]);
  const [salesTrend, setSalesTrend] = useState<any[]>([]);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const adminInfo = localStorage.getItem('adminInfo');
    if (!adminInfo) {
      router.push('/admin/login');
      return;
    }

    async function fetchData() {
      setLoading(true);
      const [usersRes, productsRes, ordersRes] = await Promise.all([
        fetch("/api/users"),
        fetch("/api/products"),
        fetch("/api/orders"),
      ]);
      const users = await usersRes.json();
      const products = await productsRes.json();
      const orders = await ordersRes.json();

      setUserCount(Array.isArray(users) ? users.length : 0);
      setProductCount(products.length);
      setOrderCount(orders.length);

      let totalRevenue = 0;
      const salesMap: Record<string, number> = {};
      const salesTrendMap: Record<string, number> = {};
      const today = new Date();
      for (let i = 6; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        salesTrendMap[d.toISOString().slice(0, 10)] = 0;
      }
      orders.forEach((order: any) => {
        totalRevenue += order.totalAmount || 0;
        (order.items || []).forEach((item: any) => {
          const pid = item.productId?._id || item.productId || item._id;
          salesMap[pid] = (salesMap[pid] || 0) + (item.quantity || 1);
        });
        const dateKey = order.createdAt ? String(order.createdAt).slice(0, 10) : null;
        if (dateKey && salesTrendMap[dateKey] !== undefined) {
          salesTrendMap[dateKey] += 1;
        }
      });
      setRevenue(totalRevenue);

      const productSalesArr = products
        .map((p: any) => ({ name: p.name, sales: salesMap[p._id] || 0 }))
        .sort((a: any, b: any) => b.sales - a.sales)
        .slice(0, 8);
      setProductSales(productSalesArr);

      setSalesTrend(Object.entries(salesTrendMap).map(([date, sales]) => ({ date: date.slice(5), sales })));
      setRecentOrders(orders.slice(-5).reverse());
      setLoading(false);
    }
    fetchData();
  }, [router]);

  const statCards = [
    { label: 'Total Users', value: userCount, icon: Users, accent: 'text-indigo-400 bg-indigo-500/10' },
    { label: 'Total Products', value: productCount, icon: Package, accent: 'text-emerald-400 bg-emerald-500/10' },
    { label: 'Total Orders', value: orderCount, icon: ShoppingCart, accent: 'text-blue-400 bg-blue-500/10' },
    { label: 'Total Revenue', value: formatPrice(revenue, 'INR'), icon: IndianRupee, accent: 'text-amber-400 bg-amber-500/10' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="ml-64 flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-white">Analytics</h1>
          <p className="text-sm text-slate-400 mt-1">Product performance and sales trends</p>
        </div>

        {loading ? (
          <div className="h-64 flex items-center justify-center text-slate-500 text-sm">Loading analytics…</div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
              {statCards.map(({ label, value, icon: Icon, accent }) => (
                <div key={label} className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                  <div className={`inline-flex items-center justify-center h-10 w-10 rounded-lg ${accent} mb-4`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <p className="text-sm text-slate-400">{label}</p>
                  <p className="text-2xl font-semibold text-white mt-1">{value}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-8">
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <h2 className="text-sm font-medium text-slate-200 mb-6">Top selling products</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={productSales} margin={{ top: 0, right: 0, left: 0, bottom: 30 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis
                      dataKey="name"
                      stroke="#64748b"
                      tick={{ fontSize: 11, fill: '#94a3b8' }}
                      interval={0}
                      angle={-30}
                      textAnchor="end"
                      height={60}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis stroke="#64748b" tick={{ fontSize: 12, fill: '#94a3b8' }} allowDecimals={false} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 8, fontSize: 13 }} cursor={{ fill: 'rgba(99,102,241,0.08)' }} />
                    <Bar dataKey="sales" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                <h2 className="text-sm font-medium text-slate-200 mb-6">Orders — last 7 days</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={salesTrend} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis dataKey="date" stroke="#64748b" tick={{ fontSize: 12, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                    <YAxis stroke="#64748b" tick={{ fontSize: 12, fill: '#94a3b8' }} allowDecimals={false} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: 8, fontSize: 13 }} />
                    <Line type="monotone" dataKey="sales" stroke="#22c55e" strokeWidth={2} dot={{ r: 3, fill: '#22c55e' }} activeDot={{ r: 5 }} />
                  </LineChart>
                </ResponsiveContainer>
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
                  {recentOrders.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-8 text-center text-sm text-slate-500">No orders found</td>
                    </tr>
                  ) : (
                    recentOrders.map((order) => (
                      <tr key={order._id} className="hover:bg-slate-800/50 transition-colors">
                        <td className="px-6 py-4 text-sm text-slate-300 font-mono">{order._id.slice(-8)}</td>
                        <td className="px-6 py-4 text-sm text-slate-300">{order.shippingAddress?.name || '-'}</td>
                        <td className="px-6 py-4 text-sm text-slate-300">{formatPrice(order.totalAmount, 'INR')}</td>
                        <td className="px-6 py-4">
                          <span className="px-2.5 py-1 inline-flex text-xs font-medium rounded-full capitalize bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/20">
                            {order.status || '-'}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
