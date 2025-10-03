"use client";
import React, { useState } from "react";
import Image from "next/image";
import Footer from "@/components/Footer";
import Link from "next/link";
import { recreationsCatalogue } from "@/data/recreationsCatalogue";
import { useRef } from 'react';
import { FaRegStar, FaFilter, FaSortAlphaDown, FaSortAlphaUp, FaRupeeSign, FaCheck } from 'react-icons/fa';

export default function RecreationsPage() {
  const [sort, setSort] = useState("");
  const [inStockOnly, setInStockOnly] = useState(false);
  // Pagination state
  const PRODUCTS_PER_PAGE = 16;
  const [page, setPage] = useState(1);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const sortDropdownRef = useRef<HTMLDivElement>(null);

  // Close sort dropdown on outside click
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target as Node)) {
        setSortDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  let filteredProducts = recreationsCatalogue.filter(p => inStockOnly ? p.inStock : true);
  let sortedProducts = [...filteredProducts];

  if (sort === "name-asc") {
    sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sort === "name-desc") {
    sortedProducts.sort((a, b) => b.name.localeCompare(a.name));
  } else if (sort === "price-asc") {
    sortedProducts.sort((a, b) => a.price - b.price);
  } else if (sort === "price-desc") {
    sortedProducts.sort((a, b) => b.price - a.price);
  }

  // Filter to unique brands only (first product per brand)
  const uniqueBrandProducts = [];
  const seenBrands = new Set();
  for (const product of sortedProducts) {
    if (!seenBrands.has(product.brand)) {
      uniqueBrandProducts.push(product);
      seenBrands.add(product.brand);
    }
  }

  // Pagination logic (update to use uniqueBrandProducts)
  const totalPages = Math.ceil(uniqueBrandProducts.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = uniqueBrandProducts.slice(
    (page - 1) * PRODUCTS_PER_PAGE,
    page * PRODUCTS_PER_PAGE
  );

  const sortOptions = [
    { value: '', label: 'Sort By', icon: <FaFilter className="text-gray-400" /> },
    { value: 'name-asc', label: 'Name: A-Z', icon: <FaSortAlphaDown className="text-blue-400" /> },
    { value: 'name-desc', label: 'Name: Z-A', icon: <FaSortAlphaUp className="text-blue-400" /> },
    { value: 'price-asc', label: 'Price: Low to High', icon: <FaRupeeSign className="text-green-500" /> },
    { value: 'price-desc', label: 'Price: High to Low', icon: <FaRupeeSign className="text-red-500" /> },
  ];

  return (
    <div className="bg-[#f5f5f5] min-h-screen pb-16 flex flex-col min-h-screen">
      {/* Hero Section */}
      <div className="w-full min-h-[480px] flex flex-col md:flex-row justify-center items-stretch mt-28">
        {/* Left: Image */}
        <div className="md:w-1/2 w-full flex items-center justify-center bg-white">
          <div className="relative w-full h-[260px] md:h-[400px] max-w-[420px] mx-auto">
            <Image
              src="/boxs.png"
              alt="Recreations"
              fill
              className="object-contain object-center"
              priority
            />
          </div>
        </div>
        {/* Right: Text */}
        <div className="md:w-1/2 w-full flex flex-col justify-center items-center bg-white px-8 md:px-16 py-10 md:py-0">
          <div className="max-w-lg">
            <h1 className="text-2xl md:text-3xl font-serif tracking-[0.2em] font-semibold mb-6 text-gray-900 uppercase text-center md:text-left">
              Recreations
            </h1>
            <p className="text-gray-700 text-base md:text-lg leading-relaxed text-center md:text-left">
              Dive into a world of fragrance nostalgia with our collection of meticulously crafted recreations, paying homage to iconic scents. From the allure of timeless classics to the intrigue of modern favourites, each bottle encapsulates a unique blend of familiarity and innovation. Immerse yourself in the artistry of scent as you explore a range of captivating aromas, meticulously formulated to evoke emotions and memories. Elevate your fragrance experience with our collection, where every scent tells a story of sophistication, elegance, and timeless beauty.
            </p>
          </div>
        </div>
      </div>

      {/* Product Grid Section */}
      <div className="max-w-7xl mx-auto px-2 md:px-6 mt-16 flex-1">
        {/* Top Bar */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <div className="text-gray-700 text-sm md:text-base font-medium">
            {sortedProducts.length} PRODUCTS
          </div>
          <div className="flex items-center gap-4">
            {/* Sort dropdown (modern minimal floating card) */}
            <div className="relative min-w-[180px]" ref={sortDropdownRef}>
              <button
                type="button"
                className="w-full flex justify-between items-center px-4 py-2 rounded-xl border border-gray-200 bg-white shadow-md font-semibold text-gray-900 text-base transition-all focus:ring-2 focus:ring-blue-300 outline-none hover:border-blue-400 hover:shadow-lg group"
                onClick={() => setSortDropdownOpen((open) => !open)}
              >
                <span className="flex items-center gap-2">
                  <FaFilter className="text-blue-400 text-lg" />
                  {sortOptions.find(opt => opt.value === sort)?.label || 'Sort By'}
                </span>
                <svg className={`ml-2 w-5 h-5 transition-transform ${sortDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
              </button>
              {sortDropdownOpen && (
                <div className="absolute left-0 mt-2 w-full z-30 bg-white border border-gray-200 rounded-xl shadow-2xl max-h-72 overflow-y-auto animate-popIn origin-top transition-all duration-200">
                  {sortOptions.map(opt => (
                    <button
                      key={opt.value}
                      className={`w-full flex items-center gap-3 text-left px-4 py-2 font-medium text-base transition-all duration-100 rounded-lg ${sort === opt.value ? 'bg-blue-50 text-blue-700' : 'text-gray-900'} hover:bg-gradient-to-r hover:from-blue-50 hover:to-gray-50`}
                      onClick={() => { setSort(opt.value); setSortDropdownOpen(false); }}
                    >
                      {opt.icon}
                      <span className="flex-1">{opt.label}</span>
                      {sort === opt.value && <FaCheck className="text-blue-500 ml-auto" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="hidden md:block w-56 flex-shrink-0">
            <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
              <div className="font-semibold text-gray-800 mb-2">AVAILABILITY</div>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  className="accent-pink-600"
                  checked={inStockOnly}
                  onChange={e => {
                    setInStockOnly(e.target.checked);
                    setPage(1); // Reset to page 1 when filter changes
                  }}
                /> In stock only
              </label>
            </div>
          </aside>
          {/* Product Grid */}
          <section className="flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-12">
              {paginatedProducts.map((product, idx) => (
                <Link
                  key={product.slug}
                  href={`/product/recreations/${product.slug}`}
                  className="bg-gradient-to-b from-neutral-900 to-black rounded-2xl flex flex-col items-center justify-center aspect-square min-h-[220px] max-w-[220px] mx-auto relative group shadow-xl hover:shadow-2xl hover:scale-105 hover:ring-2 hover:ring-pink-400/40 transition-all duration-300 p-4"
                >
                  <span className="absolute left-3 top-3 bg-black/80 text-[11px] text-white px-2 py-1 rounded uppercase tracking-widest font-semibold">Inspired By</span>
                  <div className="flex-1 flex flex-col items-center justify-center w-full px-2">
                    <div className="text-center w-full flex-1 flex flex-col justify-center items-center">
                      <span
                        className="text-xl md:text-2xl font-serif text-gray-100 tracking-[0.18em] font-bold uppercase leading-tight break-words whitespace-pre-line drop-shadow overflow-hidden max-h-[4.5em] block"
                        style={{ wordBreak: 'break-word', display: 'block' }}
                        title={product.brand}
                      >
                        {product.brand}
                      </span>
                    </div>
                    <div className="text-center w-full mt-4">
                      {/* Price removed as per request */}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-10 gap-2">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={`px-4 py-2 rounded border text-sm font-semibold transition-all duration-150 ${
                      page === i + 1
                        ? "bg-black text-white border-black"
                        : "bg-white text-black border-gray-300 hover:bg-gray-100"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
} 