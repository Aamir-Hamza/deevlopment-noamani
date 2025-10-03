"use client";

import { useState, useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line, CartesianGrid, LabelList } from "recharts";
import { motion } from "framer-motion";
import { FaUsers, FaBoxOpen, FaShoppingCart, FaRupeeSign } from "react-icons/fa";
import clsx from "clsx";

const COLORS = ["#FFD700", "#FF69B4", "#8A2BE2", "#00BFFF", "#FF6347", "#32CD32", "#FFB6C1", "#7B68EE"];

export default function AnalyticsPage() {
  const [userCount, setUserCount] = useState(0);
  const [productCount, setProductCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [revenue, setRevenue] = useState(0);
  const [productSales, setProductSales] = useState<any[]>([]);
  const [salesTrend, setSalesTrend] = useState<any[]>([]);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      // Fetch users
      const usersRes = await fetch("/api/users");
      const users = await usersRes.json();
      setUserCount(users.length);
      // Fetch products
      const productsRes = await fetch("/api/products");
      const products = await productsRes.json();
      setProductCount(products.length);
      // Fetch orders
      const ordersRes = await fetch("/api/orders");
      const orders = await ordersRes.json();
      console.log("ORDERS_DEBUG:", orders);
      setOrderCount(orders.length);
      // Revenue calculation
      let totalRevenue = 0;
      let salesMap: Record<string, number> = {};
      let salesTrendMap: Record<string, number> = {};
      const today = new Date();
      // Last 7 days
      for (let i = 6; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        const key = d.toISOString().slice(0, 10);
        salesTrendMap[key] = 0;
      }
      orders.forEach((order: any) => {
        totalRevenue += order.totalAmount || 0;
        (order.items || []).forEach((item: any) => {
          const pid = item.productId?._id || item.productId || item._id;
          if (!salesMap[pid]) salesMap[pid] = 0;
          salesMap[pid] += item.quantity || 1;
        });
        // Sales trend by date
        const dateKey = order.createdAt ? order.createdAt.slice(0, 10) : null;
        if (dateKey && salesTrendMap[dateKey] !== undefined) {
          salesTrendMap[dateKey] += 1;
        }
      });
      setRevenue(totalRevenue);
      // Product sales breakdown
      const productSalesArr = products.map((p: any) => ({
        name: p.name,
        sales: salesMap[p._id] || 0,
      })).sort((a: any, b: any) => b.sales - a.sales);
      setProductSales(productSalesArr);
      // Sales trend array
      const salesTrendArr = Object.entries(salesTrendMap).map(([date, sales]) => ({
        date: date.slice(5),
        sales,
      }));
      setSalesTrend(salesTrendArr);
      // Recent orders
      setRecentOrders(orders.slice(-5).reverse());
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-3xl font-playfair text-yellow-400 animate-pulse">Loading analytics...</div>;
  }

  // Enhanced RotatedTick for crisp, clear text
  const EnhancedRotatedTick = (props: any) => {
    const { x, y, payload } = props;
    return (
      <g>
        <title>{payload.value}</title>
        <foreignObject x={x - 40} y={y + 10} width={80} height={40} style={{ overflow: 'visible' }}>
          <div style={{
            transform: 'rotate(-35deg)',
            fontSize: 14,
            color: '#FFD700',
            fontFamily: 'Playfair Display, serif',
            fontWeight: 700,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: 70,
            cursor: 'pointer',
            textShadow: 'none', // Remove blur
            filter: 'none', // Remove any filter
          }} title={payload.value}>
            {payload.value.length > 11 ? payload.value.slice(0, 10) + '…' : payload.value}
          </div>
        </foreignObject>
      </g>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black p-8">
      <motion.h1
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="text-5xl font-playfair font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-500 drop-shadow-lg mb-10 text-center tracking-tight animate-text-float"
      >
        Admin Analytics Dashboard
      </motion.h1>
      {/* Luxury Animated Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.7, type: "spring" }}
          className="bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-500 rounded-3xl shadow-2xl p-8 flex flex-col items-center justify-center hover:scale-105 transition-transform duration-300 cursor-pointer relative overflow-hidden"
        >
          <FaUsers className="text-4xl text-white mb-2 animate-bounce" />
          <span className="text-5xl font-extrabold text-white mb-2 luxury-shimmer" style={{textShadow: 'none', filter: 'none', color: '#fff', fontWeight: 900, opacity: 1}}>
            {userCount}
          </span>
          <span className="text-lg font-semibold text-white tracking-wide">Total Users</span>
        </motion.div>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.7, type: "spring" }}
          className="bg-gradient-to-r from-purple-500 via-pink-400 to-yellow-400 rounded-3xl shadow-2xl p-8 flex flex-col items-center justify-center hover:scale-105 transition-transform duration-300 cursor-pointer relative overflow-hidden"
        >
          <FaBoxOpen className="text-4xl text-white mb-2 animate-bounce" />
          <span className="text-5xl font-extrabold text-white mb-2 luxury-shimmer" style={{textShadow: 'none', filter: 'none', color: '#fff', fontWeight: 900, opacity: 1}}>
            {productCount}
          </span>
          <span className="text-lg font-semibold text-white tracking-wide">Total Products</span>
        </motion.div>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.7, type: "spring" }}
          className="bg-gradient-to-r from-pink-400 via-yellow-400 to-purple-500 rounded-3xl shadow-2xl p-8 flex flex-col items-center justify-center hover:scale-105 transition-transform duration-300 cursor-pointer relative overflow-hidden"
        >
          <FaShoppingCart className="text-4xl text-white mb-2 animate-bounce" />
          <span className="text-5xl font-extrabold text-white mb-2 luxury-shimmer" style={{textShadow: 'none', filter: 'none', color: '#fff', fontWeight: 900, opacity: 1}}>
            {orderCount}
          </span>
          <span className="text-lg font-semibold text-white tracking-wide">Total Orders</span>
        </motion.div>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.7, type: "spring" }}
          className="bg-gradient-to-r from-purple-500 via-yellow-400 to-pink-400 rounded-3xl shadow-2xl p-8 flex flex-col items-center justify-center hover:scale-105 transition-transform duration-300 cursor-pointer relative overflow-hidden"
        >
          <FaRupeeSign className="text-4xl text-white mb-2 animate-bounce" />
          <span className="text-5xl font-extrabold text-white mb-2 luxury-shimmer" style={{textShadow: 'none', filter: 'none', color: '#FFD700', fontWeight: 900, opacity: 1}}>
            ₹{revenue}
          </span>
          <span className="text-lg font-semibold text-white tracking-wide">Total Revenue</span>
        </motion.div>
      </div>
      {/* Graphs Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
        {/* Bar Chart: Top/Least Selling Products */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8, type: "spring" }}
          className={clsx(
            "relative overflow-visible rounded-3xl p-8 shadow-2xl backdrop-blur-xl",
            "bg-gradient-to-br from-gray-900/80 via-purple-900/80 to-black/80",
            "border-4 border-transparent",
            "before:absolute before:inset-0 before:rounded-3xl before:border-4 before:border-yellow-400/40 before:animate-gold-shimmer before:pointer-events-none before:z-10",
            "after:absolute after:inset-0 after:rounded-3xl after:bg-gradient-to-br after:from-yellow-400/10 after:via-pink-400/10 after:to-purple-500/10 after:blur-lg after:z-0"
          )}
        >
          <div className="flex items-center justify-center mb-2 gap-2">
            <span className="text-4xl animate-bounce drop-shadow-lg">🏆</span>
            <h2 className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-500 bg-clip-text text-transparent tracking-tight animate-text-float luxury-shimmer" style={{textShadow: 'none', filter: 'none', color: '#FFD700', WebkitTextStroke: '0.5px #fffbe6'}}>
              Product Sales (Top & Least)
            </h2>
          </div>
          <div className="h-1 w-28 mx-auto bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-500 rounded-full shimmer-underline mb-8"></div>
          <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-yellow-400/60 scrollbar-track-transparent" style={{paddingBottom: 8}}>
            <div style={{ minWidth: Math.max(600, productSales.length * 60) }}>
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={productSales} margin={{ left: 0, right: 0, top: 20, bottom: 40 }} barCategoryGap={40} barGap={12}>
                  <XAxis dataKey="name" stroke="#FFD700" tick={<EnhancedRotatedTick />} interval={0} height={60} tickLine={{stroke: '#FFD700', strokeWidth: 2}} />
                  <YAxis stroke="#FFD700" tick={{ fontSize: 15, fontFamily: 'Playfair Display, serif', fill: '#FFD700', fontWeight: 700 }} allowDecimals={false} axisLine={{ stroke: '#FFD700', strokeWidth: 2 }} tickLine={{ stroke: '#FFD700', strokeWidth: 2 }} />
                  <CartesianGrid strokeDasharray="3 3" stroke="#FFD70022" />
                  <Tooltip contentStyle={{ background: 'rgba(34,34,34,0.98)', color: '#FFD700', borderRadius: 18, fontFamily: 'Playfair Display, serif', fontWeight: 900, fontSize: 18, border: '2px solid #FFD700', boxShadow: '0 4px 24px #FFD70044', padding: 12, textShadow: 'none', filter: 'none' }} cursor={{ fill: 'rgba(255,215,0,0.10)' }} />
                  <Bar dataKey="sales">
                    {productSales.map((entry, idx) => {
                      let fill = '#FFD700';
                      let filter = '';
                      if (idx === 0) { fill = 'url(#goldBar)'; filter = 'drop-shadow(0 0 12px #FFD70088)'; }
                      else if (idx === 1) { fill = 'url(#silverBar)'; filter = 'drop-shadow(0 0 8px #C0C0C088)'; }
                      else if (idx === 2) { fill = 'url(#bronzeBar)'; filter = 'drop-shadow(0 0 6px #cd7f32AA)'; }
                      return <Cell key={entry.name} fill={fill} style={{ filter }} />;
                    })}
                    <defs>
                      <linearGradient id="goldBar" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#fffbe6" />
                        <stop offset="100%" stopColor="#FFD700" />
                      </linearGradient>
                      <linearGradient id="silverBar" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#f8f8f8" />
                        <stop offset="100%" stopColor="#C0C0C0" />
                      </linearGradient>
                      <linearGradient id="bronzeBar" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#fff0d0" />
                        <stop offset="100%" stopColor="#cd7f32" />
                      </linearGradient>
                    </defs>
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>
        {/* Line Chart: Sales Trend */}
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.8, type: "spring" }}
          className="bg-gradient-to-br from-gray-900/80 via-pink-900/80 to-black/80 rounded-3xl shadow-2xl p-8 backdrop-blur-md border border-pink-400/30"
        >
          <h2 className="text-3xl md:text-4xl font-extrabold text-pink-400 drop-shadow-lg text-center mb-2">
            <span className="inline-block align-middle mr-2">📈</span>
            Sales Trend (Last 7 Days)
          </h2>
          <div className="h-1 w-24 mx-auto bg-gradient-to-r from-pink-400 via-yellow-400 to-purple-500 rounded-full shimmer-underline mb-6"></div>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={salesTrend} margin={{ top: 20, right: 30, left: 0, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#FFD70033" />
              <XAxis dataKey="date" stroke="#FF69B4" tick={{ fontSize: 15, fontFamily: 'Playfair Display, serif', fill: '#FF69B4', fontWeight: 700 }} interval={0} height={60} />
              <YAxis stroke="#FF69B4" tick={{ fontSize: 15, fontFamily: 'Playfair Display, serif', fill: '#FF69B4', fontWeight: 700 }} allowDecimals={false} />
              <Tooltip contentStyle={{ background: 'rgba(34,34,34,0.95)', color: '#FF69B4', borderRadius: 16, fontFamily: 'Playfair Display, serif', fontWeight: 700, fontSize: 16, border: '1px solid #FF69B4' }} cursor={{ fill: 'rgba(255,105,180,0.08)' }} />
              <Line type="monotone" dataKey="sales" stroke="#FFD700" strokeWidth={4} dot={{ r: 8, fill: '#fffbe6', stroke: '#FFD700', strokeWidth: 4, filter: 'drop-shadow(0 0 8px #FFD700)' }} activeDot={{ r: 12, fill: '#FF69B4', stroke: '#FFD700', strokeWidth: 4, filter: 'drop-shadow(0 0 16px #FF69B4)' }} isAnimationActive={true} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
      {/* Recent Orders Table */}
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1, duration: 0.8, type: "spring" }}
        className="bg-gray-900/90 rounded-3xl shadow-2xl p-8 mt-8"
      >
        <h2 className="text-2xl font-playfair font-bold text-pink-400 mb-6 text-center tracking-wide shimmer-underline">Recent Orders</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-white text-lg font-playfair">
            <thead>
              <tr className="border-b border-pink-400">
                <th className="py-3 px-4 text-left">Order ID</th>
                <th className="py-3 px-4 text-left">Customer</th>
                <th className="py-3 px-4 text-left">Amount</th>
                <th className="py-3 px-4 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order, idx) => (
                <tr key={order._id} className="border-b border-gray-700 hover:bg-pink-900/20 transition-colors">
                  <td className="py-2 px-4 font-mono text-yellow-200">{order._id}</td>
                  <td className="py-2 px-4">{order.customerName || order.customer || order.user?.name || "-"}</td>
                  <td className="py-2 px-4 text-green-300 font-bold">₹{order.amount}</td>
                  <td className="py-2 px-4">
                    <span className="inline-block px-3 py-1 rounded-full bg-yellow-400 text-gray-900 font-bold text-xs tracking-wide shadow animate-pulse">
                      {order.status || "-"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
} 