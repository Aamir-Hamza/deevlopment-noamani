'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { ChevronDown } from 'lucide-react';

const faqCategories = [
  {
    title: 'Orders & Shipping',
    image: 'https://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    questions: [
      {
        question: 'How long does shipping take?',
        answer: 'Standard shipping takes 3-5 business days. Express shipping takes 1-2 business days. Orders over $50 qualify for free standard shipping.'
      },
      {
        question: 'Can I track my order?',
        answer: 'Yes, you will receive a tracking number via email once your order ships.'
      },
      {
        question: 'Do you ship internationally?',
        answer: 'Currently, we only ship within the United States. International shipping coming soon!'
      }
    ]
  },
  {
    title: 'Returns & Exchanges',
    image: 'https://images.pexels.com/photos/5632397/pexels-photo-5632397.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    questions: [
      {
        question: 'What is your return policy?',
        answer: 'We accept returns within 30 days of purchase. Items must be unused and in original packaging.'
      },
      {
        question: 'How do I start a return?',
        answer: 'Visit our returns page or contact customer service to initiate a return. We\'ll provide a prepaid shipping label.'
      },
      {
        question: 'How long do refunds take?',
        answer: 'Refunds are processed within 3-5 business days after we receive your return.'
      }
    ]
  },
  {
    title: 'Products & Usage',
    image: 'https://images.pexels.com/photos/965989/pexels-photo-965989.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    questions: [
      {
        question: 'Are your fragrances tested on animals?',
        answer: 'No, we are proudly cruelty-free. None of our products or ingredients are tested on animals.'
      },
      {
        question: 'How long do your fragrances last?',
        answer: 'Our fragrances typically last 8-12 hours. The exact duration may vary based on skin type and environmental factors.'
      },
      {
        question: 'Are your products hypoallergenic?',
        answer: 'While our products are formulated to be gentle, we recommend doing a patch test if you have sensitive skin.'
      }
    ]
  }
];

export default function FAQsPage() {
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [openQuestion, setOpenQuestion] = useState<string | null>(null);

  const toggleCategory = (title: string) => {
    setOpenCategory(openCategory === title ? null : title);
    setOpenQuestion(null);
  };

  const toggleQuestion = (question: string) => {
    setOpenQuestion(openQuestion === question ? null : question);
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
          src="https://images.pexels.com/photos/4110409/pexels-photo-4110409.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
          alt="FAQs"
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
            FREQUENTLY ASKED QUESTIONS
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="text-xl font-light"
          >
            Find answers to common questions about our products and services
          </motion.p>
        </div>
      </motion.div>

      {/* FAQ Categories */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {faqCategories.map((category, index) => (
            <motion.div
              key={category.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group cursor-pointer"
              onClick={() => toggleCategory(category.title)}
            >
              <div className="relative aspect-[3/4] overflow-hidden mb-6">
                <Image
                  src={category.image}
                  alt={category.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <p className="text-lg font-light">Click to view questions</p>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <h3 className="text-2xl font-light mb-2">{category.title}</h3>
                <p className="text-gray-600">{category.questions.length} Questions</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* FAQ Questions */}
        {faqCategories.map((category) => (
          <motion.div
            key={category.title}
            initial={{ opacity: 0, height: 0 }}
            animate={{ 
              opacity: openCategory === category.title ? 1 : 0,
              height: openCategory === category.title ? 'auto' : 0
            }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            {openCategory === category.title && (
              <div className="bg-gray-50 p-8 rounded-lg mb-8">
                <h2 className="text-3xl font-light mb-8 text-center">{category.title}</h2>
                <div className="space-y-4 max-w-3xl mx-auto">
                  {category.questions.map((item) => (
                    <motion.div
                      key={item.question}
                      className="border-b border-gray-200 last:border-0"
                    >
                      <button
                        onClick={() => toggleQuestion(item.question)}
                        className="w-full py-4 flex items-center justify-between text-left"
                      >
                        <span className="text-lg font-medium">{item.question}</span>
                        <ChevronDown
                          className={`w-5 h-5 transition-transform ${
                            openQuestion === item.question ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ 
                          opacity: openQuestion === item.question ? 1 : 0,
                          height: openQuestion === item.question ? 'auto' : 0
                        }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        {openQuestion === item.question && (
                          <p className="pb-4 text-gray-600">{item.answer}</p>
                        )}
                      </motion.div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Contact Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="py-16 px-4 text-center bg-gray-50"
      >
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-light mb-6">Still Have Questions?</h2>
          <p className="text-gray-600 mb-8">
            Our customer service team is here to help you with any questions you may have.
          </p>
          <button className="bg-black text-white px-12 py-4 text-sm font-medium hover:bg-gray-800 transition-colors">
            CONTACT US
          </button>
        </div>
      </motion.div>
    </div>
  );
} 