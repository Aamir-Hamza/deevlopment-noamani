"use client";

import { useState, useEffect, useCallback } from 'react';

interface CountryData {
  country: string;
  countryCode: string;
  flag: string;
  currency: string;
  timezone: string;
}

const countryFlags: { [key: string]: string } = {
  'IN': '🇮🇳',
  'US': '🇺🇸',
  'GB': '🇬🇧',
  'CA': '🇨🇦',
  'AU': '🇦🇺',
  'DE': '🇩🇪',
  'FR': '🇫🇷',
  'IT': '🇮🇹',
  'ES': '🇪🇸',
  'JP': '🇯🇵',
  'CN': '🇨🇳',
  'KR': '🇰🇷',
  'BR': '🇧🇷',
  'MX': '🇲🇽',
  'RU': '🇷🇺',
  'AE': '🇦🇪',
  'SA': '🇸🇦',
  'EG': '🇪🇬',
  'ZA': '🇿🇦',
  'NG': '🇳🇬',
  'KE': '🇰🇪',
  'MA': '🇲🇦',
  'TH': '🇹🇭',
  'SG': '🇸🇬',
  'MY': '🇲🇾',
  'ID': '🇮🇩',
  'PH': '🇵🇭',
  'VN': '🇻🇳',
  'TR': '🇹🇷',
  'PL': '🇵🇱',
  'NL': '🇳🇱',
  'SE': '🇸🇪',
  'NO': '🇳🇴',
  'DK': '🇩🇰',
  'FI': '🇫🇮',
  'CH': '🇨🇭',
  'AT': '🇦🇹',
  'BE': '🇧🇪',
  'IE': '🇮🇪',
  'PT': '🇵🇹',
  'GR': '🇬🇷',
  'CZ': '🇨🇿',
  'HU': '🇭🇺',
  'RO': '🇷🇴',
  'BG': '🇧🇬',
  'HR': '🇭🇷',
  'SI': '🇸🇮',
  'SK': '🇸🇰',
  'LT': '🇱🇹',
  'LV': '🇱🇻',
  'EE': '🇪🇪',
  'LU': '🇱🇺',
  'MT': '🇲🇹',
  'CY': '🇨🇾',
  'IS': '🇮🇸',
  'LI': '🇱🇮',
  'MC': '🇲🇨',
  'SM': '🇸🇲',
  'VA': '🇻🇦',
  'AD': '🇦🇩',
  'BY': '🇧🇾',
  'UA': '🇺🇦',
  'MD': '🇲🇩',
  'RS': '🇷🇸',
  'ME': '🇲🇪',
  'BA': '🇧🇦',
  'MK': '🇲🇰',
  'AL': '🇦🇱',
  'XK': '🇽🇰',
  'IL': '🇮🇱',
  'JO': '🇯🇴',
  'LB': '🇱🇧',
  'SY': '🇸🇾',
  'IQ': '🇮🇶',
  'IR': '🇮🇷',
  'KW': '🇰🇼',
  'QA': '🇶🇦',
  'BH': '🇧🇭',
  'OM': '🇴🇲',
  'YE': '🇾🇪',
  'AF': '🇦🇫',
  'PK': '🇵🇰',
  'BD': '🇧🇩',
  'LK': '🇱🇰',
  'MV': '🇲🇻',
  'BT': '🇧🇹',
  'NP': '🇳🇵',
  'MM': '🇲🇲',
  'LA': '🇱🇦',
  'KH': '🇰🇭',
  'BN': '🇧🇳',
  'TL': '🇹🇱',
  'MN': '🇲🇳',
  'KZ': '🇰🇿',
  'UZ': '🇺🇿',
  'TM': '🇹🇲',
  'TJ': '🇹🇯',
  'KG': '🇰🇬',
  'GE': '🇬🇪',
  'AM': '🇦🇲',
  'AZ': '🇦🇿',
  'AR': '🇦🇷',
  'BO': '🇧🇴',
  'CL': '🇨🇱',
  'CO': '🇨🇴',
  'EC': '🇪🇨',
  'GY': '🇬🇾',
  'PY': '🇵🇾',
  'PE': '🇵🇪',
  'SR': '🇸🇷',
  'UY': '🇺🇾',
  'VE': '🇻🇪',
  'FJ': '🇫🇯',
  'PG': '🇵🇬',
  'SB': '🇸🇧',
  'VU': '🇻🇺',
  'NC': '🇳🇨',
  'PF': '🇵🇫',
  'WS': '🇼🇸',
  'KI': '🇰🇮',
  'TV': '🇹🇻',
  'TO': '🇹🇴',
  'NR': '🇳🇷',
  'PW': '🇵🇼',
  'FM': '🇫🇲',
  'MH': '🇲🇭',
  'CK': '🇨🇰',
  'NU': '🇳🇺',
  'TK': '🇹🇰',
  'WF': '🇼🇫',
  'AS': '🇦🇸',
  'GU': '🇬🇺',
  'MP': '🇲🇵',
  'VI': '🇻🇮',
  'PR': '🇵🇷',
  'DO': '🇩🇴',
  'HT': '🇭🇹',
  'JM': '🇯🇲',
  'CU': '🇨🇺',
  'BS': '🇧🇸',
  'BB': '🇧🇧',
  'TT': '🇹🇹',
  'AG': '🇦🇬',
  'DM': '🇩🇲',
  'GD': '🇬🇩',
  'KN': '🇰🇳',
  'LC': '🇱🇨',
  'VC': '🇻🇨',
  'BZ': '🇧🇿',
  'CR': '🇨🇷',
  'GT': '🇬🇹',
  'HN': '🇭🇳',
  'NI': '🇳🇮',
  'PA': '🇵🇦',
  'SV': '🇸🇻',
  'DZ': '🇩🇿',
  'AO': '🇦🇴',
  'BW': '🇧🇼',
  'BI': '🇧🇮',
  'CM': '🇨🇲',
  'CV': '🇨🇻',
  'CF': '🇨🇫',
  'TD': '🇹🇩',
  'KM': '🇰🇲',
  'CG': '🇨🇬',
  'CD': '🇨🇩',
  'CI': '🇨🇮',
  'DJ': '🇩🇯',
  'GQ': '🇬🇶',
  'ER': '🇪🇷',
  'ET': '🇪🇹',
  'GA': '🇬🇦',
  'GM': '🇬🇲',
  'GH': '🇬🇭',
  'GN': '🇬🇳',
  'GW': '🇬🇼',
  'LS': '🇱🇸',
  'LR': '🇱🇷',
  'LY': '🇱🇾',
  'MG': '🇲🇬',
  'MW': '🇲🇼',
  'ML': '🇲🇱',
  'MR': '🇲🇷',
  'MU': '🇲🇺',
  'MZ': '🇲🇿',
  'NA': '🇳🇦',
  'NE': '🇳🇪',
  'RW': '🇷🇼',
  'ST': '🇸🇹',
  'SN': '🇸🇳',
  'SC': '🇸🇨',
  'SL': '🇸🇱',
  'SO': '🇸🇴',
  'SS': '🇸🇸',
  'SD': '🇸🇩',
  'SZ': '🇸🇿',
  'TZ': '🇹🇿',
  'TG': '🇹🇬',
  'TN': '🇹🇳',
  'UG': '🇺🇬',
  'ZM': '🇿🇲',
  'ZW': '🇿🇼'
};

