"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Search, ShoppingBag, User, Menu, X, ChevronDown } from "lucide-react";
import { toast } from "react-hot-toast";
import Image from "next/image";
import { LoginModal } from "@/components/LoginModal";
import { CartProvider } from "@/context/CartContext";
import { products } from "@/data/products";
import { Kolker_Brush, Italianno } from 'next/font/google';
import { useCountry } from '@/hooks/useCountry';
import { CountryDisplay } from '@/components/CountryDisplay';

const kolker = Kolker_Brush({ weight: '400', subsets: ['latin'] });
const italianno = Italianno({ weight: '400', subsets: ['latin'] });

const navItems = [
  { name: "Bestsellers", href: "/bestsellers" },
  { name: "Fragrance", href: "/fragrance" },
  { name: "Recreations", href: "/product/recreations" },
  { name: "About Us", href: "/about" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const [profileImg, setProfileImg] = useState<string | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [pendingCartItem, setPendingCartItem] = useState<any>(null);
  const { countryData, loading: countryLoading, country: selectedCountry } = useCountry();
  const earthRef = useRef<HTMLDivElement>(null);
  const userEmailRef = useRef<string | null>(null);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const userDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (
        pathname === '/about/shipping' ||
        pathname === '/product/recreations' ||
        pathname === '/shop'
      ) {
        setIsScrolled(true);
      } else {
        setIsScrolled(window.scrollY > 50);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const userEmail = localStorage.getItem("userEmail");
      const userProfileImg = localStorage.getItem("profileImg");
      userEmailRef.current = userEmail;
      setProfileImg(userProfileImg);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setShowUserDropdown(false);
      }
    };

    if (showUserDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserDropdown]);

  useEffect(() => {
    const handleCartUpdate = () => {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      setCartItemsCount(cart.length);
    };

    handleCartUpdate();
    window.addEventListener("cartUpdated", handleCartUpdate);
    return () => window.removeEventListener("cartUpdated", handleCartUpdate);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userEmail");
    localStorage.removeItem("profileImg");
    localStorage.removeItem("cart");
    setProfileImg(null);
    userEmailRef.current = null;
    setShowUserDropdown(false);
    toast.success("Logged out successfully!");
    router.push("/");
  };

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setLoadingProducts(true);
    try {
      const filtered = products.filter((product) =>
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(filtered);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleRequireLogin = (item: any) => {
    setPendingCartItem(item);
    setShowLoginModal(true);
  };

  if (!isMounted) {
    return null;
  }

  return (
    <CartProvider>
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-lg"
            : "bg-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left side - Brand */}
            <div className="flex-shrink-0">
              <Link href="/" className="flex items-center">
                <Image
                  src="/Brand_logo/nlogo.png"
                  alt="Noamani"
                  width={40}
                  height={40}
                  className="h-10 w-auto"
                />
              </Link>
            </div>

            {/* Center - Navigation Items (Desktop) */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "text-sm font-medium transition-colors duration-200 hover:text-gray-600",
                    isScrolled ? "text-gray-900" : "text-white"
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Right side - Actions */}
            <div className="flex items-center space-x-4">
              {/* Search */}
              <button
                onClick={() => setShowSearchModal(true)}
                className={cn(
                  "p-2 rounded-full transition-colors duration-200 hover:bg-gray-100",
                  isScrolled ? "text-gray-900" : "text-white hover:bg-white/10"
                )}
              >
                <Search className="h-5 w-5" />
              </button>

              {/* Country Display - Auto-detected */}
              <CountryDisplay
                isScrolled={isScrolled}
                isMobileMenuOpen={isMobileMenuOpen}
              />

              {/* User Profile or Login */}
              {userEmailRef.current ? (
                <div className="relative" ref={userDropdownRef}>
                  <button
                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                    className="flex items-center space-x-2 p-2 rounded-full transition-colors duration-200 hover:bg-gray-100"
                  >
                    {profileImg ? (
                      <Image
                        src={profileImg}
                        alt="Profile"
                        width={32}
                        height={32}
                        className="rounded-full"
                      />
                    ) : (
                      <User className="h-6 w-6" />
                    )}
                    <span className={cn(
                      "text-sm font-medium",
                      isScrolled ? "text-gray-900" : "text-white"
                    )}>
                      {userEmailRef.current.split('@')[0]}
                    </span>
                    <ChevronDown className="h-4 w-4" />
                  </button>

                  {showUserDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                      <Link
                        href="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowUserDropdown(false)}
                      >
                        Profile
                      </Link>
                      <Link
                        href="/orders"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowUserDropdown(false)}
                      >
                        Orders
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => setShowLoginModal(true)}
                  className={cn(
                    "flex items-center space-x-2 px-4 py-2 rounded-full transition-colors duration-200",
                    isScrolled
                      ? "bg-gray-900 text-white hover:bg-gray-800"
                      : "bg-white/10 text-white hover:bg-white/20"
                  )}
                >
                  <User className="h-5 w-5" />
                  <span className="text-sm font-medium">Login</span>
                </button>
              )}

              {/* Cart */}
              <Link
                href="/cart"
                className="relative p-2 rounded-full transition-colors duration-200 hover:bg-gray-100"
              >
                <ShoppingBag className={cn(
                  "h-5 w-5",
                  isScrolled ? "text-gray-900" : "text-white"
                )} />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemsCount}
                  </span>
                )}
              </Link>

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-full transition-colors duration-200 hover:bg-gray-100"
              >
                {isMobileMenuOpen ? (
                  <X className={cn("h-6 w-6", isScrolled ? "text-gray-900" : "text-white")} />
                ) : (
                  <Menu className={cn("h-6 w-6", isScrolled ? "text-gray-900" : "text-white")} />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-t border-gray-200"
            >
              <div className="px-2 pt-2 pb-3 space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="block px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-100 rounded-md"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Login Modal */}
      {showLoginModal && (
        <LoginModal
          onClose={() => setShowLoginModal(false)}
          onLoginSuccess={() => {
            setShowLoginModal(false);
            window.location.reload();
          }}
        />
      )}
    </CartProvider>
  );
}
