"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { products } from "@/data/products";

export default function AllProducts() {
  const [currentPage, setCurrentPage] = useState(0);
  const PRODUCTS_PER_PAGE = 3;

  const totalPages = Math.ceil(products.length / PRODUCTS_PER_PAGE);

  const nextSlide = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const prevSlide = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const getCurrentProducts = () => {
    const startIndex = currentPage * PRODUCTS_PER_PAGE;
    return products.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);
  };

  const getProductLabel = (index: number) => {
    const labels = ["New Product", "Special", "Popular", "Best", "New"];
    return labels[index % labels.length];
  };

  const getProductLabelColor = (index: number) => {
    const colors = [
      "bg-gray-800",
      "bg-purple-800", 
      "bg-blue-800",
      "bg-green-800",
      "bg-orange-800"
    ];
    return colors[index % colors.length];
  };

  const currentProducts = getCurrentProducts();

  return (
    <div className="all-products-page min-h-screen bg-white py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <style jsx global>{`
          /* Ensure only 3 products are visible */
          .all-products-page .group {
            width: 280px !important;
            flex-shrink: 0 !important;
            margin: 0 !important;
          }
          
          @media (max-width: 768px) {
            .all-products-page .group {
              width: 250px !important;
            }
          }
          
          @media (max-width: 640px) {
            .all-products-page .group {
              width: 220px !important;
            }
          }
        `}</style>
        {/* Header */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <h1 className="text-4xl font-serif text-gray-800 tracking-wide">
            All Products
          </h1>
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center shadow-sm">
            <div className="w-8 h-8 bg-blue-500 rounded-sm flex items-center justify-center">
              <div className="w-4 h-6 bg-white rounded-sm relative">
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1 h-2 bg-white rounded-sm"></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Underline */}
        <div className="w-24 h-1 bg-black mx-auto mb-16"></div>

        {/* Product Carousel - EXACTLY 3 PRODUCTS */}
        <div className="relative max-w-4xl mx-auto">
          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center shadow-lg transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-gray-600" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center shadow-lg transition-colors"
          >
            <ChevronRight className="w-6 h-6 text-gray-600" />
          </button>

          {/* Product Container - HARDCODED 3 PRODUCTS ONLY */}
          <div className="flex justify-center items-center px-20">
            <div className="flex justify-center items-center gap-6" style={{ width: '900px', maxWidth: '900px' }}>
              {/* Product 1 */}
              {currentProducts[0] && (
                <div className="group" style={{ width: '280px', flexShrink: 0 }}>
                  <div className="relative bg-gradient-to-b from-pink-100 to-gray-100 rounded-2xl p-8 h-80 flex flex-col items-center justify-center overflow-hidden">
                    <div className={`absolute top-4 left-4 ${getProductLabelColor(currentPage * PRODUCTS_PER_PAGE + 0)} text-white px-3 py-1 rounded-full text-sm font-medium`}>
                      {getProductLabel(currentPage * PRODUCTS_PER_PAGE + 0)}
                    </div>
                    <div className="flex-1 flex items-center justify-center">
                      <img
                        src={currentProducts[0].images[0]}
                        alt={currentProducts[0].name}
                        className="max-h-48 object-contain transition-transform group-hover:scale-105"
                      />
                    </div>
                  </div>
                  <h3 className="text-xl font-serif text-gray-800 mt-4 text-center">
                    {currentProducts[0].name}
                  </h3>
                </div>
              )}

              {/* Product 2 */}
              {currentProducts[1] && (
                <div className="group" style={{ width: '280px', flexShrink: 0 }}>
                  <div className="relative bg-gradient-to-b from-pink-100 to-gray-100 rounded-2xl p-8 h-80 flex flex-col items-center justify-center overflow-hidden">
                    <div className={`absolute top-4 left-4 ${getProductLabelColor(currentPage * PRODUCTS_PER_PAGE + 1)} text-white px-3 py-1 rounded-full text-sm font-medium`}>
                      {getProductLabel(currentPage * PRODUCTS_PER_PAGE + 1)}
                    </div>
                    <div className="flex-1 flex items-center justify-center">
                      <img
                        src={currentProducts[1].images[0]}
                        alt={currentProducts[1].name}
                        className="max-h-48 object-contain transition-transform group-hover:scale-105"
                      />
                    </div>
                  </div>
                  <h3 className="text-xl font-serif text-gray-800 mt-4 text-center">
                    {currentProducts[1].name}
                  </h3>
                </div>
              )}

              {/* Product 3 */}
              {currentProducts[2] && (
                <div className="group" style={{ width: '280px', flexShrink: 0 }}>
                  <div className="relative bg-gradient-to-b from-pink-100 to-gray-100 rounded-2xl p-8 h-80 flex flex-col items-center justify-center overflow-hidden">
                    <div className={`absolute top-4 left-4 ${getProductLabelColor(currentPage * PRODUCTS_PER_PAGE + 2)} text-white px-3 py-1 rounded-full text-sm font-medium`}>
                      {getProductLabel(currentPage * PRODUCTS_PER_PAGE + 2)}
                    </div>
                    <div className="flex-1 flex items-center justify-center">
                      <img
                        src={currentProducts[2].images[0]}
                        alt={currentProducts[2].name}
                        className="max-h-48 object-contain transition-transform group-hover:scale-105"
                      />
                    </div>
                  </div>
                  <h3 className="text-xl font-serif text-gray-800 mt-4 text-center">
                    {currentProducts[2].name}
                  </h3>
                </div>
              )}
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-8 gap-2">
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  currentPage === index
                    ? 'bg-gray-800'
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Product Count Info */}
        <div className="text-center mt-8 text-gray-600">
          Showing {currentPage * PRODUCTS_PER_PAGE + 1}-{Math.min((currentPage + 1) * PRODUCTS_PER_PAGE, products.length)} of {products.length} products
        </div>
      </div>
    </div>
  );
} 