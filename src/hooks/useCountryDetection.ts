"use client";

import { useState, useEffect } from 'react';

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

export const useCountryDetection = () => {
  const [countryData, setCountryData] = useState<CountryData | null>({
    country: 'India',
    countryCode: 'IN',
    flag: '🇮🇳',
    currency: 'INR',
    timezone: 'Asia/Kolkata'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const detectCountry = async () => {
      try {
        setLoading(true);
        setError(null);

        // Try multiple IP geolocation services for better reliability
        const services = [
          'https://ipapi.co/json/',
          'https://ip-api.com/json/',
          'https://api.country.is/',
          'https://ipinfo.io/json?token='
        ];

        let countryInfo = null;

        // Try each service until one works
        for (const service of services) {
          try {
            const response = await fetch(service, {
              method: 'GET',
              headers: {
                'Accept': 'application/json',
              },
            });

            if (response.ok) {
              const data = await response.json();
              
              // Handle different response formats
              if (data.country_code) {
                countryInfo = {
                  countryCode: data.country_code.toUpperCase(),
                  country: data.country_name || data.country,
                  currency: data.currency || 'USD',
                  timezone: data.timezone || 'UTC'
                };
              } else if (data.country) {
                countryInfo = {
                  countryCode: data.country.toUpperCase(),
                  country: data.country_name || data.country,
                  currency: data.currency || 'USD',
                  timezone: data.timezone || 'UTC'
                };
              }

              if (countryInfo) break;
            }
          } catch (serviceError) {
            console.log(`Service ${service} failed:`, serviceError);
            continue;
          }
        }

        // Fallback to a default country if all services fail
        if (!countryInfo) {
          console.log('All geolocation services failed, using default country');
          countryInfo = {
            countryCode: 'IN',
            country: 'India',
            currency: 'INR',
            timezone: 'Asia/Kolkata'
          };
        }

        // Get country name and flag
        const countryName = countryNames[countryInfo.countryCode] || countryInfo.country;
        const flag = countryFlags[countryInfo.countryCode] || '🌍';

        const finalCountryData: CountryData = {
          country: countryName,
          countryCode: countryInfo.countryCode,
          flag: flag,
          currency: countryInfo.currency,
          timezone: countryInfo.timezone
        };

        console.log('Country detected:', finalCountryData);
        setCountryData(finalCountryData);
        
        // Store in localStorage for persistence
        localStorage.setItem('detectedCountry', JSON.stringify(finalCountryData));
        
      } catch (err) {
        console.error('Country detection error:', err);
        setError('Failed to detect country');
        
        // Fallback to stored country or default
        const storedCountry = localStorage.getItem('detectedCountry');
        if (storedCountry) {
          console.log('Using stored country:', JSON.parse(storedCountry));
          setCountryData(JSON.parse(storedCountry));
        } else {
          console.log('No stored country, using default India');
          setCountryData({
            country: 'India',
            countryCode: 'IN',
            flag: '🇮🇳',
            currency: 'INR',
            timezone: 'Asia/Kolkata'
          });
        }
      } finally {
        setLoading(false);
      }
    };

    // Check if we have stored country data first
    const storedCountry = localStorage.getItem('detectedCountry');
    if (storedCountry) {
      setCountryData(JSON.parse(storedCountry));
      setLoading(false);
    } else {
      detectCountry();
    }
  }, []);

  const updateCountry = (newCountryData: CountryData) => {
    setCountryData(newCountryData);
    localStorage.setItem('detectedCountry', JSON.stringify(newCountryData));
  };

  return {
    countryData,
    loading,
    error,
    updateCountry
  };
};
