'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import { AdminSidebar } from '@/components/AdminSidebar';
import { formatPrice } from '@/lib/priceUtils';

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

function getStatusBadgeClass(status: string) {
  switch ((status || '').toLowerCase()) {
    case 'completed':
    case 'delivered':
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

export default function OrdersManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [activeTab, setActiveTab] = useState('orders');
  const router = useRouter();

  useEffect(() => {
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
        method: 'PUT',
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

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="ml-64 flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-white">Orders</h1>
          <p className="text-sm text-slate-400 mt-1">Manage and track customer orders</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <table className="min-w-full divide-y divide-slate-800">
            <thead className="bg-slate-900/60">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-sm text-slate-500">Loading...</td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-sm text-slate-500">No orders found.</td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order._id} className="hover:bg-slate-800/50 transition-colors">
                    <td className="px-6 py-4 text-sm text-slate-300 font-mono">{order._id.slice(-8)}</td>
                    <td className="px-6 py-4 text-sm text-slate-300">{order.shippingAddress.name}</td>
                    <td className="px-6 py-4 text-sm text-slate-300">{formatPrice(order.totalAmount, 'INR')}</td>
                    <td className="px-6 py-4">
                      <select
                        value={order.status}
                        onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                        className={`text-xs font-medium rounded-full pl-2.5 pr-7 py-1 border-0 focus:outline-none focus:ring-2 focus:ring-indigo-500 capitalize ${getStatusBadgeClass(order.status)}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-400">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
                      >
                        View details
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {selectedOrder && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedOrder(null)}
          >
            <div
              className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center px-6 py-4 border-b border-slate-800">
                <h2 className="text-lg font-semibold text-white">Order details</h2>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-slate-500 hover:text-slate-300 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Shipping information</h3>
                  <div className="text-sm text-slate-300 space-y-1">
                    <p>{selectedOrder.shippingAddress.name}</p>
                    <p>{selectedOrder.shippingAddress.street}</p>
                    <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state} {selectedOrder.shippingAddress.zipCode}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Order items</h3>
                  <table className="min-w-full divide-y divide-slate-800 rounded-lg overflow-hidden">
                    <thead className="bg-slate-800/60">
                      <tr>
                        <th className="text-left px-4 py-2 text-xs font-medium text-slate-400">Product</th>
                        <th className="text-left px-4 py-2 text-xs font-medium text-slate-400">Qty</th>
                        <th className="text-left px-4 py-2 text-xs font-medium text-slate-400">Price</th>
                        <th className="text-left px-4 py-2 text-xs font-medium text-slate-400">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {selectedOrder.items.map((item, index) => (
                        <tr key={index}>
                          <td className="px-4 py-2 text-sm text-slate-300">{item.productId?.name}</td>
                          <td className="px-4 py-2 text-sm text-slate-300">{item.quantity}</td>
                          <td className="px-4 py-2 text-sm text-slate-300">{formatPrice(item.price, 'INR')}</td>
                          <td className="px-4 py-2 text-sm text-slate-300">{formatPrice(item.price * item.quantity, 'INR')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div>
                  <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-2">Payment information</h3>
                  <div className="text-sm text-slate-300 space-y-1">
                    <p>Order ID: <span className="font-mono text-slate-400">{selectedOrder.paymentInfo?.razorpayOrderId}</span></p>
                    <p>Payment ID: <span className="font-mono text-slate-400">{selectedOrder.paymentInfo?.razorpayPaymentId}</span></p>
                    <p>Status: {selectedOrder.paymentInfo?.status}</p>
                  </div>
                </div>

                <div className="border-t border-slate-800 pt-4 flex justify-between items-center">
                  <span className="text-sm text-slate-400">Total amount</span>
                  <span className="text-xl font-semibold text-white">{formatPrice(selectedOrder.totalAmount, 'INR')}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
