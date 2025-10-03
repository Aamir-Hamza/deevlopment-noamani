"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AuthForm } from "@/components/AuthForm";
import { AdminLogin } from "@/components/AdminLogin";
import { Button } from "@/components/ui/button";
import { Lock, X, LogIn, ExternalLink } from "lucide-react";
import Image from "next/image";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";

interface LoginModalProps {
  onClose: () => void;
  onLoginSuccess?: () => void;
}

export function LoginModal({ onClose, onLoginSuccess }: LoginModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const { addToCart } = useCart();
  const router = useRouter();

  const handleLoginSuccess = async () => {
    if (onLoginSuccess) {
      onLoginSuccess();
    }

    // Check for pending cart item in localStorage
    const pendingItem = localStorage.getItem("pendingCartItem");
    if (pendingItem) {
      try {
        const item = JSON.parse(pendingItem);
        await addToCart(item);
        localStorage.removeItem("pendingCartItem");
      } catch (error) {
        console.error("Error adding pending item to cart:", error);
      }
    }

    onClose();
  };

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
  };

  // Redirect directly to login page when modal opens
  React.useEffect(() => {
    onClose();
    router.push('/login');
  }, []);

  return null;
}
