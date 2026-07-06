"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { formatPrice } from "@/lib/priceUtils";

// Define types for mega menu content
type ProductItem = {
  title: string;
  price: number;
  image: string;
  href: string;
};

type ListItem = {
  title: string;
  href: string;
};

type FavoriteItem = {
  title: string;
  href: string;
};

type MegaMenuContent = {
  products: ProductItem[];
  listTitle: string;
  listItems: ListItem[];
  favoritesTitle: string;
  favoriteItems: FavoriteItem[];
  viewAllHref?: string;
  viewAllLabel?: string;
};

// Sample data for each category
const megaMenuData: any = {
  "Shop All": {
    products: [
      {
        title: "Rose Saffron",
        price: 89,
        image: "/product3.jpg",
        href: "/product/rose-saffron",
      },
      {
        title: "Pimento",
        price: 65,
        image: "/product1.jpg",
        href: "/product/pimento",
      },
      {
        title: "Resin",
        price: 75,
        image: "/product2.jpg",
        href: "/product/resin",
      },
      {
        title: "Ocean Breeze",
        price: 82,
        image: "/product3.jpg",
        href: "/product/ocean-breeze",
      },
    ],
    listTitle: "Categories",
    listItems: [
      { title: "All Products", href: "/shop/all" },
      { title: "New Arrivals", href: "/shop/new" },
    ],
    viewAllHref: "/shop/all",
    viewAllLabel: "Shop all products",
  },
  Bestsellers: {
    products: [
      {
        title: "Velvet Orchid",
        price: 110,
        image: "/product1.jpg",
        href: "/product/velvet-orchid",
      },
      {
        title: "Royal Oud",
        price: 125,
        image: "/product2.jpg",
        href: "/product/royal-oud",
      },
    ],
    favoritesTitle: "Customer Favorites",
    favoriteItems: [
      { title: "Award Winners", href: "/collections/award-winners" },
      { title: "Editor's Picks", href: "/collections/editors-picks" },
      { title: "Most Reviewed", href: "/collections/most-reviewed" },
      { title: "Trending Now", href: "/collections/trending" },
    ],
    viewAllHref: "/bestsellers",
    viewAllLabel: "Shop all bestsellers",
  },
  Fragrance: {
    products: [
      {
        title: "Amber Musk",
        price: 98,
        image: "/product3.jpg",
        href: "/product/amber-musk",
      },
      {
        title: "Citrus Bloom",
        price: 78,
        image: "/product4.jpg",
        href: "/product/citrus-bloom",
      },
    ],
    listTitle: "",
    listItems: [
      // No items
    ],
    viewAllHref: "/fragrance",
    viewAllLabel: "Shop all fragrance",
  },
  "Discovery Sets": {
    products: [
      {
        title: "Scent Sampler",
        price: 35,
        image:
          "https://images.pexels.com/photos/3762324/pexels-photo-3762324.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        href: "/product/scent-sampler",
      },
      {
        title: "Skincare Starter",
        price: 48,
        image:
          "https://images.pexels.com/photos/6621333/pexels-photo-6621333.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        href: "/product/skincare-starter",
      },
    ],
    listTitle: "By Category",
    listItems: [
      { title: "Fragrance Sets", href: "/discovery/fragrance" },
      { title: "Skincare Sets", href: "/discovery/skincare" },
      { title: "Hair Sets", href: "/discovery/hair" },
      { title: "Mixed Collections", href: "/discovery/mixed" },
    ],
    viewAllHref: "/discovery-sets",
    viewAllLabel: "Shop all discovery sets",
  },
  "Gifts + Sets": {
    products: [
      {
        title: "Luxury Gift Set",
        price: 150,
        image: "/product2.jpg",
        href: "/product/luxury-gift-set",
      },
      {
        title: "Essential Collection",
        price: 95,
        image: "/product3.jpg",
        href: "/product/essential-collection",
      },
    ],
    listTitle: "Gift Types",
    listItems: [
      { title: "Gift Sets", href: "/gifts/sets" },
      { title: "Gift Cards", href: "/gifts/cards" },
      { title: "Ready to Gift", href: "/gifts/ready" },
      { title: "Limited Edition", href: "/gifts/limited" },
    ],
    viewAllHref: "/gifts",
    viewAllLabel: "Shop all gifts",
  },
  "About Us": {
    products: [
      {
        title: "Our Story",
        price: 49,
        image: "/product4.jpg",
        href: "/about/story",
      },
      {
        title: "Sustainability",
        price: 59,
        image: "/newproduct-removebg-preview.png",
        href: "/about/sustainability",
      },
    ],
    listTitle: "Learn More",
    listItems: [
      { title: "Our Brand", href: "/about/brand" },
      { title: "Ingredients", href: "/about/ingredients" },
      { title: "Sustainability", href: "/about/sustainability" },
      { title: "Press", href: "/about/press" },
    ],
    viewAllHref: "/about",
    viewAllLabel: "About Noamani",
  },
  "Perfect Perfume Quiz": {
    products: [
      {
        title: "Find Your Scent",
        price: 0,
        image:
          "https://images.pexels.com/photos/6669033/pexels-photo-6669033.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        href: "/quiz/start",
      },
      {
        title: "Custom Blends",
        price: 85,
        image:
          "https://images.pexels.com/photos/3650469/pexels-photo-3650469.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        href: "/custom-blends",
      },
    ],
    listTitle: "Quiz Types",
    listItems: [
      { title: "Scent Profile", href: "/quiz/profile" },
      { title: "Mood Match", href: "/quiz/mood" },
      { title: "Personality", href: "/quiz/personality" },
      { title: "Season", href: "/quiz/season" },
    ],
    viewAllHref: "/quiz",
    viewAllLabel: "Take the quiz",
  },
  "Customer Care": {
    products: [
      {
        title: "Free Shipping",
        price: 50,
        image:
          "https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        href: "/customer-care/shipping",
      },
      {
        title: "Easy Returns",
        price: 30,
        image:
          "https://images.pexels.com/photos/5632397/pexels-photo-5632397.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
        href: "/customer-care/returns",
      },
    ],
    listTitle: "Help Center",
    listItems: [
      { title: "Shipping Information", href: "/customer-care/shipping" },
      { title: "Returns & Exchanges", href: "/customer-care/returns" },
      { title: "FAQs", href: "/customer-care/faqs" },
      { title: "Contact Us", href: "/customer-care/contact" },
    ],
    viewAllHref: "/customer-care",
    viewAllLabel: "Visit help center",
  },
};

