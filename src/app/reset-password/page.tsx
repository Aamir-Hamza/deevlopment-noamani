"use client";

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const tokenFromQuery = searchParams.get('token') || '';
  const [token, setToken] = useState(tokenFromQuery);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setToken(tokenFromQuery);
  }, [tokenFromQuery]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      toast.error('Missing reset token');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Reset failed');
      toast.success('Password reset successful. You can now sign in.');
      window.location.href = '/login';
    } catch (err: any) {
      toast.error(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="bg-black border border-gray-800 rounded-lg p-8">
          <h2 className="text-2xl font-semibold text-white mb-2">Reset password</h2>
          <p className="text-gray-400 text-sm mb-6">
            Enter a new password for your account
          </p>
          <form onSubmit={handleSubmit} className="space-y-6">
            {!tokenFromQuery && (
              <div className="space-y-2">
                <Label htmlFor="token" className="text-white text-sm">Reset token</Label>
                <Input
                  id="token"
                  name="token"
                  type="text"
                  placeholder="Paste your token"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  className="bg-black border border-gray-600 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-gray-500 focus:border-gray-500 rounded-md"
                  required
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="password" className="text-white text-sm">New Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="New password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 bg-black border border-gray-600 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-gray-500 focus:border-gray-500 rounded-md"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-white text-sm">Confirm New Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10 bg-black border border-gray-600 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-gray-500 focus:border-gray-500 rounded-md"
                  required
                />
              </div>
            </div>

            <Button type="submit" className="w-full bg-black border border-gray-600 text-white hover:bg-gray-900 hover:border-gray-500 rounded-md py-3 font-medium transition-all duration-200" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="animate-spin w-4 h-4 mr-2" />
                  Updating
                </>
              ) : (
                'Reset password'
              )}
            </Button>
          </form>
          <div className="mt-6 text-center">
            <Link href="/login" className="text-gray-400 hover:text-gray-200 text-sm transition-colors">Back to sign in</Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center px-4 py-8">
        <div className="text-gray-300 flex items-center gap-2">
          <Loader2 className="animate-spin w-5 h-5" />
          Loading...
        </div>
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}


