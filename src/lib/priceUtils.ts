// All product prices are stored in the database in INR (₹) — this file
// converts that base price into the currency detected for the visitor
// (see useCountryDetection) purely for display. It never touches what
// actually gets charged: Razorpay checkout always processes the real
// amount in INR regardless of what currency is shown on the page.

// Approximate market rates (units of currency per 1 INR). These are for
// display estimates only and are not refreshed live from a forex API.
export const CURRENCY_RATES: Record<string, number> = {
  INR: 1,
  USD: 0.012,
  GBP: 0.0095,
  EUR: 0.011,
  CAD: 0.0165,
  AUD: 0.018,
  NZD: 0.02,
  JPY: 1.75,
  CNY: 0.086,
  KRW: 16.5,
  BRL: 0.062,
  MXN: 0.2,
  RUB: 1.05,
  AED: 0.044,
  SAR: 0.045,
  QAR: 0.044,
  KWD: 0.0037,
  BHD: 0.0045,
  OMR: 0.0046,
  EGP: 0.59,
  ZAR: 0.22,
  NGN: 18.5,
  KES: 1.55,
  THB: 0.42,
  SGD: 0.016,
  MYR: 0.054,
  IDR: 190,
  PHP: 0.68,
  VND: 305,
  TRY: 0.41,
  PLN: 0.048,
  SEK: 0.13,
  NOK: 0.13,
  DKK: 0.082,
  CHF: 0.0105,
  ILS: 0.044,
  PKR: 3.35,
  BDT: 1.32,
  LKR: 3.6,
  NPR: 1.6,
  ARS: 12.5,
  CLP: 11.5,
  COP: 47,
  PEN: 0.045,
};

export const CURRENCY_SYMBOLS: Record<string, string> = {
  INR: '₹',
  USD: '$',
  GBP: '£',
  EUR: '€',
  CAD: 'C$',
  AUD: 'A$',
  NZD: 'NZ$',
  JPY: '¥',
  CNY: '¥',
  KRW: '₩',
  BRL: 'R$',
  MXN: '$',
  RUB: '₽',
  AED: 'د.إ',
  SAR: '﷼',
  QAR: '﷼',
  KWD: 'د.ك',
  BHD: '.د.ب',
  OMR: '﷼',
  EGP: 'E£',
  ZAR: 'R',
  NGN: '₦',
  KES: 'KSh',
  THB: '฿',
  SGD: 'S$',
  MYR: 'RM',
  IDR: 'Rp',
  PHP: '₱',
  VND: '₫',
  TRY: '₺',
  PLN: 'zł',
  SEK: 'kr',
  NOK: 'kr',
  DKK: 'kr',
  CHF: 'CHF',
  ILS: '₪',
  PKR: '₨',
  BDT: '৳',
  LKR: '₨',
  NPR: '₨',
  ARS: '$',
  CLP: '$',
  COP: '$',
  PEN: 'S/',
};

// Currencies conventionally shown with no decimal places.
const ZERO_DECIMAL_CURRENCIES = new Set(['JPY', 'KRW', 'IDR', 'VND', 'CLP']);

/** Converts a base INR price into the given currency and rounds it sensibly. */
export const convertPrice = (basePriceINR: number, currency?: string | null): number => {
  const code = (currency || 'INR').toUpperCase();
  const rate = CURRENCY_RATES[code] ?? 1;
  const converted = basePriceINR * rate;
  return ZERO_DECIMAL_CURRENCIES.has(code) ? Math.round(converted) : Math.round(converted * 100) / 100;
};

/** Returns the symbol + converted value for a base INR price, in the given currency. */
export const getPrice = (basePriceINR: number, currency?: string | null) => {
  const code = (currency || 'INR').toUpperCase();
  const symbol = CURRENCY_SYMBOLS[code] ?? code;
  const value = convertPrice(basePriceINR, code);
  return { symbol, value, currency: code };
};

/** Formats a base INR price as a display string in the given currency. */
export const formatPrice = (basePriceINR: number, currency?: string | null): string => {
  if (basePriceINR == null || isNaN(basePriceINR)) {
    const code = (currency || 'INR').toUpperCase();
    return `${CURRENCY_SYMBOLS[code] ?? code}0`;
  }

  const code = (currency || 'INR').toUpperCase();
  const symbol = CURRENCY_SYMBOLS[code] ?? code;
  const value = convertPrice(basePriceINR, code);
  const zeroDecimal = ZERO_DECIMAL_CURRENCIES.has(code);

  const formatted = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: zeroDecimal ? 0 : 2,
    maximumFractionDigits: zeroDecimal ? 0 : 2,
  }).format(value);

  return `${symbol}${formatted}`;
};
