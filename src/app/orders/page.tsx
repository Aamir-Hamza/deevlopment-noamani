"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, ArrowLeft } from "lucide-react";
import LazyLoader from '@/components/ui/LazyLoader';
import ProductImage from '@/components/ui/ProductImage';

const STATUS_STYLES: Record<string, string> = {
  completed: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  processing: "bg-blue-50 text-blue-700 border border-blue-200",
  cancelled: "bg-red-50 text-red-700 border border-red-200",
};
const STATUS_DEFAULT = "bg-amber-50 text-amber-700 border border-amber-200";

export default function OrdersPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<any[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userInfo = localStorage.getItem("userInfo");
      const adminInfo = localStorage.getItem("adminInfo");
      if (userInfo) {
        setUser(JSON.parse(userInfo));
      } else if (adminInfo) {
        setUser({ ...JSON.parse(adminInfo), isAdmin: true });
      } else {
        router.replace("/login");
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

  const sortedOrders = orders
    .slice()
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const availableStatuses = Array.from(new Set(sortedOrders.map((o) => o.status).filter(Boolean)));
  const filteredOrders = statusFilter === "all" ? sortedOrders : sortedOrders.filter((o) => o.status === statusFilter);

  return (
    <div className="min-h-screen">
      {/* Hero Section — matches /shop, /bestsellers, /gifts */}
      <div className="relative h-[40vh] bg-black text-white flex items-center justify-center">
        <Image
          src="https://images.pexels.com/photos/3910071/pexels-photo-3910071.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
          alt="Order History"
          fill
          className="object-cover opacity-40"
        />
        <div className="relative z-10 text-center px-4">
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-5xl font-light mb-4 tracking-wide"
          >
            ORDER HISTORY
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-lg font-light"
          >
            {sortedOrders.length > 0 ? `${sortedOrders.length} order${sortedOrders.length === 1 ? "" : "s"} on file` : "Every order, in one place"}
          </motion.p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-16">
        {sortedOrders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center py-8"
          >
            <ShoppingBag className="mx-auto h-24 w-24 text-gray-300 mb-6" />
            <h2 className="text-3xl font-light mb-4">No orders yet</h2>
            <p className="text-gray-500 mb-8">Once you place an order, it will show up here</p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Continue Shopping
            </Link>
          </motion.div>
        ) : (
          <>
            {availableStatuses.length > 1 && (
              <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-1">
                {["all", ...availableStatuses].map((status) => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide whitespace-nowrap transition-colors ${
                      statusFilter === status
                        ? "bg-black text-white"
                        : "bg-gray-50 text-gray-600 border border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    {status === "all" ? `All (${sortedOrders.length})` : status}
                  </button>
                ))}
              </div>
            )}

            <div className="space-y-5">
              {filteredOrders.map((order, idx) => (
                <motion.div
                  key={order._id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.06 }}
                  className="border border-gray-200 rounded-xl p-6 hover:border-gray-300 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3">
                      <span className="font-semibold text-gray-900 tracking-wide">
                        Order #{order._id.slice(-8).toUpperCase()}
                      </span>
                      <span className="text-gray-500 text-sm">
                        {order.createdAt
                          ? new Date(order.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
                          : ''}
                      </span>
                    </div>
                    <span className={`self-start sm:self-auto px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide ${STATUS_STYLES[order.status] || STATUS_DEFAULT}`}>
                      {order.status}
                    </span>
                  </div>

                  {order.items?.length > 0 && (
                    <div className="flex flex-wrap gap-3 mb-4">
                      {order.items.map((item: any, i: number) => (
                        <div key={i} className="flex items-center gap-2.5 bg-gray-50 border border-gray-100 rounded-full pl-1.5 pr-3 py-1.5">
                          <div className="relative w-7 h-7 rounded-full overflow-hidden bg-white flex-shrink-0">
                            <ProductImage
                              src={item.productId?.image}
                              alt={item.productId?.name || item.name || 'Product'}
                              fill
                              compact
                              className="object-contain p-0.5"
                            />
                          </div>
                          <span className="text-gray-700 text-sm">
                            {item.productId?.name || item.name} × {item.quantity || item.qty}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                    <span className="text-sm text-gray-500">Total</span>
                    <span className="text-xl font-semibold text-gray-900">₹{order.totalAmount}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
