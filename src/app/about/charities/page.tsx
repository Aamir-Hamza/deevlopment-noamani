'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

const initiatives = [
  {
    title: 'Environmental Conservation',
    description: 'Protecting our planet through sustainable practices',
    impact: '1M+ Trees Planted',
    image: 'https://images.pexels.com/photos/957024/forest-trees-perspective-bright-957024.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  {
    title: 'Women Empowerment',
    description: 'Supporting women entrepreneurs in fragrance industry',
    impact: '500+ Women Supported',
    image: 'https://images.pexels.com/photos/7551442/pexels-photo-7551442.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  {
    title: 'Education',
    description: 'Providing fragrance education and training',
    impact: '1000+ Students Trained',
    image: 'https://images.pexels.com/photos/4778611/pexels-photo-4778611.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  {
    title: 'Community Support',
    description: 'Giving back to local communities',
    impact: '50+ Projects Funded',
    image: 'https://images.pexels.com/photos/6646918/pexels-photo-6646918.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  }
];

const partners = [
  {
    name: 'Environmental Alliance',
    role: 'Conservation Partner',
    description: 'Working together to protect forests and biodiversity',
    image: 'https://images.pexels.com/photos/957024/forest-trees-perspective-bright-957024.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  {
    name: 'Women in Business',
    role: 'Empowerment Partner',
    description: 'Mentoring and supporting women entrepreneurs',
    image: 'https://images.pexels.com/photos/7551442/pexels-photo-7551442.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  {
    name: 'Global Education Fund',
    role: 'Education Partner',
    description: 'Providing access to quality education worldwide',
    image: 'https://images.pexels.com/photos/4778611/pexels-photo-4778611.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  }
];

export default function CharitiesPage() {
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
          src="https://images.pexels.com/photos/6646918/pexels-photo-6646918.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
          alt="Our Initiatives"
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
            GIVING BACK
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="text-xl font-light"
          >
            Making a positive impact in our communities
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
        <h2 className="text-3xl font-light mb-6">OUR COMMITMENT</h2>
        <p className="text-gray-600">
          We believe in using our success to create positive change.
          Through our charitable initiatives, we're working to build a better, more sustainable future.
        </p>
      </motion.div>

      {/* Initiatives Grid */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-light text-center mb-12">Our Initiatives</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {initiatives.map((initiative, index) => (
            <motion.div
              key={initiative.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <div className="relative aspect-[3/4] overflow-hidden mb-6">
                <Image
                  src={initiative.image}
                  alt={initiative.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <p className="text-lg font-light">{initiative.description}</p>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <h3 className="text-2xl font-light mb-2">{initiative.title}</h3>
                <p className="text-gray-600">{initiative.impact}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Partners Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-gray-50 py-16"
      >
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-light text-center mb-12">Our Partners</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {partners.map((partner, index) => (
              <motion.div
                key={partner.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <div className="relative aspect-[3/4] overflow-hidden mb-6">
                  <Image
                    src={partner.image}
                    alt={partner.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <p className="text-lg font-light">{partner.description}</p>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <h3 className="text-2xl font-light mb-2">{partner.name}</h3>
                  <p className="text-gray-600">{partner.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Get Involved CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="py-16 px-4 text-center"
      >
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-light mb-6">Get Involved</h2>
          <p className="text-gray-600 mb-8">
            Join us in making a difference. Every purchase contributes to our charitable initiatives.
          </p>
          <button className="bg-black text-white px-12 py-4 text-sm font-medium hover:bg-gray-800 transition-colors">
            LEARN MORE
          </button>
        </div>
      </motion.div>
    </div>
  );
} 