"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useCountry } from "@/hooks/useCountry";

interface CountryDisplayProps {
  isScrolled: boolean;
  isMobileMenuOpen: boolean;
}

export function CountryDisplay({
  isScrolled,
  isMobileMenuOpen
}: CountryDisplayProps) {
  const { countryData } = useCountry();

  // Ensure we have valid data
  const safeCountryData = countryData || {
    country: 'India',
    countryCode: 'IN',
    flag: '🇮🇳',
    currency: 'INR',
    timezone: 'Asia/Kolkata'
  };

  return (
    <div className="flex items-center gap-2">
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-2 rounded-lg px-3 py-1"
      >
        <span className="text-2xl">{safeCountryData.flag}</span>
        <div className="flex flex-col">
          <span className={cn(
            "text-sm font-medium",
            !isScrolled && !isMobileMenuOpen ? "text-white" : "text-gray-900"
          )}>
            {safeCountryData.country}
          </span>
          <span className={cn(
            "text-xs",
            !isScrolled && !isMobileMenuOpen ? "text-gray-300" : "text-gray-500"
          )}>
            {safeCountryData.currency}
          </span>
        </div>
      </motion.div>
    </div>
  );
}
