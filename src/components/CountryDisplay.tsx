"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useCountry } from "@/hooks/useCountry";
import { MapPin, X, Check, Loader2 } from "lucide-react";

interface CountryDisplayProps {
  isScrolled: boolean;
  isMobileMenuOpen: boolean;
}

export function CountryDisplay({
  isScrolled,
  isMobileMenuOpen,
}: CountryDisplayProps) {
  const { countryData, permission, requestPermission, denyPermission, loading } = useCountry();
  const [showPermissionPopup, setShowPermissionPopup] = useState(false);

  const isSolid = isScrolled || isMobileMenuOpen;

  // Safe defaults
  const safeCountryData = countryData || {
    country: 'India',
    countryCode: 'IN',
    flag: '🇮🇳',
    currency: 'INR',
    timezone: 'Asia/Kolkata',
  };

  const handleAllowLocation = () => {
    requestPermission();
    setShowPermissionPopup(false);
  };

  const handleDenyLocation = () => {
    denyPermission();
    setShowPermissionPopup(false);
  };

  // ─── If permission not yet granted, show the "detect location" prompt button ───
  if (permission === 'prompt') {
    return (
      <div className="relative flex items-center">
        <button
          onClick={() => setShowPermissionPopup(true)}
          className={cn(
            "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium tracking-wide transition-all duration-200",
            isSolid
              ? "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800"
              : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white border border-white/10"
          )}
        >
          <MapPin className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Set Location</span>
          <span className="sm:hidden">📍</span>
        </button>

        {/* Permission popup */}
        <AnimatePresence>
          {showPermissionPopup && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] bg-black/30 backdrop-blur-sm"
                onClick={handleDenyLocation}
              />

              {/* Permission card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.92, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -5 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[101] w-[340px] max-w-[90vw] rounded-2xl bg-white shadow-[0_20px_60px_rgba(0,0,0,0.15)] overflow-hidden"
              >
                {/* Gold accent header */}
                <div className="h-1 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600" />

                <div className="p-6">
                  {/* Icon */}
                  <div className="flex justify-center mb-4">
                    <div className="w-14 h-14 rounded-full bg-amber-50 flex items-center justify-center">
                      <MapPin className="h-7 w-7 text-amber-600" />
                    </div>
                  </div>

                  {/* Text */}
                  <h3 className="text-center text-[15px] font-semibold text-gray-900 mb-1.5">
                    Detect Your Location?
                  </h3>
                  <p className="text-center text-[13px] text-gray-500 leading-relaxed mb-6">
                    We&apos;ll use your IP address to show prices in your local currency and provide a personalized shopping experience.
                  </p>

                  {/* Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={handleDenyLocation}
                      className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
                    >
                      No Thanks
                    </button>
                    <button
                      onClick={handleAllowLocation}
                      className="flex-1 rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800 transition-all duration-200 shadow-sm"
                    >
                      Allow
                    </button>
                  </div>

                  <p className="text-center text-[10px] text-gray-400 mt-3 tracking-wide">
                    You can change this anytime from the navbar
                  </p>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // ─── Detecting state: show spinner ───
  if (permission === 'detecting' || loading) {
    return (
      <div className="flex items-center gap-2">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-2 rounded-lg px-3 py-1"
        >
          <Loader2 className={cn("h-4 w-4 animate-spin", isSolid ? "text-gray-500" : "text-white/60")} />
          <span className={cn("text-xs", isSolid ? "text-gray-500" : "text-white/60")}>
            Detecting...
          </span>
        </motion.div>
      </div>
    );
  }

  // ─── Denied state: show compact "set location" button ───
  if (permission === 'denied') {
    return (
      <div className="flex items-center">
        <button
          onClick={() => {
            // Reset and show the prompt again
            setShowPermissionPopup(true);
          }}
          className={cn(
            "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium tracking-wide transition-all duration-200",
            isSolid
              ? "bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700"
              : "bg-white/10 text-white/50 hover:bg-white/20 hover:text-white/80 border border-white/10"
          )}
        >
          <span>🌍</span>
          <span className="hidden sm:inline">Set Location</span>
        </button>

        {/* Re-show permission popup for denied users who click again */}
        <AnimatePresence>
          {showPermissionPopup && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] bg-black/30 backdrop-blur-sm"
                onClick={() => setShowPermissionPopup(false)}
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.92, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -5 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[101] w-[340px] max-w-[90vw] rounded-2xl bg-white shadow-[0_20px_60px_rgba(0,0,0,0.15)] overflow-hidden"
              >
                <div className="h-1 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600" />
                <div className="p-6">
                  <div className="flex justify-center mb-4">
                    <div className="w-14 h-14 rounded-full bg-amber-50 flex items-center justify-center">
                      <MapPin className="h-7 w-7 text-amber-600" />
                    </div>
                  </div>
                  <h3 className="text-center text-[15px] font-semibold text-gray-900 mb-1.5">
                    Detect Your Location?
                  </h3>
                  <p className="text-center text-[13px] text-gray-500 leading-relaxed mb-6">
                    We&apos;ll detect your country to show localized prices and currency.
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        denyPermission();
                        setShowPermissionPopup(false);
                      }}
                      className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
                    >
                      No Thanks
                    </button>
                    <button
                      onClick={() => {
                        requestPermission();
                        setShowPermissionPopup(false);
                      }}
                      className="flex-1 rounded-xl bg-gray-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800 transition-all duration-200 shadow-sm"
                    >
                      Allow
                    </button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // ─── Granted state: show detected country (existing design, improved) ───
  return (
    <div className="flex items-center gap-2">
      <motion.div
        key={safeCountryData.countryCode}
        initial={{ opacity: 0, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center gap-2 rounded-lg px-3 py-1"
      >
        <span className="text-xl leading-none">{safeCountryData.flag}</span>
        <div className="flex flex-col">
          <span className={cn(
            "text-sm font-medium leading-tight",
            isSolid ? "text-gray-900" : "text-white"
          )}>
            {safeCountryData.country}
          </span>
          <span className={cn(
            "text-[10px] leading-tight",
            isSolid ? "text-gray-500" : "text-gray-300"
          )}>
            {safeCountryData.currency}
          </span>
        </div>
      </motion.div>
    </div>
  );
}
