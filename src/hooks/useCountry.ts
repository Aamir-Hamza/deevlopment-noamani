import { useState, useEffect } from 'react';
import { useCountryDetection } from './useCountryDetection';

export const useCountry = () => {
  const { countryData, loading, updateCountry: updateDetectedCountry } = useCountryDetection();
  const [selectedCountry, setSelectedCountry] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('selectedCountry') || countryData?.countryCode || 'IN';
    }
    return 'IN';
  });

  useEffect(() => {
    // Update selected country when detected country changes
    if (countryData && !localStorage.getItem('selectedCountry')) {
      setSelectedCountry(countryData.countryCode);
      localStorage.setItem('selectedCountry', countryData.countryCode);
    }
  }, [countryData]);

  useEffect(() => {
    const updateCountry = () => {
      const newCountry = localStorage.getItem('selectedCountry') || countryData?.countryCode || 'IN';
      setSelectedCountry(newCountry);
    };

    window.addEventListener('storage', updateCountry);
    window.addEventListener('countryChange', updateCountry);

    return () => {
      window.removeEventListener('storage', updateCountry);
      window.removeEventListener('countryChange', updateCountry);
    };
  }, [countryData]);

  const updateCountry = (newCountry: string) => {
    localStorage.setItem('selectedCountry', newCountry);
    setSelectedCountry(newCountry);
    window.dispatchEvent(new Event('countryChange'));
  };

  return { 
    country: selectedCountry, 
    setCountry: updateCountry,
    countryData,
    loading
  };
}; 