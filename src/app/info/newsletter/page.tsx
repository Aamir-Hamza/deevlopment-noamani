'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Gift, Star, Bell, Tag } from 'lucide-react';

const benefits = [
  {
    title: 'Early Access',
    description: 'Be the first to shop new collections',
    icon: Star,
    image: 'https://images.pexels.com/photos/3059609/pexels-photo-3059609.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  {
    title: 'Exclusive Offers',
    description: 'Special discounts for subscribers',
    icon: Tag,
    image: 'https://images.pexels.com/photos/5632397/pexels-photo-5632397.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  {
    title: 'Birthday Gifts',
    description: 'Special treats on your special day',
    icon: Gift,
    image: 'https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  {
    title: 'Latest Updates',
    description: 'Stay informed about new launches',
    icon: Bell,
    image: 'https://images.pexels.com/photos/4110409/pexels-photo-4110409.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  }
];

export default function NewsletterPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    birthdate: '',
    preferences: {
      newArrivals: false,
      exclusiveOffers: false,
      events: false,
      tips: false
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setFormData(prev => ({
        ...prev,
        preferences: {
          ...prev.preferences,
          [name]: checked
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
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
          alt="Newsletter Signup"
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
            JOIN OUR NEWSLETTER
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="text-xl font-light"
          >
            Stay updated with exclusive offers and new releases
          </motion.p>
        </div>
      </motion.div>

      {/* Benefits Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-light text-center mb-12">Subscriber Benefits</h2>
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

      {/* Signup Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-gray-50 py-16"
      >
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-light text-center mb-12">Subscribe Now</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 focus:outline-none focus:border-black"
                  placeholder="Enter your first name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-200 focus:outline-none focus:border-black"
                  placeholder="Enter your last name"
                />
              </div>
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
                Birthday (Optional)
              </label>
              <input
                type="date"
                name="birthdate"
                value={formData.birthdate}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 focus:outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                Email Preferences
              </label>
              <div className="space-y-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="newArrivals"
                    checked={formData.preferences.newArrivals}
                    onChange={handleChange}
                    className="w-4 h-4 border-gray-300 rounded focus:ring-black"
                  />
                  <span className="ml-3 text-sm text-gray-600">New Arrivals</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="exclusiveOffers"
                    checked={formData.preferences.exclusiveOffers}
                    onChange={handleChange}
                    className="w-4 h-4 border-gray-300 rounded focus:ring-black"
                  />
                  <span className="ml-3 text-sm text-gray-600">Exclusive Offers</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="events"
                    checked={formData.preferences.events}
                    onChange={handleChange}
                    className="w-4 h-4 border-gray-300 rounded focus:ring-black"
                  />
                  <span className="ml-3 text-sm text-gray-600">Events & Launches</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="tips"
                    checked={formData.preferences.tips}
                    onChange={handleChange}
                    className="w-4 h-4 border-gray-300 rounded focus:ring-black"
                  />
                  <span className="ml-3 text-sm text-gray-600">Fragrance Tips & Guides</span>
                </label>
              </div>
            </div>

            <div className="text-center">
              <button
                type="submit"
                className="bg-black text-white px-12 py-4 text-sm font-medium hover:bg-gray-800 transition-colors"
              >
                SUBSCRIBE
              </button>
              <p className="mt-4 text-sm text-gray-500">
                You can unsubscribe at any time. View our Privacy Policy.
              </p>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
} 