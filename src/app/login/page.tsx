"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import { Italianno, Dancing_Script, Great_Vibes, Allura } from 'next/font/google';
import { AdminLogin } from '@/components/AdminLogin';

const italianno = Italianno({ weight: '400', subsets: ['latin'] });
const dancingScript = Dancing_Script({ weight: '400', subsets: ['latin'] });
const greatVibes = Great_Vibes({ weight: '400', subsets: ['latin'] });
const allura = Allura({ weight: '400', subsets: ['latin'] });

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");
      
      localStorage.setItem("userInfo", JSON.stringify(data.user));
      toast.success("Welcome to Noamani!", { icon: "🎉" });
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.7 },
        colors: ['#bfa14a', '#fffbe6', '#f7e7b4', '#111']
      });
      window.dispatchEvent(new Event("userLogin"));
      window.location.href = "/";
    } catch (err: any) {
      toast.error(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        {/* Sign In Form */}
        <div className="bg-black border border-gray-800 rounded-lg p-8">
          {/* Brand Header inside the form */}
          <div className="text-center mb-8">
            <h1 className={`text-5xl font-normal text-white mb-2 select-none ${greatVibes.className}`} style={{ letterSpacing: "0.05em" }}>
              Noamani
            </h1>
          </div>
          <h2 className="text-2xl font-semibold text-white mb-2">Sign in</h2>
          <p className="text-gray-400 text-sm mb-6">
            Enter your email and we'll send you a verification code
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white text-sm">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="pl-10 bg-black border border-gray-600 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-gray-500 focus:border-gray-500 rounded-md"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-white text-sm">
                Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="pl-10 pr-10 bg-black border border-gray-600 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-gray-500 focus:border-gray-500 rounded-md"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Link href="/forgot-password" className="text-gray-400 hover:text-gray-200 text-sm transition-colors">Forgot password?</Link>
            </div>

            <Button
              type="submit"
              className="w-full bg-black border border-gray-600 text-white hover:bg-gray-900 hover:border-gray-500 rounded-md py-3 font-medium transition-all duration-200"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin w-4 h-4 mr-2" />
                  Please wait
                </>
              ) : (
                "Continue"
              )}
            </Button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              Don't have an account?{" "}
              <Link 
                href="/signup" 
                className="text-white hover:text-gray-300 transition-colors font-medium"
              >
                Sign up
              </Link>
            </p>
          </div>

          {/* Admin Access Button */}
          <div className="mt-6">
            <Button
              onClick={() => setShowAdminLogin(true)}
              className="w-full bg-gray-800 border border-gray-700 text-gray-300 hover:bg-gray-700 hover:border-gray-600 rounded-md py-2 font-medium transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              Admin Access
            </Button>
          </div>

          {/* Footer Links - moved inside the form container */}
          <div className="mt-8 text-center space-x-4">
            <Link 
              href="/legal/privacy" 
              className="text-gray-500 hover:text-gray-400 text-sm transition-colors"
            >
              Privacy policy
            </Link>
            <span className="text-gray-500">•</span>
            <Link 
              href="/legal/terms" 
              className="text-gray-500 hover:text-gray-400 text-sm transition-colors"
            >
              Terms of service
            </Link>
          </div>
        </div>

        {/* Admin Login Modal */}
        {showAdminLogin && (
          <AdminLogin onClose={() => setShowAdminLogin(false)} />
        )}
      </motion.div>
    </div>
  );
}