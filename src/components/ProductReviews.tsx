'use client';

import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import Image from 'next/image';

const reviews = [
  {
    id: 1,
    name: 'Aarav Kapoor',
    role: 'Luxury Lifestyle Blogger',
    rating: 5,
    comment: 'Noamani-Fragrance is pure luxury in a bottle. The scent is unique and long-lasting—my new signature!',
    avatar: '/Product_review_user_pic/user1.jpeg'
  },
  {
    id: 2,
    name: 'Isabelle Laurent',
    role: 'Fashion Editor',
    rating: 5,
    comment: 'I get compliments every time I wear Noamani. The bottle design is stunning and the fragrance is unforgettable.',
    avatar: '/Product_review_user_pic/user2.jpg'
  },
  {
    id: 3,
    name: 'Omar Al-Farsi',
    role: 'Perfume Collector',
    rating: 5,
    comment: 'A true masterpiece! The notes are perfectly balanced and exude sophistication. Highly recommended.',
    avatar: '/Product_review_user_pic/user3.jpeg'
  },
  {
    id: 4,
    name: 'Sophia Rossi',
    role: 'Beauty Influencer',
    rating: 5,
    comment: 'The best fragrance I have ever owned. Elegant, luxurious, and makes me feel special every day.',
    avatar: '/Product_review_user_pic/user4.jpeg'
  }
];

export default function ProductReviews() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center justify-center gap-4 text-4xl md:text-5xl font-light text-center mb-6 bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-700 bg-clip-text text-transparent drop-shadow-lg"
          style={{ fontFamily: 'Didot, serif', letterSpacing: 2 }}
        >
          <span>Product Reviews</span>
          <span className="luxury-icon group relative">
            <img src="/icon/notebook.gif" alt="Product Reviews Icon" className="w-12 h-12 object-contain transition-transform duration-300 group-hover:scale-110" />
          </span>
        </motion.h2>
        <div className="flex justify-center mb-12">
          <div className="h-1 w-24 rounded-full bg-gradient-to-r from-yellow-400 via-yellow-600 to-yellow-400 shadow-md" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {reviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="bg-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-shadow border border-yellow-100 relative group"
              style={{ boxShadow: '0 4px 32px #ffe08240, 0 1.5px 8px #bfa14a30' }}
            >
              <div className="flex items-center mb-4">
                <div className="relative w-14 h-14 mr-4">
                  <Image
                    src={review.avatar}
                    alt={review.name}
                    fill
                    className="rounded-full object-cover border-4 border-yellow-300 shadow-md"
                  />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900 mb-1" style={{ fontFamily: 'Didot, serif' }}>{review.name}</h3>
                  <p className="text-xs text-yellow-700 font-medium">{review.role}</p>
                </div>
              </div>
              <div className="flex mb-2">
                {[...Array(review.rating)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20"><polygon points="10 1.5 12.59 7.36 18.9 7.64 13.97 11.97 15.54 18.09 10 14.77 4.46 18.09 6.03 11.97 1.1 7.64 7.41 7.36 10 1.5" /></svg>
                ))}
              </div>
              <p className="text-gray-700 text-sm italic leading-relaxed group-hover:text-yellow-900 transition-colors duration-300">"{review.comment}"</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
} 