// Default fallback content
const defaultContent: any = {
  products: [
    {
      title: "Featured Item",
      price: 75,
      image:
        "https://images.pexels.com/photos/3373230/pexels-photo-3373230.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      href: "/product/featured",
    },
    {
      title: "New Arrival",
      price: 85,
      image:
        "https://images.pexels.com/photos/755992/pexels-photo-755992.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
      href: "/product/new-arrival",
    },
  ],
  listTitle: "Categories",
  listItems: [
    { title: "All Products", href: "/shop/all" },
    { title: "New Arrivals", href: "/shop/new" },
    { title: "Bestsellers", href: "/shop/bestsellers" },
    { title: "Last Chance", href: "/shop/last-chance" },
  ],
  viewAllHref: "/shop/all",
  viewAllLabel: "Shop all products",
};

type MegaMenuProps = {
  category: string;
  onClose: () => void;
  onMouseEnter?: React.MouseEventHandler<HTMLDivElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLDivElement>;
  textColor?: string;
  isNavbarWhite?: boolean;
};

const menuVariants = {
  hidden: { opacity: 0, y: -6, transition: { duration: 0.15, ease: "easeInOut" } },
  visible: { opacity: 1, y: 0, transition: { duration: 0.18, ease: "easeOut" } },
  exit: { opacity: 0, y: -6, transition: { duration: 0.12, ease: "easeInOut" } },
};

const listVariants = {
  hidden: { opacity: 1 },
  visible: { opacity: 1, transition: { staggerChildren: 0.035 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 6 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.18, ease: "easeOut" } },
};

