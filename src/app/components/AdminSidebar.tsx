import Link from "next/link";

<div className="mt-8 flex flex-col items-center w-full">
  <Link href="/" className="w-11/12">
    <button
      className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-blue-500 via-pink-500 to-yellow-400 text-white font-bold text-lg shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-2xl active:scale-95 focus:outline-none focus:ring-4 focus:ring-pink-300 animate-pulse"
      style={{ letterSpacing: '0.04em' }}
    >
      <span className="text-2xl">🏠</span>
      <span>Home</span>
    </button>
  </Link>
</div> 