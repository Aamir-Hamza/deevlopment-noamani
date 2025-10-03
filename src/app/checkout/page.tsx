'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { useCountry } from '@/hooks/useCountry';
import { getPrice } from '@/lib/priceUtils';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CheckoutPage() {
  const router = useRouter();
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

  const { country } = useCountry();

  const { value: subtotal } = getPrice(
    cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    country
  );

  const shippingThreshold = country === 'IN' ? 8000 : 100;
  const shippingCost = country === 'IN' ? 80 : 10;
  const shipping = subtotal >= shippingThreshold ? 0 : shippingCost;
  const total = subtotal + shipping;
  const { symbol } = getPrice(0, country);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const initializePayment = async () => {
    if (!validateForm()) {
      toast.error('Please fill in all required fields');
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
          amount: total,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      // Initialize Razorpay
      const options = {
        key: 'rzp_test_Y1SVuHN3IsyjgD',
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
      toast.error('Payment initialization failed');
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
        totalAmount: total,
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
      toast.success('Payment successful!');
      router.push('/order-confirmation');
    } catch (error) {
      console.error('Error processing payment:', error);
      toast.error('Error processing payment');
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

  return (
    <div className="min-h-screen bg-white py-8 sm:py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-12">
          {/* Contact Information Form */}
          <div className="mb-12 lg:mb-0">
            <h1 className="text-2xl sm:text-3xl font-light mb-6 sm:mb-8">Checkout</h1>
            
            <div className="space-y-6">
              <div>
                <h2 className="text-lg sm:text-xl font-light mb-4">Contact Information</h2>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Email"
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              <div>
                <h2 className="text-lg sm:text-xl font-light mb-4">Shipping Address</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    placeholder="First name"
                    className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  />
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    placeholder="Last name"
                    className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Address"
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black mb-4"
                />
                <input
                  type="text"
                  name="apartment"
                  value={formData.apartment}
                  onChange={handleInputChange}
                  placeholder="Apartment, suite, etc. (optional)"
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black mb-4"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="City"
                    className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  />
                  <input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    placeholder="ZIP code"
                    className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                  />
                </div>
              </div>

              <div>
                <h2 className="text-lg sm:text-xl font-light mb-4">Contact Details</h2>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Phone"
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="bg-gray-50 p-6 sm:p-8 rounded-lg">
            <h2 className="text-xl sm:text-2xl font-light mb-6">Your Order</h2>
            <div className="space-y-4">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-white border p-1 rounded-md">
                      <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                    </div>
                    <div>
                      <p className="font-medium text-sm sm:text-base">{item.name}</p>
                      <p className="text-xs sm:text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="font-medium text-sm sm:text-base">{symbol}{getPrice(item.price * item.quantity, country).value}</p>
                </div>
              ))}
            </div>
            <div className="border-t my-6"></div>
            <div className="space-y-2 text-sm sm:text-base">
              <div className="flex justify-between">
                <p>Subtotal</p>
                <p>{symbol}{subtotal}</p>
              </div>
              <div className="flex justify-between">
                <p>Shipping</p>
                <p>{shipping === 0 ? 'Free' : `${symbol}${shipping}`}</p>
              </div>
            </div>
            <div className="border-t my-6"></div>
            <div className="flex justify-between text-lg sm:text-xl font-bold">
              <p>Total</p>
              <p>{symbol}{total}</p>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={initializePayment}
              disabled={isLoading}
              className={`w-full bg-black text-white py-3 sm:py-4 mt-6 rounded-md text-base sm:text-lg ${
                isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:opacity-90'
              }`}
            >
              {isLoading ? 'Processing...' : 'Proceed to Payment'}
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
} 