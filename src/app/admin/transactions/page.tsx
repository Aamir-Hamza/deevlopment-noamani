'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { formatDistance, format } from 'date-fns';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { AdminSidebar } from '@/components/AdminSidebar';

interface Transaction {
  _id: string;
  totalAmount: number;
  paymentInfo: {
    razorpayOrderId: string;
    razorpayPaymentId: string;
    status: string;
    method: string;
    email: string;
    contact: string;
    cardNetwork?: string;
    cardLast4?: string;
    cardIssuer?: string;
    amountRefunded: number;
    refundStatus: string;
    transactionTime: string;
    currency: string;
  };
  shippingAddress: {
    name: string;
  };
  createdAt: string;
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [activeTab, setActiveTab] = useState('transactions');
  const router = useRouter();

  useEffect(() => {
    // Check if admin is logged in
    const adminInfo = localStorage.getItem('adminInfo');
    if (!adminInfo) {
      router.push('/admin/login');
      return;
    }
    fetchTransactions();
  }, [router]);

  const fetchTransactions = async () => {
    try {
      const response = await fetch('/api/transactions');
      const data = await response.json();
      setTransactions(data);
    } catch (error) {
      toast.error('Error fetching transactions');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'success':
      case 'captured':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (date: string) => {
    try {
      return format(new Date(date), 'PPpp');
    } catch (error) {
      return 'Invalid date';
    }
  };

  const getTimeAgo = (date: string) => {
    try {
      return formatDistance(new Date(date), new Date(), { addSuffix: true });
    } catch (error) {
      return 'Unknown time';
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
          <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 tracking-wide">Payment Transactions</h1>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700"
        >
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    Transaction ID
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
                      Loading transactions...
                    </td>
                  </tr>
                ) : transactions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-gray-400">
                      No transactions found
                    </td>
                  </tr>
                ) : (
                  transactions.map((transaction) => (
                    <motion.tr 
                      key={transaction._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="hover:bg-gray-700 transition-colors duration-200"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {transaction.paymentInfo.razorpayPaymentId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {transaction.shippingAddress.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {transaction.paymentInfo.currency} {transaction.totalAmount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(transaction.paymentInfo.status)}`}>
                          {transaction.paymentInfo.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                        <span title={formatDate(transaction.paymentInfo.transactionTime)}>
                          {getTimeAgo(transaction.paymentInfo.transactionTime)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setSelectedTransaction(transaction)}
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
          </div>
        </motion.div>

        {/* Transaction Details Modal */}
        {selectedTransaction && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedTransaction(null)}
          >
            <div
              className="bg-gray-800 p-8 rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-gray-700 text-gray-100"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-4">
                <h2 className="text-2xl font-bold text-white">Transaction Details</h2>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSelectedTransaction(null)}
                  className="text-gray-400 hover:text-red-500 transition-colors duration-200 text-2xl"
                >
                  ✕
                </motion.button>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-300">Payment ID</h3>
                    <p className="mt-1 text-gray-400">{selectedTransaction.paymentInfo.razorpayPaymentId}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-300">Order ID</h3>
                    <p className="mt-1 text-gray-400">{selectedTransaction.paymentInfo.razorpayOrderId}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-300">Amount</h3>
                    <p className="mt-1 text-gray-400">{selectedTransaction.paymentInfo.currency} {selectedTransaction.totalAmount.toFixed(2)}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-300">Status</h3>
                    <p className={`mt-1 inline-flex px-3 py-1 text-sm rounded-full ${getStatusColor(selectedTransaction.paymentInfo.status)}`}>
                      {selectedTransaction.paymentInfo.status}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-300">Payment Method</h3>
                    <p className="mt-1 text-gray-400">{selectedTransaction.paymentInfo.method || 'N/A'}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-300">Date & Time</h3>
                    <p className="mt-1 text-gray-400">{formatDate(selectedTransaction.paymentInfo.transactionTime)}</p>
                  </div>
                </div>

                {selectedTransaction.paymentInfo.cardNetwork && (
                  <div className="border-t border-gray-700 pt-4 mt-6">
                    <h3 className="text-lg font-medium mb-2 text-purple-400">Card Details</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-300">Card Network</h4>
                        <p className="mt-1 text-gray-400">{selectedTransaction.paymentInfo.cardNetwork}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-300">Last 4 Digits</h4>
                        <p className="mt-1 text-gray-400">****{selectedTransaction.paymentInfo.cardLast4}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-300">Card Issuer</h4>
                        <p className="mt-1 text-gray-400">{selectedTransaction.paymentInfo.cardIssuer || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                )}

                {selectedTransaction.paymentInfo.refundStatus !== 'none' && (
                  <div className="border-t border-gray-700 pt-4 mt-6">
                    <h3 className="text-lg font-medium mb-2 text-purple-400">Refund Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-300">Refund Status</h4>
                        <p className="mt-1 text-gray-400">{selectedTransaction.paymentInfo.refundStatus}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-300">Amount Refunded</h4>
                        <p className="mt-1 text-gray-400">{selectedTransaction.paymentInfo.currency} {selectedTransaction.paymentInfo.amountRefunded.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="border-t border-gray-700 pt-4 mt-6">
                  <h3 className="text-lg font-medium mb-2 text-purple-400">Customer Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-300">Name</h4>
                      <p className="mt-1 text-gray-400">{selectedTransaction.shippingAddress.name}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-300">Email</h4>
                      <p className="mt-1 text-gray-400">{selectedTransaction.paymentInfo.email || 'N/A'}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-300">Contact</h4>
                      <p className="mt-1 text-gray-400">{selectedTransaction.paymentInfo.contact || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
} 