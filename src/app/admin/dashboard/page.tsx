'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { AdminSidebar } from '@/components/AdminSidebar';
import { useCountry } from '@/hooks/useCountry';
import { formatPrice } from '@/lib/priceUtils';

interface DashboardStats {
  totalOrders: number;
  totalProducts: number;
  totalRevenue: number;
  recentOrders: any[];
}

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    totalProducts: 0,
    totalRevenue: 0,
    recentOrders: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const { country } = useCountry();

  useEffect(() => {
    // Check if admin is logged in
    const adminInfo = localStorage.getItem('adminInfo');
    if (!adminInfo) {
      router.push('/admin/login');
      return;
    }

    fetchDashboardStats();
  }, [router]);

  const fetchDashboardStats = async () => {
    try {
      // Fetch orders
      const ordersRes = await fetch('/api/orders');
      const orders = await ordersRes.json();
      
      // Fetch products
      const productsRes = await fetch('/api/products');
      const products = await productsRes.json();

      // Calculate stats
      const revenue = orders.reduce((acc: number, order: any) => acc + order.totalAmount, 0);
      
      setStats({
        totalOrders: orders.length,
        totalProducts: products.length,
        totalRevenue: revenue,
        recentOrders: orders.slice(0, 5) // Get 5 most recent orders
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem('adminInfo');
      router.push('/');
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex">
      {/* Sidebar */}
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="ml-64 p-8 flex-1"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <motion.div
            whileHover={{ y: -5, scale: 1.02 }}
            transition={{ duration: 0.2 }}
            className="bg-gradient-to-br from-purple-700 to-indigo-800 p-6 rounded-xl shadow-lg relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-full bg-black opacity-10 rounded-xl"></div>
            <h3 className="text-lg font-semibold text-white mb-2 relative z-10">Total Orders</h3>
            <p className="text-4xl font-bold text-white relative z-10">
              {isLoading ? 'Loading...' : stats.totalOrders}
            </p>
          </motion.div>
          <motion.div
            whileHover={{ y: -5, scale: 1.02 }}
            transition={{ duration: 0.2 }}
            className="bg-gradient-to-br from-green-600 to-teal-700 p-6 rounded-xl shadow-lg relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-full bg-black opacity-10 rounded-xl"></div>
            <h3 className="text-lg font-semibold text-white mb-2 relative z-10">Total Products</h3>
            <p className="text-4xl font-bold text-white relative z-10">
              {isLoading ? 'Loading...' : stats.totalProducts}
            </p>
          </motion.div>
          <motion.div
            whileHover={{ y: -5, scale: 1.02 }}
            transition={{ duration: 0.2 }}
            className="bg-gradient-to-br from-orange-600 to-red-700 p-6 rounded-xl shadow-lg relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-full bg-black opacity-10 rounded-xl"></div>
            <h3 className="text-lg font-semibold text-white mb-2 relative z-10">Total Revenue</h3>
            <p className="text-4xl font-bold text-white relative z-10">
              {isLoading ? 'Loading...' : formatPrice(stats.totalRevenue, country)}
            </p>
          </motion.div>
        </div>

        <div className="mt-8">
          <h2 className="text-3xl font-bold text-gray-200 mb-6">Recent Orders</h2>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700"
          >
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {isLoading ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-center text-gray-400">
                      Loading...
                    </td>
                  </tr>
                ) : stats.recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-4 text-center text-gray-400">
                      No orders found
                    </td>
                  </tr>
                ) : (
                  stats.recentOrders.map((order: any) => (
                    <tr key={order._id} className="hover:bg-gray-700 transition-colors duration-200">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {order._id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {order.shippingAddress?.name || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {formatPrice(order.totalAmount, country)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
} 