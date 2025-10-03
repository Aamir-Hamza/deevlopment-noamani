"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { useCountry } from "@/hooks/useCountry";
import { formatPrice } from "@/lib/priceUtils";
import { useCart } from "@/context/CartContext";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

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
  },
  // "Skin + Hair": {
  //   products: [
  //     {
  //       title: "Radiance Serum",
  //       price: 68,
  //       image: "/productall.png",
  //       href: "/product/radiance-serum",
  //     },
  //     {
  //       title: "Repair Mask",
  //       price: 45,
  //       image: "/product1.jpg",
  //       href: "/product/repair-mask",
  //     },
  //   ],
  //   listTitle: "Skin Care",
  //   listItems: [
  //     { title: "Cleansers", href: "/skin/cleansers" },
  //     { title: "Moisturizers", href: "/skin/moisturizers" },
  //     { title: "Serums", href: "/skin/serums" },
  //     { title: "Masks", href: "/skin/masks" },
  //   ],
  // },
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
};

type MegaMenuProps = {
  category: string;
  onClose: () => void;
  onMouseEnter?: React.MouseEventHandler<HTMLDivElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLDivElement>;
  textColor?: string;
  isNavbarWhite?: boolean;
};

// Add these variants at the top, after imports
const productListVariants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0, // Remove stagger for instant load
    },
  },
};
const productItemVariants = {
  hidden: { opacity: 0, y: 0 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.12, ease: 'easeOut' } },
};

export default function MegaMenu({
  category,
  onClose,
  onMouseEnter,
  onMouseLeave,
  textColor = "text-black",
  isNavbarWhite = false,
}: MegaMenuProps) {
  const [content, setContent] = useState<MegaMenuContent>(defaultContent);
  const country = useCountry();
  const { addToCart } = useCart();
  const router = useRouter();
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

  const menuVariants = {
    hidden: {
      opacity: 0,
      y: -10,
      transition: { duration: 0.12, ease: 'easeInOut' },
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.12, ease: "easeInOut" },
    },
    exit: {
      opacity: 0,
      y: -10,
      transition: { duration: 0.12, ease: 'easeInOut' },
    },
  };

  return (
    <motion.div
      className={`absolute top-full left-0 right-0 transition-colors duration-300 z-50 ${isNavbarWhite ? 'bg-white' : 'bg-black/30 backdrop-blur-md'}`}
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={menuVariants}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1">
        <div className="grid grid-cols-12 gap-4 bg-transparent">
          {/* Featured Products */}
          <div className="col-span-12">
            <AnimatePresence mode="wait">
              <motion.div
                className="flex flex-row justify-center items-center gap-10 h-16 rounded-lg text-center px-12"
                variants={productListVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                key={category + '-' + (
                  category === 'Shop All' ? navbarProducts.length :
                  category === 'Bestsellers' ? bestsellerProducts.length :
                  category === 'Fragrance' ? fragranceProducts.length :
                  content.products.length
                )}
              >
              {category === "Shop All"
                ? navbarProducts.map((product, index) => (
                      <motion.div
                        key={index}
                        variants={productItemVariants}
                      >
                    <Link
                      href={`/product/${product.slug}`}
                          className={`uppercase tracking-widest font-bold px-2 group text-lg mb-2 ${textColor}`}
                          style={{ fontFamily: 'Didot, serif', fontWeight: 'bold', letterSpacing: 2 }}
                    >
                      {product.name}
                          <span className={`block h-0.5 ${textColor === 'text-white' ? 'bg-white' : 'bg-black'} scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-200 mt-1`}></span>
                    </Link>
                      </motion.div>
                  ))
                : category === "Bestsellers"
                ? bestsellerProducts.map((product, index) => (
                      <motion.div
                        key={index}
                        variants={productItemVariants}
                      >
                    <Link
                      href={`/product/${product.slug}`}
                          className={`uppercase tracking-widest font-bold px-2 group text-lg mb-2 ${textColor}`}
                          style={{ fontFamily: 'Didot, serif', fontWeight: 'bold', letterSpacing: 2 }}
                    >
                      {product.name}
                          <span className={`block h-0.5 ${textColor === 'text-white' ? 'bg-white' : 'bg-black'} scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-200 mt-1`}></span>
                    </Link>
                      </motion.div>
                  ))
                : category === "Fragrance"
                ? fragranceProducts.map((product, index) => (
                      <motion.div
                        key={index}
                        variants={productItemVariants}
                      >
                    <Link
                      href={`/product/${product.slug}`}
                          className={`uppercase tracking-widest font-bold px-2 group text-lg mb-2 ${textColor}`}
                          style={{ fontFamily: 'Didot, serif', fontWeight: 'bold', letterSpacing: 2 }}
                    >
                      {product.name}
                          <span className={`block h-0.5 ${textColor === 'text-white' ? 'bg-white' : 'bg-black'} scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-200 mt-1`}></span>
                    </Link>
                      </motion.div>
                  ))
                : content.products.map((product, index) => (
                      <motion.div
                        key={index}
                        variants={productItemVariants}
                      >
                    <Link
                      href={product.href}
                          className={`uppercase tracking-widest font-bold px-2 group text-lg mb-2 ${textColor}`}
                          style={{ fontFamily: 'Didot, serif', fontWeight: 'bold', letterSpacing: 2 }}
                    >
                      {product.title}
                          <span className={`block h-0.5 ${textColor === 'text-white' ? 'bg-white' : 'bg-black'} scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-200 mt-1`}></span>
                    </Link>
                      </motion.div>
                  ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Categories and Collections - hide for Shop All */}
          { category !== "Shop All" && (content.listTitle || (content.listItems && content.listItems.length > 0)) && (
            <div className="col-span-5 flex items-center justify-center">
              <div className="bg-transparent p-3 w-full max-w-xs mx-auto">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-900 mb-2 text-center">
                  {content.listTitle}
                </h3>
                <ul className="space-y-2">
                  {content.listItems.map((item, index) => (
                    <li key={index} className="text-center">
                      <Link
                        href={item.href}
                        className="group flex items-center justify-center text-sm text-gray-700 hover:text-brand-dark font-medium transition-colors"
                      >
                        <span>{item.title}</span>
                        <ChevronRight className="h-3 w-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