const countryNames: { [key: string]: string } = {
  'IN': 'India',
  'US': 'United States',
  'GB': 'United Kingdom',
  'CA': 'Canada',
  'AU': 'Australia',
  'DE': 'Germany',
  'FR': 'France',
  'IT': 'Italy',
  'ES': 'Spain',
  'JP': 'Japan',
  'CN': 'China',
  'KR': 'South Korea',
  'BR': 'Brazil',
  'MX': 'Mexico',
  'RU': 'Russia',
  'AE': 'United Arab Emirates',
  'SA': 'Saudi Arabia',
  'EG': 'Egypt',
  'ZA': 'South Africa',
  'NG': 'Nigeria',
  'KE': 'Kenya',
  'MA': 'Morocco',
  'TH': 'Thailand',
  'SG': 'Singapore',
  'MY': 'Malaysia',
  'ID': 'Indonesia',
  'PH': 'Philippines',
  'VN': 'Vietnam',
  'TR': 'Turkey',
  'PL': 'Poland',
  'NL': 'Netherlands',
  'SE': 'Sweden',
  'NO': 'Norway',
  'DK': 'Denmark',
  'FI': 'Finland',
  'CH': 'Switzerland',
  'AT': 'Austria',
  'BE': 'Belgium',
  'IE': 'Ireland',
  'PT': 'Portugal',
  'GR': 'Greece',
  'CZ': 'Czech Republic',
  'HU': 'Hungary',
  'RO': 'Romania',
  'BG': 'Bulgaria',
  'HR': 'Croatia',
  'SI': 'Slovenia',
  'SK': 'Slovakia',
  'LT': 'Lithuania',
  'LV': 'Latvia',
  'EE': 'Estonia',
  'LU': 'Luxembourg',
  'MT': 'Malta',
  'CY': 'Cyprus',
  'IS': 'Iceland',
  'LI': 'Liechtenstein',
  'MC': 'Monaco',
  'SM': 'San Marino',
  'VA': 'Vatican City',
  'AD': 'Andorra',
  'BY': 'Belarus',
  'UA': 'Ukraine',
  'MD': 'Moldova',
  'RS': 'Serbia',
  'ME': 'Montenegro',
  'BA': 'Bosnia and Herzegovina',
  'MK': 'North Macedonia',
  'AL': 'Albania',
  'XK': 'Kosovo',
  'IL': 'Israel',
  'JO': 'Jordan',
  'LB': 'Lebanon',
  'SY': 'Syria',
  'IQ': 'Iraq',
  'IR': 'Iran',
  'KW': 'Kuwait',
  'QA': 'Qatar',
  'BH': 'Bahrain',
  'OM': 'Oman',
  'YE': 'Yemen',
  'AF': 'Afghanistan',
  'PK': 'Pakistan',
  'BD': 'Bangladesh',
  'LK': 'Sri Lanka',
  'MV': 'Maldives',
  'BT': 'Bhutan',
  'NP': 'Nepal',
  'MM': 'Myanmar',
  'LA': 'Laos',
  'KH': 'Cambodia',
  'BN': 'Brunei',
  'TL': 'East Timor',
  'MN': 'Mongolia',
  'KZ': 'Kazakhstan',
  'UZ': 'Uzbekistan',
  'TM': 'Turkmenistan',
  'TJ': 'Tajikistan',
  'KG': 'Kyrgyzstan',
  'GE': 'Georgia',
  'AM': 'Armenia',
  'AZ': 'Azerbaijan',
  'AR': 'Argentina',
  'BO': 'Bolivia',
  'CL': 'Chile',
  'CO': 'Colombia',
  'EC': 'Ecuador',
  'GY': 'Guyana',
  'PY': 'Paraguay',
  'PE': 'Peru',
  'SR': 'Suriname',
  'UY': 'Uruguay',
  'VE': 'Venezuela',
  'FJ': 'Fiji',
  'PG': 'Papua New Guinea',
  'SB': 'Solomon Islands',
  'VU': 'Vanuatu',
  'NC': 'New Caledonia',
  'PF': 'French Polynesia',
  'WS': 'Samoa',
  'KI': 'Kiribati',
  'TV': 'Tuvalu',
  'TO': 'Tonga',
  'NR': 'Nauru',
  'PW': 'Palau',
  'FM': 'Micronesia',
  'MH': 'Marshall Islands',
  'CK': 'Cook Islands',
  'NU': 'Niue',
  'TK': 'Tokelau',
  'WF': 'Wallis and Futuna',
  'AS': 'American Samoa',
  'GU': 'Guam',
  'MP': 'Northern Mariana Islands',
  'VI': 'U.S. Virgin Islands',
  'PR': 'Puerto Rico',
  'DO': 'Dominican Republic',
  'HT': 'Haiti',
  'JM': 'Jamaica',
  'CU': 'Cuba',
  'BS': 'Bahamas',
  'BB': 'Barbados',
  'TT': 'Trinidad and Tobago',
  'AG': 'Antigua and Barbuda',
  'DM': 'Dominica',
  'GD': 'Grenada',
  'KN': 'Saint Kitts and Nevis',
  'LC': 'Saint Lucia',
  'VC': 'Saint Vincent and the Grenadines',
  'BZ': 'Belize',
  'CR': 'Costa Rica',
  'GT': 'Guatemala',
  'HN': 'Honduras',
  'NI': 'Nicaragua',
  'PA': 'Panama',
  'SV': 'El Salvador',
  'DZ': 'Algeria',
  'AO': 'Angola',
  'BW': 'Botswana',
  'BI': 'Burundi',
  'CM': 'Cameroon',
  'CV': 'Cape Verde',
  'CF': 'Central African Republic',
  'TD': 'Chad',
  'KM': 'Comoros',
  'CG': 'Republic of the Congo',
  'CD': 'Democratic Republic of the Congo',
  'CI': 'Ivory Coast',
  'DJ': 'Djibouti',
  'GQ': 'Equatorial Guinea',
  'ER': 'Eritrea',
  'ET': 'Ethiopia',
  'GA': 'Gabon',
  'GM': 'Gambia',
  'GH': 'Ghana',
  'GN': 'Guinea',
  'GW': 'Guinea-Bissau',
  'LS': 'Lesotho',
  'LR': 'Liberia',
  'LY': 'Libya',
  'MG': 'Madagascar',
  'MW': 'Malawi',
  'ML': 'Mali',
  'MR': 'Mauritania',
  'MU': 'Mauritius',
  'MZ': 'Mozambique',
  'NA': 'Namibia',
  'NE': 'Niger',
  'RW': 'Rwanda',
  'ST': 'São Tomé and Príncipe',
  'SN': 'Senegal',
  'SC': 'Seychelles',
  'SL': 'Sierra Leone',
  'SO': 'Somalia',
  'SS': 'South Sudan',
  'SD': 'Sudan',
  'SZ': 'Eswatini',
  'TZ': 'Tanzania',
  'TG': 'Togo',
  'TN': 'Tunisia',
  'UG': 'Uganda',
  'ZM': 'Zambia',
  'ZW': 'Zimbabwe'
};

