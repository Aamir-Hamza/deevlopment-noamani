"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { I18nextProvider, useTranslation } from "react-i18next";
import i18n from "@/i18n/config";
import { LANGUAGES, DEFAULT_LANGUAGE, getLanguage, LanguageOption } from "@/i18n/languages";

interface LanguageContextType {
  language: LanguageOption;
  languages: LanguageOption[];
  setLanguage: (code: string) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

function applyDocumentAttributes(code: string) {
  if (typeof document === "undefined") return;
  const lang = getLanguage(code);
  document.documentElement.lang = lang.code;
  document.documentElement.dir = lang.dir;
}

function LanguageContextBridge({ children }: { children: ReactNode }) {
  const { i18n: i18nInstance } = useTranslation();
  const [languageCode, setLanguageCode] = useState(DEFAULT_LANGUAGE);

  // Pick up a previously chosen language once we're on the client
  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("selectedLanguage") : null;
    if (stored && stored !== DEFAULT_LANGUAGE && LANGUAGES.some((l) => l.code === stored)) {
      i18nInstance.changeLanguage(stored);
      setLanguageCode(stored);
    } else {
      applyDocumentAttributes(DEFAULT_LANGUAGE);
    }
  }, [i18nInstance]);

  const setLanguage = (code: string) => {
    if (!LANGUAGES.some((l) => l.code === code)) return;
    i18nInstance.changeLanguage(code);
    setLanguageCode(code);
    localStorage.setItem("selectedLanguage", code);
    applyDocumentAttributes(code);
  };

  return (
    <LanguageContext.Provider
      value={{ language: getLanguage(languageCode), languages: LANGUAGES, setLanguage }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  return (
    <I18nextProvider i18n={i18n}>
      <LanguageContextBridge>{children}</LanguageContextBridge>
    </I18nextProvider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within a LanguageProvider");
  return ctx;
}
