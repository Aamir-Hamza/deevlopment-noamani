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
    <div className="min-h-screen bg-[#faf9f6] py-16 px-2 flex flex-col items-center font-sans relative overflow-x-hidden">
      <div className="w-full bg-white rounded-3xl flex flex-col md:flex-row overflow-hidden" style={{maxWidth: '100vw', borderRadius: '32px'}}>
        {/* Left: Main Image with Thumbnails */}
        <div className="md:w-1/2 flex items-center justify-center bg-transparent p-10 min-h-[520px]">
          <div className="flex flex-row gap-4 items-center justify-center">
            {/* Thumbnails */}
            <div className="flex flex-col gap-3 mr-6">
              {images.map((img: string, idx: number) => (
                <button
                  key={img+idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`border-2 rounded-xl overflow-hidden w-16 h-16 flex items-center justify-center bg-white transition-all duration-200 ${selectedImageIndex === idx ? 'border-[#bfa14a] shadow-lg' : 'border-gray-200'}`}
                  style={{ outline: selectedImageIndex === idx ? '2px solid #bfa14a' : 'none' }}
                  tabIndex={0}
                  aria-label={`Show image ${idx + 1}`}
                >
                  <Image src={img} alt={`Thumbnail ${idx + 1}`} width={60} height={60} className="object-contain w-full h-full" />
                </button>
              ))}
            </div>
            {/* Main Image with 3D Tilt */}
            <TiltWrapper glareEnable={true} glareMaxOpacity={0.25} scale={1.07} transitionSpeed={1500} tiltMaxAngleX={15} tiltMaxAngleY={15} className="shadow-2xl rounded-2xl bg-transparent">
              <div className="w-full h-full flex items-center justify-center">
                <div className="relative w-[340px] h-[420px] rounded-3xl overflow-hidden shadow-xl bg-white">
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
        <div className="md:w-1/2 p-16 flex flex-col justify-center">
          <h1 className="text-5xl font-serif font-bold mb-2 text-gray-900 tracking-tight leading-tight bg-gradient-to-r from-[#bfa14a] via-[#fffbe6] to-[#bfa14a] text-transparent bg-clip-text" style={{ fontFamily: 'Didot, serif', color: '#111' }}>
            {product.name}
          </h1>
          <div className="text-xl text-gray-500 mb-3 font-light">Inspired by {product.brand}</div>
          <div className="mb-6 text-base text-gray-400">This product exists in {defaultSizes.length} sizes</div>
          <div className="flex space-x-4 mb-8">
            {defaultSizes.map((size: any, idx: number) => (
              <button
                key={size.label}
                className={`px-7 py-2 rounded-lg text-base font-medium border transition-all focus:outline-none shadow-sm ${
                  selectedSizeIndex === idx
                    ? 'bg-white text-gray-900 border-gray-900 shadow-md'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                }`}
                style={{ minWidth: 90 }}
                onClick={() => setSelectedSizeIndex(idx)}
              >
                {size.label}
              </button>
            ))}
          </div>
          <div className="text-2xl font-bold text-[#b07a5a] mb-10">₹{getPrice()}</div>
          {/* Tabs */}
          <div className="mb-8">
            <div className="flex space-x-10 border-b border-gray-200 mb-4 overflow-x-auto scrollbar-hide">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  className={`pb-2 text-lg font-medium transition-all border-b-2 whitespace-nowrap ${
                    activeTab === tab.key ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-900'
                  }`}
                  style={{ fontFamily: 'serif' }}
                  onClick={() => setActiveTab(tab.key)}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <div className="text-gray-800 text-lg min-h-[90px] font-light leading-relaxed" style={{ whiteSpace: 'pre-line' }}>
              {tabContent[activeTab]}
            </div>
          </div>
          {/* Add to Cart inside details panel */}
          <button
            className="w-full md:w-auto bg-gradient-to-r from-[#bfa14a] via-[#fffbe6] to-[#bfa14a] text-white px-12 py-4 rounded-full text-lg font-bold shadow-lg hover:from-[#fffbe6] hover:to-[#bfa14a] transition-colors mb-6 mt-2 border-2 border-[#bfa14a]"
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
      <section className="w-full max-w-6xl mt-8 grid grid-cols-1 md:grid-cols-2 gap-10">
        {gridImages.map((img: string, idx: number) => (
          <TiltWrapper key={img+idx} glareEnable={true} glareMaxOpacity={0.18} scale={1.04} transitionSpeed={1200} tiltMaxAngleX={10} tiltMaxAngleY={10} className="bg-white/60 backdrop-blur-lg rounded-3xl shadow-2xl group hover:scale-105 transition-transform duration-500 ease-in-out relative overflow-hidden">
            <div className="absolute inset-0 z-0 pointer-events-none animate-pulse" style={{ background: 'radial-gradient(circle at 60% 40%, #fffbe6 0%, #bfa14a22 80%, transparent 100%)' }}></div>
            <div className="w-full h-72 md:h-[340px] flex items-center justify-center z-10 relative">
              <Image
                src={img}
                alt={`Product grid image ${idx + 1}`}
                width={320}
                height={320}
                className="object-contain w-full h-full rounded-2xl"
                style={{ background: '#fff' }}
              />
            </div>
          </TiltWrapper>
        ))}
      </section>
      {/* Why You'll Love It (match bestseller order) */}
      <section className="w-full max-w-6xl mx-auto my-12 flex flex-col items-center text-center py-8">
        <h2 className="text-4xl md:text-5xl font-serif font-semibold mb-12 text-gray-900 tracking-tight relative">
          <span className="relative z-10">Why You'll Love It</span>
          <span className="absolute left-0 bottom-[-10px] w-full h-2 bg-gradient-to-r from-[#bfa14a] via-[#f7e7b4] to-[#bfa14a] rounded-full opacity-60"></span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 w-full">
          {[
            {icon:'💎',title:'Premium Ingredients',desc:'Crafted with the finest, globally sourced notes for a truly luxurious scent.'},
            {icon:'🕰️',title:'Long Lasting',desc:'Enjoy a fragrance that stays with you all day and into the night.'},
            {icon:'♻️',title:'Refillable Bottle',desc:'Eco-friendly, beautifully designed bottles you can refill again and again.'},
            {icon:'🌍',title:'Unisex Appeal',desc:'A scent designed to be loved by everyone, anytime, anywhere.'},
          ].map((f, i) => (
            <TiltWrapper key={f.title} glareEnable={true} glareMaxOpacity={0.15} scale={1.03} transitionSpeed={1000} tiltMaxAngleX={8} tiltMaxAngleY={8} className="bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center hover:shadow-2xl hover:scale-105 transition-all relative overflow-hidden">
              <span className="text-5xl mb-4">{f.icon}</span>
              <h3 className="text-xl font-bold mb-2 text-gray-900">{f.title}</h3>
              <p className="text-gray-500 font-medium">{f.desc}</p>
            </TiltWrapper>
          ))}
        </div>
      </section>
      {/* The Noamani Range */}
      <section className="w-full max-w-7xl mx-auto mb-24 flex flex-col items-center py-14 luxury-section-bg">
        <h2 className="luxury-heading mb-10 text-center w-full relative inline-block">
          <span className="relative z-10">The Noamani Range</span>
          <span className="luxury-underline"></span>
        </h2>
        <div className="w-full flex flex-col md:flex-row items-stretch justify-between gap-10 md:gap-0">
          {/* Left: Text + Button */}
          <div className="flex-1 flex flex-col items-center md:items-start justify-center text-center md:text-left px-4 md:pr-12 py-8 md:py-0">
            <p className="luxury-desc mb-8 max-w-md">
              Fragrances that are <span className="luxury-highlight">powerful</span> and <span className="luxury-highlight">noble</span> all at once: choose from the crisp & raw Eau de Noamani, the mysterious & sensual Eau de Parfum, the smoldering & fierce Parfum, and the rare & intoxicating Elixir.
            </p>
            <button className="luxury-btn mt-4">Discover</button>
          </div>
          {/* Right: Image */}
          <div className="flex-1 flex items-center justify-center w-full">
            <TiltWrapper glareEnable={true} glareMaxOpacity={0.18} scale={1.05} transitionSpeed={1200} tiltMaxAngleX={10} tiltMaxAngleY={10} className="luxury-img-frame shadow-2xl max-w-[500px] w-full rounded-[40px]">
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
      <section className="w-full max-w-7xl mx-auto mb-20 flex flex-col items-center py-14">
        <h2 className="text-3xl md:text-4xl font-serif font-semibold mb-12 text-gray-900 tracking-tight relative inline-block">
          <span className="relative z-10">Prolong the Trail of Noamani with the Ritual:</span>
          <span className="absolute left-0 bottom-[-8px] w-full h-1 bg-gradient-to-r from-[#bfa14a] via-[#fffbe6] to-[#bfa14a] rounded-full opacity-60"></span>
        </h2>
        <div className="w-full flex flex-col md:flex-row items-center justify-between gap-8 px-4">
          {/* Step 1 */}
          <TiltWrapper glareEnable={true} glareMaxOpacity={0.18} scale={1.04} transitionSpeed={1200} tiltMaxAngleX={10} tiltMaxAngleY={10} className="bg-white rounded-3xl shadow-xl flex flex-col items-center p-8 w-full md:max-w-[360px] gap-5 border border-gray-100">
            <div className="flex items-center justify-center gap-3">
              <span className="text-sm font-bold w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-[#bfa14a] to-[#fffbe6] text-white shadow">01</span>
              <span className="text-3xl">🌅</span>
            </div>
            <div className="text-2xl font-black uppercase text-[#bfa14a] text-center tracking-wider">Awaken the Senses</div>
            <div className="w-full flex items-center justify-center rounded-2xl overflow-hidden bg-white shadow">
              <Image src="/product1.jpg" alt="Awaken the Senses" width={240} height={260} className="object-contain w-full h-full" />
            </div>
          </TiltWrapper>
          {/* Step 2 */}
          <TiltWrapper glareEnable={true} glareMaxOpacity={0.18} scale={1.04} transitionSpeed={1200} tiltMaxAngleX={10} tiltMaxAngleY={10} className="bg-white rounded-3xl shadow-xl flex flex-col items-center p-8 w-full md:max-w-[360px] gap-5 border border-gray-100">
            <div className="flex items-center justify-center gap-3">
              <span className="text-sm font-bold w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-[#bfa14a] to-[#fffbe6] text-white shadow">02</span>
              <span className="text-3xl">💧</span>
            </div>
            <div className="text-2xl font-black uppercase text-[#bfa14a] text-center tracking-wider">Prolong the Experience</div>
            <div className="w-full flex items-center justify-center rounded-2xl overflow-hidden bg-white shadow">
              <Image src="/newproduct-removebg-preview.png" alt="Prolong the Experience" width={240} height={260} className="object-contain w-full h-full" />
            </div>
          </TiltWrapper>
          {/* Step 3 */}
          <TiltWrapper glareEnable={true} glareMaxOpacity={0.18} scale={1.04} transitionSpeed={1200} tiltMaxAngleX={10} tiltMaxAngleY={10} className="bg-white rounded-3xl shadow-xl flex flex-col items-center p-8 w-full md:max-w-[360px] gap-5 border border-gray-100">
            <div className="flex items-center justify-center gap-3">
              <span className="text-sm font-bold w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-[#bfa14a] to-[#fffbe6] text-white shadow">03</span>
              <span className="text-3xl">✨</span>
            </div>
            <div className="text-2xl font-black uppercase text-[#bfa14a] text-center tracking-wider">Spray Pulse Points</div>
            <div className="w-full flex items-center justify-center rounded-2xl overflow-hidden bg-white shadow">
              <Image src="/productnew.png" alt="Spray Pulse Points" width={240} height={260} className="object-contain w-full h-full" />
            </div>
          </TiltWrapper>
        </div>
      </section>
      {/* Discover the Noamani Ritual */}
      <section className="w-full mb-28 py-10 bg-gradient-to-br from-[#fffbe6] to-[#f7f3e3]">
        <div className="max-w-7xl mx-auto flex flex-col items-center">
          <h2 className="luxury-heading mb-14 text-center w-full relative inline-block">
            <span className="relative z-10">Discover the Noamani Ritual</span>
            <span className="luxury-underline"></span>
          </h2>
          <div className="w-full flex flex-col md:flex-row items-center justify-between gap-10">
            {/* Left: Large Image */}
            <div className="flex-[1.5] flex items-center justify-center w-full md:pr-8 mb-10 md:mb-0">
              <TiltWrapper glareEnable={true} glareMaxOpacity={0.18} scale={1.05} transitionSpeed={1200} tiltMaxAngleX={10} tiltMaxAngleY={10} className="luxury-img-frame">
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
            <div className="flex-1 flex flex-col items-start justify-center text-left px-4 md:pl-8" style={{ minHeight: '320px' }}>
              <div className="luxury-desc-box mb-6">
                The Noamani line is composed of products formulated with the finest natural-origin ingredients and infused with signature extracts. Prolong the trail of your Noamani fragrance with this daily ritual.
              </div>
              <button className="luxury-btn mt-4">Discover</button>
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
        .luxury-heading { font-family: 'Playfair Display', 'Didot', serif; font-size: 2.7rem; font-weight: 700; color: #1a1a1a; letter-spacing: 1.5px; position: relative; }
        .luxury-underline { display: block; position: absolute; left: 0; right: 0; bottom: -8px; height: 6px; width: 100%; background: linear-gradient(90deg, #bfa14a 0%, #fffbe6 50%, #bfa14a 100%); border-radius: 6px; opacity: 0.7; }
        .luxury-desc { font-family: 'Marcellus', 'Georgia', serif; font-size: 1.18rem; color: #3a2e13; background: rgba(255,255,255,0.7); border-left: 5px solid #bfa14a; border-radius: 18px; box-shadow: 0 4px 24px 0 rgba(191,161,74,0.08); padding: 1.1rem 1.5rem; font-weight: 400; line-height: 1.7; letter-spacing: 0.2px; }
        .luxury-highlight { color: #bfa14a; font-weight: 700; font-family: 'Playfair Display', 'Didot', serif; letter-spacing: 0.5px; }
        .luxury-btn { font-family: 'Marcellus', 'Georgia', serif; font-size: 1.1rem; font-weight: 700; color: #fff; background: linear-gradient(90deg, #bfa14a 0%, #fffbe6 100%); border: none; border-radius: 999px; box-shadow: 0 4px 24px 0 rgba(191,161,74,0.18); padding: 0.9rem 2.5rem; letter-spacing: 2px; text-transform: uppercase; position: relative; overflow: hidden; cursor: pointer; }
        .luxury-btn::after { content: ''; position: absolute; left: -75%; top: 0; width: 50%; height: 100%; background: linear-gradient(120deg, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.0) 100%); transform: skewX(-20deg); transition: left 0.5s; z-index: 1; }
        .luxury-btn:hover { box-shadow: 0 8px 32px 0 rgba(191,161,74,0.28); transform: scale(1.04); }
        .luxury-btn:hover::after { left: 120%; transition: left 0.5s; }
        .luxury-img-frame { border: none !important; border-image: none !important; box-shadow: none !important; }
        .luxury-img { filter: drop-shadow(0 2px 16px #bfa14a33); border-radius: 32px; transition: filter 0.3s; }
        .luxury-desc-box { font-family: 'Marcellus', 'Georgia', serif; font-size: 1.13rem; color: #3a2e13; background: rgba(255,255,255,0.8); border-left: 5px solid #bfa14a; border-radius: 18px; box-shadow: 0 4px 24px 0 rgba(191,161,74,0.10); padding: 1.1rem 1.5rem; font-weight: 400; line-height: 1.7; letter-spacing: 0.2px; }
      `}</style>
    </div>
  );
}