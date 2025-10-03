"use client";
import React from "react";

export default function FindABoutique() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#f8e8c8] via-[#fff9f2] to-[#f8f5ef] animate-fadein">
      <section className="w-full flex flex-col items-center justify-center py-20">
        <div className="max-w-4xl w-full bg-white/80 rounded-[2.5rem] shadow-2xl p-14 border-2 border-[#bfa14a] backdrop-blur-2xl relative overflow-hidden">
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-[#bfa14a]/20 rounded-full blur-2xl z-0 animate-pulse" />
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#bfa14a]/20 rounded-full blur-2xl z-0 animate-pulse" />
          <h1 className="text-5xl md:text-6xl font-serif mb-10 text-center text-gray-900 tracking-wider drop-shadow-lg z-10" style={{ fontFamily: 'Didot, serif', letterSpacing: 3 }}>Find a Boutique</h1>
          <div className="grid md:grid-cols-2 gap-12 z-10 relative">
            <div className="bg-[#f8f5ef]/80 rounded-2xl p-8 border border-[#bfa14a]/60 shadow-lg hover:scale-105 transition-transform duration-300">
              <h2 className="text-2xl md:text-3xl font-serif mb-3 text-gray-900" style={{ fontFamily: 'Didot, serif' }}>Noamani Perfumes Boutiques</h2>
              <p className="text-lg font-serif text-gray-700" style={{ fontFamily: 'Didot, serif' }}>
                Discover our exclusive Noamani Perfumes Boutiques in select cities. Experience luxury, elegance, and the full range of our fragrances in person.
              </p>
            </div>
            <div className="bg-[#f8f5ef]/80 rounded-2xl p-8 border border-[#bfa14a]/60 shadow-lg hover:scale-105 transition-transform duration-300">
              <h2 className="text-2xl md:text-3xl font-serif mb-3 text-gray-900" style={{ fontFamily: 'Didot, serif' }}>Noamani Couture Boutiques</h2>
              <p className="text-lg font-serif text-gray-700" style={{ fontFamily: 'Didot, serif' }}>
                Visit our Couture Boutiques for a bespoke fragrance experience and personalized service. Coming soon to major luxury destinations.
              </p>
            </div>
          </div>
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