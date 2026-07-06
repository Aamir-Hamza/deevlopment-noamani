"use client";

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import AuthShell, { authInputClass, authLabelClass, authPrimaryButtonClass } from '@/components/auth/AuthShell';

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const tokenFromQuery = searchParams.get('token') || '';
  const [token, setToken] = useState(tokenFromQuery);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
      window.location.href = '/?authModal=login';
    } catch (err: any) {
      toast.error(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      eyebrow="Artistry in Scent"
      quote="Each bottle is a masterpiece, crafted with the rarest ingredients and a passion for perfection."
    >
      <div className="mb-6 text-center lg:text-left">
        <h2 className="text-2xl font-bold text-gray-900 tracking-wide">Reset password</h2>
        <p className="text-gray-500 text-sm mt-1.5 leading-relaxed">
          Enter a new password for your account.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {!tokenFromQuery && (
          <div className="space-y-1.5">
            <Label htmlFor="token" className={authLabelClass}>Reset token</Label>
            <Input
              id="token"
              name="token"
              type="text"
              placeholder="Paste your token"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="bg-white border border-gray-300 text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-[#bfa14a]/40 focus:border-[#bfa14a] rounded-lg h-11 transition-all"
              required
            />
          </div>
        )}

        <div className="space-y-1.5">
          <Label htmlFor="password" className={authLabelClass}>New Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="New password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`pr-10 ${authInputClass}`}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="confirmPassword" className={authLabelClass}>Confirm New Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`pr-10 ${authInputClass}`}
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors"
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <Button type="submit" className={authPrimaryButtonClass} disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="animate-spin w-4 h-4 mr-2" />
              Updating...
            </>
          ) : (
            'Reset password'
          )}
        </Button>
      </form>

      <div className="mt-6 text-center border-t border-gray-100 pt-4">
        <p className="text-gray-500 text-sm">
          <Link href="/?authModal=login" className="text-gray-900 hover:text-[#a88d3f] transition-colors font-semibold">
            Back to sign in
          </Link>
        </p>
      </div>
    </AuthShell>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center px-4 py-8">
        <div className="text-gray-500 flex items-center gap-2">
          <Loader2 className="animate-spin w-5 h-5" />
          Loading...
        </div>
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}
