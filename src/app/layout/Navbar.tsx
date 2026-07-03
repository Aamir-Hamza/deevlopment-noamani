"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import {
  Search,
  User,
  ShoppingBag,
  Menu,
  X,
  ChevronRight,
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
  // ─── STATE ───────────────────────────────────────────────
  const { cart, clearCart } = useCart();
  const router = useRouter();
  const pathname = usePathname();

  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
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
  const [allProducts, setAllProducts] = useState<any[]>(products);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const userDropdownRef = useRef<HTMLDivElement>(null);
  const [announcementDismissed, setAnnouncementDismissed] = useState(false);

  // ─── DERIVED STATE ───────────────────────────────────────
  const forcesSolid =
    pathname?.startsWith("/product/") ||
    pathname === "/about/shipping" ||
    pathname === "/about/returns" ||
    pathname === "/about/faqs" ||
    pathname === "/shop";

  const isSolid = isScrolled || !!forcesSolid;
  const isHomepage = pathname === "/";

  // Unified color tokens — one place for all color logic
  const textColor = isSolid ? "text-gray-900" : "text-white";
  const iconColor = isSolid ? "text-gray-800" : "text-white";
  const underlineColor = isSolid ? "bg-gray-900" : "bg-white";
  const showAnnouncementBar = !announcementDismissed && !isScrolled;

  // ─── EFFECTS ─────────────────────────────────────────────
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Scroll handler
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Profile image update
  const handleProfileImgUpdate = useCallback(() => {
    const userEmail = userEmailRef.current;
    if (userEmail) {
      const updatedImg = localStorage.getItem(`profileImg_${userEmail}`);
      setProfileImg(updatedImg || null);
    }
  }, []);

  // Load user/admin info from localStorage
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

  // Profile image event listener
  useEffect(() => {
    window.addEventListener("profileImgUpdated", handleProfileImgUpdate);
    return () => window.removeEventListener("profileImgUpdated", handleProfileImgUpdate);
  }, [handleProfileImgUpdate]);

  // Cart count sync
  useEffect(() => {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    setCartItemsCount(count);
  }, [cart]);

  // Admin logout event
  useEffect(() => {
    const handleAdminLogout = () => {
      setAdminInfo(null);
      setUserInfo(null);
    };
    window.addEventListener("adminLogout", handleAdminLogout);
    return () => window.removeEventListener("adminLogout", handleAdminLogout);
  }, []);

  // User login event
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

  // Product catalogue background refresh
  useEffect(() => {
    const controller = new AbortController();
    const refreshCatalogue = () => {
      fetch("/api/products", { signal: controller.signal })
        .then((res) => {
          if (!res.ok) throw new Error("Unable to refresh product catalogue");
          return res.json();
        })
        .then((data) => {
          if (Array.isArray(data) && data.length > 0) setAllProducts(data);
        })
        .catch((error) => {
          if (error instanceof Error && error.name !== "AbortError") {
            console.error("Search catalogue refresh failed:", error);
          }
        });
    };

    const idleWindow = window as typeof window & {
      requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    const idleId = idleWindow.requestIdleCallback?.(refreshCatalogue, { timeout: 1200 });
    const timeoutId = idleId === undefined ? window.setTimeout(refreshCatalogue, 250) : undefined;

    return () => {
      controller.abort();
      if (idleId !== undefined) idleWindow.cancelIdleCallback?.(idleId);
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
    };
  }, []);

  // Search filtering
  useEffect(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();
    if (!normalizedQuery) {
      setSearchResults([]);
      return;
    }
    setSearchResults(
      allProducts
        .filter(
          (product) =>
            product.name?.toLowerCase().includes(normalizedQuery) ||
            product.description?.toLowerCase().includes(normalizedQuery) ||
            product.category?.toLowerCase().includes(normalizedQuery)
        )
        .slice(0, 8)
    );
  }, [allProducts, searchQuery]);

  // Search modal body scroll lock
  useEffect(() => {
    if (!showSearchModal) return;
    const previousOverflow = document.body.style.overflow;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setShowSearchModal(false);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [showSearchModal]);

  // Mobile menu body scroll lock
  useEffect(() => {
    if (showMobileMenu) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [showMobileMenu]);

  // Close mobile menu on desktop resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setShowMobileMenu(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Click outside user dropdown
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
    }
    return () => {
      if (typeof document !== 'undefined') {
        document.removeEventListener("mousedown", handleClickOutsideUserDropdown);
      }
    };
  }, [showDropdown]);

  // ─── HANDLERS ────────────────────────────────────────────
  const getTruncatedName = (name: string) => {
    return name.length > 12 ? name.substring(0, 12) + "..." : name;
  };

  // Early returns (after all hooks)
  if (!isMounted) return null;
  if (pathname?.startsWith("/admin") || pathname?.startsWith("/auth")) return null;

  const handleLogout = async () => {
    if (typeof window !== "undefined") {
      await clearCart();
      localStorage.removeItem("adminInfo");
      setAdminInfo(null);
      setShowDropdown(false);
      router.push("/");
      toast.success("Logged out successfully", { icon: "👋", duration: 3000 });
    }
  };

  const handleUserLogout = async () => {
    if (typeof window !== "undefined") {
      await clearCart();
      localStorage.removeItem("userInfo");
      setUserInfo(null);
      setShowDropdown(false);
      toast.success("Logged out successfully", { icon: "👋", duration: 3000 });
    }
  };

  const handleRequireLogin = (item: any) => {
    setPendingCartItem(item);
    setShowLoginModal(true);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const closeSearch = () => {
    setShowSearchModal(false);
    setSearchQuery("");
    setSearchResults([]);
  };

  const handleProductClick = (productId: string) => {
    closeSearch();
    router.push(`/product/${productId}`);
  };

  // Mega menu text color for MegaMenu component
  const navTextColor = isSolid ? 'text-black' : 'text-white';

  // ─── SHARED RENDER HELPERS ───────────────────────────────

  /** Renders search, user/admin dropdown, cart, and country icons.
   *  Used in both desktop and mobile layouts — written once, zero duplication. */
  const renderRightIcons = (mode: 'desktop' | 'mobile') => {
    const isCompact = mode === 'mobile';
    const iconSize = isCompact ? "h-[18px] w-[18px]" : "h-5 w-5";
    const gap = isCompact ? "gap-2.5" : "gap-4";

    return (
      <div className={cn("flex items-center", gap)}>
        {/* Search */}
        <button
          className={cn("transition-all duration-200 hover:opacity-70 hover:scale-110", iconColor)}
          onClick={() => setShowSearchModal(true)}
          aria-label="Search"
          type="button"
        >
          <Search className={iconSize} />
        </button>

        {/* User / Admin */}
        {adminInfo ? (
          <div className="relative" ref={userDropdownRef}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className={cn(
                "flex items-center gap-1.5 text-sm font-medium transition-all duration-200 hover:opacity-70",
                textColor
              )}
            >
              <UserCircleIcon className={iconSize} />
              {!isCompact && <span className="tracking-wide">Admin</span>}
            </button>
            <AnimatePresence>
              {showDropdown && (
                <motion.div
                  key="admin-dropdown"
                  className="absolute right-0 top-full mt-3 w-52 rounded-2xl glass-dropdown py-2 z-[60]"
                  initial={{ opacity: 0, y: -8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.97 }}
                  transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link
                    href="/admin/dashboard"
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                    onClick={() => setShowDropdown(false)}
                  >
                    Dashboard
                  </Link>
                  <div className="mx-3 my-1 h-px bg-gray-100" />
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                  >
                    <ArrowRightOnRectangleIcon className="h-4 w-4" />
                    Logout
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : userInfo ? (
          <div className="relative" ref={userDropdownRef}>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-1.5 focus:outline-none group"
              aria-label="User menu"
              type="button"
            >
              {profileImg ? (
                <Image
                  src={profileImg}
                  alt="Profile"
                  width={isCompact ? 24 : 28}
                  height={isCompact ? 24 : 28}
                  className="rounded-full object-cover border-2 border-amber-400/40 transition-all duration-200 group-hover:border-amber-400/80"
                />
              ) : (
                <UserCircleIcon className={cn(iconSize, iconColor, "transition-colors")} />
              )}
              {!isCompact && (
                <span className={cn(
                  "max-w-[80px] truncate text-sm font-medium transition-colors",
                  textColor
                )}>
                  {getTruncatedName(userInfo.name)}
                </span>
              )}
            </button>
            <AnimatePresence>
              {showDropdown && (
                <motion.div
                  key="user-dropdown"
                  className={cn(
                    "absolute top-full mt-3 w-56 rounded-2xl glass-dropdown overflow-hidden z-[60]",
                    isCompact ? "right-0" : "left-1/2 -translate-x-1/2"
                  )}
                  initial={{ opacity: 0, y: -8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.97 }}
                  transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                >
                  {/* User info header */}
                  <div className="px-4 py-3 bg-gradient-to-b from-gray-50/80 to-transparent border-b border-gray-100/80">
                    <p className="text-[11px] uppercase tracking-widest text-gray-400 font-medium">Signed in as</p>
                    <p className="text-sm font-semibold text-gray-900 truncate mt-0.5">
                      {userInfo.email}
                    </p>
                  </div>
                  <div className="py-1.5">
                    <Link
                      href="/profile"
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                      onClick={() => setShowDropdown(false)}
                    >
                      <UserCircleIcon className="h-4 w-4 text-gray-400" />
                      Profile
                    </Link>
                    <Link
                      href="/orders"
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                      onClick={() => setShowDropdown(false)}
                    >
                      <ShoppingBagIcon className="h-4 w-4 text-gray-400" />
                      Orders
                    </Link>
                    <div className="mx-3 my-1 h-px bg-gray-100" />
                    <button
                      onClick={handleUserLogout}
                      className="flex items-center gap-2.5 w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                    >
                      <ArrowRightOnRectangleIcon className="h-4 w-4" />
                      Logout
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <button
            onClick={() => setShowLoginModal(true)}
            className={cn("transition-all duration-200 hover:opacity-70 hover:scale-110", iconColor)}
            aria-label="Login"
          >
            <User className={iconSize} />
          </button>
        )}

        {/* Cart */}
        <Link
          href="/cart"
          className={cn("relative transition-all duration-200 hover:opacity-70 hover:scale-110", iconColor)}
        >
          <ShoppingBagIcon className={iconSize} />
          {cartItemsCount > 0 && (
            <motion.span
              key={cartItemsCount}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="absolute -top-2 -right-2.5 bg-gradient-to-br from-amber-700 to-amber-900 text-white text-[10px] font-bold rounded-full h-[18px] w-[18px] flex items-center justify-center shadow-sm"
            >
              {cartItemsCount}
            </motion.span>
          )}
        </Link>

        {/* Country Display — desktop only */}
        {!isCompact && (
          <CountryDisplay
            isScrolled={isSolid}
            isMobileMenuOpen={false}
          />
        )}
      </div>
    );
  };

  /** Desktop navigation links with CSS underline animation */
  const renderDesktopNav = () => (
    <nav className="hidden md:flex flex-1 justify-center">
      <ul className="flex items-center gap-7 lg:gap-9">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <li
              key={item.name}
              className="relative"
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
                  "relative text-[14px] lg:text-[15px] tracking-[0.1em] py-2 transition-all duration-300 font-semibold uppercase",
                  textColor,
                  "hover:opacity-80",
                  item.name === "About Us" && pathname === "/about" && "pointer-events-none opacity-50"
                )}
                style={{ fontFamily: 'Didot, serif', fontWeight: 600 }}
              >
                {item.name}

                {/* CSS underline */}
                <span
                  className={cn(
                    "navbar-link-underline",
                    underlineColor,
                    activeMenu === item.name && "active"
                  )}
                />
              </Link>

              {/* Active page gold dot */}
              {isActive && (
                <motion.span
                  layoutId="nav-active-dot"
                  className="nav-active-dot"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );

  // ─── MAIN RENDER ─────────────────────────────────────────
  return (
    <CartProvider onRequireLogin={handleRequireLogin}>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 navbar-transition",
          isSolid
            ? "bg-white/95 backdrop-blur-xl shadow-[0_1px_3px_rgba(0,0,0,0.06)]"
            : "bg-black/20 backdrop-blur-md"
        )}
        onMouseLeave={() => setActiveMenu(null)}
      >
        {/* ═══ ANNOUNCEMENT BAR ═══ */}
        <div
          className={cn(
            "overflow-hidden transition-all duration-500 ease-in-out",
            showAnnouncementBar
              ? "max-h-9 opacity-100"
              : "max-h-0 opacity-0"
          )}
        >
          <div className="flex items-center justify-center h-9 announcement-bar-gradient px-9 sm:px-4 relative">
            <p className="text-[10px] sm:text-[11px] text-white/90 tracking-[0.14em] sm:tracking-[0.18em] font-medium uppercase text-center truncate">
              <span className="sm:hidden">Free shipping over ₹2,000</span>
              <span className="hidden sm:inline">Complimentary shipping on orders above ₹2,000 &middot; Free samples with every order</span>
            </p>
            <button
              onClick={() => setAnnouncementDismissed(true)}
              className="absolute right-2 sm:right-5 text-white/40 hover:text-white/90 transition-colors p-1"
              aria-label="Close announcement"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        </div>

        {/* ═══ MAIN NAVBAR ═══ */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* ─── Desktop (md+) ─── */}
          <div className="hidden md:flex items-center justify-between h-[72px]">
            {/* Brand */}
            <Link
              href="/"
              className={cn(
                italianno.className,
                "font-extrabold tracking-wider select-none transition-all duration-500 origin-left flex-shrink-0",
                textColor,
                "hover:opacity-80"
              )}
              style={{
                fontSize: isHomepage && !isSolid ? '2.6rem' : '1.85rem',
                letterSpacing: '0.08em',
                lineHeight: 1,
              }}
            >
              Noamani
            </Link>

            {/* Nav Links */}
            {renderDesktopNav()}

            {/* Right Icons */}
            {renderRightIcons('desktop')}
          </div>

          {/* ─── Mobile (<md) ─── */}
          <div className="flex md:hidden items-center justify-between h-14 px-1">
            {/* Hamburger */}
            <button
              onClick={() => setShowMobileMenu(true)}
              className={cn("transition-all duration-200 hover:scale-110 p-1", iconColor)}
              aria-label="Open menu"
            >
              <Menu className="w-[22px] h-[22px]" />
            </button>

            {/* Brand (centered) */}
            <Link
              href="/"
              className={cn(
                italianno.className,
                "absolute left-1/2 -translate-x-1/2 font-extrabold tracking-wider select-none transition-all duration-500",
                textColor
              )}
              style={{
                fontSize: isHomepage && !isSolid ? '2rem' : '1.6rem',
                letterSpacing: '0.06em',
                lineHeight: 1,
              }}
            >
              Noamani
            </Link>

            {/* Right Icons */}
            {renderRightIcons('mobile')}
          </div>
        </div>

        {/* ═══ MEGA MENU ═══ */}
        <div className="relative">
          {activeMenu && activeMenu !== "About Us" && (
            <MegaMenu
              category={activeMenu}
              onClose={() => setActiveMenu(null)}
              onMouseEnter={() => {}}
              onMouseLeave={() => setActiveMenu(null)}
              textColor={navTextColor}
              isNavbarWhite={isSolid}
            />
          )}
        </div>

        {/* ═══ LOGIN MODAL ═══ */}
        {/* Portaled to document.body: the header's backdrop-blur creates a
            CSS containing block for fixed-position descendants, which would
            otherwise clip this full-screen modal to the header's box. */}
        {createPortal(
          <AnimatePresence>
            {showLoginModal && (
              <LoginModal onClose={() => setShowLoginModal(false)} />
            )}
          </AnimatePresence>,
          document.body
        )}

        {/* ═══ SEARCH MODAL ═══ */}
        {createPortal(
        <AnimatePresence>
          {showSearchModal && (
            <motion.div
              className="fixed inset-0 z-[200] flex items-start justify-center bg-[#0b0908]/70 px-4 pt-[max(1rem,6vh)] sm:pt-[12vh]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.14 }}
              onClick={closeSearch}
            >
              <motion.div
                role="dialog"
                aria-modal="true"
                aria-labelledby="product-search-title"
                className="w-full max-w-2xl overflow-hidden rounded-2xl border border-[#d8c6a5]/50 bg-[#fffdf8] shadow-[0_24px_80px_rgba(0,0,0,0.4)]"
                initial={{ opacity: 0, y: -10, scale: 0.985 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.99 }}
                transition={{ duration: 0.16, ease: "easeOut" }}
                onClick={(event) => event.stopPropagation()}
              >
                <div className="flex items-center justify-between border-b border-[#e8dfd0] px-5 py-4 sm:px-6">
                  <div>
                    <p id="product-search-title" className="text-sm font-semibold tracking-[0.16em] text-[#3b3028] uppercase">
                      Search Noamani
                    </p>
                    <p className="mt-0.5 text-xs text-[#817569]">Find a fragrance by name, note, or collection</p>
                  </div>
                  <button
                    type="button"
                    className="grid h-9 w-9 place-items-center rounded-full text-[#74695f] transition-colors hover:bg-[#eee7dc] hover:text-[#211a16] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9a7b4f]"
                    onClick={closeSearch}
                    aria-label="Close search"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="p-4 sm:p-5">
                  <div className="flex items-center gap-3 rounded-xl border border-[#d8cbb8] bg-white px-4 shadow-[0_4px_16px_rgba(54,42,31,0.05)] transition focus-within:border-[#9a7b4f] focus-within:ring-2 focus-within:ring-[#9a7b4f]/15">
                    <Search className="h-5 w-5 shrink-0 text-[#8c7557]" aria-hidden="true" />
                    <input
                      type="search"
                      className="min-w-0 flex-1 bg-transparent py-3.5 text-base text-[#211a16] outline-none placeholder:text-[#a49a90] sm:text-[17px]"
                      placeholder="Search fragrances, notes, collections…"
                      value={searchQuery}
                      onChange={(event) => handleSearch(event.target.value)}
                      autoFocus
                      autoComplete="off"
                      aria-label="Search products"
                    />
                    <span className="hidden rounded-md border border-[#ded5c8] bg-[#f7f3ed] px-2 py-1 text-[10px] font-medium tracking-wide text-[#80756a] sm:inline">
                      ESC
                    </span>
                  </div>

                  {!searchQuery.trim() && (
                    <div className="px-2 py-8 text-center sm:py-10">
                      <p className="text-sm font-medium text-[#4f453d]">Discover your signature scent</p>
                      <p className="mt-1 text-xs text-[#91867b]">Try &ldquo;oud&rdquo;, &ldquo;floral&rdquo;, or a fragrance name</p>
                    </div>
                  )}

                  {searchQuery.trim() && searchResults.length === 0 && (
                    <div className="px-2 py-8 text-center sm:py-10">
                      <p className="text-sm font-medium text-[#4f453d]">No matching fragrances</p>
                      <p className="mt-1 text-xs text-[#91867b]">Try a broader name, note, or collection</p>
                    </div>
                  )}

                  {searchResults.length > 0 && (
                    <div className="mt-4 max-h-[min(52vh,430px)] overflow-y-auto overscroll-contain pr-1">
                      <div className="mb-2 flex items-center justify-between px-1">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#8a7b6d]">Products</p>
                        <p className="text-xs text-[#9b9085]">{searchResults.length} result{searchResults.length === 1 ? "" : "s"}</p>
                      </div>
                      <ul className="space-y-1">
                        {searchResults.map((product) => (
                          <li key={product._id || product.id}>
                            <button
                              type="button"
                              className="group flex w-full items-center gap-4 rounded-xl px-2.5 py-2.5 text-left transition-colors hover:bg-[#f2ece3] focus-visible:bg-[#f2ece3] focus-visible:outline-none"
                              onClick={() => handleProductClick(product._id || product.id)}
                            >
                              <span className="grid h-14 w-14 shrink-0 place-items-center overflow-hidden rounded-lg border border-[#e4dbcf] bg-white">
                                <img
                                  src={product.image || product.images?.[0] || "/product1.jpg"}
                                  alt=""
                                  className="h-full w-full object-contain p-1"
                                />
                              </span>
                              <span className="min-w-0 flex-1">
                                <span className="block truncate text-sm font-semibold text-[#2e251f] sm:text-[15px]">{product.name}</span>
                                <span className="mt-1 block truncate text-xs text-[#84786d]">{product.category || product.description}</span>
                              </span>
                              <span className="text-lg text-[#a08b70] transition-transform group-hover:translate-x-0.5" aria-hidden="true">→</span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
        )}

        {/* ═══ MOBILE FULL-SCREEN OVERLAY MENU ═══ */}
        {createPortal(
        <AnimatePresence>
          {showMobileMenu && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35 }}
                className="fixed inset-0 z-[120] bg-black/60 md:hidden"
                onClick={() => setShowMobileMenu(false)}
              />

              {/* Full-screen menu content */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="fixed inset-0 z-[121] md:hidden flex flex-col items-center justify-center mobile-menu-overlay"
              >
                {/* Close Button */}
                <motion.button
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                  onClick={() => setShowMobileMenu(false)}
                  className="absolute top-5 right-5 p-2.5 rounded-full border border-white/10 text-white/50 hover:text-white hover:border-white/30 hover:bg-white/5 transition-all duration-200"
                  aria-label="Close menu"
                >
                  <X className="w-6 h-6" />
                </motion.button>

                {/* Brand watermark */}
                <motion.div
                  initial={{ opacity: 0, y: -15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.5 }}
                  className="mb-10"
                >
                  <span className={`${italianno.className} text-4xl text-white/20 tracking-[0.12em] select-none`}>
                    Noamani
                  </span>
                  <div className="mt-3 w-16 h-[1px] bg-gradient-to-r from-transparent via-amber-500/40 to-transparent mx-auto" />
                </motion.div>

                {/* Navigation Links */}
                <nav className="flex flex-col items-center gap-1">
                  {navItems.map((item, index) => (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, y: 25 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: 0.15 + index * 0.07,
                        duration: 0.45,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setShowMobileMenu(false)}
                        className={cn(
                          "block px-8 py-3.5 text-[22px] sm:text-[26px] font-light tracking-[0.16em] uppercase transition-all duration-200",
                          pathname === item.href
                            ? "text-amber-400"
                            : "text-white/80 hover:text-white"
                        )}
                        style={{ fontFamily: 'Didot, serif' }}
                      >
                        {item.name}
                      </Link>
                    </motion.div>
                  ))}
                </nav>

                {/* Divider */}
                <motion.div
                  initial={{ opacity: 0, scaleX: 0 }}
                  animate={{ opacity: 1, scaleX: 1 }}
                  transition={{ delay: 0.45, duration: 0.4 }}
                  className="mt-10 w-24 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent"
                />

                {/* Extra links */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.4 }}
                  className="mt-6 flex gap-6"
                >
                  <Link
                    href="/cart"
                    onClick={() => setShowMobileMenu(false)}
                    className="flex items-center gap-2 text-sm text-white/40 hover:text-white/70 transition-colors tracking-widest uppercase"
                  >
                    <ShoppingBagIcon className="h-4 w-4" />
                    Cart {cartItemsCount > 0 && `(${cartItemsCount})`}
                  </Link>
                  {userInfo && (
                    <Link
                      href="/profile"
                      onClick={() => setShowMobileMenu(false)}
                      className="flex items-center gap-2 text-sm text-white/40 hover:text-white/70 transition-colors tracking-widest uppercase"
                    >
                      <UserCircleIcon className="h-4 w-4" />
                      Profile
                    </Link>
                  )}
                </motion.div>

                {/* Country / currency — interactive, matches the desktop selector so mobile
                    shoppers can change the currency prices are shown in */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.55, duration: 0.4 }}
                  className="absolute bottom-8 flex flex-col items-center gap-2"
                >
                  <CountryDisplay isScrolled={false} isMobileMenuOpen={false} />
                </motion.div>
              </motion.div>
            </>
          )}
        </AnimatePresence>,
        document.body
        )}
      </header>
    </CartProvider>
  );
}
