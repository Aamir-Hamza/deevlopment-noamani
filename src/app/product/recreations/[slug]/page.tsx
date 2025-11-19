'use client';
import { recreationsCatalogue } from '@/data/recreationsCatalogue';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import Tilt from 'react-parallax-tilt';
import Footer from '@/components/Footer';
import ProductReviews from '@/components/ProductReviews';
import { useCart } from '@/context/CartContext';
import confetti from 'canvas-confetti';

const TiltWrapper = (props: any) => <Tilt {...props} />;

const demo = {
  subtitle: 'Parfum - Luxurious Blend',
  description:
    'A luxurious recreation inspired by iconic notes. Crafted to deliver a premium experience with long-lasting performance and a refined, modern trail.',
  olfactoryNotes:
    'Top: Bergamot, Honey\nHeart: Floral Accord\nBase: Vanilla, Sandalwood',
  perfumersWord:
    "Created for elegance and sensuality in every moment.",
  knowHow:
    'A masterful blend using fine ingredients and contemporary techniques.',
  applicationTips:
    'Apply to pulse points. Avoid rubbing. Reapply as desired.',
};

export default function RecreationProductPage({ params }: { params: { slug: string } }) {
  const product = recreationsCatalogue.find(p => p.slug === params.slug);
  if (!product) return notFound();

  const images = (product.images && product.images.length > 0) ? product.images : ['/boxs.png'];

  const defaultSizes = [
    { label: '25 mL', value: 25, priceFactor: 0.25 },
    { label: '50 mL', value: 50, priceFactor: 0.5 },
    { label: '100 mL', value: 100, priceFactor: 1 },
  ];

  const [selectedSizeIndex, setSelectedSizeIndex] = useState(2);
  const [selectedImageIndex, setSelectedImageIndex] = useState(selectedSizeIndex);
  const [isAdding, setIsAdding] = useState(false);

  const { addToCart } = useCart();

  useEffect(() => {
    setSelectedImageIndex(selectedSizeIndex);
  }, [selectedSizeIndex]);

  const getPrice = () => Math.round(product.price * defaultSizes[selectedSizeIndex].priceFactor);

  const mainImage = images[selectedImageIndex] || images[0];

  const tabContent: Record<string, string> = {
    description: demo.description,
    olfactoryNotes: demo.olfactoryNotes,
    perfumersWord: demo.perfumersWord,
    knowHow: demo.knowHow,
    applicationTips: demo.applicationTips,
  };

  const tabs = [
    { label: 'Description', key: 'description' },
    { label: 'Olfactory Notes', key: 'olfactoryNotes' },
    { label: "Perfumer's Word", key: 'perfumersWord' },
    { label: 'Know How', key: 'knowHow' },
    { label: 'Application Tips', key: 'applicationTips' },
  ];

  const [activeTab, setActiveTab] = useState('description');

  const gridImages = images.length === 4 ? images : [...images, ...images].slice(0, 4);

  return (
    <div className="min-h-screen bg-[#faf9f6] pt-20 sm:pt-24 md:pt-20 pb-4 sm:pb-8 md:pb-16 px-2 sm:px-4 flex flex-col items-center font-sans relative overflow-x-hidden">
      <div className="w-full max-w-7xl bg-white rounded-2xl sm:rounded-3xl flex flex-col md:flex-row overflow-hidden shadow-lg" style={{maxWidth: '100vw', borderRadius: '32px'}}>
        {/* Left: Main Image with Thumbnails */}
        <div className="md:w-1/2 flex items-center justify-center bg-transparent p-4 sm:p-6 md:p-10 min-h-[300px] sm:min-h-[400px] md:min-h-[520px]">
          <div className="flex flex-col md:flex-row gap-3 md:gap-4 items-center justify-center w-full">
            {/* Thumbnails - Horizontal on mobile, Vertical on desktop */}
            <div className="flex flex-row md:flex-col gap-2 md:gap-3 md:mr-6 order-2 md:order-1">
              {images.map((img: string, idx: number) => (
                <button
                  key={img+idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`border-2 rounded-lg md:rounded-xl overflow-hidden w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 flex items-center justify-center bg-white transition-all duration-200 flex-shrink-0 ${selectedImageIndex === idx ? 'border-[#bfa14a] shadow-lg' : 'border-gray-200'}`}
                  style={{ outline: selectedImageIndex === idx ? '2px solid #bfa14a' : 'none' }}
                  tabIndex={0}
                  aria-label={`Show image ${idx + 1}`}
                >
                  <Image src={img} alt={`Thumbnail ${idx + 1}`} width={60} height={60} className="object-contain w-full h-full" />
                </button>
              ))}
            </div>
            {/* Main Image with 3D Tilt */}
            <TiltWrapper glareEnable={true} glareMaxOpacity={0.25} scale={1.07} transitionSpeed={1500} tiltMaxAngleX={15} tiltMaxAngleY={15} className="shadow-2xl rounded-2xl bg-transparent order-1 md:order-2 w-full md:w-auto">
              <div className="w-full h-full flex items-center justify-center">
                <div className="relative w-full max-w-[280px] sm:max-w-[320px] md:w-[340px] h-[320px] sm:h-[380px] md:h-[420px] rounded-2xl md:rounded-3xl overflow-hidden shadow-xl bg-white">
                  <Image
                    src={mainImage}
                    alt={product.name}
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
              </div>
            </TiltWrapper>
          </div>
        </div>
        {/* Right: Details */}
        <div className="md:w-1/2 p-4 sm:p-6 md:p-8 lg:p-16 flex flex-col justify-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-bold mb-2 text-gray-900 tracking-tight leading-tight bg-gradient-to-r from-[#bfa14a] via-[#fffbe6] to-[#bfa14a] text-transparent bg-clip-text" style={{ fontFamily: 'Didot, serif', color: '#111' }}>
            {product.name}
          </h1>
          <div className="text-base sm:text-lg md:text-xl text-gray-500 mb-3 font-light">Inspired by {product.brand}</div>
          <div className="mb-4 md:mb-6 text-sm sm:text-base text-gray-400">This product exists in {defaultSizes.length} sizes</div>
          <div className="flex flex-wrap sm:flex-nowrap gap-2 sm:gap-3 md:gap-4 mb-6 md:mb-8">
            {defaultSizes.map((size: any, idx: number) => (
              <button
                key={size.label}
                className={`px-4 sm:px-5 md:px-7 py-2 rounded-lg text-sm sm:text-base font-medium border transition-all focus:outline-none shadow-sm flex-1 sm:flex-none ${
                  selectedSizeIndex === idx
                    ? 'bg-white text-gray-900 border-gray-900 shadow-md'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                }`}
                style={{ minWidth: '80px' }}
                onClick={() => setSelectedSizeIndex(idx)}
              >
                {size.label}
              </button>
            ))}
          </div>
          <div className="text-xl sm:text-2xl font-bold text-[#b07a5a] mb-6 md:mb-10">₹{getPrice()}</div>
          {/* Tabs */}
          <div className="mb-6 md:mb-8">
            <div className="flex space-x-4 sm:space-x-6 md:space-x-10 border-b border-gray-200 mb-4 overflow-x-auto scrollbar-hide pb-2">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  className={`pb-2 text-sm sm:text-base md:text-lg font-medium transition-all border-b-2 whitespace-nowrap ${
                    activeTab === tab.key ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-900'
                  }`}
                  style={{ fontFamily: 'serif' }}
                  onClick={() => setActiveTab(tab.key)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="text-gray-800 text-sm sm:text-base md:text-lg min-h-[90px] font-light leading-relaxed" style={{ whiteSpace: 'pre-line' }}>
              {tabContent[activeTab]}
            </div>
          </div>
          {/* Add to Cart inside details panel */}
          <button
            className="w-full bg-gradient-to-r from-[#bfa14a] via-[#fffbe6] to-[#bfa14a] text-white px-6 sm:px-8 md:px-12 py-3 sm:py-3.5 md:py-4 rounded-full text-base sm:text-lg font-bold shadow-lg hover:from-[#fffbe6] hover:to-[#bfa14a] transition-colors mb-4 md:mb-6 mt-2 border-2 border-[#bfa14a]"
            onClick={async () => {
              setIsAdding(true);
              await addToCart({
                id: product.slug,
                name: product.name,
                price: getPrice(),
                image: images[0],
                quantity: 1,
                size: defaultSizes[selectedSizeIndex].label,
                category: 'Recreations',
                description: demo.description,
              });
              setIsAdding(false);
              confetti({ particleCount: 80, spread: 70, origin: { y: 0.7 }, colors: ['#bfa14a', '#fffbe6', '#f7e7b4', '#111'] });
            }}
            disabled={isAdding}
          >
            {isAdding ? 'Adding...' : 'Add to Cart'}
          </button>
        </div>
      </div>
      {/* Enhanced Product Gallery */}
      <section className="w-full max-w-6xl mt-4 sm:mt-6 md:mt-8 px-2 sm:px-4 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-10">
        {gridImages.map((img: string, idx: number) => (
          <TiltWrapper key={img+idx} glareEnable={true} glareMaxOpacity={0.18} scale={1.04} transitionSpeed={1200} tiltMaxAngleX={10} tiltMaxAngleY={10} className="bg-white/60 backdrop-blur-lg rounded-2xl sm:rounded-3xl shadow-2xl group hover:scale-105 transition-transform duration-500 ease-in-out relative overflow-hidden">
            <div className="absolute inset-0 z-0 pointer-events-none animate-pulse" style={{ background: 'radial-gradient(circle at 60% 40%, #fffbe6 0%, #bfa14a22 80%, transparent 100%)' }}></div>
            <div className="w-full h-56 sm:h-64 md:h-72 lg:h-[340px] flex items-center justify-center z-10 relative">
              <Image
                src={img}
                alt={`Product grid image ${idx + 1}`}
                width={320}
                height={320}
                className="object-contain w-full h-full rounded-xl sm:rounded-2xl"
                style={{ background: '#fff' }}
              />
            </div>
          </TiltWrapper>
        ))}
      </section>
      {/* Why You'll Love It (match bestseller order) */}
      <section className="w-full max-w-6xl mx-auto my-8 sm:my-10 md:my-12 flex flex-col items-center text-center py-4 sm:py-6 md:py-8 px-2 sm:px-4">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif font-semibold mb-6 sm:mb-8 md:mb-12 text-gray-900 tracking-tight relative">
          <span className="relative z-10">Why You'll Love It</span>
          <span className="absolute left-0 bottom-[-8px] sm:bottom-[-10px] w-full h-1.5 sm:h-2 bg-gradient-to-r from-[#bfa14a] via-[#f7e7b4] to-[#bfa14a] rounded-full opacity-60"></span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5 md:gap-6 w-full">
          {[
            {icon:'💎',title:'Premium Ingredients',desc:'Crafted with the finest, globally sourced notes for a truly luxurious scent.'},
            {icon:'🕰️',title:'Long Lasting',desc:'Enjoy a fragrance that stays with you all day and into the night.'},
            {icon:'♻️',title:'Refillable Bottle',desc:'Eco-friendly, beautifully designed bottles you can refill again and again.'},
            {icon:'🌍',title:'Unisex Appeal',desc:'A scent designed to be loved by everyone, anytime, anywhere.'},
          ].map((f, i) => (
            <TiltWrapper key={f.title} glareEnable={true} glareMaxOpacity={0.15} scale={1.03} transitionSpeed={1000} tiltMaxAngleX={8} tiltMaxAngleY={8} className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 flex flex-col items-center hover:shadow-2xl hover:scale-105 transition-all relative overflow-hidden">
              <span className="text-3xl sm:text-4xl md:text-5xl mb-2 sm:mb-3 md:mb-4">{f.icon}</span>
              <h3 className="text-base sm:text-lg md:text-xl font-bold mb-1 sm:mb-2 text-gray-900">{f.title}</h3>
              <p className="text-xs sm:text-sm md:text-base text-gray-500 font-medium">{f.desc}</p>
            </TiltWrapper>
          ))}
        </div>
      </section>
      {/* The Noamani Range */}
      <section className="w-full max-w-7xl mx-auto mb-12 sm:mb-16 md:mb-24 flex flex-col items-center py-6 sm:py-8 md:py-14 px-2 sm:px-4 luxury-section-bg">
        <h2 className="luxury-heading mb-6 sm:mb-8 md:mb-10 text-center w-full relative inline-block text-2xl sm:text-3xl md:text-4xl lg:text-5xl px-2">
          <span className="relative z-10">The Noamani Range</span>
          <span className="luxury-underline"></span>
        </h2>
        <div className="w-full flex flex-col md:flex-row items-stretch justify-between gap-6 sm:gap-8 md:gap-10 md:gap-0">
          {/* Left: Text + Button */}
          <div className="flex-1 flex flex-col items-center md:items-start justify-center text-center md:text-left px-2 sm:px-4 md:pr-8 lg:pr-12 py-4 sm:py-6 md:py-8 md:py-0">
            <p className="luxury-desc mb-4 sm:mb-6 md:mb-8 max-w-md text-sm sm:text-base md:text-lg">
              Fragrances that are <span className="luxury-highlight">powerful</span> and <span className="luxury-highlight">noble</span> all at once: choose from the crisp & raw Eau de Noamani, the mysterious & sensual Eau de Parfum, the smoldering & fierce Parfum, and the rare & intoxicating Elixir.
            </p>
            <button className="luxury-btn mt-2 sm:mt-4 text-sm sm:text-base md:text-lg px-4 sm:px-6 md:px-8 py-2 sm:py-2.5 md:py-3">Discover</button>
          </div>
          {/* Right: Image */}
          <div className="flex-1 flex items-center justify-center w-full px-2 sm:px-4">
            <TiltWrapper glareEnable={true} glareMaxOpacity={0.18} scale={1.05} transitionSpeed={1200} tiltMaxAngleX={10} tiltMaxAngleY={10} className="luxury-img-frame shadow-2xl max-w-full sm:max-w-[400px] md:max-w-[500px] w-full rounded-2xl sm:rounded-[40px]">
              <Image
                src="/product1.jpg"
                alt="Noamani Range"
                width={500}
                height={600}
                className="object-contain w-full h-full luxury-img"
                style={{ borderRadius: '32px' }}
              />
            </TiltWrapper>
          </div>
        </div>
      </section>
      {/* Prolong the Trail with the Ritual */}
      <section className="w-full max-w-7xl mx-auto mb-12 sm:mb-16 md:mb-20 flex flex-col items-center py-6 sm:py-10 md:py-14 px-2 sm:px-4">
        <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-serif font-semibold mb-6 sm:mb-8 md:mb-12 text-gray-900 tracking-tight relative inline-block text-center px-2">
          <span className="relative z-10">Prolong the Trail of Noamani with the Ritual:</span>
          <span className="absolute left-0 bottom-[-6px] sm:bottom-[-8px] w-full h-0.5 sm:h-1 bg-gradient-to-r from-[#bfa14a] via-[#fffbe6] to-[#bfa14a] rounded-full opacity-60"></span>
        </h2>
        <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 md:gap-8 px-2 sm:px-4">
          {/* Step 1 */}
          <TiltWrapper glareEnable={true} glareMaxOpacity={0.18} scale={1.04} transitionSpeed={1200} tiltMaxAngleX={10} tiltMaxAngleY={10} className="bg-white rounded-2xl sm:rounded-3xl shadow-xl flex flex-col items-center p-4 sm:p-6 md:p-8 w-full sm:max-w-[300px] md:max-w-[360px] gap-3 sm:gap-4 md:gap-5 border border-gray-100">
            <div className="flex items-center justify-center gap-2 sm:gap-3">
              <span className="text-xs sm:text-sm font-bold w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-[#bfa14a] to-[#fffbe6] text-white shadow">01</span>
              <span className="text-2xl sm:text-3xl">🌅</span>
            </div>
            <div className="text-lg sm:text-xl md:text-2xl font-black uppercase text-[#bfa14a] text-center tracking-wider">Awaken the Senses</div>
            <div className="w-full flex items-center justify-center rounded-xl sm:rounded-2xl overflow-hidden bg-white shadow">
              <Image src="/product1.jpg" alt="Awaken the Senses" width={240} height={260} className="object-contain w-full h-full" />
            </div>
          </TiltWrapper>
          {/* Step 2 */}
          <TiltWrapper glareEnable={true} glareMaxOpacity={0.18} scale={1.04} transitionSpeed={1200} tiltMaxAngleX={10} tiltMaxAngleY={10} className="bg-white rounded-2xl sm:rounded-3xl shadow-xl flex flex-col items-center p-4 sm:p-6 md:p-8 w-full sm:max-w-[300px] md:max-w-[360px] gap-3 sm:gap-4 md:gap-5 border border-gray-100">
            <div className="flex items-center justify-center gap-2 sm:gap-3">
              <span className="text-xs sm:text-sm font-bold w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-[#bfa14a] to-[#fffbe6] text-white shadow">02</span>
              <span className="text-2xl sm:text-3xl">💧</span>
            </div>
            <div className="text-lg sm:text-xl md:text-2xl font-black uppercase text-[#bfa14a] text-center tracking-wider">Prolong the Experience</div>
            <div className="w-full flex items-center justify-center rounded-xl sm:rounded-2xl overflow-hidden bg-white shadow">
              <Image src="/newproduct-removebg-preview.png" alt="Prolong the Experience" width={240} height={260} className="object-contain w-full h-full" />
            </div>
          </TiltWrapper>
          {/* Step 3 */}
          <TiltWrapper glareEnable={true} glareMaxOpacity={0.18} scale={1.04} transitionSpeed={1200} tiltMaxAngleX={10} tiltMaxAngleY={10} className="bg-white rounded-2xl sm:rounded-3xl shadow-xl flex flex-col items-center p-4 sm:p-6 md:p-8 w-full sm:max-w-[300px] md:max-w-[360px] gap-3 sm:gap-4 md:gap-5 border border-gray-100">
            <div className="flex items-center justify-center gap-2 sm:gap-3">
              <span className="text-xs sm:text-sm font-bold w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-[#bfa14a] to-[#fffbe6] text-white shadow">03</span>
              <span className="text-2xl sm:text-3xl">✨</span>
            </div>
            <div className="text-lg sm:text-xl md:text-2xl font-black uppercase text-[#bfa14a] text-center tracking-wider">Spray Pulse Points</div>
            <div className="w-full flex items-center justify-center rounded-xl sm:rounded-2xl overflow-hidden bg-white shadow">
              <Image src="/productnew.png" alt="Spray Pulse Points" width={240} height={260} className="object-contain w-full h-full" />
            </div>
          </TiltWrapper>
        </div>
      </section>
      {/* Discover the Noamani Ritual */}
      <section className="w-full mb-12 sm:mb-16 md:mb-28 py-6 sm:py-8 md:py-10 bg-gradient-to-br from-[#fffbe6] to-[#f7f3e3] px-2 sm:px-4">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          <h2 className="luxury-heading mb-8 sm:mb-10 md:mb-14 text-center w-full relative inline-block text-2xl sm:text-3xl md:text-4xl lg:text-5xl px-2">
            <span className="relative z-10">Discover the Noamani Ritual</span>
            <span className="luxury-underline"></span>
          </h2>
          <div className="w-full flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8 md:gap-10">
            {/* Left: Large Image */}
            <div className="flex-[1.5] flex items-center justify-center w-full md:pr-4 lg:pr-8 mb-6 sm:mb-8 md:mb-0 px-2 sm:px-4">
              <TiltWrapper glareEnable={true} glareMaxOpacity={0.18} scale={1.05} transitionSpeed={1200} tiltMaxAngleX={10} tiltMaxAngleY={10} className="luxury-img-frame w-full max-w-full sm:max-w-[400px] md:max-w-[500px]">
                <Image
                  src="/product1.jpg"
                  alt="Noamani Ritual Banner"
                  width={500}
                  height={600}
                  className="object-contain w-full h-full luxury-img"
                  style={{ borderRadius: '32px' }}
                />
              </TiltWrapper>
            </div>
            {/* Right: Text + Button */}
            <div className="flex-1 flex flex-col items-center md:items-start justify-center text-center md:text-left px-2 sm:px-4 md:pl-4 lg:pl-8" style={{ minHeight: 'auto' }}>
              <div className="luxury-desc-box mb-4 sm:mb-6 text-sm sm:text-base md:text-lg">
                The Noamani line is composed of products formulated with the finest natural-origin ingredients and infused with signature extracts. Prolong the trail of your Noamani fragrance with this daily ritual.
              </div>
              <button className="luxury-btn mt-2 sm:mt-4 text-sm sm:text-base md:text-lg px-4 sm:px-6 md:px-8 py-2 sm:py-2.5 md:py-3">Discover</button>
            </div>
          </div>
        </div>
      </section>
      <ProductReviews />
      <Footer />
      {/* Styles reused from bestseller detail for visual parity */}
      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        .luxury-section-bg { background: #fcf8e5 !important; position: relative; overflow: visible; }
        .luxury-heading { 
          font-family: 'Playfair Display', 'Didot', serif; 
          font-weight: 700; 
          color: #1a1a1a; 
          letter-spacing: 1.5px; 
          position: relative; 
        }
        @media (max-width: 640px) {
          .luxury-heading { font-size: 1.75rem; letter-spacing: 1px; }
        }
        @media (min-width: 641px) and (max-width: 768px) {
          .luxury-heading { font-size: 2.25rem; }
        }
        @media (min-width: 769px) and (max-width: 1024px) {
          .luxury-heading { font-size: 2.5rem; }
        }
        @media (min-width: 1025px) {
          .luxury-heading { font-size: 2.7rem; }
        }
        .luxury-underline { 
          display: block; 
          position: absolute; 
          left: 0; 
          right: 0; 
          bottom: -6px; 
          height: 4px; 
          width: 100%; 
          background: linear-gradient(90deg, #bfa14a 0%, #fffbe6 50%, #bfa14a 100%); 
          border-radius: 4px; 
          opacity: 0.7; 
        }
        @media (min-width: 768px) {
          .luxury-underline { bottom: -8px; height: 6px; border-radius: 6px; }
        }
        .luxury-desc { 
          font-family: 'Marcellus', 'Georgia', serif; 
          color: #3a2e13; 
          background: rgba(255,255,255,0.7); 
          border-left: 4px solid #bfa14a; 
          border-radius: 12px; 
          box-shadow: 0 4px 24px 0 rgba(191,161,74,0.08); 
          padding: 0.9rem 1.2rem; 
          font-weight: 400; 
          line-height: 1.6; 
          letter-spacing: 0.2px; 
        }
        @media (min-width: 768px) {
          .luxury-desc { 
            font-size: 1.18rem; 
            border-left: 5px solid #bfa14a; 
            border-radius: 18px; 
            padding: 1.1rem 1.5rem; 
            line-height: 1.7; 
          }
        }
        .luxury-highlight { color: #bfa14a; font-weight: 700; font-family: 'Playfair Display', 'Didot', serif; letter-spacing: 0.5px; }
        .luxury-btn { 
          font-family: 'Marcellus', 'Georgia', serif; 
          font-weight: 700; 
          color: #fff; 
          background: linear-gradient(90deg, #bfa14a 0%, #fffbe6 100%); 
          border: none; 
          border-radius: 999px; 
          box-shadow: 0 4px 24px 0 rgba(191,161,74,0.18); 
          letter-spacing: 1.5px; 
          text-transform: uppercase; 
          position: relative; 
          overflow: hidden; 
          cursor: pointer; 
          transition: all 0.3s;
        }
        @media (max-width: 640px) {
          .luxury-btn { font-size: 0.875rem; letter-spacing: 1px; }
        }
        @media (min-width: 641px) {
          .luxury-btn { letter-spacing: 2px; }
        }
        .luxury-btn::after { 
          content: ''; 
          position: absolute; 
          left: -75%; 
          top: 0; 
          width: 50%; 
          height: 100%; 
          background: linear-gradient(120deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.0) 100%); 
          transform: skewX(-20deg); 
          transition: left 0.5s; 
          z-index: 1; 
        }
        .luxury-btn:hover { box-shadow: 0 8px 32px 0 rgba(191,161,74,0.28); transform: scale(1.04); }
        .luxury-btn:hover::after { left: 120%; transition: left 0.5s; }
        .luxury-img-frame { border: none !important; border-image: none !important; box-shadow: none !important; }
        .luxury-img { filter: drop-shadow(0 2px 16px #bfa14a33); border-radius: 24px; transition: filter 0.3s; }
        @media (min-width: 768px) {
          .luxury-img { border-radius: 32px; }
        }
        .luxury-desc-box { 
          font-family: 'Marcellus', 'Georgia', serif; 
          color: #3a2e13; 
          background: rgba(255,255,255,0.8); 
          border-left: 4px solid #bfa14a; 
          border-radius: 12px; 
          box-shadow: 0 4px 24px 0 rgba(191,161,74,0.10); 
          padding: 0.9rem 1.2rem; 
          font-weight: 400; 
          line-height: 1.6; 
          letter-spacing: 0.2px; 
        }
        @media (min-width: 768px) {
          .luxury-desc-box { 
            font-size: 1.13rem; 
            border-left: 5px solid #bfa14a; 
            border-radius: 18px; 
            padding: 1.1rem 1.5rem; 
            line-height: 1.7; 
          }
        }
      `}</style>
    </div>
  );
}