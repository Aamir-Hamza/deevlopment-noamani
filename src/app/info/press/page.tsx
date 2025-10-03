'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Download } from 'lucide-react';

const pressReleases = [
  {
    title: 'New Sustainable Collection',
    date: 'December 2023',
    description: 'Introducing our eco-friendly fragrance line',
    image: 'https://images.pexels.com/photos/3059609/pexels-photo-3059609.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  {
    title: 'Global Expansion',
    date: 'October 2023',
    description: 'Opening new boutiques across Europe',
    image: 'https://images.pexels.com/photos/2922326/pexels-photo-2922326.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  {
    title: 'Award-Winning Design',
    date: 'September 2023',
    description: 'Recognition for innovative packaging',
    image: 'https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  }
];

const mediaCoverage = [
  {
    outlet: 'Vogue',
    title: 'The Future of Luxury Fragrance',
    quote: 'Setting new standards in sustainable luxury',
    image: 'https://images.pexels.com/photos/4110409/pexels-photo-4110409.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  {
    outlet: 'Forbes',
    title: 'Innovation in Perfumery',
    quote: 'Revolutionizing the fragrance industry',
    image: 'https://images.pexels.com/photos/5632397/pexels-photo-5632397.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  {
    outlet: 'Elle',
    title: 'Sustainable Luxury',
    quote: 'Where luxury meets responsibility',
    image: 'https://images.pexels.com/photos/6621462/pexels-photo-6621462.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  }
];

export default function PressPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="relative h-[80vh] bg-black text-white flex items-center justify-center"
      >
        <Image
          src="https://images.pexels.com/photos/3738338/pexels-photo-3738338.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
          alt="Press Room"
          fill
          className="object-cover opacity-40"
        />
        <div className="relative z-10 text-center max-w-4xl px-4">
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-6xl font-light mb-6"
          >
            PRESS ROOM
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="text-xl font-light"
          >
            Latest news and media coverage
          </motion.p>
        </div>
      </motion.div>

      {/* Press Kit Download */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-3xl mx-auto mt-16 mb-16 px-4"
      >
        <h2 className="text-3xl font-light mb-6">PRESS KIT</h2>
        <p className="text-gray-600 mb-8">
          Download our press kit for high-resolution images, company information, and brand assets.
        </p>
        <button className="bg-black text-white px-12 py-4 text-sm font-medium hover:bg-gray-800 transition-colors inline-flex items-center gap-2">
          <Download className="w-4 h-4" />
          DOWNLOAD PRESS KIT
        </button>
      </motion.div>

      {/* Press Releases Grid */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-light text-center mb-12">Latest Press Releases</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pressReleases.map((release, index) => (
            <motion.div
              key={release.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <div className="relative aspect-[3/4] overflow-hidden mb-6">
                <Image
                  src={release.image}
                  alt={release.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <p className="text-lg font-light">{release.description}</p>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <h3 className="text-2xl font-light mb-2">{release.title}</h3>
                <p className="text-gray-600">{release.date}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Media Coverage */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-gray-50 py-16"
      >
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-light text-center mb-12">Media Coverage</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {mediaCoverage.map((coverage, index) => (
              <motion.div
                key={coverage.outlet}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <div className="relative aspect-[3/4] overflow-hidden mb-6">
                  <Image
                    src={coverage.image}
                    alt={coverage.outlet}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <p className="text-lg font-light">{coverage.quote}</p>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <h3 className="text-2xl font-light mb-2">{coverage.outlet}</h3>
                  <p className="text-gray-600">{coverage.title}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Media Contact */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="py-16 px-4 text-center"
      >
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-light mb-6">Media Inquiries</h2>
          <p className="text-gray-600 mb-8">
            For press and media inquiries, please contact our PR team.
          </p>
          <button className="bg-black text-white px-12 py-4 text-sm font-medium hover:bg-gray-800 transition-colors">
            CONTACT PR TEAM
          </button>
        </div>
      </motion.div>
    </div>
  );
} 