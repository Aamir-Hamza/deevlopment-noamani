"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Search,
  User,
  ShoppingBag,
  Menu,
  X,
  Droplets,
  Star,
  Sparkles,
  Info
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import MegaMenu from "./MegaMenu";
import { cn } from "@/lib/utils";
import { useCart } from "@/context/CartContext";
import {
  ShoppingBagIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { useRouter, usePathname } from "next/navigation";
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

interface UserInfo {
  name: string;
  email: string;
}

interface AdminInfo {
  name: string;
  email: string;
  role: string;
}

export default function Navbar() {
  // All hooks at the top
  const { cart, clearCart } = useCart();
  const router = useRouter();
  const pathname = usePathname();
  const isFixedNavPage = ["/shop", "/bestsellers", "/fragrance", "/about"].includes(pathname ?? "");
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [adminInfo, setAdminInfo] = useState<AdminInfo | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [cartItemsCount, setCartItemsCount] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const [profileImg, setProfileImg] = useState<string | null>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [pendingCartItem, setPendingCartItem] = useState<any>(null);
  const { countryData, loading: countryLoading, country: selectedCountry } = useCountry();
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
      // Always scrolled style for /about/shipping, /product/recreations, /shop, and all product pages
      if (
        pathname === '/about/shipping' ||
        pathname === '/product/recreations' ||
        pathname === '/shop' ||
        (pathname && pathname.startsWith("/product/"))
      ) {
        setIsScrolled(true);
      } else {
        setIsScrolled(window.scrollY > 0);
      }
    };
    window.addEventListener("scroll", handleScroll);
    // Call once on mount to set initial state
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  const handleProfileImgUpdate = () => {
    const userEmail = userEmailRef.current;
    if (userEmail) {
      const updatedImg = localStorage.getItem(`profileImg_${userEmail}`);
      setProfileImg(updatedImg || null);
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedAdminInfo = localStorage.getItem("adminInfo");
      const storedUserInfo = localStorage.getItem("userInfo");
      let userEmail: string | null = null;
      if (storedAdminInfo) {
        setAdminInfo(JSON.parse(storedAdminInfo));
        setUserInfo(null);
        userEmail = JSON.parse(storedAdminInfo).email;
      } else if (storedUserInfo) {
        setUserInfo(JSON.parse(storedUserInfo));
        setAdminInfo(null);
        userEmail = JSON.parse(storedUserInfo).email;
      }
      userEmailRef.current = userEmail;
      if (userEmail) {
        const storedImg = localStorage.getItem(`profileImg_${userEmail}`);
        setProfileImg(storedImg || null);
      } else {
        setProfileImg(null);
      }
    }
  }, []);

  useEffect(() => {
    window.addEventListener("profileImgUpdated", handleProfileImgUpdate);
    return () =>
      window.removeEventListener("profileImgUpdated", handleProfileImgUpdate);
  }, []);

  useEffect(() => {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    setCartItemsCount(count);
  }, [cart]);


  useEffect(() => {
    const handleAdminLogout = () => {
      setAdminInfo(null);
      setUserInfo(null);
    };
    window.addEventListener("adminLogout", handleAdminLogout);
    return () => window.removeEventListener("adminLogout", handleAdminLogout);
  }, []);

  useEffect(() => {
    const handleUserLogin = () => {
      if (typeof window !== "undefined") {
        const storedAdminInfo = localStorage.getItem("adminInfo");
        const storedUserInfo = localStorage.getItem("userInfo");
        let userEmail: string | null = null;
        if (storedAdminInfo) {
          setAdminInfo(JSON.parse(storedAdminInfo));
          setUserInfo(null);
          userEmail = JSON.parse(storedAdminInfo).email;
        } else if (storedUserInfo) {
          setUserInfo(JSON.parse(storedUserInfo));
          setAdminInfo(null);
          userEmail = JSON.parse(storedUserInfo).email;
        }
        userEmailRef.current = userEmail;
        if (userEmail) {
          const storedImg = localStorage.getItem(`profileImg_${userEmail}`);
          setProfileImg(storedImg || null);
        } else {
          setProfileImg(null);
        }
      }
    };
    window.addEventListener("userLogin", handleUserLogin);
    return () => window.removeEventListener("userLogin", handleUserLogin);
  }, []);

  useEffect(() => {
    if (showSearchModal) {
      setLoadingProducts(true);
      fetch("/api/products")
        .then((res) => res.json())
        .then((data) => {
          setAllProducts(data);
          setLoadingProducts(false);
        })
        .catch(() => setLoadingProducts(false));
    }
  }, [showSearchModal]);

  useEffect(() => {
    function handleClickOutsideUserDropdown(event: MouseEvent) {
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    }
    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutsideUserDropdown);
    } else {
      document.removeEventListener("mousedown", handleClickOutsideUserDropdown);
    }
    return () => {
      if (typeof document !== 'undefined') {
      document.removeEventListener("mousedown", handleClickOutsideUserDropdown);
      }
    };
  }, [showDropdown]);

  // Function to truncate username
  const getTruncatedName = (name: string) => {
    if (name.length > 12) {
      return name.substring(0, 12) + "...";
    }
    return name;
  };

  // Early returns after all hooks
  if (!isMounted) return null;
  if (
    (pathname && pathname.startsWith("/admin")) ||
    (pathname && pathname.startsWith("/auth"))
  )
    return null;

  const handleLogout = async () => {
    if (typeof window !== "undefined") {
      await clearCart();
      localStorage.removeItem("adminInfo");
      setAdminInfo(null);
      setShowDropdown(false);
      router.push("/");
      toast.success("Logged out successfully", {
        icon: "👋",
        duration: 3000,
      });
    }
  };

  const handleUserLogout = async () => {
    if (typeof window !== "undefined") {
      await clearCart();
      localStorage.removeItem("userInfo");
      setUserInfo(null);
      setShowDropdown(false);
      toast.success("Logged out successfully", {
        icon: "👋",
        duration: 3000,
      });
    }
  };


  // Add this function to handle requiring login for cart
  const handleRequireLogin = (item: any) => {
    setPendingCartItem(item);
    setShowLoginModal(true);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    const results = allProducts.filter(
      (p) =>
        (p.name && p.name.toLowerCase().includes(query.toLowerCase())) ||
        (p.description &&
          p.description.toLowerCase().includes(query.toLowerCase()))
    );
    setSearchResults(results);
  };

  const handleProductClick = (productId: string) => {
    setShowSearchModal(false);
    setSearchQuery("");
    setSearchResults([]);
    router.push(`/product/${productId}`);
  };

  // Determine nav text color for submenu
  const navTextColor = (!isScrolled && !isMobileMenuOpen) ? 'text-white' : 'text-black';

  return (
    <CartProvider onRequireLogin={handleRequireLogin}>
      <header
        className={cn(
          pathname === "/about/shipping" || pathname === "/about/returns"
            ? "fixed top-0 left-0 right-0 z-50 bg-white shadow-sm"
            : pathname && pathname.startsWith("/product/")
              ? "fixed top-0 left-0 right-0 z-50 bg-white shadow-md"
              : "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          // On product details page, always use white background with shadow
          pathname?.startsWith("/product/")
            ? "bg-white shadow-md"
            : (isScrolled || isMobileMenuOpen)
              ? "bg-white shadow-sm"
              : "bg-black/30 backdrop-blur-md" // <-- light black + blur for luxury look
        )}
      >
        <div
          className={cn(
            pathname === '/about/shipping'
              ? 'w-full px-4 sm:px-6 lg:px-8 bg-white'
              : 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'
          )}
          style={pathname === '/about/shipping' ? { backgroundColor: '#fff', maxWidth: '100%', margin: 0 } : {}}
        >
          {/* Unscrolled: 2-row luxury hero, Scrolled: 1-row sticky */}
          {isScrolled ||
          (pathname && pathname.startsWith("/product/")) ||
          pathname === "/about/shipping" ||
          pathname === "/about/returns" ||
          pathname === "/about/faqs" ? (
            <div
              className={cn(
                "relative flex items-center justify-between hidden md:flex",
                pathname && pathname.startsWith("/product/")
                  ? "h-16 md:h-18 py-2"
                  : "h-16 md:h-20"
              )}
              style={{
                transition: "height 0.5s",
                minHeight: pathname && pathname.startsWith("/product/") ? "64px" : "64px",
                alignItems: "center",
              }}
            >
              {/* Brand Name (left) */}
              <div
                className="flex items-center flex-none w-auto pl-0 ml-0"
                style={{ alignSelf: "center", height: "100%" }}
              >
                <Link
                  href="/"
                  className={cn(
                    `transition-all duration-500 font-extrabold tracking-wider select-none ${italianno.className}`,
                    pathname === '/shop' 
                      ? 'text-lg md:text-xl' 
                      : pathname && pathname.startsWith("/product/")
                        ? 'text-xl md:text-2xl'
                        : 'text-2xl md:text-3xl'
                  )}
                  style={{
                    letterSpacing: "0.08em",
                    color: "#000",
                  }}
                >
                  Noamani
                </Link>
              </div>
              {/* Nav Links (center, less space when scrolled) */}
              <nav className="hidden md:flex flex-1 justify-center px-4">
                <ul
                  className={cn(
                    "flex items-center justify-between gap-6",
                    pathname && pathname.startsWith("/product/")
                      ? "w-full max-w-3xl gap-4"
                      : (isFixedNavPage || !isScrolled)
                        ? "w-full max-w-3xl"
                        : "w-full max-w-2xl"
                  )}
                >
                  {navItems.map((item) => {
                    // Determine if this nav item should be white or black (same as text)
                    const isWhite = !isScrolled && !isMobileMenuOpen;
                    return (
                    <li
                      key={item.name}
                      className="relative group"
                      onMouseEnter={() => {
                        if (item.name !== "About Us" && item.name !== "Recreations") {
                          setActiveMenu(item.name);
                        } else {
                          setActiveMenu(null);
                        }
                      }}
                    >
                      <Link
                        href={item.href}
                        className={cn(
                          "tracking-wider py-2 transition-colors duration-200 flex items-center font-semibold",
                          pathname && pathname.startsWith("/product/")
                            ? "text-base"
                            : "text-lg",
                          pathname &&
                            (pathname.startsWith("/product/") ||
                              pathname === "/about/shipping" ||
                              pathname === "/about/returns" ||
                              pathname === "/about/faqs")
                            ? "text-black hover:text-gray-600"
                              : isWhite
                                ? "text-white"
                            : "text-black",
                          activeMenu === item.name
                            ? "font-bold"
                            : "font-semibold",
                          item.name === "About Us" &&
                            pathname === "/about" &&
                            "pointer-events-none opacity-70"
                        )}
                        style={{ fontFamily: 'Didot, serif', fontWeight: 'bold' }}
                      >
                          {/* Icon before nav text */}
                          {/* {item.name === 'Shop All' && <ShoppingBag size={18} color={isWhite ? '#fff' : '#000'} className="mr-2 drop-shadow" />} */}
                          {/* {item.name === 'Bestsellers' && <Star size={18} color={isWhite ? '#fff' : '#000'} className="mr-2 drop-shadow" />} */}
                          {/* {item.name === 'Fragrance' && <Droplets size={18} color={isWhite ? '#fff' : '#000'} className="mr-2 drop-shadow" />} */}
                          {/* {item.name === 'Recreations' && <Sparkles size={18} color={isWhite ? '#fff' : '#000'} className="mr-2 drop-shadow" />} */}
                          {/* {item.name === 'About Us' && <Info size={18} color={isWhite ? '#fff' : '#000'} className="mr-2 drop-shadow" />} */}
                        {item.name}
                      </Link>
                      {activeMenu === item.name && item.name !== "About Us" && (
                        <motion.div
                          className="absolute bottom-0 left-0 right-0 h-0.5"
                          style={{
                            background:
                              pathname &&
                              (pathname.startsWith("/product/") ||
                                pathname === "/about/shipping" ||
                                pathname === "/about/returns" ||
                                pathname === "/about/faqs")
                                ? "#000"
                                : "#000",
                          }}
                          layoutId="underline"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        />
                      )}
                    </li>
                    );
                  })}
                </ul>
              </nav>
              {/* Right side icons (less space when scrolled) */}
              <div
                className={cn(
                  "flex flex-row items-center ml-auto",
                  pathname && pathname.startsWith("/product/")
                    ? "space-x-3"
                    : "space-x-4"
                )}
                style={{ alignItems: "center", height: "100%" }}
              >
                <button
                  className={cn(
                    "hover:opacity-70 transition-opacity",
                    !isScrolled &&
                      (pathname === "/shop/all" || pathname === "/shop/new")
                      ? "text-black"
                      : pathname &&
                        (pathname.startsWith("/product/") ||
                          pathname === "/about/shipping" ||
                          pathname === "/about/returns" ||
                          pathname === "/about/faqs")
                      ? "text-black"
                      : isScrolled || isMobileMenuOpen
                      ? "text-brand-dark"
                      : "text-white"
                  )}
                  onClick={() => setShowSearchModal(true)}
                  aria-label="Search"
                  type="button"
                >
                  <Search className="h-5 w-5" />
                </button>
                {adminInfo ? (
                  <div className="relative">
                    <button
                      onClick={() => setShowDropdown(!showDropdown)}
                      className={cn(
                        "flex items-center space-x-2 text-sm font-medium hover:opacity-70 transition-opacity",
                        isScrolled || isMobileMenuOpen
                          ? "text-brand-dark"
                          : "text-white"
                      )}
                    >
                      <UserCircleIcon className="h-6 w-6" />
                      <span>Admin</span>
                    </button>
                    {showDropdown && (
                      <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 z-[60]">
                        <Link
                          href="/admin/dashboard"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setShowDropdown(false)}
                        >
                          Dashboard
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
                ) : userInfo ? (
                  <div className="relative">
                    <button
                      onClick={() => setShowDropdown(!showDropdown)}
                      className={cn(
                        "flex items-center space-x-2 text-sm font-medium hover:opacity-70 transition-opacity",
                        (pathname && pathname.startsWith("/product/"))
                          ? "text-black"
                          : isScrolled || isMobileMenuOpen
                          ? "text-brand-dark"
                          : "text-white"
                      )}
                    >
                      {profileImg && userInfo ? (
                        <Image
                          src={profileImg}
                          alt="Profile"
                          width={28}
                          height={28}
                          className="rounded-full object-cover border-2 border-gold-400"
                        />
                      ) : (
                        <UserCircleIcon className="h-6 w-6" style={{ color: (pathname && pathname.startsWith("/product/")) ? '#000' : (isScrolled ? '#000' : '#fff') }} />
                      )}
                      <span
                        className={`max-w-[80px] truncate text-sm font-medium ${(pathname && pathname.startsWith("/product/")) ? 'text-black' : (isScrolled ? 'text-brand-dark' : 'text-white')}`}
                      >
                        {getTruncatedName(userInfo.name)}
                      </span>
                    </button>
                    {showDropdown && (
                      <AnimatePresence>
                        <motion.div
                          key="user-dropdown"
                          ref={userDropdownRef}
                          className="absolute left-1/2 top-full mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 z-[60]"
                          style={{ transform: 'translateX(-60%)' }}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          transition={{ duration: 0.18 }}
                        >
                          <div className="px-4 py-2 text-sm text-gray-500 border-b border-gray-200">
                            Signed in as
                            <br />
                            <span className="font-medium text-gray-900 truncate block">
                              {userInfo.email}
                            </span>
                          </div>
                          <Link
                            href="/profile"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setShowDropdown(false)}
                          >
                            Profile
                          </Link>
                          <Link
                            href="/orders"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setShowDropdown(false)}
                          >
                            Orders
                          </Link>
                          <button
                            onClick={handleUserLogout}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          >
                            Logout
                          </button>
                        </motion.div>
                      </AnimatePresence>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => setShowLoginModal(true)}
                    className={cn(
                      'text-lg font-bold hover:opacity-70 transition-opacity',
                      !isScrolled &&
                        (pathname === "/shop/all" || pathname === "/shop/new")
                        ? "text-black"
                        : pathname &&
                          (pathname.startsWith("/product/") ||
                            pathname === "/about/shipping" ||
                            pathname === "/about/returns" ||
                            pathname === "/about/faqs")
                        ? "text-black"
                        : !isScrolled &&
                          pathname &&
                          !pathname.startsWith("/admin") &&
                          !pathname.startsWith("/auth")
                        ? "text-white"
                        : "text-black"
                    )}
                    style={{ fontFamily: 'Didot, serif', fontWeight: 'bold' }}
                  >
                    Login
                  </button>
                )}

                <Link
                  href="/cart"
                  className={cn(
                    "hover:opacity-70 transition-opacity relative",
                    !isScrolled &&
                      (pathname === "/shop/all" || pathname === "/shop/new")
                      ? "text-black"
                      : pathname &&
                        (pathname.startsWith("/product/") ||
                          pathname === "/about/shipping" ||
                          pathname === "/about/returns" ||
                          pathname === "/about/faqs")
                      ? "text-black"
                      : isScrolled || isMobileMenuOpen
                      ? "text-brand-dark"
                      : "text-white"
                  )}
                >
                  <ShoppingBagIcon className="h-5 w-5" />
                  {cartItemsCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cartItemsCount}
                    </span>
                  )}
                </Link>
                
                {/* Country Display - Auto-detected */}
                <CountryDisplay
                  isScrolled={isScrolled}
                  isMobileMenuOpen={isMobileMenuOpen}
                />
                
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center w-full pt-6 pb-2 relative">
              {/* Brand Name (center, big) */}
              <div className="flex items-center justify-center w-full">
                {!isScrolled &&
                !(
                  pathname &&
                  (pathname.startsWith("/admin") ||
                    pathname.startsWith("/auth") ||
                    pathname.startsWith("/product/"))
                ) &&
                pathname === "/" ? (
                  <Link
                    href="/"
                    className={`transition-all duration-500 font-extrabold tracking-wider select-none text-7xl md:text-9xl text-white drop-shadow-[0_2px_8px_rgba(255,255,255,0.18)] ${italianno.className}`}
                    style={{
                      letterSpacing: "0.08em",
                      color: "#fff",
                    }}
                  >
                    Noamani
                  </Link>
                ) : !isScrolled &&
                !(
                  pathname &&
                  (pathname.startsWith("/admin") ||
                    pathname.startsWith("/auth") ||
                    pathname.startsWith("/product/"))
                ) ? (
                  <Link
                    href="/"
                    className={`transition-all duration-500 font-extrabold tracking-wider select-none text-xl md:text-3xl text-white drop-shadow-[0_2px_8px_rgba(255,255,255,0.18)] ${italianno.className}`}
                    style={{
                      letterSpacing: "0.08em",
                      color: "#fff",
                    }}
                  >
                    Noamani
                  </Link>
                ) : (
                  <div
                    className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
                    style={{ height: "100%" }}
                  >
                    <Link
                      href="/"
                      className={`font-extrabold tracking-wider select-none text-2xl md:text-3xl ${italianno.className}`}
                    >
                      Noamani
                    </Link>
                  </div>
                )}
              </div>
              {/* Nav Links and Right Icons in one row */}
              <div className="w-full flex flex-row items-center justify-between mt-5 relative hidden md:flex">
                {/* Nav Links: Centered below big brand name when not scrolled, normal row when scrolled */}
                <nav
                  className={cn(
                    "hidden md:flex flex-1",
                    !isScrolled &&
                      !(
                        pathname &&
                        (pathname.startsWith("/admin") ||
                          pathname.startsWith("/auth") ||
                          pathname.startsWith("/product/"))
                      ) &&
                      (pathname === "/shop/all" || pathname === "/shop/new")
                      ? "justify-center animate-fade-in-down"
                      : !isScrolled &&
                        !(
                          pathname &&
                          (pathname.startsWith("/admin") ||
                            pathname.startsWith("/auth") ||
                            pathname.startsWith("/product/"))
                        )
                      ? "justify-center animate-fade-in-down"
                      : "justify-start"
                  )}
                >
                  <ul
                    className={cn(
                      "flex items-center justify-between gap-8",
                      isScrolled ? "w-full max-w-2xl" : "w-full max-w-3xl"
                    )}
                  >
                    {navItems.map((item) => {
                      // Determine if this nav item should be white or black (same as text)
                      const isWhite = !isScrolled && !isMobileMenuOpen;
                      return (
                      <li
                        key={item.name}
                        className="relative group"
                        onMouseEnter={() => {
                          if (item.name !== "About Us" && item.name !== "Recreations") {
                            setActiveMenu(item.name);
                          } else {
                            setActiveMenu(null);
                          }
                        }}
                      >
                        <Link
                          href={item.href}
                          className={cn(
                            "text-lg tracking-wider py-2 transition-colors duration-200 flex items-center font-semibold",
                            !isScrolled &&
                              (pathname === "/shop/all" ||
                                pathname === "/shop/new")
                              ? "text-black"
                              : !isScrolled &&
                                pathname &&
                                !pathname.startsWith("/admin") &&
                                !pathname.startsWith("/auth") &&
                                !pathname.startsWith("/product/")
                              ? "text-white"
                              : "text-black",
                            activeMenu === item.name
                              ? "font-bold"
                              : "font-semibold",
                            item.name === "About Us" &&
                              pathname === "/about" &&
                              "pointer-events-none opacity-70"
                          )}
                          style={{ fontFamily: 'Didot, serif', fontWeight: 'bold' }}
                        >
                            {/* Icon before nav text */}
                            {/* {item.name === 'Shop All' && <ShoppingBag size={18} color={isWhite ? '#fff' : '#000'} className="mr-2 drop-shadow" />} */}
                            {/* {item.name === 'Bestsellers' && <Star size={18} color={isWhite ? '#fff' : '#000'} className="mr-2 drop-shadow" />} */}
                            {/* {item.name === 'Fragrance' && <Droplets size={18} color={isWhite ? '#fff' : '#000'} className="mr-2 drop-shadow" />} */}
                            {/* {item.name === 'Recreations' && <Sparkles size={18} color={isWhite ? '#fff' : '#000'} className="mr-2 drop-shadow" />} */}
                            {/* {item.name === 'About Us' && <Info size={18} color={isWhite ? '#fff' : '#000'} className="mr-2 drop-shadow" />} */}
                          {item.name}
                        </Link>
                        {activeMenu === item.name &&
                          item.name !== "About Us" && (
                            <motion.div
                              className={cn(
                                "absolute bottom-0 left-0 right-0 h-0.5",
                                !isScrolled &&
                                  (pathname === "/shop/all" ||
                                    pathname === "/shop/new")
                                  ? "bg-black"
                                  : !isScrolled &&
                                    pathname &&
                                    !pathname.startsWith("/admin") &&
                                    !pathname.startsWith("/auth") &&
                                    !pathname.startsWith("/product/")
                                  ? "bg-white"
                                  : "bg-black"
                              )}
                              layoutId="underline"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                            />
                          )}
                      </li>
                      );
                    })}
                  </ul>
                </nav>
                {/* Right side icons (aligned with nav links, spaced apart) */}
                <div className="flex flex-row items-center space-x-4 ml-24">
                  <button
                    className={cn(
                      "hover:opacity-70 transition-opacity",
                      !isScrolled &&
                        (pathname === "/shop/all" || pathname === "/shop/new")
                        ? "text-black"
                        : pathname &&
                          (pathname.startsWith("/product/") ||
                            pathname === "/about/shipping" ||
                            pathname === "/about/returns" ||
                            pathname === "/about/faqs")
                        ? "text-black"
                        : isScrolled || isMobileMenuOpen
                        ? "text-brand-dark"
                        : "text-white"
                    )}
                    onClick={() => setShowSearchModal(true)}
                    aria-label="Search"
                    type="button"
                  >
                    <Search className="h-5 w-5" />
                  </button>
                  {adminInfo ? (
                    <div className="relative">
                      <button
                        onClick={() => setShowDropdown(!showDropdown)}
                        className={cn(
                          "flex items-center space-x-2 text-sm font-medium hover:opacity-70 transition-opacity",
                          isScrolled || isMobileMenuOpen
                            ? "text-brand-dark"
                            : "text-white"
                        )}
                      >
                        <UserCircleIcon className="h-6 w-6" />
                        <span>Admin</span>
                      </button>
                      {showDropdown && (
                        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 z-[60]">
                          <Link
                            href="/admin/dashboard"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => setShowDropdown(false)}
                          >
                            Dashboard
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
                  ) : userInfo ? (
                    <div className="relative flex items-center space-x-2">
                      <button
                        onClick={() => setShowDropdown(!showDropdown)}
                        className="flex items-center space-x-2 focus:outline-none"
                        aria-label="User menu"
                        type="button"
                      >
                        {profileImg ? (
                          <Image
                            src={profileImg}
                            alt="Profile"
                            width={28}
                            height={28}
                            className="rounded-full object-cover border-2 border-gold-400"
                          />
                        ) : (
                          <UserCircleIcon className="h-6 w-6" style={{ color: !isScrolled ? '#fff' : '#000' }} />
                        )}
                        <span className={`max-w-[80px] truncate text-sm font-medium ${!isScrolled ? 'text-white' : 'text-brand-dark'}`}>{getTruncatedName(userInfo.name)}</span>
                      </button>
                      <AnimatePresence>
                        {showDropdown && (
                          <motion.div
                            key="user-dropdown"
                            ref={userDropdownRef}
                            className="absolute left-1/2 top-full mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 z-[60]"
                            style={{ transform: 'translateX(-60%)' }}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.18 }}
                          >
                            <div className="px-4 py-2 text-sm text-gray-500 border-b border-gray-200">
                              Signed in as
                              <br />
                              <span className="font-medium text-gray-900 truncate block">
                                {userInfo.email}
                              </span>
                            </div>
                            <Link
                              href="/profile"
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              onClick={() => setShowDropdown(false)}
                            >
                              Profile
                            </Link>
                            <Link
                              href="/orders"
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              onClick={() => setShowDropdown(false)}
                            >
                              Orders
                            </Link>
                            <button
                              onClick={handleUserLogout}
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              Logout
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowLoginModal(true)}
                      className={cn(
                        'text-lg font-bold hover:opacity-70 transition-opacity',
                        !isScrolled &&
                          (pathname === "/shop/all" || pathname === "/shop/new")
                          ? "text-black"
                          : pathname &&
                            (pathname.startsWith("/product/") ||
                              pathname === "/about/shipping" ||
                              pathname === "/about/returns" ||
                              pathname === "/about/faqs")
                        ? "text-black"
                        : !isScrolled &&
                          pathname &&
                          !pathname.startsWith("/admin") &&
                          !pathname.startsWith("/auth")
                        ? "text-white"
                        : "text-black"
                      )}
                      style={{ fontFamily: 'Didot, serif', fontWeight: 'bold' }}
                    >
                      Login
                    </button>
                  )}

                  <Link
                    href="/cart"
                    className={cn(
                      "hover:opacity-70 transition-opacity relative",
                      !isScrolled &&
                        (pathname === "/shop/all" || pathname === "/shop/new")
                        ? "text-black"
                        : pathname &&
                          (pathname.startsWith("/product/") ||
                            pathname === "/about/shipping" ||
                            pathname === "/about/returns" ||
                            pathname === "/about/faqs")
                        ? "text-black"
                        : isScrolled || isMobileMenuOpen
                        ? "text-brand-dark"
                        : "text-white"
                    )}
                  >
                    <ShoppingBagIcon className="h-5 w-5" />
                    {cartItemsCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {cartItemsCount}
                      </span>
                    )}
                  </Link>
                  
                  {/* Country Display - Auto-detected */}
                  <CountryDisplay
                    isScrolled={isScrolled}
                    isMobileMenuOpen={isMobileMenuOpen}
                  />
                  
                </div>
              </div>
            </div>
          )}
          {/* MOBILE NAVBAR: Only this should remain for mobile (md:hidden) */}
          <div className={cn(
            "flex md:hidden w-full flex-row items-center justify-between px-2 gap-4",
            pathname && pathname.startsWith("/product/")
              ? "h-14 bg-white shadow-md"
              : "h-14"
          )}>
            {isScrolled ? (
              // SCROLLED: ONLY NEW NAVBAR
              <>
                {/* Hamburger menu */}
                <button
                  onClick={() => setShowMobileMenu(true)}
                  className={cn(
                    'transition-colors flex items-center',
                    'text-brand-dark'
                  )}
                  aria-label="Open menu"
                >
                  <Menu className="w-6 h-6" />
                </button>
                {/* Noamani brand */}
                <motion.div
                  initial={{ x: 0, scale: 1, filter: 'drop-shadow(0 8px 32px #FFD70099)' }}
                  animate={isScrolled
                    ? { x: 0, scale: 0.6, filter: 'drop-shadow(0 2px 8px #00000033)' }
                    : { x: 0, scale: 1, filter: 'drop-shadow(0 8px 32px #FFD70099)' }
                  }
                  transition={{ type: 'spring', stiffness: 120, damping: 18 }}
                  className="flex items-center"
                  style={{ minWidth: 120 }}
                >
                <Link
                  href="/"
                    className={`select-none mx-2 ${italianno.className}`}
                    style={{
                      fontSize: isScrolled ? '2.2rem' : '5rem',
                      color: isScrolled ? '#222' : '#fff',
                      letterSpacing: '2px',
                      lineHeight: 1.1,
                      transition: 'font-size 0.4s cubic-bezier(0.23,1,0.32,1), color 0.4s',
                      textShadow: isScrolled
                        ? '0 1px 4px #fff8, 0 1px 1px #00000033'
                        : '0 8px 32px #FFD70099, 0 1px 1px #00000055',
                    }}
                >
                  Noamani
                </Link>
                </motion.div>
                {/* Rest of the icons */}
                <div className="flex flex-row items-center gap-3 ml-auto">
                  {/* Search button */}
                  <button
                    className="hover:opacity-70 transition-opacity text-brand-dark"
                    onClick={() => setShowSearchModal(true)}
                    aria-label="Search"
                    type="button"
                  >
                    <Search className="h-5 w-5" />
                  </button>
                  {/* User name (with avatar if available) */}
                  {userInfo ? (
                    <div className="relative flex items-center space-x-2">
                      <button
                        onClick={() => setShowDropdown(!showDropdown)}
                        className="flex items-center space-x-2 focus:outline-none"
                        aria-label="User menu"
                        type="button"
                      >
                        {profileImg ? (
                          <Image
                            src={profileImg}
                            alt="Profile"
                            width={28}
                            height={28}
                            className="rounded-full object-cover border-2 border-gold-400"
                          />
                        ) : (
                          <UserCircleIcon className="h-6 w-6" style={{ color: !isScrolled ? '#fff' : '#000' }} />
                        )}
                        <span className={`max-w-[80px] truncate text-sm font-medium ${!isScrolled ? 'text-white' : 'text-brand-dark'}`}>{getTruncatedName(userInfo.name)}</span>
                      </button>
                      <AnimatePresence>
                        {showDropdown && (
                          <motion.div
                            key="user-dropdown"
                            ref={userDropdownRef}
                            className="absolute left-1/2 top-full mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 z-[60]"
                            style={{ transform: 'translateX(-60%)' }}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.18 }}
                          >
                            <div className="px-4 py-2 text-sm text-gray-500 border-b border-gray-200">
                              Signed in as
                              <br />
                              <span className="font-medium text-gray-900 truncate block">
                                {userInfo.email}
                              </span>
                            </div>
                            <Link
                              href="/profile"
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              onClick={() => setShowDropdown(false)}
                            >
                              Profile
                            </Link>
                            <Link
                              href="/orders"
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              onClick={() => setShowDropdown(false)}
                            >
                              Orders
                            </Link>
                            <button
                              onClick={handleUserLogout}
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              Logout
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowLoginModal(true)}
                      className="text-sm font-medium hover:opacity-70 transition-opacity text-brand-dark"
                    >
                      Login
                    </button>
                  )}
                  {/* Cart icon */}
                  <Link
                    href="/cart"
                    className={cn(
                      'hover:opacity-70 transition-opacity relative',
                      (!isScrolled && !showMobileMenu) ? 'text-white' : 'text-brand-dark'
                    )}
                  >
                    <ShoppingBagIcon className="h-5 w-5" />
                    {cartItemsCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {cartItemsCount}
                      </span>
                    )}
                  </Link>
                  
                  {/* Country Display - Auto-detected */}
                  <CountryDisplay
                    isScrolled={isScrolled}
                    isMobileMenuOpen={isMobileMenuOpen}
                  />
                  
                </div>
              </>
            ) : (
              // NOT SCROLLED: ONLY OLD NAVBAR
              <>
                {/* Hamburger menu */}
                <button
                  onClick={() => setShowMobileMenu(true)}
                  className={cn(
                    'transition-colors flex items-center',
                    (!isScrolled && !showMobileMenu) ? 'text-white' : 'text-brand-dark'
                  )}
                  aria-label="Open menu"
                >
                  <Menu className="w-6 h-6" />
                </button>
                {/* Search button - moved next to hamburger */}
                <button
                  className={cn(
                    'hover:opacity-70 transition-opacity',
                    (!isScrolled && !showMobileMenu) ? 'text-white' : 'text-brand-dark'
                  )}
                  onClick={() => setShowSearchModal(true)}
                  aria-label="Search"
                  type="button"
                >
                  <Search className="h-5 w-5" />
                </button>
                <div className="flex flex-row items-center gap-4 ml-auto">
                  {/* User name (with avatar if available) */}
                  {userInfo ? (
                    <div className="relative flex items-center space-x-2">
                      <button
                        onClick={() => setShowDropdown(!showDropdown)}
                        className="flex items-center space-x-2 focus:outline-none"
                        aria-label="User menu"
                        type="button"
                      >
                        {profileImg ? (
                          <Image
                            src={profileImg}
                            alt="Profile"
                            width={28}
                            height={28}
                            className="rounded-full object-cover border-2 border-gold-400"
                          />
                        ) : (
                          <UserCircleIcon className="h-6 w-6" style={{ color: !isScrolled ? '#fff' : '#000' }} />
                        )}
                        <span className={`max-w-[80px] truncate text-sm font-medium ${!isScrolled ? 'text-white' : 'text-brand-dark'}`}>{getTruncatedName(userInfo.name)}</span>
                      </button>
                      <AnimatePresence>
                        {showDropdown && (
                          <motion.div
                            key="user-dropdown"
                            ref={userDropdownRef}
                            className="absolute left-1/2 top-full mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 z-[60]"
                            style={{ transform: 'translateX(-60%)' }}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.18 }}
                          >
                            <div className="px-4 py-2 text-sm text-gray-500 border-b border-gray-200">
                              Signed in as
                              <br />
                              <span className="font-medium text-gray-900 truncate block">
                                {userInfo.email}
                              </span>
                            </div>
                            <Link
                              href="/profile"
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              onClick={() => setShowDropdown(false)}
                            >
                              Profile
                            </Link>
                            <Link
                              href="/orders"
                              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              onClick={() => setShowDropdown(false)}
                            >
                              Orders
                            </Link>
                            <button
                              onClick={handleUserLogout}
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              Logout
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowLoginModal(true)}
                      className={cn(
                        'text-lg font-bold hover:opacity-70 transition-opacity',
                        !isScrolled &&
                          (pathname === "/shop/all" || pathname === "/shop/new")
                          ? "text-black"
                          : pathname &&
                            (pathname.startsWith("/product/") ||
                              pathname === "/about/shipping" ||
                              pathname === "/about/returns" ||
                              pathname === "/about/faqs")
                        ? "text-black"
                        : !isScrolled &&
                          pathname &&
                          !pathname.startsWith("/admin") &&
                          !pathname.startsWith("/auth")
                        ? "text-white"
                        : "text-black"
                      )}
                      style={{ fontFamily: 'Didot, serif', fontWeight: 'bold' }}
                    >
                      Login
                    </button>
                  )}
                  {/* Cart icon */}
                  <Link
                    href="/cart"
                    className={cn(
                      'hover:opacity-70 transition-opacity relative',
                      (!isScrolled && !showMobileMenu) ? 'text-white' : 'text-brand-dark'
                    )}
                  >
                    <ShoppingBagIcon className="h-5 w-5" />
                    {cartItemsCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {cartItemsCount}
                      </span>
                    )}
                  </Link>
                  
                  {/* Country Display - Auto-detected */}
                  <CountryDisplay
                    isScrolled={isScrolled}
                    isMobileMenuOpen={isMobileMenuOpen}
                  />
                  
                </div>
              </>
            )}
          </div>
        </div>

        {/* Mega Menu */}
        <div className="relative">
          {activeMenu && activeMenu !== "About Us" && (
            <MegaMenu
              category={activeMenu}
              onClose={() => setActiveMenu(null)}
              onMouseEnter={() => {}}
              onMouseLeave={() => setActiveMenu(null)}
              textColor={navTextColor}
              isNavbarWhite={isScrolled || isMobileMenuOpen}
            />
          )}
        </div>

        {/* Login Modal */}
        <AnimatePresence>
          {showLoginModal && (
            <LoginModal onClose={() => setShowLoginModal(false)} />
          )}
        </AnimatePresence>

        {/* Search Modal */}
        {showSearchModal && (
          <div
            className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm"
            onClick={() => setShowSearchModal(false)}
          >
            <div
              className="fixed left-1/2 -translate-x-1/2 top-6 sm:top-16 w-[92vw] sm:w-[90vw] max-w-md bg-white rounded-2xl shadow-2xl flex items-center px-4 sm:px-6 py-3 animate-slide-in-right border border-pink-200"
              style={{ zIndex: 1001 }}
              onClick={e => e.stopPropagation()}
            >
              <input
                type="text"
                className="flex-1 border-none outline-none bg-transparent text-base sm:text-lg px-2 sm:px-3 py-2 placeholder-pink-400 text-gray-900"
                placeholder="Search products..."
                value={searchQuery}
                onChange={e => handleSearch(e.target.value)}
                autoFocus
                style={{ minWidth: 0 }}
              />
              <button
                className="ml-2 text-gray-400 hover:text-pink-500"
                onClick={() => setShowSearchModal(false)}
                aria-label="Close search"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            {/* Results Dropdown */}
            {searchQuery && (
              <div className="fixed left-1/2 -translate-x-1/2 top-20 sm:top-28 w-[92vw] sm:w-[90vw] max-w-md bg-white rounded-xl shadow-xl mt-2 overflow-y-auto max-h-[60vh] border border-pink-100 animate-fade-in-down" style={{ zIndex: 1002 }}>
                {loadingProducts && (
                  <div className="text-center text-gray-500 py-6">Loading products...</div>
                )}
                {!loadingProducts && searchQuery && searchResults.length === 0 && (
                  <div className="text-center text-gray-400 py-6">No products found.</div>
                )}
                {!loadingProducts && searchResults.length > 0 && (
                  <ul className="divide-y divide-gray-100">
                    {searchResults.map((product) => (
                      <li
                        key={product._id || product.id}
                        className="py-3 px-4 flex items-center gap-3 cursor-pointer hover:bg-pink-50 rounded-lg transition"
                        onClick={() => handleProductClick(product._id || product.id)}
                      >
                        <img
                          src={product.image || (product.images && product.images[0])}
                          alt={product.name}
                          className="w-10 h-10 object-cover rounded-md border"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-gray-900 truncate">{product.name}</div>
                          <div className="text-xs text-gray-500 truncate">{product.description}</div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        )}

        {/* Modern Mobile Menu with Glassmorphism */}
        <AnimatePresence>
          {showMobileMenu && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="fixed inset-0 z-[120] bg-black/50 backdrop-blur-sm md:hidden"
                onClick={() => setShowMobileMenu(false)}
              />
              {/* Sidebar Menu */}
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className={cn(
                  "fixed left-0 top-0 h-full w-80 max-w-[85vw] z-[121] md:hidden flex flex-col shadow-2xl",
                  // Glassmorphism effect - adapts based on scroll state
                  isScrolled || pathname?.startsWith("/product/")
                    ? "glass bg-white/95 backdrop-blur-xl border-r border-gray-200/50"
                    : "glass-dark bg-white/10 backdrop-blur-2xl border-r border-white/20"
                )}
                onClick={e => e.stopPropagation()}
              >
                {/* Header with Close Button */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200/50">
                  <h2 className={cn(
                    "text-xl font-bold font-display",
                    isScrolled || pathname?.startsWith("/product/") ? "text-gray-900" : "text-white"
                  )}>
                    Menu
                  </h2>
                  <button
                    className={cn(
                      "p-2 rounded-lg transition-colors hover:bg-black/10",
                      isScrolled || pathname?.startsWith("/product/") 
                        ? "text-gray-700 hover:text-gray-900" 
                        : "text-white/80 hover:text-white hover:bg-white/20"
                    )}
                    onClick={() => setShowMobileMenu(false)}
                    aria-label="Close menu"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Navigation Links */}
                <nav className="flex-1 p-6 flex flex-col gap-2">
                  {navItems.map((item, index) => (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1, duration: 0.3 }}
                    >
                      <Link
                        href={item.href}
                        className={cn(
                          "block px-4 py-3 rounded-xl text-lg font-medium transition-all duration-200",
                          isScrolled || pathname?.startsWith("/product/")
                            ? "text-gray-700 hover:text-primary-400 hover:bg-gray-100/50"
                            : "text-white/90 hover:text-white hover:bg-white/10"
                        )}
                        onClick={() => setShowMobileMenu(false)}
                      >
                        {item.name}
                      </Link>
                    </motion.div>
                  ))}
                </nav>

                {/* Footer Actions */}
                <div className={cn(
                  "p-6 border-t",
                  isScrolled || pathname?.startsWith("/product/") 
                    ? "border-gray-200/50" 
                    : "border-white/20"
                )}>
                  <div className="flex flex-col gap-3">
                    {userInfo ? (
                      <Link
                        href="/profile"
                        className={cn(
                          "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                          isScrolled || pathname?.startsWith("/product/")
                            ? "text-gray-700 hover:bg-gray-100/50"
                            : "text-white/90 hover:bg-white/10"
                        )}
                        onClick={() => setShowMobileMenu(false)}
                      >
                        My Account
                      </Link>
                    ) : (
                      <button
                        onClick={() => {
                          setShowMobileMenu(false);
                          setShowLoginModal(true);
                        }}
                        className={cn(
                          "px-4 py-2 rounded-lg text-sm font-medium transition-all text-left",
                          isScrolled || pathname?.startsWith("/product/")
                            ? "text-gray-700 hover:bg-gray-100/50"
                            : "text-white/90 hover:bg-white/10"
                        )}
                      >
                        Login
                      </button>
                    )}
                    <Link
                      href="/cart"
                      className={cn(
                        "px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2",
                        isScrolled || pathname?.startsWith("/product/")
                          ? "text-gray-700 hover:bg-gray-100/50"
                          : "text-white/90 hover:bg-white/10"
                      )}
                      onClick={() => setShowMobileMenu(false)}
                    >
                      <ShoppingBag className="w-4 h-4" />
                      Cart {cartItemsCount > 0 && `(${cartItemsCount})`}
                    </Link>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </header>
      <style jsx>{`
        @keyframes fadeInDown {
          0% {
            opacity: 0;
            transform: translateY(-30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-down {
          animation: fadeInDown 0.7s cubic-bezier(0.23, 1, 0.32, 1);
        }
        @keyframes slide-in-right {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.4s cubic-bezier(0.23, 1, 0.32, 1);
        }
      `}</style>
    </CartProvider>
  );
}
