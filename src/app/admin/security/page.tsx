"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { AdminSidebar } from "@/components/AdminSidebar";
import { ShieldCheck, Smartphone, MessageSquare } from "lucide-react";

type TwoFactorMethod = "none" | "totp" | "sms";
type SetupFlow = null | "totp" | "sms";

export default function AdminSecurityPage() {
  const [activeTab, setActiveTab] = useState("security");
  const [method, setMethod] = useState<TwoFactorMethod>("none");
  const [maskedPhone, setMaskedPhone] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [flow, setFlow] = useState<SetupFlow>(null);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [phone, setPhone] = useState("");
  const [phoneSubmitted, setPhoneSubmitted] = useState(false);
  const [code, setCode] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [disablePassword, setDisablePassword] = useState("");
  const [showDisableForm, setShowDisableForm] = useState(false);

  const loadStatus = async () => {
    try {
      const { data } = await axios.get("/api/admin/2fa/status");
      setMethod(data.method);
      setMaskedPhone(data.maskedPhone);
    } catch {
      toast.error("Could not load 2FA status");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStatus();
  }, []);

  const resetFlow = () => {
    setFlow(null);
    setQrCode(null);
    setSecret(null);
    setPhone("");
    setPhoneSubmitted(false);
    setCode("");
  };

  const startTotpSetup = async () => {
    setSubmitting(true);
    try {
      const { data } = await axios.post("/api/admin/2fa/totp/setup");
      setQrCode(data.qrCode);
      setSecret(data.secret);
      setFlow("totp");
    } catch (error: any) {
      toast.error(error?.response?.data?.error || "Could not start setup");
    } finally {
      setSubmitting(false);
    }
  };

  const confirmTotp = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axios.post("/api/admin/2fa/totp/verify", { code });
      toast.success("Authenticator app enabled");
      resetFlow();
      loadStatus();
    } catch (error: any) {
      toast.error(error?.response?.data?.error || "Invalid code");
    } finally {
      setSubmitting(false);
    }
  };

  const startSmsSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { data } = await axios.post("/api/admin/2fa/sms/setup", { phone });
      setMaskedPhone(data.maskedPhone);
      setPhoneSubmitted(true);
      toast.success("Code sent");
    } catch (error: any) {
      toast.error(error?.response?.data?.error || "Could not send code");
    } finally {
      setSubmitting(false);
    }
  };

  const confirmSms = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axios.post("/api/admin/2fa/sms/verify", { code });
      toast.success("SMS 2FA enabled");
      resetFlow();
      loadStatus();
    } catch (error: any) {
      toast.error(error?.response?.data?.error || "Invalid code");
    } finally {
      setSubmitting(false);
    }
  };

  const disable2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axios.post("/api/admin/2fa/disable", { password: disablePassword });
      toast.success("Two-factor authentication disabled");
      setShowDisableForm(false);
      setDisablePassword("");
      loadStatus();
    } catch (error: any) {
      toast.error(error?.response?.data?.error || "Could not disable 2FA");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="ml-64 flex-1 p-8 max-w-2xl">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-white">Security</h1>
          <p className="text-sm text-slate-400 mt-1">
            Add a second step to admin login to protect against stolen passwords
          </p>
        </div>

        {loading ? (
          <p className="text-slate-400">Loading...</p>
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-1">
              <ShieldCheck className={`h-5 w-5 ${method !== "none" ? "text-emerald-400" : "text-slate-500"}`} />
              <h2 className="text-lg font-medium text-white">Two-factor authentication</h2>
            </div>
            <p className="text-sm text-slate-400 mb-6">
              {method === "none" && "Not enabled. Choose a method below to turn it on."}
              {method === "totp" && "Enabled via authenticator app."}
              {method === "sms" && `Enabled via SMS to ${maskedPhone}.`}
            </p>

            {method !== "none" && !showDisableForm && (
              <button
                onClick={() => setShowDisableForm(true)}
                className="rounded-lg border border-red-900 text-red-400 hover:bg-red-950 text-sm font-medium px-4 py-2 transition-colors"
              >
                Disable 2FA
              </button>
            )}

            {method !== "none" && showDisableForm && (
              <form onSubmit={disable2FA} className="space-y-3 max-w-xs">
                <label className="block text-sm text-slate-300">Confirm your password to disable</label>
                <input
                  type="password"
                  required
                  value={disablePassword}
                  onChange={(e) => setDisablePassword(e.target.value)}
                  className="w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="rounded-lg bg-red-700 hover:bg-red-600 disabled:opacity-60 text-white text-sm font-medium px-4 py-2 transition-colors"
                  >
                    Confirm disable
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowDisableForm(false)}
                    className="rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 text-sm font-medium px-4 py-2 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {method === "none" && !flow && (
              <div className="grid sm:grid-cols-2 gap-4">
                <button
                  onClick={startTotpSetup}
                  disabled={submitting}
                  className="flex flex-col items-start gap-2 rounded-xl border border-slate-800 hover:border-amber-600/50 hover:bg-slate-800/50 p-4 text-left transition-colors disabled:opacity-60"
                >
                  <Smartphone className="h-5 w-5 text-amber-400" />
                  <span className="font-medium text-white">Authenticator app</span>
                  <span className="text-xs text-slate-400">
                    Microsoft Authenticator, Google Authenticator, or Authy
                  </span>
                </button>
                <button
                  onClick={() => setFlow("sms")}
                  disabled={submitting}
                  className="flex flex-col items-start gap-2 rounded-xl border border-slate-800 hover:border-amber-600/50 hover:bg-slate-800/50 p-4 text-left transition-colors disabled:opacity-60"
                >
                  <MessageSquare className="h-5 w-5 text-amber-400" />
                  <span className="font-medium text-white">SMS code</span>
                  <span className="text-xs text-slate-400">Get a code by text message at login</span>
                </button>
              </div>
            )}

            {flow === "totp" && (
              <div className="space-y-4">
                {qrCode && (
                  <div className="bg-white p-4 rounded-lg inline-block">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={qrCode} alt="Scan with your authenticator app" className="h-40 w-40" />
                  </div>
                )}
                <p className="text-sm text-slate-400">
                  Scan this QR code with Microsoft Authenticator (or any TOTP app). Can&apos;t scan?
                  Enter this key manually:
                </p>
                {secret && (
                  <code className="block text-xs text-amber-400 bg-slate-800 rounded px-3 py-2 break-all">
                    {secret}
                  </code>
                )}
                <form onSubmit={confirmTotp} className="flex gap-2 max-w-xs">
                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                    placeholder="000000"
                    className="w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-white text-center tracking-widest focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                  />
                  <button
                    type="submit"
                    disabled={submitting || code.length !== 6}
                    className="rounded-lg bg-amber-600 hover:bg-amber-500 disabled:opacity-60 text-white text-sm font-medium px-4 py-2 transition-colors whitespace-nowrap"
                  >
                    Confirm
                  </button>
                </form>
                <button onClick={resetFlow} className="text-sm text-slate-500 hover:text-slate-300">
                  Cancel
                </button>
              </div>
            )}

            {flow === "sms" && !phoneSubmitted && (
              <form onSubmit={startSmsSetup} className="space-y-3 max-w-xs">
                <label className="block text-sm text-slate-300">Phone number (international format)</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+14155552671"
                  className="w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="rounded-lg bg-amber-600 hover:bg-amber-500 disabled:opacity-60 text-white text-sm font-medium px-4 py-2 transition-colors"
                  >
                    Send code
                  </button>
                  <button
                    type="button"
                    onClick={resetFlow}
                    className="rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 text-sm font-medium px-4 py-2 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {flow === "sms" && phoneSubmitted && (
              <form onSubmit={confirmSms} className="space-y-3 max-w-xs">
                <label className="block text-sm text-slate-300">Enter the code sent to {maskedPhone}</label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={6}
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                  placeholder="000000"
                  className="w-full rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-white text-center tracking-widest focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={submitting || code.length !== 6}
                    className="rounded-lg bg-amber-600 hover:bg-amber-500 disabled:opacity-60 text-white text-sm font-medium px-4 py-2 transition-colors"
                  >
                    Confirm
                  </button>
                  <button
                    type="button"
                    onClick={resetFlow}
                    className="rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 text-sm font-medium px-4 py-2 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
