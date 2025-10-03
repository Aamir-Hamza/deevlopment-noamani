'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { DollarSign, Users, BarChart, Award } from 'lucide-react';

const benefits = [
  {
    title: 'High Commission',
    description: 'Earn up to 20% commission on every sale',
    icon: DollarSign,
    image: 'https://images.pexels.com/photos/3059609/pexels-photo-3059609.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  {
    title: 'Exclusive Access',
    description: 'Get early access to new products and promotions',
    icon: Users,
    image: 'https://images.pexels.com/photos/5632397/pexels-photo-5632397.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  {
    title: 'Marketing Support',
    description: 'Access to marketing materials and analytics',
    icon: BarChart,
    image: 'https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  {
    title: 'Rewards Program',
    description: 'Earn bonus rewards for high performance',
    icon: Award,
    image: 'https://images.pexels.com/photos/4110409/pexels-photo-4110409.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  }
];

const requirements = [
  {
    title: 'Active Social Media',
    description: 'Minimum 5,000 followers on any platform',
    image: 'https://images.pexels.com/photos/607812/pexels-photo-607812.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  {
    title: 'Content Creation',
    description: 'Regular beauty or lifestyle content',
    image: 'https://images.pexels.com/photos/3910071/pexels-photo-3910071.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  {
    title: 'Brand Alignment',
    description: 'Values aligned with luxury beauty',
    image: 'https://images.pexels.com/photos/3765976/pexels-photo-3765976.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  }
];

export default function AffiliatePage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    website: '',
    instagram: '',
    followers: '',
    experience: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

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
          alt="Affiliate Program"
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
            BECOME AN AFFILIATE
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="text-xl font-light"
          >
            Join our luxury fragrance affiliate program
          </motion.p>
        </div>
      </motion.div>

      {/* Benefits Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-light text-center mb-12">Program Benefits</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <div className="relative aspect-[3/4] overflow-hidden mb-6">
                <Image
                  src={benefit.image}
                  alt={benefit.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <p className="text-lg font-light">{benefit.description}</p>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <benefit.icon className="w-6 h-6 mx-auto mb-4" />
                <h3 className="text-2xl font-light mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Requirements Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-gray-50 py-16"
      >
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-light text-center mb-12">Requirements</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {requirements.map((requirement, index) => (
              <motion.div
                key={requirement.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group"
              >
                <div className="relative aspect-[3/4] overflow-hidden mb-6">
                  <Image
                    src={requirement.image}
                    alt={requirement.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <p className="text-lg font-light">{requirement.description}</p>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <h3 className="text-2xl font-light mb-2">{requirement.title}</h3>
                  <p className="text-gray-600">{requirement.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Application Form */}
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-light text-center mb-12">Apply Now</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 focus:outline-none focus:border-black"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 focus:outline-none focus:border-black"
              placeholder="Enter your email address"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Website/Blog
            </label>
            <input
              type="url"
              name="website"
              value={formData.website}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 focus:outline-none focus:border-black"
              placeholder="Enter your website URL"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Instagram Handle
            </label>
            <input
              type="text"
              name="instagram"
              value={formData.instagram}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 focus:outline-none focus:border-black"
              placeholder="@yourusername"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number of Followers
            </label>
            <input
              type="number"
              name="followers"
              value={formData.followers}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-200 focus:outline-none focus:border-black"
              placeholder="Total followers across platforms"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Experience with Luxury Brands
            </label>
            <textarea
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              rows={6}
              className="w-full px-4 py-3 border border-gray-200 focus:outline-none focus:border-black resize-none"
              placeholder="Tell us about your experience working with luxury brands..."
            />
          </div>

          <div className="text-center">
            <button
              type="submit"
              className="bg-black text-white px-12 py-4 text-sm font-medium hover:bg-gray-800 transition-colors"
            >
              SUBMIT APPLICATION
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 