'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import type { CartItem, CartContextType } from '@/types/cart'
import { toast } from 'react-hot-toast'
import { useRouter } from 'next/navigation'

const CartContext = createContext<CartContextType | undefined>(undefined)

interface CartProviderProps {
  children: React.ReactNode;
  onRequireLogin?: (pendingItem: CartItem) => void;
}

export function CartProvider({ children, onRequireLogin }: CartProviderProps) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Load cart from backend on mount
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await fetch('/api/cart')
        const data = await response.json()
        if (data.items) {
          setCart(data.items)
        }
      } catch (error) {
        console.error('Error fetching cart:', error)
        toast.error('Failed to load cart')
      } finally {
        setLoading(false)
      }
    }

    fetchCart()
  }, [])

  const addToCart = async (item: CartItem) => {
    // Check if user is logged in
    let userInfo = null;
    if (typeof window !== 'undefined') {
      userInfo = localStorage.getItem('userInfo');
    }
    if (!userInfo) {
      toast.error('Please login first to add to cart!');
      if (onRequireLogin) onRequireLogin(item);
      return;
    }
    try {
      // Optimistically update the cart
      setCart(prevCart => {
        const existingItem = prevCart.find(i => i.id === item.id)
        if (existingItem) {
          return prevCart.map(i => 
            i.id === item.id 
              ? { ...i, quantity: i.quantity + (item.quantity || 1) }
              : i
          )
        }
        return [...prevCart, { ...item, quantity: item.quantity || 1 }]
      })

      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(item),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || 'Failed to add item to cart')
      }

      // Update with server response
      setCart(data.items)
      toast.success('Item added to cart')
    } catch (error) {
      // Revert optimistic update on error
      const response = await fetch('/api/cart')
      const data = await response.json()
      setCart(data.items)
      console.error('Error adding to cart:', error)
      toast.error('Failed to add item to cart')
    }
  }

  const removeFromCart = async (itemId: string) => {
    try {
      // Optimistically update the cart
      setCart(prevCart => prevCart.filter(item => item.id !== itemId))

      const response = await fetch(`/api/cart?itemId=${itemId}`, {
        method: 'DELETE',
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || 'Failed to remove item from cart')
      }

      setCart(data.items)
      toast.success('Item removed from cart')
    } catch (error) {
      // Revert optimistic update on error
      const response = await fetch('/api/cart')
      const data = await response.json()
      setCart(data.items)
      console.error('Error removing from cart:', error)
      toast.error('Failed to remove item from cart')
    }
  }

  const updateQuantity = async (itemId: string, quantity: number) => {
    try {
      // Optimistically update the cart
      setCart(prevCart => 
        prevCart.map(item => 
          item.id === itemId ? { ...item, quantity } : item
        )
      )

      const response = await fetch('/api/cart', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ itemId, quantity }),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update cart')
      }

      setCart(data.items)
    } catch (error) {
      // Revert optimistic update on error
      const response = await fetch('/api/cart')
      const data = await response.json()
      setCart(data.items)
      console.error('Error updating cart:', error)
      toast.error('Failed to update cart')
    }
  }

  const clearCart = async () => {
    try {
      // Optimistically clear the cart
      setCart([])

      const response = await fetch('/api/cart', {
        method: 'DELETE',
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.message || 'Failed to clear cart')
      }

      toast.success('Cart cleared')
    } catch (error) {
      // Revert optimistic update on error
      const response = await fetch('/api/cart')
      const data = await response.json()
      setCart(data.items)
      console.error('Error clearing cart:', error)
      toast.error('Failed to clear cart')
    }
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        loading
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
} 