export default function MegaMenu({
  category,
  onClose,
  onMouseEnter,
  onMouseLeave,
}: MegaMenuProps) {
  const [content, setContent] = useState<MegaMenuContent>(defaultContent);
  const [navbarProducts, setNavbarProducts] = useState<{ name: string; slug: string }[]>([]);
  const [bestsellerProducts, setBestsellerProducts] = useState<{ name: string; slug: string }[]>([]);
  const [fragranceProducts, setFragranceProducts] = useState<{ name: string; slug: string }[]>([]);

  useEffect(() => {
    setContent(megaMenuData[category] || defaultContent);
  }, [category]);

  useEffect(() => {
    if (category === "Shop All") {
      fetch("/api/navbar-products")
        .then((res) => res.json())
        .then((data) => setNavbarProducts(data));
      // Listen for live updates
      const handler = () => {
        fetch("/api/navbar-products")
          .then((res) => res.json())
          .then((data) => setNavbarProducts(data));
      };
      window.addEventListener('navbarProductsUpdated', handler);
      return () => window.removeEventListener('navbarProductsUpdated', handler);
    } else if (category === "Bestsellers") {
      fetch("/api/navbar-bestsellers")
        .then((res) => res.json())
        .then((data) => setBestsellerProducts(data));
      const handler = () => {
        fetch("/api/navbar-bestsellers")
          .then((res) => res.json())
          .then((data) => setBestsellerProducts(data));
      };
      window.addEventListener('navbarBestsellersUpdated', handler);
      return () => window.removeEventListener('navbarBestsellersUpdated', handler);
    } else if (category === "Fragrance") {
      fetch("/api/navbar-fragrance")
        .then((res) => res.json())
        .then((data) => setFragranceProducts(data));
      const handler = () => {
        fetch("/api/navbar-fragrance")
          .then((res) => res.json())
          .then((data) => setFragranceProducts(data));
      };
      window.addEventListener('navbarFragranceUpdated', handler);
      return () => window.removeEventListener('navbarFragranceUpdated', handler);
    }
  }, [category]);

  // Dynamic (admin-managed) categories only ever have a name + slug — no
  // image/price — so they render as a clean link list rather than product tiles.
  const dynamicItems =
    category === "Shop All"
      ? navbarProducts
      : category === "Bestsellers"
      ? bestsellerProducts
      : category === "Fragrance"
      ? fragranceProducts
      : null;

  const hasSideList = !!content.listTitle && !!content.listItems?.length;

  return (
    <motion.div
      className="absolute top-full left-0 right-0 z-50 bg-white border-t border-gray-100 shadow-[0_16px_40px_rgba(0,0,0,0.08)]"
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={menuVariants}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="max-w-5xl mx-auto px-8 py-8">
        <div className={cnRow(hasSideList)}>
          {/* Featured items */}
          <div className={hasSideList ? "col-span-8" : "col-span-12"}>
            <div className="flex items-center justify-between mb-5">
              <span className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#a88d3f]">
                <Sparkles className="h-3.5 w-3.5" />
                Featured in {category}
              </span>
              {content.viewAllHref && (
                <Link
                  href={content.viewAllHref}
                  onClick={onClose}
                  className="group flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-gray-500 hover:text-gray-900 transition-colors"
                >
                  {content.viewAllLabel || "View all"}
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </Link>
              )}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={category + '-' + (dynamicItems ? dynamicItems.length : content.products.length)}
                variants={listVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-2 sm:grid-cols-3 gap-2.5"
              >
                {dynamicItems
                  ? dynamicItems.map((product, index) => (
                      <motion.div key={product.slug + index} variants={itemVariants}>
                        <Link
                          href={`/product/${product.slug}`}
                          onClick={onClose}
                          className="group flex items-center gap-3 rounded-lg border border-gray-100 px-3.5 py-3 hover:border-[#bfa14a]/40 hover:bg-[#fdfaf3] transition-colors"
                        >
                          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gray-50 text-[10px] font-bold text-gray-400 group-hover:bg-[#bfa14a]/10 group-hover:text-[#a88d3f] transition-colors">
                            {index + 1}
                          </span>
                          <span
                            className="text-[13px] font-semibold text-gray-800 group-hover:text-gray-900 tracking-wide leading-snug"
                            style={{ fontFamily: 'Didot, serif' }}
                          >
                            {product.name}
                          </span>
                        </Link>
                      </motion.div>
                    ))
                  : content.products.map((product, index) => (
                      <motion.div key={product.href + index} variants={itemVariants}>
                        <Link
                          href={product.href}
                          onClick={onClose}
                          className="group flex items-center gap-3 rounded-lg border border-gray-100 p-2 hover:border-[#bfa14a]/40 hover:bg-[#fdfaf3] transition-colors"
                        >
                          <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md bg-gray-50">
                            <Image
                              src={product.image}
                              alt={product.title}
                              fill
                              sizes="48px"
                              className="object-cover"
                            />
                          </span>
                          <span className="min-w-0">
                            <span
                              className="block truncate text-[13px] font-semibold text-gray-800 group-hover:text-gray-900 tracking-wide"
                              style={{ fontFamily: 'Didot, serif' }}
                            >
                              {product.title}
                            </span>
                            {product.price > 0 && (
                              <span className="block text-[11px] text-gray-400">
                                {formatPrice(product.price)}
                              </span>
                            )}
                          </span>
                        </Link>
                      </motion.div>
                    ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Categories / collections column */}
          {hasSideList && (
            <div className="col-span-4 border-l border-gray-100 pl-8">
              <span className="block text-[11px] font-semibold uppercase tracking-[0.16em] text-gray-400 mb-5">
                {content.listTitle}
              </span>
              <ul className="space-y-1">
                {content.listItems.map((item, index) => (
                  <li key={index}>
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className="group flex items-center justify-between rounded-md px-2.5 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 font-medium transition-colors -mx-2.5"
                    >
                      <span>{item.title}</span>
                      <ArrowRight className="h-3.5 w-3.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function cnRow(hasSideList: boolean) {
  return hasSideList ? "grid grid-cols-12 gap-8" : "grid grid-cols-12";
}
