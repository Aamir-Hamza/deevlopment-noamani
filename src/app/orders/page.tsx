"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ShoppingBagIcon } from "@heroicons/react/24/outline";
import LazyLoader from '@/components/ui/LazyLoader';

export default function OrdersPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userInfo = localStorage.getItem("userInfo");
      const adminInfo = localStorage.getItem("adminInfo");
      if (userInfo) {
        setUser(JSON.parse(userInfo));
      } else if (adminInfo) {
        setUser({ ...JSON.parse(adminInfo), isAdmin: true });
      } else {
        router.replace("/auth/login");
      }
    }
  }, [router]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.email) return;
      setLoading(true);
      try {
        const res = await fetch(`/api/orders?userEmail=${encodeURIComponent(user.email)}`);
        const data = await res.json();
        setOrders(data || []);
      } catch (err) {
        setOrders([]);
      }
      setLoading(false);
    };
    if (user?.email) fetchOrders();
  }, [user]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><LazyLoader /></div>;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f2027] via-[#2c5364] to-[#f5d365] flex flex-col items-center justify-start p-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="mt-40 bg-white/40 backdrop-blur-2xl rounded-3xl shadow-2xl p-10 max-w-2xl w-full border-2 border-gold-400 drop-shadow-2xl"
        style={{ boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)' }}
      >
        <div className="flex items-center gap-3 mb-10">
          <ShoppingBagIcon className="h-10 w-10 text-gold-500 drop-shadow" />
          <h2 className="text-3xl font-extrabold text-gold-700 tracking-wide drop-shadow">Order History</h2>
        </div>
        {orders.length === 0 ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-gray-900 text-lg font-semibold"
          >
            You have no orders yet.
          </motion.p>
        ) : (
          <div className="space-y-8">
            {orders
              .slice()
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .map((order, idx) => (
                <motion.div
                  key={order._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white/80 rounded-2xl p-6 shadow-xl border-2 border-gold-200 hover:scale-[1.03] hover:shadow-2xl transition-transform duration-200"
                  style={{ boxShadow: '0 4px 24px 0 rgba(218, 165, 32, 0.10)' }}
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-3">
                    <div className="flex flex-col md:flex-row md:items-center gap-3">
                      <span className="font-bold text-gold-600 text-lg tracking-wide">Order #{order._id}</span>
                      <span className="text-gray-700 text-base font-medium">
                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }) + ' ' + new Date(order.createdAt).toLocaleTimeString() : ''}
                      </span>
                    </div>
                    <span className={`px-4 py-1 rounded-full text-sm font-bold shadow-md tracking-wide ${order.status === "completed" ? "bg-green-500 text-white" : order.status === "processing" ? "bg-blue-500 text-white" : "bg-yellow-400 text-black"}`}>{order.status}</span>
                  </div>
                  <div className="flex flex-wrap gap-3 mb-3">
                    {order.items && order.items.map((item: any, i: number) => (
                      <span key={i} className="bg-gold-100/90 text-gray-900 px-4 py-1 rounded-full text-sm font-semibold shadow">
                        {item.productId?.name || item.name} x{item.quantity || item.qty}
                      </span>
                    ))}
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-2xl font-extrabold text-gold-600 drop-shadow">₹{order.totalAmount}</span>
                    <span className="text-base text-gray-700 font-semibold">Total</span>
                  </div>
                </motion.div>
              ))}
          </div>
        )}
      </motion.div>
    </div>
  );
} 