"use client";
import React from "react";

export default function LazyLoader() {
  return (
    <div className="flex flex-col items-center justify-center py-10 animate-fade-in">
      {/* Perfume bottle animation */}
      <div className="relative w-16 h-24 mb-4">
        {/* Bottle base */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-16 bg-gradient-to-t from-yellow-300 via-yellow-100 to-white rounded-b-2xl shadow-lg border-2 border-yellow-400" />
        {/* Bottle neck */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-4 h-6 bg-yellow-400 rounded-t-md border-2 border-yellow-600" />
        {/* Cap */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-3 bg-gray-700 rounded-t-lg border-2 border-gray-900" />
        {/* Animated droplet */}
        <div className="absolute left-1/2 top-8 -translate-x-1/2">
          <span className="block w-3 h-3 bg-yellow-300 rounded-full animate-bounce-drop shadow-lg border border-yellow-500" />
        </div>
      </div>
      <div className="text-lg font-semibold text-yellow-400 tracking-wide mt-2 animate-pulse">
        Loading... Please wait
      </div>
      <style jsx>{`
        @keyframes fadeIn {
          0% {
            opacity: 0;
            transform: translateY(30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.8s cubic-bezier(0.23, 1, 0.32, 1);
        }
        @keyframes bounceDrop {
          0%,
          100% {
            transform: translateY(0);
            opacity: 1;
          }
          50% {
            transform: translateY(18px);
            opacity: 0.7;
          }
        }
        .animate-bounce-drop {
          animation: bounceDrop 1.1s infinite cubic-bezier(0.6, 0.05, 0.2, 0.95);
        }
      `}</style>
    </div>
  );
}
