"use client";
import React, { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronDown, Filter, Check, SlidersHorizontal, X } from "lucide-react";
import Footer from "@/components/Footer";
import { recreationsCatalogue } from "@/data/recreationsCatalogue";

const PRODUCTS_PER_PAGE = 16;

const sortOptions = [
  { value: "", label: "Featured" },
  { value: "name-asc", label: "Name: A-Z" },
  { value: "name-desc", label: "Name: Z-A" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

export default function RecreationsPage() {
  const [sort, setSort] = useState("");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [page, setPage] = useState(1);
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const sortDropdownRef = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target as Node)) {
        setSortDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredProducts = recreationsCatalogue.filter((p) => (inStockOnly ? p.inStock : true));
  const sortedProducts = [...filteredProducts];

  if (sort === "name-asc") sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
  else if (sort === "name-desc") sortedProducts.sort((a, b) => b.name.localeCompare(a.name));
  else if (sort === "price-asc") sortedProducts.sort((a, b) => a.price - b.price);
  else if (sort === "price-desc") sortedProducts.sort((a, b) => b.price - a.price);

  // Unique brands only (first product per brand)
  const uniqueBrandProducts: typeof sortedProducts = [];
  const seenBrands = new Set<string>();
  for (const product of sortedProducts) {
    if (!seenBrands.has(product.brand)) {
      uniqueBrandProducts.push(product);
      seenBrands.add(product.brand);
    }
  }

  const totalPages = Math.ceil(uniqueBrandProducts.length / PRODUCTS_PER_PAGE);
  const paginatedProducts = uniqueBrandProducts.slice(
    (page - 1) * PRODUCTS_PER_PAGE,
    page * PRODUCTS_PER_PAGE
  );

  const FilterPanel = () => (
    <div>
      <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-3">Availability</p>
      <label className="flex items-center gap-2.5 text-sm text-gray-700 cursor-pointer">
        <input
          type="checkbox"
          className="w-4 h-4 accent-[#bfa14a]"
          checked={inStockOnly}
          onChange={(e) => {
            setInStockOnly(e.target.checked);
            setPage(1);
          }}
        />
        In Stock
      </label>
    </div>
  );

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Hero */}
      <div className="relative h-[45vh] bg-black text-white flex items-center justify-center">
        <Image
          src="https://images.pexels.com/photos/3059609/pexels-photo-3059609.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
          alt="Recreations"
          fill
          className="object-cover opacity-40"
        />
        <div className="relative z-10 text-center max-w-2xl px-4">
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-5xl font-light mb-4"
            style={{ fontFamily: "Didot, serif" }}
          >
            RECREATIONS
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-lg font-light"
          >
            Iconic scents, reimagined with Noamani craftsmanship
          </motion.p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex-1 w-full">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-10 gap-4">
          <p className="text-sm text-gray-500">
            {uniqueBrandProducts.length} brand{uniqueBrandProducts.length === 1 ? "" : "s"}
          </p>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="md:hidden flex items-center gap-2 px-4 py-2 rounded-full border border-gray-300 text-sm font-medium text-gray-700 hover:border-gray-900 transition-colors"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Filters
            </button>

            <div className="relative" ref={sortDropdownRef}>
              <button
                onClick={() => setSortDropdownOpen((o) => !o)}
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-gray-300 text-sm font-medium text-gray-700 hover:border-gray-900 transition-colors"
              >
                <Filter className="w-3.5 h-3.5" />
                {sortOptions.find((o) => o.value === sort)?.label || "Sort"}
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${sortDropdownOpen ? "rotate-180" : ""}`} />
              </button>
              {sortDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden z-30">
                  {sortOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => {
                        setSort(opt.value);
                        setSortDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between text-left px-4 py-2.5 text-sm hover:bg-gray-50 transition-colors ${
                        sort === opt.value ? "text-gray-900 font-medium" : "text-gray-600"
                      }`}
                    >
                      {opt.label}
                      {sort === opt.value && <Check className="w-3.5 h-3.5 text-[#bfa14a]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-10">
          {/* Sidebar (desktop) */}
          <aside className="hidden md:block w-48 flex-shrink-0">
            <FilterPanel />
          </aside>

          {/* Mobile filter drawer */}
          {mobileFilterOpen && (
            <>
              <div
                className="fixed inset-0 bg-black/40 z-40 md:hidden"
                onClick={() => setMobileFilterOpen(false)}
              />
              <aside className="fixed top-0 right-0 h-full w-72 bg-white shadow-2xl z-50 md:hidden overflow-y-auto">
                <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">Filters</h3>
                  <button
                    onClick={() => setMobileFilterOpen(false)}
                    className="text-gray-400 hover:text-gray-900"
                    aria-label="Close filters"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="p-5">
                  <FilterPanel />
                </div>
              </aside>
            </>
          )}

          {/* Product grid */}
          <section className="flex-1">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
              {paginatedProducts.map((product, idx) => (
                <motion.div
                  key={product.slug}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: (idx % PRODUCTS_PER_PAGE) * 0.03 }}
                >
                  <Link
                    href={`/product/recreations/${product.slug}`}
                    className="group relative flex flex-col items-center justify-center aspect-square rounded-2xl bg-black overflow-hidden border border-black hover:border-[#bfa14a] transition-colors p-5"
                  >
                    {!product.inStock && (
                      <span className="absolute right-3 top-3 bg-white/10 text-[10px] text-white/70 px-2 py-1 rounded-full uppercase tracking-widest font-medium">
                        Sold Out
                      </span>
                    )}
                    <span className="absolute left-3 top-3 text-[10px] text-[#bfa14a] px-0 py-0 uppercase tracking-widest font-semibold">
                      Inspired By
                    </span>
                    <span
                      className="text-lg sm:text-xl font-serif text-white tracking-wide font-semibold uppercase text-center leading-snug group-hover:text-[#bfa14a] transition-colors"
                      style={{ fontFamily: "Didot, serif" }}
                    >
                      {product.brand}
                    </span>
                  </Link>
                </motion.div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center mt-14 gap-2">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i + 1)}
                    className={`w-9 h-9 rounded-full text-sm font-medium transition-colors ${
                      page === i + 1
                        ? "bg-black text-white"
                        : "bg-white text-gray-600 border border-gray-300 hover:border-gray-900"
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
