"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Lock, Hash, Eye, EyeOff, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import AuthShell, { authInputClass, authLabelClass, authPrimaryButtonClass } from '@/components/auth/AuthShell';

export default function ResetPasswordOtpPage() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) {
      toast.error('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/auth/reset-password-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, newPassword: password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Reset failed');
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
          Enter the OTP sent to your email and choose a new password.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-1.5">
          <Label htmlFor="email" className={authLabelClass}>Email Address</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={authInputClass}
              required
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="otp" className={authLabelClass}>OTP Code</Label>
          <div className="relative">
            <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              id="otp"
              name="otp"
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="6-digit code"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className={authInputClass}
              required
            />
          </div>
        </div>

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
          <Label htmlFor="confirm" className={authLabelClass}>Confirm New Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              id="confirm"
              name="confirm"
              type={showConfirm ? "text" : "password"}
              placeholder="Confirm new password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className={`pr-10 ${authInputClass}`}
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors"
            >
              {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
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
