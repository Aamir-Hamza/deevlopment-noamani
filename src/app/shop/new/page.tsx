import React from "react";
import Image from "next/image";
import Link from "next/link";

const newArrivals = [
  {
    name: "Noamani Luxe Oud",
    description: "A bold, modern oud fragrance with rare woods, saffron, and a touch of rose. Handcrafted for those who want to stand out. Launching soon.",
    details: "Top Notes: Saffron, Bergamot | Heart: Oud, Rose, Patchouli | Base: Sandalwood, Amber, Musk. Long-lasting, unisex, and made with the purest ingredients.",
    image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1600&auto=format&fit=crop"
  },
  {
    name: "Noamani Velvet Blossom",
    description: "A luxurious floral scent with velvet orchid, creamy vanilla, and a hint of citrus. Perfect for special occasions and everyday elegance.",
    details: "Top Notes: Mandarin, Pink Pepper | Heart: Velvet Orchid, Jasmine | Base: Vanilla, White Musk. All-day wear, vegan, and cruelty-free.",
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=800&auto=format&fit=crop"
  }
];

export default function NewArrivals() {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[400px] md:h-[500px] flex items-center justify-center overflow-hidden mt-24 md:mt-32">
        <Image
          src="https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1600&auto=format&fit=crop"
          alt="New Arrivals Perfume Hero"
          fill
          className="object-cover object-center opacity-80"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-wide drop-shadow-lg">NEW ARRIVALS</h1>
          <p className="text-lg md:text-2xl font-light mb-6 drop-shadow">A sneak peek at the next generation of luxury fragrances from Noamani.</p>
          <span className="inline-block bg-pink-600/90 text-white px-6 py-2 rounded-full font-semibold text-base shadow-lg animate-pulse">Coming Soon</span>
        </div>
      </div>

      {/* New Arrivals Showcase */}
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 text-gray-900 tracking-tight">Launching Soon</h2>
        <div className="flex flex-col gap-16">
          {newArrivals.map((product, idx) => (
            <div key={idx} className="flex flex-col md:flex-row items-center gap-8 bg-gradient-to-br from-pink-50 to-blue-50 rounded-3xl shadow-xl p-8">
              <div className="relative w-full md:w-1/3 aspect-[2/3] min-w-[200px] max-w-[260px] mx-auto">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover rounded-2xl shadow-lg border-4 border-white"
                  sizes="(max-width: 768px) 60vw, 260px"
                  priority={idx === 0}
                />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-2xl font-extrabold text-pink-700 mb-2">{product.name}</h3>
                <p className="text-base md:text-lg text-gray-700 mb-4 font-medium">{product.description}</p>
                <p className="text-sm md:text-base text-gray-500 mb-4 italic">{product.details}</p>
                <span className="inline-block bg-pink-100 text-pink-700 px-4 py-1 rounded-full font-semibold text-xs shadow">New Arrival</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 