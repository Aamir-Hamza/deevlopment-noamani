"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import axios from "axios";
import { toast } from "react-hot-toast";

type Step = "credentials" | "2fa";

export default function AdminLoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("credentials");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [method, setMethod] = useState<"totp" | "sms" | null>(null);
  const [maskedPhone, setMaskedPhone] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { data } = await axios.post("/api/admin/login", { email, password });
      if (data.requires2FA) {
        setMethod(data.method);
        setMaskedPhone(data.maskedPhone || null);
        setStep("2fa");
      } else {
        localStorage.setItem("adminInfo", JSON.stringify(data.admin));
        toast.success("Welcome back");
        router.push("/admin/dashboard");
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.error || "Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { data } = await axios.post("/api/admin/login/verify-2fa", { code });
      localStorage.setItem("adminInfo", JSON.stringify(data.admin));
      toast.success("Welcome back");
      router.push("/admin/dashboard");
    } catch (error: any) {
      toast.error(error?.response?.data?.error || "Invalid code");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    try {
      const { data } = await axios.post("/api/admin/login/resend-2fa");
      setMaskedPhone(data.maskedPhone || null);
      toast.success("Code resent");
    } catch (error: any) {
      toast.error(error?.response?.data?.error || "Could not resend code");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4">
      <div className="w-full max-w-sm rounded-2xl border border-gray-800 bg-gray-900 p-8 shadow-xl">
        <Image src="/Brand_logo/nlogo.png" alt="Noamani" width={48} height={48} className="mx-auto mb-4" />
        <h1 className="text-2xl font-semibold text-white text-center mb-1">Admin Login</h1>
        <p className="text-sm text-gray-400 text-center mb-8">Noamani Admin Portal</p>

        {step === "credentials" && (
          <form onSubmit={handleCredentialsSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-300 mb-1.5">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg bg-gray-800 border border-gray-700 px-4 py-2.5 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500"
                placeholder="admin@noamani.com"
                autoComplete="email"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1.5">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg bg-gray-800 border border-gray-700 px-4 py-2.5 text-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500"
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-lg bg-amber-600 hover:bg-amber-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium py-2.5 transition-colors mt-2"
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </button>
          </form>
        )}

        {step === "2fa" && (
          <form onSubmit={handleCodeSubmit} className="space-y-4">
            <p className="text-sm text-gray-400 text-center -mt-2 mb-2">
              {method === "totp"
                ? "Enter the 6-digit code from your authenticator app"
                : `Enter the code sent to ${maskedPhone || "your phone"}`}
            </p>
            <div>
              <input
                type="text"
                inputMode="numeric"
                autoFocus
                required
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                className="w-full rounded-lg bg-gray-800 border border-gray-700 px-4 py-2.5 text-white text-center tracking-[0.5em] placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500"
                placeholder="000000"
                autoComplete="one-time-code"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || code.length !== 6}
              className="w-full rounded-lg bg-amber-600 hover:bg-amber-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium py-2.5 transition-colors mt-2"
            >
              {isLoading ? "Verifying..." : "Verify"}
            </button>
            {method === "sms" && (
              <button
                type="button"
                onClick={handleResend}
                disabled={isResending}
                className="w-full text-sm text-gray-400 hover:text-gray-200 disabled:opacity-60 transition-colors"
              >
                {isResending ? "Resending..." : "Resend code"}
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                setStep("credentials");
                setCode("");
              }}
              className="w-full text-sm text-gray-500 hover:text-gray-300 transition-colors"
            >
              Back
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
