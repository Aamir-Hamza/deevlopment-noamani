'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useCart } from '@/context/CartContext'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Minus, Plus, Trash2, ArrowLeft, ShoppingBag } from 'lucide-react'
import { toast } from 'react-hot-toast'
import Image from 'next/image'
import { useCountry } from '@/hooks/useCountry'
import { formatPrice, getPrice } from '@/lib/priceUtils'

export default function CartPage() {
  const router = useRouter()
  const { cart, removeFromCart, updateQuantity } = useCart()
  const { country } = useCountry();
  const [isClient, setIsClient] = useState(false)
  const [subtotal, setSubtotal] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [checkoutLoading, setCheckoutLoading] = useState(false)

  useEffect(() => {
    setIsClient(true)
    const total = cart.reduce((sum, item) => {
      const priceInBaseCurrency = item.price;
      const { value } = getPrice(priceInBaseCurrency, country);
      return sum + (value * item.quantity);
    }, 0)
    setSubtotal(total)
    setIsLoading(false)
  }, [cart, country])

  const handleQuantityChange = async (itemId: string, newQuantity: number) => {
    try {
      if (newQuantity >= 1) {
        await updateQuantity(itemId, newQuantity)
        toast.success('Cart updated successfully')
      }
    } catch (error) {
      toast.error('Failed to update cart')
    }
  }

  const handleRemoveFromCart = async (itemId: string) => {
    try {
      await removeFromCart(itemId)
      toast.success('Item removed from cart')
    } catch (error) {
      toast.error('Failed to remove item')
    }
  }

  if (!isClient || isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
        </div>
      </div>
    )
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen">
        {/* Hero Section */}
        <div className="relative h-[60vh] bg-black text-white flex items-center justify-center">
          <Image
            src="https://images.pexels.com/photos/3910071/pexels-photo-3910071.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
            alt="Empty Cart"
            fill
            className="object-cover opacity-50"
          />
          <div className="relative z-10 text-center">
            <motion.h1 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-5xl font-light mb-4"
            >
              YOUR CART
            </motion.h1>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="text-xl font-light"
            >
              Begin your fragrance journey
            </motion.p>
          </div>
        </div>

        {/* Empty Cart Content */}
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <ShoppingBag className="mx-auto h-24 w-24 text-gray-300 mb-6" />
            <h2 className="text-3xl font-light mb-4">Your Cart is Empty</h2>
            <p className="text-gray-500 mb-8">Discover our collection of luxury fragrances</p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Continue Shopping
            </Link>
          </motion.div>
        </div>
      </div>
    )
  }

  const { symbol } = getPrice(0, country);
  const shippingThreshold = country === 'IN' ? 8000 : 100;
  const shippingCost = country === 'IN' ? 80 : 10;
  const shipping = subtotal >= shippingThreshold ? 0 : shippingCost;
  const total = subtotal + shipping

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[60vh] bg-black text-white flex items-center justify-center">
        <Image
          src="https://images.pexels.com/photos/3910071/pexels-photo-3910071.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
          alt="Shopping Cart"
          fill
          className="object-cover opacity-50"
        />
        <div className="relative z-10 text-center">
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-5xl font-light mb-4"
          >
            YOUR CART
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-xl font-light"
          >
            Complete your fragrance selection
          </motion.p>
        </div>
      </div>

      {/* Cart Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-lg shadow-sm">
              <ul className="divide-y divide-gray-200">
                {cart.map((item) => (
                  <motion.li
                    key={item.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="p-6"
                  >
                    <div className="flex gap-6">
                      {item.image && (
                        <div className="relative h-32 w-32 flex-shrink-0 overflow-hidden rounded-md">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-full w-full object-cover object-center"
                          />
                        </div>
                      )}
                      <div className="flex flex-1 flex-col">
                        <div className="flex justify-between">
                          <div>
                            <h3 className="text-lg font-medium text-gray-900">
                              {item.name}
                            </h3>
                            {item.size && (
                              <p className="mt-1 text-sm text-gray-500">
                                Size: {item.size}
                              </p>
                            )}
                          </div>
                          <p className="text-lg font-medium text-gray-900">
                            {formatPrice(item.price * item.quantity, country)}
                          </p>
                        </div>
                        <div className="flex items-center justify-between mt-6">
                          <div className="flex items-center gap-4">
                            <button
                              onClick={() => handleQuantityChange(item.id, Math.max(1, item.quantity - 1))}
                              className="rounded-full p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="w-8 text-center text-gray-900 text-lg">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                              className="rounded-full p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                          <button
                            onClick={() => handleRemoveFromCart(item.id)}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-lg shadow-sm p-8 sticky top-24">
              <h2 className="text-2xl font-light text-gray-900 mb-6">Order Summary</h2>
              <div className="space-y-4">
                <div className="flex justify-between text-base">
                  <p className="text-gray-500">Subtotal</p>
                  <p className="text-gray-900">{symbol}{subtotal}</p>
                </div>
                <div className="flex justify-between text-base">
                  <p className="text-gray-500">Shipping</p>
                  <p className="text-gray-900">
                    {shipping === 0 ? 'Free' : `${symbol}${shipping}`}
                  </p>
                </div>
                {shipping > 0 && (
                  <p className="text-sm text-gray-500 italic">
                    Free shipping on orders over {symbol}{shippingThreshold}
                  </p>
                )}
                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between text-lg font-medium">
                    <p className="text-gray-900">Total</p>
                    <p className="text-gray-900">{symbol}{total}</p>
                  </div>
                </div>
                <button
                  onClick={async () => {
                    setCheckoutLoading(true);
                    await router.push('/checkout');
                    setCheckoutLoading(false);
                  }}
                  className="w-full bg-black text-white py-4 rounded-lg hover:opacity-90 transition-opacity mt-6 text-lg font-light flex items-center justify-center gap-2"
                  disabled={checkoutLoading}
                >
                  {checkoutLoading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                      </svg>
                      Please wait...
                    </>
                  ) : (
                    'Proceed to Checkout'
                  )}
                </button>
                <Link
                  href="/shop"
                  className="block text-center text-sm text-gray-500 hover:text-gray-700 mt-4"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}