'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

const sections = [
  {
    title: 'Terms of Service',
    content: [
      'Welcome to LUXE. By accessing our website, you agree to these terms and conditions.',
      'These terms apply to all visitors, users, and others who access or use our service.',
      'By accessing or using the service, you agree to be bound by these terms. If you disagree with any part of the terms, you may not access the service.'
    ]
  },
  {
    title: 'Account Terms',
    content: [
      'You must be 18 years or older to use this service.',
      'You must provide accurate, complete, and current information.',
      'You are responsible for maintaining the security of your account.',
      'You must not share your account credentials with any third party.'
    ]
  },
  {
    title: 'Purchase Terms',
    content: [
      'All purchases through our site are subject to product availability.',
      'We reserve the right to limit the quantity of items purchased per order.',
      'Prices for products are subject to change without notice.',
      'We reserve the right to refuse service to anyone for any reason at any time.'
    ]
  },
  {
    title: 'Shipping & Delivery',
    content: [
      'Delivery times are estimates and not guaranteed.',
      'We are not responsible for delays caused by customs or postal services.',
      'Risk of loss and title for items pass to you upon delivery.',
      'International orders may be subject to customs duties and taxes.'
    ]
  },
  {
    title: 'Returns & Refunds',
    content: [
      'Returns must be initiated within 30 days of delivery.',
      'Items must be unused and in original packaging.',
      'Refunds will be processed to the original payment method.',
      'Shipping costs for returns are the responsibility of the customer.'
    ]
  },
  {
    title: 'Intellectual Property',
    content: [
      'All content on this site is the property of LUXE.',
      'You may not use our trademarks without written permission.',
      'Product images and descriptions are protected by copyright.',
      'Any unauthorized use may result in legal action.'
    ]
  },
  {
    title: 'Limitation of Liability',
    content: [
      'We shall not be liable for any indirect damages.',
      'Our liability is limited to the amount paid for the product.',
      'We do not guarantee the accuracy of product descriptions.',
      'We are not responsible for technical errors or typographical mistakes.'
    ]
  },
  {
    title: 'Changes to Terms',
    content: [
      'We reserve the right to modify these terms at any time.',
      'Changes will be effective immediately upon posting.',
      'Your continued use of the site constitutes acceptance.',
      'It is your responsibility to review these terms periodically.'
    ]
  }
];

export default function TermsPage() {
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
          alt="Terms and Conditions"
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
            TERMS AND CONDITIONS
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="text-xl font-light"
          >
            Please read these terms carefully before using our services
          </motion.p>
        </div>
      </motion.div>

      {/* Terms Content */}
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600 mb-12">
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>

          {sections.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="mb-12"
            >
              <h2 className="text-2xl font-light mb-6">{section.title}</h2>
              <div className="space-y-4">
                {section.content.map((paragraph, i) => (
                  <p key={i} className="text-gray-600">
                    {paragraph}
                  </p>
                ))}
              </div>
            </motion.div>
          ))}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 p-6 bg-gray-50"
          >
            <h2 className="text-2xl font-light mb-4">Contact Us</h2>
            <p className="text-gray-600">
              If you have any questions about these Terms and Conditions, please contact us:
            </p>
            <ul className="list-disc list-inside text-gray-600 mt-4">
              <li>Email: legal@luxeperfume.com</li>
              <li>Phone: 1-800-LUXE-LEGAL</li>
              <li>Address: 123 Luxury Avenue, New York, NY 10001</li>
            </ul>
          </motion.div>
        </div>
      </div>
    </div>
  );
} 