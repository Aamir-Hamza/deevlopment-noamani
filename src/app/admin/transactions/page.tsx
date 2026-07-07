'use client';

import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { formatDistance, format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';
import { AdminSidebar } from '@/components/AdminSidebar';
import { useAdminSessionGuard } from '@/lib/useAdminSessionGuard';

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

function getStatusBadgeClass(status: string) {
  switch ((status || '').toLowerCase()) {
    case 'success':
    case 'captured':
      return 'bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20';
    case 'failed':
      return 'bg-red-500/10 text-red-400 ring-1 ring-red-500/20';
    case 'refunded':
      return 'bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/20';
    default:
      return 'bg-slate-500/10 text-slate-400 ring-1 ring-slate-500/20';
  }
}

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [activeTab, setActiveTab] = useState('transactions');
  const router = useRouter();

  useAdminSessionGuard();

  useEffect(() => {
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

  const formatDate = (date: string) => {
    try {
      return format(new Date(date), 'PPpp');
    } catch {
      return 'Invalid date';
    }
  };

  const getTimeAgo = (date: string) => {
    try {
      return formatDistance(new Date(date), new Date(), { addSuffix: true });
    } catch {
      return 'Unknown time';
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="ml-64 flex-1 p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-white">Transactions</h1>
          <p className="text-sm text-slate-400 mt-1">Payment history and refund tracking</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-800">
              <thead className="bg-slate-900/60">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Transaction ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-sm text-slate-500">Loading transactions...</td>
                  </tr>
                ) : transactions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-sm text-slate-500">No transactions found</td>
                  </tr>
                ) : (
                  transactions.map((transaction) => (
                    <tr key={transaction._id} className="hover:bg-slate-800/50 transition-colors">
                      <td className="px-6 py-4 text-sm text-slate-300 font-mono">{transaction.paymentInfo.razorpayPaymentId}</td>
                      <td className="px-6 py-4 text-sm text-slate-300">{transaction.shippingAddress.name}</td>
                      <td className="px-6 py-4 text-sm text-slate-300">
                        {transaction.paymentInfo.currency} {transaction.totalAmount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 inline-flex text-xs font-medium rounded-full capitalize ${getStatusBadgeClass(transaction.paymentInfo.status)}`}>
                          {transaction.paymentInfo.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-400">
                        <span title={formatDate(transaction.paymentInfo.transactionTime)}>
                          {getTimeAgo(transaction.paymentInfo.transactionTime)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <button
                          onClick={() => setSelectedTransaction(transaction)}
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
        </div>

        {selectedTransaction && (
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedTransaction(null)}
          >
            <div
              className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center px-6 py-4 border-b border-slate-800">
                <h2 className="text-lg font-semibold text-white">Transaction details</h2>
                <button
                  onClick={() => setSelectedTransaction(null)}
                  className="text-slate-500 hover:text-slate-300 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider">Payment ID</h3>
                    <p className="mt-1 text-sm text-slate-300 font-mono">{selectedTransaction.paymentInfo.razorpayPaymentId}</p>
                  </div>
                  <div>
                    <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider">Order ID</h3>
                    <p className="mt-1 text-sm text-slate-300 font-mono">{selectedTransaction.paymentInfo.razorpayOrderId}</p>
                  </div>
                  <div>
                    <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider">Amount</h3>
                    <p className="mt-1 text-sm text-slate-300">{selectedTransaction.paymentInfo.currency} {selectedTransaction.totalAmount.toFixed(2)}</p>
                  </div>
                  <div>
                    <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider">Status</h3>
                    <p className={`mt-1 inline-flex px-2.5 py-1 text-xs font-medium rounded-full capitalize ${getStatusBadgeClass(selectedTransaction.paymentInfo.status)}`}>
                      {selectedTransaction.paymentInfo.status}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider">Payment method</h3>
                    <p className="mt-1 text-sm text-slate-300">{selectedTransaction.paymentInfo.method || 'N/A'}</p>
                  </div>
                  <div>
                    <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider">Date & time</h3>
                    <p className="mt-1 text-sm text-slate-300">{formatDate(selectedTransaction.paymentInfo.transactionTime)}</p>
                  </div>
                </div>

                {selectedTransaction.paymentInfo.cardNetwork && (
                  <div className="border-t border-slate-800 pt-4">
                    <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3">Card details</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-xs text-slate-500">Card network</h4>
                        <p className="mt-1 text-sm text-slate-300">{selectedTransaction.paymentInfo.cardNetwork}</p>
                      </div>
                      <div>
                        <h4 className="text-xs text-slate-500">Last 4 digits</h4>
                        <p className="mt-1 text-sm text-slate-300">****{selectedTransaction.paymentInfo.cardLast4}</p>
                      </div>
                      <div>
                        <h4 className="text-xs text-slate-500">Card issuer</h4>
                        <p className="mt-1 text-sm text-slate-300">{selectedTransaction.paymentInfo.cardIssuer || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                )}

                {selectedTransaction.paymentInfo.refundStatus !== 'none' && (
                  <div className="border-t border-slate-800 pt-4">
                    <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3">Refund information</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-xs text-slate-500">Refund status</h4>
                        <p className="mt-1 text-sm text-slate-300">{selectedTransaction.paymentInfo.refundStatus}</p>
                      </div>
                      <div>
                        <h4 className="text-xs text-slate-500">Amount refunded</h4>
                        <p className="mt-1 text-sm text-slate-300">{selectedTransaction.paymentInfo.currency} {selectedTransaction.paymentInfo.amountRefunded.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="border-t border-slate-800 pt-4">
                  <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wider mb-3">Customer information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-xs text-slate-500">Name</h4>
                      <p className="mt-1 text-sm text-slate-300">{selectedTransaction.shippingAddress.name}</p>
                    </div>
                    <div>
                      <h4 className="text-xs text-slate-500">Email</h4>
                      <p className="mt-1 text-sm text-slate-300">{selectedTransaction.paymentInfo.email || 'N/A'}</p>
                    </div>
                    <div>
                      <h4 className="text-xs text-slate-500">Contact</h4>
                      <p className="mt-1 text-sm text-slate-300">{selectedTransaction.paymentInfo.contact || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
