'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { ArrowLeft } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useCountry } from '@/hooks/useCountry';
import { formatPrice } from '@/lib/priceUtils';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CheckoutPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const { cart, clearCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    apartment: '',
    city: '',
    zipCode: '',
    phone: '',
  });

  const { countryData } = useCountry();
  const currency = countryData?.currency;

  // Everything that actually gets charged (Razorpay order, saved order record)
  // must stay in raw INR — Razorpay only ever processes INR here. `currency`
  // is used purely to render an estimate for the visitor below.
  const subtotalINR = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingThresholdINR = 8000;
  const shippingCostINR = 80;
  const shippingINR = subtotalINR >= shippingThresholdINR ? 0 : shippingCostINR;
  const totalINR = subtotalINR + shippingINR;

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (cart.length === 0) {
      router.replace('/cart');
    }
  }, [cart, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const initializePayment = async () => {
    if (!validateForm()) {
      toast.error(t('checkout.fillRequired'));
      return;
    }

    setIsLoading(true);
    try {
      // Create order on server
      const response = await fetch('/api/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: totalINR,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      // Initialize Razorpay
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: data.amount * 100,
        currency: data.currency,
        name: 'Luxury Perfumes',
        description: 'Thank you for your purchase',
        order_id: data.orderId,
        handler: async function (response: any) {
          // Handle successful payment
          await handlePaymentSuccess(response);
        },
        prefill: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
        },
        theme: {
          color: '#000000',
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.error('Payment Error:', error);
      toast.error(t('checkout.paymentInitFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentSuccess = async (response: any) => {
    try {
      // Verify payment first
      const verifyResponse = await fetch('/api/payment/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          razorpay_order_id: response.razorpay_order_id,
          razorpay_payment_id: response.razorpay_payment_id,
          razorpay_signature: response.razorpay_signature,
        }),
      });

      if (!verifyResponse.ok) {
        throw new Error('Payment verification failed');
      }

      // Save order details to your database
      const orderData = {
        items: cart.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          name: item.name,
          price: item.price,
          image: item.image,
          description: item.description,
          category: item.category,
          size: item.size,
          fragrance: item.fragrance,
        })),
        totalAmount: totalINR,
        shippingAddress: {
          name: `${formData.firstName} ${formData.lastName}`,
          street: formData.address,
          apartment: formData.apartment,
          city: formData.city,
          zipCode: formData.zipCode,
        },
        paymentInfo: {
          razorpayOrderId: response.razorpay_order_id,
          razorpayPaymentId: response.razorpay_payment_id,
          razorpaySignature: response.razorpay_signature,
          status: 'completed',
          method: response.method || 'card',
          email: formData.email,
          contact: formData.phone || '',
          cardNetwork: response.card?.network,
          cardLast4: response.card?.last4,
          cardIssuer: response.card?.issuer,
          transactionTime: new Date().toISOString(),
          currency: 'INR'
        },
      };

      const saveOrderResponse = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!saveOrderResponse.ok) {
        throw new Error('Failed to save order');
      }

      await clearCart();
      toast.success(t('checkout.paymentSuccessful'));
      router.push('/order-confirmation');
    } catch (error) {
      console.error('Error processing payment:', error);
      toast.error(t('checkout.paymentError'));
    }
  };

  const validateForm = () => {
    return (
      formData.email &&
      formData.firstName &&
      formData.lastName &&
      formData.address &&
      formData.city &&
      formData.zipCode &&
      formData.phone
    );
  };

  if (cart.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Minimal checkout header — keeps branding and a way back without the full nav/promo distractions */}
      <div className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-semibold tracking-wide text-gray-900" style={{ fontFamily: 'Didot, serif' }}>
            Noamani
          </Link>
          <Link
            href="/cart"
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            {t('checkout.backToCart')}
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="lg:grid lg:grid-cols-2 lg:gap-12">
          {/* Contact Information Form */}
          <div className="mb-12 lg:mb-0">
            <h1 className="text-2xl sm:text-3xl font-light mb-6 sm:mb-8">{t('checkout.checkout')}</h1>

            <div className="space-y-6">
              <div>
                <h2 className="text-lg sm:text-xl font-light mb-4">{t('checkout.contactInformation')}</h2>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder={t('checkout.email') as string}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              <div>
                <h2 className="text-lg sm:text-xl font-light mb-4">{t('checkout.shippingAddress')}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder={t('checkout.firstName') as string}
                    className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  />
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder={t('checkout.lastName') as string}
                    className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder={t('checkout.address') as string}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black mb-4"
                />
                <input
                  type="text"
                  name="apartment"
                  value={formData.apartment}
                  onChange={handleInputChange}
                  placeholder={t('checkout.apartment') as string}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black mb-4"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder={t('checkout.city') as string}
                    className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  />
                  <input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    placeholder={t('checkout.zipCode') as string}
                    className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
              </div>

              <div>
                <h2 className="text-lg sm:text-xl font-light mb-4">{t('checkout.contactDetails')}</h2>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder={t('checkout.phone') as string}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-gray-50 p-6 sm:p-8 rounded-lg">
            <h2 className="text-xl sm:text-2xl font-light mb-6">{t('checkout.yourOrder')}</h2>
            <div className="space-y-4">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-white border p-1 rounded-md">
                      <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                    </div>
                    <div>
                      <p className="font-medium text-sm sm:text-base">{item.name}</p>
                      <p className="text-xs sm:text-sm text-gray-500">{t('checkout.qty')}: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="font-medium text-sm sm:text-base">{formatPrice(item.price * item.quantity, currency)}</p>
                </div>
              ))}
            </div>
            <div className="border-t my-6"></div>
            <div className="space-y-2 text-sm sm:text-base">
              <div className="flex justify-between">
                <p>{t('cart.subtotal')}</p>
                <p>{formatPrice(subtotalINR, currency)}</p>
              </div>
              <div className="flex justify-between">
                <p>{t('cart.shipping')}</p>
                <p>{shippingINR === 0 ? t('cart.free') : formatPrice(shippingINR, currency)}</p>
              </div>
            </div>
            <div className="border-t my-6"></div>
            <div className="flex justify-between text-lg sm:text-xl font-bold">
              <p>{t('cart.total')}</p>
              <p>{formatPrice(totalINR, currency)}</p>
            </div>
            {currency && currency.toUpperCase() !== 'INR' && (
              <p className="text-xs text-gray-400 mt-2 text-right">
                {t('checkout.approxCurrencyNote', { amount: formatPrice(totalINR, 'INR') })}
              </p>
            )}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={initializePayment}
              disabled={isLoading}
              className={`w-full bg-black text-white py-3 sm:py-4 mt-6 rounded-md text-base sm:text-lg ${
                isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:opacity-90'
              }`}
            >
              {isLoading ? t('checkout.processing') : t('checkout.proceedToPayment')}
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}