const currencyByCountry: { [key: string]: string } = {
  'IN': 'INR', 'US': 'USD', 'GB': 'GBP', 'CA': 'CAD', 'AU': 'AUD', 'DE': 'EUR',
  'FR': 'EUR', 'IT': 'EUR', 'ES': 'EUR', 'JP': 'JPY', 'CN': 'CNY', 'KR': 'KRW',
  'BR': 'BRL', 'MX': 'MXN', 'RU': 'RUB', 'AE': 'AED', 'SA': 'SAR', 'EG': 'EGP',
  'ZA': 'ZAR', 'NG': 'NGN', 'KE': 'KES', 'TH': 'THB', 'SG': 'SGD', 'MY': 'MYR',
  'ID': 'IDR', 'PH': 'PHP', 'VN': 'VND', 'TR': 'TRY', 'PL': 'PLN', 'NL': 'EUR',
  'SE': 'SEK', 'NO': 'NOK', 'DK': 'DKK', 'FI': 'EUR', 'CH': 'CHF', 'AT': 'EUR',
  'BE': 'EUR', 'IE': 'EUR', 'PT': 'EUR', 'GR': 'EUR', 'IL': 'ILS', 'PK': 'PKR',
  'BD': 'BDT', 'LK': 'LKR', 'NP': 'NPR', 'QA': 'QAR', 'KW': 'KWD', 'BH': 'BHD',
  'OM': 'OMR', 'AR': 'ARS', 'CL': 'CLP', 'CO': 'COP', 'PE': 'PEN', 'NZ': 'NZD',
};

