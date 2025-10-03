'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertCircle } from 'lucide-react';

export default function CheckoutError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <AlertCircle className="h-12 w-12 text-red-500" />
        </div>
        <h1 className="text-2xl font-serif mb-4">Something went wrong!</h1>
        <p className="text-gray-600 mb-8">
          We encountered an error while processing your checkout. Please try again.
        </p>
        <div className="space-x-4">
          <button
            onClick={reset}
            className="bg-brand-dark text-white px-6 py-2 rounded-md hover:opacity-90 transition-opacity"
          >
            Try again
          </button>
          <Link
            href="/cart"
            className="inline-block border border-gray-300 px-6 py-2 rounded-md hover:bg-gray-50 transition-colors"
          >
            Return to cart
          </Link>
        </div>
      </div>
    </div>
  );
} 