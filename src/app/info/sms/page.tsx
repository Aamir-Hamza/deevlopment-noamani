'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { MessageSquare, Clock, Gift, Tag } from 'lucide-react';

const benefits = [
  {
    title: 'Instant Updates',
    description: 'Be the first to know about new releases',
    icon: MessageSquare,
    image: 'https://images.pexels.com/photos/3059609/pexels-photo-3059609.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  {
    title: 'Flash Sales',
    description: 'Exclusive time-limited offers',
    icon: Clock,
    image: 'https://images.pexels.com/photos/5632397/pexels-photo-5632397.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  {
    title: 'VIP Rewards',
    description: 'Special rewards for SMS subscribers',
    icon: Gift,
    image: 'https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  },
  {
    title: 'Exclusive Discounts',
    description: 'SMS-only special offers',
    icon: Tag,
    image: 'https://images.pexels.com/photos/4110409/pexels-photo-4110409.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2'
  }
];

export default function SMSPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    preferences: {
      newArrivals: false,
      sales: false,
      restocks: false,
      events: false
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
          alt="SMS Updates"
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
            SMS UPDATES
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="text-xl font-light"
          >
            Get instant updates about new releases and exclusive offers
          </motion.p>
        </div>
      </motion.div>

      {/* Benefits Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-light text-center mb-12">SMS Benefits</h2>
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
          <h2 className="text-3xl font-light text-center mb-12">Sign Up for SMS Updates</h2>
          
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
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-200 focus:outline-none focus:border-black"
                placeholder="Enter your phone number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4">
                SMS Preferences
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
                    name="sales"
                    checked={formData.preferences.sales}
                    onChange={handleChange}
                    className="w-4 h-4 border-gray-300 rounded focus:ring-black"
                  />
                  <span className="ml-3 text-sm text-gray-600">Flash Sales & Promotions</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="restocks"
                    checked={formData.preferences.restocks}
                    onChange={handleChange}
                    className="w-4 h-4 border-gray-300 rounded focus:ring-black"
                  />
                  <span className="ml-3 text-sm text-gray-600">Restock Alerts</span>
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
              </div>
            </div>

            <div className="text-center">
              <button
                type="submit"
                className="bg-black text-white px-12 py-4 text-sm font-medium hover:bg-gray-800 transition-colors"
              >
                SIGN UP FOR SMS
              </button>
              <p className="mt-4 text-sm text-gray-500">
                By signing up, you agree to receive recurring automated marketing messages. 
                Consent is not a condition of purchase. Reply STOP to unsubscribe. 
                Msg & data rates may apply.
              </p>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
} 