const DEFAULT_COUNTRY: CountryData = {
  country: 'India',
  countryCode: 'IN',
  flag: '🇮🇳',
  currency: 'INR',
  timezone: 'Asia/Kolkata',
};

export type LocationPermission = 'prompt' | 'granted' | 'denied' | 'detecting';

export const useCountryDetection = () => {
  const [countryData, setCountryData] = useState<CountryData>(DEFAULT_COUNTRY);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [permission, setPermission] = useState<LocationPermission>('prompt');

  /** Builds and persists CountryData from a resolved ISO country code */
  const applyCountryCode = useCallback((countryCode: string, timezone?: string) => {
    const code = countryCode.toUpperCase();
    const finalCountryData: CountryData = {
      country: countryNames[code] || code,
      countryCode: code,
      flag: countryFlags[code] || '🌍',
      currency: currencyByCountry[code] || 'USD',
      timezone: timezone || Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
    };

    setCountryData(finalCountryData);
    setPermission('granted');
    localStorage.setItem('detectedCountry', JSON.stringify(finalCountryData));
    localStorage.setItem('locationPermission', 'granted');
    window.dispatchEvent(new Event('countryChange'));
  }, []);

  /** Reverse-geocodes GPS coordinates into a country via a free, keyless API */
  const detectCountryFromCoords = useCallback(async (latitude: number, longitude: number) => {
    const response = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
    );
    if (!response.ok) throw new Error('Reverse geocoding failed');
    const data = await response.json();
    const countryCode = (data.countryCode || '').toUpperCase();
    if (!countryCode) throw new Error('No country resolved from coordinates');
    return countryCode;
  }, []);

  /** Performs the actual IP-based country detection (fallback when GPS is unavailable/denied) */
  const detectCountry = useCallback(async () => {
    try {
      setLoading(true);
      setPermission('detecting');
      setError(null);

      const services = [
        'https://ipapi.co/json/',
        'https://ip-api.com/json/',
        'https://api.country.is/',
      ];

      let countryInfo = null;

      for (const service of services) {
        try {
          const response = await fetch(service, {
            method: 'GET',
            headers: { 'Accept': 'application/json' },
          });

          if (response.ok) {
            const data = await response.json();

            if (data.country_code) {
              countryInfo = {
                countryCode: data.country_code.toUpperCase(),
                country: data.country_name || data.country,
                currency: data.currency || 'USD',
                timezone: data.timezone || 'UTC',
              };
            } else if (data.country) {
              countryInfo = {
                countryCode: data.country.toUpperCase(),
                country: data.country_name || data.country,
                currency: data.currency || 'USD',
                timezone: data.timezone || 'UTC',
              };
            }

            if (countryInfo) break;
          }
        } catch (serviceError) {
          console.log(`Service ${service} failed:`, serviceError);
          continue;
        }
      }

      if (!countryInfo) {
        countryInfo = {
          countryCode: 'IN',
          country: 'India',
          currency: 'INR',
          timezone: 'Asia/Kolkata',
        };
      }

      applyCountryCode(countryInfo.countryCode, countryInfo.timezone);
    } catch (err) {
      console.error('Country detection error:', err);
      setError('Failed to detect country');
      // Fall back to the safe default rather than leaving the UI stuck —
      // this is a silent background detection, so there's no button to retry from.
      setPermission('denied');
      localStorage.setItem('locationPermission', 'denied');
    } finally {
      setLoading(false);
    }
  }, [applyCountryCode]);

  /**
   * Silently asks the browser's native Geolocation API for the user's position.
   * This is what actually triggers the browser's built-in permission prompt —
   * there is no custom UI here by design. Whatever the user picks (allow or
   * block), we resolve to a usable country: GPS on allow, IP lookup on deny.
   */
  const detectViaGeolocation = useCallback(async () => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      await detectCountry();
      return;
    }

    setLoading(true);
    setPermission('detecting');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const countryCode = await detectCountryFromCoords(
            position.coords.latitude,
            position.coords.longitude
          );
          applyCountryCode(countryCode);
          setLoading(false);
        } catch (err) {
          console.error('Reverse geocoding failed, falling back to IP detection:', err);
          await detectCountry();
        }
      },
      async () => {
        // Permission denied, or position unavailable/timed out — fall back
        // to IP-based detection so the experience still works either way.
        await detectCountry();
      },
      { timeout: 8000, maximumAge: 10 * 60 * 1000 }
    );
  }, [applyCountryCode, detectCountry, detectCountryFromCoords]);

  // On mount: use cached country instantly if we have one, otherwise kick off
  // silent detection (geolocation first, IP fallback) with no button required.
  useEffect(() => {
    const storedCountry = localStorage.getItem('detectedCountry');
    const storedPermission = localStorage.getItem('locationPermission');

    if (storedCountry && (storedPermission === 'granted' || storedPermission === 'denied')) {
      try {
        setCountryData(JSON.parse(storedCountry));
        setPermission('granted');
        return;
      } catch {
        // fall through to fresh detection
      }
    }

    detectViaGeolocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /** Reset permission (allow user to re-trigger from settings) */
  const resetPermission = useCallback(() => {
    localStorage.removeItem('locationPermission');
    localStorage.removeItem('detectedCountry');
    setCountryData(DEFAULT_COUNTRY);
    setPermission('prompt');
    detectViaGeolocation();
  }, [detectViaGeolocation]);

  /** Manually update country data (e.g. from a country-picker UI) */
  const updateCountry = useCallback((newCountryData: CountryData) => {
    setCountryData(newCountryData);
    setPermission('granted');
    localStorage.setItem('detectedCountry', JSON.stringify(newCountryData));
    localStorage.setItem('locationPermission', 'granted');
    window.dispatchEvent(new Event('countryChange'));
  }, []);

  return {
    countryData,
    loading,
    error,
    permission,
    updateCountry,
    resetPermission,
  };
};
