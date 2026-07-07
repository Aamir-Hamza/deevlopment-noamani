'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { Gem, Recycle, Leaf, Hand } from 'lucide-react'

const values = [
  {
    icon: Gem,
    title: 'Premium Ingredients',
    description: 'Every fragrance is crafted with the rarest, globally sourced notes for a truly luxurious scent.',
    image: '/product2.jpg',
  },
  {
    icon: Hand,
    title: 'Handcrafted',
    description: 'Each bottle is composed with precision and care, blending traditional and modern perfumery techniques.',
    image: '/product3.jpg',
  },
  {
    icon: Recycle,
    title: 'Refillable Bottles',
    description: 'Our signature bottles are designed to be refilled again and again, reducing waste without compromising on elegance.',
    image: '/product1.jpg',
  },
  {
    icon: Leaf,
    title: 'Cruelty-Free',
    description: "We're proudly cruelty-free — none of our products or ingredients are tested on animals.",
    image: '/product4.jpg',
  },
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
            style={{ fontFamily: 'Didot, serif' }}
          >
            OUR STORY
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="text-xl font-light"
          >
            Artistry in every bottle
          </motion.p>
        </div>
      </motion.div>

      {/* Introduction */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-3xl mx-auto mt-16 mb-16 px-4"
      >
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#bfa14a] mb-3">Our Mission</p>
        <h2 className="text-3xl font-light mb-6" style={{ fontFamily: 'Didot, serif' }}>
          Crafted for Distinction
        </h2>
        <p className="text-gray-600 leading-relaxed">
          To create exceptional fragrances that capture moments, evoke emotions, and leave lasting impressions.
          We believe in the power of scent to transform and inspire — crafted for those who desire distinction in every detail.
        </p>
      </motion.div>

      {/* Our Craft / Values Grid */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#bfa14a] mb-3">Our Craft</p>
          <h2 className="text-3xl font-light" style={{ fontFamily: 'Didot, serif' }}>What We Believe</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <div className="relative aspect-[3/4] overflow-hidden mb-6 rounded-xl bg-gray-50 border border-gray-100">
                <Image
                  src={value.image}
                  alt={value.title}
                  fill
                  className="object-contain p-8 transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              <div className="text-center">
                <value.icon className="w-6 h-6 text-[#bfa14a] mx-auto mb-3" strokeWidth={1.5} />
                <h3 className="text-lg font-medium mb-2 text-gray-900">{value.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{value.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Customer Care Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center bg-gray-50 py-16 px-4 mb-16 rounded-2xl"
        >
          <h2 className="text-3xl font-light mb-12" style={{ fontFamily: 'Didot, serif' }}>Customer Care</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="p-6 bg-white shadow-sm rounded-xl">
              <h3 className="text-lg font-medium mb-4">Shipping</h3>
              <p className="text-gray-600 mb-4">Free shipping on orders above ₹2,000. Standard delivery within 3-5 business days.</p>
              <Link href="/about/shipping" className="text-black hover:text-[#bfa14a] text-sm font-medium">
                Learn More →
              </Link>
            </div>
            <div className="p-6 bg-white shadow-sm rounded-xl">
              <h3 className="text-lg font-medium mb-4">Returns</h3>
              <p className="text-gray-600 mb-4">Easy 30-day returns. We accept returns for any reason within 30 days of delivery.</p>
              <Link href="/about/returns" className="text-black hover:text-[#bfa14a] text-sm font-medium">
                Learn More →
              </Link>
            </div>
            <div className="p-6 bg-white shadow-sm rounded-xl">
              <h3 className="text-lg font-medium mb-4">FAQs</h3>
              <p className="text-gray-600 mb-4">Find answers to commonly asked questions about our products and services.</p>
              <Link href="/about/faqs" className="text-black hover:text-[#bfa14a] text-sm font-medium">
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
          className="text-center bg-gray-50 py-16 px-4 rounded-2xl"
        >
          <h2 className="text-2xl font-light mb-4" style={{ fontFamily: 'Didot, serif' }}>Get in Touch</h2>
          <p className="text-gray-600 mb-8">We&apos;d love to hear from you. Contact us for any inquiries.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div>
              <h3 className="text-lg font-medium mb-2">VISIT</h3>
              <p className="text-gray-600 mb-2">J19C, Ground Floor, Thokar No. 4, Abul Fazal, Delhi, India</p>
              <Link href="/find-a-boutique" className="text-sm text-[#bfa14a] hover:text-black font-medium">
                Find a Boutique →
              </Link>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">CONTACT</h3>
              <p className="text-gray-600">+91 98217 44247<br />info@noamani.com</p>
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
