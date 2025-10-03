"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Lock, User, Eye, EyeOff, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import { Italianno, Dancing_Script, Great_Vibes, Allura } from 'next/font/google';

const italianno = Italianno({ weight: '400', subsets: ['latin'] });
const dancingScript = Dancing_Script({ weight: '400', subsets: ['latin'] });
const greatVibes = Great_Vibes({ weight: '400', subsets: ['latin'] });
const allura = Allura({ weight: '400', subsets: ['latin'] });

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      setLoading(false);
      return;
    }
    
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Signup failed");
      
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
        {/* Sign Up Form */}
        <div className="bg-black border border-gray-800 rounded-lg p-8">
          {/* Brand Header inside the form */}
          <div className="text-center mb-8">
            <h1 className={`text-5xl font-normal text-white mb-2 select-none ${greatVibes.className}`} style={{ letterSpacing: "0.05em" }}>
              Noamani
            </h1>
          </div>
          <h2 className="text-2xl font-semibold text-white mb-2">Sign up</h2>
          <p className="text-gray-400 text-sm mb-6">
            Create your account to get started
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-white text-sm">
                Full Name
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="pl-10 bg-black border border-gray-600 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-gray-500 focus:border-gray-500 rounded-md"
                  required
                />
              </div>
            </div>

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

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-white text-sm">
                Confirm Password
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="pl-10 pr-10 bg-black border border-gray-600 text-white placeholder:text-gray-500 focus:ring-2 focus:ring-gray-500 focus:border-gray-500 rounded-md"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
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

          {/* Sign In Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              Already have an account?{" "}
              <Link 
                href="/login" 
                className="text-white hover:text-gray-300 transition-colors font-medium"
              >
                Sign in
              </Link>
            </p>
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
      </motion.div>
    </div>
  );
}
