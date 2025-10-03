"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const [devLink, setDevLink] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Request failed');
      toast.success('If an account exists, an email has been sent.');
      setDevLink(null);
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
          <h2 className="text-2xl font-semibold text-white mb-2">Forgot password</h2>
          <p className="text-gray-400 text-sm mb-6">
            Enter your email and we'll send you a reset link
          </p>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white text-sm">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-black border border-gray-600 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-gray-500 focus:border-gray-500 rounded-md"
                  required
                />
              </div>
            </div>
            <Button type="submit" className="w-full bg-black border border-gray-600 text-white hover:bg-gray-900 hover:border-gray-500 rounded-md py-3 font-medium transition-all duration-200" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="animate-spin w-4 h-4 mr-2" />
                  Sending
                </>
              ) : (
                'Send reset link'
              )}
            </Button>
          </form>
          {/* Removed development reset link display to enforce email-only flow */}
          <div className="mt-6 text-center">
            <Link href="/login" className="text-gray-400 hover:text-gray-200 text-sm transition-colors">Back to sign in</Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}


