"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useCountry } from "@/hooks/useCountry";

interface CountryDisplayProps {
  isScrolled: boolean;
  isMobileMenuOpen: boolean;
}

/**
 * Purely informational — location is requested silently via the browser's
 * native Geolocation permission prompt (see useCountryDetection), with an
 * automatic IP-based fallback if the user denies it or GPS is unavailable.
 * There is no "Set Location" control here by design; this just reflects
 * whatever country was resolved.
 */
export function CountryDisplay({
  isScrolled,
  isMobileMenuOpen,
}: CountryDisplayProps) {
  const { countryData } = useCountry();

  const isSolid = isScrolled || isMobileMenuOpen;

  const safeCountryData = countryData || {
    country: 'India',
    countryCode: 'IN',
    flag: '🇮🇳',
    currency: 'INR',
    timezone: 'Asia/Kolkata',
  };

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
