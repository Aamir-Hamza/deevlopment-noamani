'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'

const milestones = [
  {
    year: '1995',
    title: 'Our Beginning',
    description: 'Founded with a passion for luxury fragrances',
    image: 'https://images.pexels.com/photos/3059609/pexels-photo-3059609.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  {
    year: '2005',
    title: 'Global Expansion',
    description: 'Opening our first international boutiques',
    image: 'https://images.pexels.com/photos/2922326/pexels-photo-2922326.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  {
    year: '2015',
    title: 'Sustainability Initiative',
    description: 'Committed to eco-friendly practices',
    image: 'https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  {
    year: '2023',
    title: 'Innovation in Fragrance',
    description: 'Launching revolutionary scent technology',
    image: 'https://images.pexels.com/photos/965989/pexels-photo-965989.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  }
];

const values = [
  {
    title: 'Craftsmanship',
    description: 'Every fragrance is crafted with precision and care',
    image: 'https://images.pexels.com/photos/4110409/pexels-photo-4110409.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  {
    title: 'Innovation',
    description: 'Pushing boundaries in perfumery',
    image: 'https://images.pexels.com/photos/5632397/pexels-photo-5632397.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  {
    title: 'Sustainability',
    description: 'Committed to environmental responsibility',
    image: 'https://images.pexels.com/photos/6621462/pexels-photo-6621462.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  }
];

const team = [
  {
    name: 'CREATIVE DIRECTOR',
    role: 'Design & Innovation',
    image: 'https://images.pexels.com/photos/5490779/pexels-photo-5490779.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  {
    name: 'MASTER PERFUMER',
    role: 'Fragrance Creation',
    image: 'https://images.pexels.com/photos/4110410/pexels-photo-4110410.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  {
    name: 'ARTISAN CRAFTSMAN',
    role: 'Product Development',
    image: 'https://images.pexels.com/photos/4041393/pexels-photo-4041393.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  }
];

export default function AboutPage() {
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
          alt="About Us"
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
            OUR STORY
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="text-xl font-light"
          >
            Crafting luxury fragrances since 1995
          </motion.p>
        </div>
      </motion.div>

      {/* Introduction */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-3xl mx-auto mt-16 mb-16 px-4"
      >
        <h2 className="text-3xl font-light mb-6">OUR MISSION</h2>
        <p className="text-gray-600">
          To create exceptional fragrances that capture moments, evoke emotions, and leave lasting impressions.
          We believe in the power of scent to transform and inspire.
        </p>
      </motion.div>

      {/* Milestones Grid */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-light text-center mb-12">Our Journey</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {milestones.map((milestone, index) => (
            <motion.div
              key={milestone.year}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <div className="relative aspect-[3/4] overflow-hidden mb-6">
                <Image
                  src={milestone.image}
                  alt={milestone.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <p className="text-lg font-light">{milestone.description}</p>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <h3 className="text-2xl font-light mb-2">{milestone.year}</h3>
                <p className="text-gray-600">{milestone.title}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Values Section */}
      {/* Removed 'Our Values' section as per request */}

      {/* Bottom CTA */}
      {/* Removed 'Experience Our Legacy' section as per request */}

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Our Philosophy */}
        {/* Removed 'OUR PHILOSOPHY' section as per request */}

        {/* Team Section */}
        {/* Removed THE ARTISANS section as per request */}

        {/* Customer Care Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center bg-gray-50 py-16 px-4 mb-16"
        >
          <h2 className="text-3xl font-light mb-12">CUSTOMER CARE</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="p-6 bg-white shadow-sm">
              <h3 className="text-lg font-medium mb-4">Shipping</h3>
              <p className="text-gray-600 mb-4">Free shipping on orders over $100. Standard delivery within 3-5 business days.</p>
              <Link href="/about/shipping" className="text-black hover:text-gray-600 text-sm font-medium">
                Learn More →
              </Link>
            </div>
            <div className="p-6 bg-white shadow-sm">
              <h3 className="text-lg font-medium mb-4">Returns</h3>
              <p className="text-gray-600 mb-4">Easy 30-day returns. We accept returns for any reason within 30 days of delivery.</p>
              <Link href="/about/returns" className="text-black hover:text-gray-600 text-sm font-medium">
                Learn More →
              </Link>
            </div>
            <div className="p-6 bg-white shadow-sm">
              <h3 className="text-lg font-medium mb-4">FAQs</h3>
              <p className="text-gray-600 mb-4">Find answers to commonly asked questions about our products and services.</p>
              <Link href="/about/faqs" className="text-black hover:text-gray-600 text-sm font-medium">
                Learn More →
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center bg-gray-50 py-16 px-4"
        >
          <h2 className="text-2xl font-light mb-4">GET IN TOUCH</h2>
          <p className="text-gray-600 mb-8">We'd love to hear from you. Contact us for any inquiries.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div>
              <h3 className="text-lg font-medium mb-2">VISIT</h3>
              <p className="text-gray-600">123 Luxury Avenue<br />New York, NY 10001</p>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">CONTACT</h3>
              <p className="text-gray-600">9821744247<br />noamaniperfumes@gmail.com</p>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">HOURS</h3>
              <p className="text-gray-600">Mon - Sat: 10AM - 7PM<br />Sun: 12PM - 6PM</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
} 