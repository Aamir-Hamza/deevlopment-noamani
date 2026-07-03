"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";

interface LanguageSwitcherProps {
  isSolid: boolean;
}

export function LanguageSwitcher({ isSolid }: LanguageSwitcherProps) {
  const { language, languages, setLanguage } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium tracking-wide transition-all duration-200",
          isSolid
            ? "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800"
            : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white border border-white/10"
        )}
        aria-label="Choose language"
      >
        <Globe className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">{language.flag} {language.code.toUpperCase()}</span>
        <span className="sm:hidden">{language.flag}</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.98 }}
            transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-0 mt-2 w-48 rounded-2xl bg-white shadow-[0_20px_60px_rgba(0,0,0,0.15)] overflow-hidden z-[70] py-1.5"
          >
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  setLanguage(lang.code);
                  setOpen(false);
                }}
                className={cn(
                  "w-full flex items-center justify-between gap-2 px-4 py-2.5 text-sm transition-colors hover:bg-gray-50",
                  language.code === lang.code ? "text-gray-900 font-semibold" : "text-gray-600"
                )}
              >
                <span className="flex items-center gap-2.5">
                  <span className="text-base leading-none">{lang.flag}</span>
                  {lang.nativeLabel}
                </span>
                {language.code === lang.code && <Check className="h-3.5 w-3.5 text-[#bfa14a]" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
