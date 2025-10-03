'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { CheckCircleIcon } from '@heroicons/react/24/outline'

export default function OrderSuccessPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to home after 5 seconds
    const timeout = setTimeout(() => {
      router.push('/')
    }, 5000)

    return () => clearTimeout(timeout)
  }, [router])

  return (
    <div className="min-h-screen bg-white pt-32">
      <div className="mx-auto max-w-2xl px-4 text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          className="mb-8 flex justify-center"
        >
          <CheckCircleIcon className="h-24 w-24 text-green-500" />
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-4 text-3xl font-semibold"
        >
          Order Placed Successfully!
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8 text-gray-600"
        >
          Thank you for your purchase. Your order has been confirmed and will be shipped soon.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="space-x-4"
        >
          <button
            onClick={() => router.push('/shop')}
            className="rounded-lg bg-black px-8 py-3 text-white hover:bg-gray-800"
          >
            Continue Shopping
          </button>
          <button
            onClick={() => router.push('/orders')}
            className="rounded-lg border border-black px-8 py-3 hover:bg-gray-50"
          >
            View Orders
          </button>
        </motion.div>
      </div>
    </div>
  )
} 