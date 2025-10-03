'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AdminSidebar } from '@/components/AdminSidebar';

interface OrderItem {
  productId: {
    _id: string;
    name: string;
    price: number;
  };
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  items: OrderItem[];
  totalAmount: number;
  status: string;
  shippingAddress: {
    name: string;
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  paymentInfo: {
    razorpayOrderId: string;
    razorpayPaymentId: string;
    status: string;
  };
  createdAt: string;
}

export default function OrdersManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [activeTab, setActiveTab] = useState('orders');
  const router = useRouter();

  useEffect(() => {
    // Check if admin is logged in
    const adminInfo = localStorage.getItem('adminInfo');
    if (!adminInfo) {
      router.push('/admin/login');
      return;
    }
    fetchOrders();
  }, [router]);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders');
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      toast.error('Error fetching orders');
    } finally {
      setIsLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error('Failed to update order status');
      }

      toast.success('Order status updated successfully');
      fetchOrders();
    } catch (error) {
      toast.error('Error updating order status');
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

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Sidebar */}
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content */}
      <div className="ml-64 p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-cyan-600 tracking-wide">Orders Management</h1>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
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
                  Total Amount
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-400">
                    Loading...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-400">
                    No orders found.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <motion.tr 
                    key={order._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="hover:bg-gray-700 transition-colors duration-200"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {order._id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {order.shippingAddress.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      ${order.totalAmount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          updateOrderStatus(order._id, e.target.value)
                        }
                        className="text-sm rounded-md border-gray-600 bg-gray-700 text-white focus:border-purple-500 focus:ring-purple-500 py-2 px-3"
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setSelectedOrder(order)}
                        className="text-blue-500 hover:text-blue-400 transition-colors duration-200"
                      >
                        View Details
                      </motion.button>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </motion.div>

        {/* Order Details Modal */}
        {selectedOrder && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedOrder(null)}
          >
            <div
              className="bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-700 text-gray-100"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-4">
                <h2 className="text-2xl font-bold text-white">Order Details</h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-400 hover:text-red-500 transition-colors duration-200 text-2xl"
                >
                  ✕
                </motion.button>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2 text-purple-400">Shipping Information</h3>
                  <p className="text-gray-300">Name: {selectedOrder.shippingAddress.name}</p>
                  <p className="text-gray-300">Street: {selectedOrder.shippingAddress.street}</p>
                  <p className="text-gray-300">City: {selectedOrder.shippingAddress.city}</p>
                  <p className="text-gray-300">State: {selectedOrder.shippingAddress.state}</p>
                  <p className="text-gray-300">ZIP Code: {selectedOrder.shippingAddress.zipCode}</p>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2 text-purple-400">Order Items</h3>
                  <table className="min-w-full divide-y divide-gray-700 rounded-lg overflow-hidden">
                    <thead className="bg-gray-700">
                      <tr>
                        <th className="text-left px-4 py-2 text-gray-300">Product</th>
                        <th className="text-left px-4 py-2 text-gray-300">Quantity</th>
                        <th className="text-left px-4 py-2 text-gray-300">Price</th>
                        <th className="text-left px-4 py-2 text-gray-300">Total</th>
                      </tr>
                    </thead>
                    <tbody className="bg-gray-800 divide-y divide-gray-700">
                      {selectedOrder.items.map((item, index) => (
                        <tr key={index} className="hover:bg-gray-700 transition-colors duration-200">
                          <td className="px-4 py-2 text-gray-300">{item.productId.name}</td>
                          <td className="px-4 py-2 text-gray-300">{item.quantity}</td>
                          <td className="px-4 py-2 text-gray-300">${item.price.toFixed(2)}</td>
                          <td className="px-4 py-2 text-gray-300">${(item.price * item.quantity).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-2 text-purple-400">Payment Information</h3>
                  <p className="text-gray-300">Order ID: {selectedOrder.paymentInfo.razorpayOrderId}</p>
                  <p className="text-gray-300">Payment ID: {selectedOrder.paymentInfo.razorpayPaymentId}</p>
                  <p className="text-gray-300">Status: {selectedOrder.paymentInfo.status}</p>
                </div>

                <div className="border-t border-gray-700 pt-4 mt-6">
                  <p className="text-2xl font-bold text-white">
                    Total Amount: ${selectedOrder.totalAmount.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
} 