"use client";
import React from "react";

export default function GeneralSalesConditions() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#f8e8c8] via-[#fff9f2] to-[#f8f5ef] animate-fadein">
      <section className="w-full flex flex-col items-center justify-center py-20">
        <div className="max-w-3xl w-full bg-white/80 rounded-[2.5rem] shadow-2xl p-14 border-2 border-[#bfa14a] backdrop-blur-2xl relative overflow-hidden">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-[#bfa14a]/20 rounded-full blur-2xl z-0 animate-pulse" />
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#bfa14a]/20 rounded-full blur-2xl z-0 animate-pulse" />
          <h1 className="text-5xl md:text-6xl font-serif mb-10 text-center text-gray-900 tracking-wider drop-shadow-lg z-10" style={{ fontFamily: 'Didot, serif', letterSpacing: 3 }}>General Sales Conditions</h1>
          <p className="text-lg md:text-xl font-serif text-gray-700 leading-relaxed mb-8 z-10 relative" style={{ fontFamily: 'Didot, serif' }}>
            Welcome to Noamani Perfumes. These General Sales Conditions govern the sale of products on our website. Please read them carefully before placing your order.
          </p>
          <ul className="list-disc pl-8 text-gray-700 font-serif text-lg md:text-xl space-y-3 z-10 relative" style={{ fontFamily: 'Didot, serif' }}>
            <li>All products are subject to availability.</li>
            <li>Prices are inclusive of all applicable taxes.</li>
            <li>Orders are processed within 1-2 business days.</li>
            <li>Returns and exchanges are accepted within 14 days of delivery.</li>
            <li>For any queries, please contact our support team.</li>
          </ul>
        </div>
      </section>
      <style jsx>{`
        .animate-fadein {
          animation: fadein 1.2s cubic-bezier(0.4,0,0.2,1);
        }
        @keyframes fadein {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </main>
  );
} 