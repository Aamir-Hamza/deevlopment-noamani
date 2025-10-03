'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

const sections = [
  {
    title: 'Terms of Use',
    content: [
      'By accessing and using this website, you agree to comply with and be bound by these Terms of Use.',
      'The content of this website is for general information and use only.',
      'We reserve the right to modify these terms at any time without prior notice.'
    ]
  },
  {
    title: 'Intellectual Property',
    content: [
      'All content on this website, including text, graphics, logos, and images, is our property.',
      'You may not reproduce, distribute, or use our content without explicit permission.',
      'All trademarks and brand names mentioned are property of their respective owners.'
    ]
  },
  {
    title: 'User Conduct',
    content: [
      'You agree to use this website for lawful purposes only.',
      'You must not attempt to gain unauthorized access to our systems.',
      'You are responsible for maintaining the confidentiality of your account information.'
    ]
  },
  {
    title: 'Privacy & Data',
    content: [
      'We collect and process your data in accordance with our Privacy Policy.',
      'By using our website, you consent to our data collection practices.',
      'We use cookies to enhance your browsing experience.'
    ]
  },
  {
    title: 'Purchases & Payments',
    content: [
      'All purchases are subject to our return and refund policies.',
      'Prices are subject to change without notice.',
      'We use secure payment processing systems to protect your information.'
    ]
  },
  {
    title: 'Limitation of Liability',
    content: [
      'We are not liable for any damages arising from the use of our website.',
      'We do not guarantee the accuracy or completeness of information on this site.',
      'Use of this website is at your own risk.'
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
        className="relative h-[40vh] bg-black text-white flex items-center justify-center"
      >
        <Image
          src="https://images.pexels.com/photos/5632397/pexels-photo-5632397.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
          alt="Terms of Use"
          fill
          className="object-cover opacity-30"
        />
        <div className="relative z-10 text-center max-w-4xl px-4">
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-5xl font-light mb-6"
          >
            TERMS OF USE
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

      {/* Last Updated */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <p className="text-gray-500 text-sm">Last Updated: March 15, 2024</p>
      </div>

      {/* Terms Content */}
      <div className="max-w-4xl mx-auto px-4 pb-16">
        <div className="prose max-w-none">
          <p className="text-gray-600 mb-12">
            Welcome to our website. If you continue to browse and use this website, you are agreeing to comply 
            with and be bound by the following terms and conditions of use. Please read these terms carefully 
            before using our services.
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
              <ul className="space-y-4 text-gray-600">
                {section.content.map((item, i) => (
                  <li key={i} className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16"
          >
            <h2 className="text-2xl font-light mb-6">Contact Us</h2>
            <p className="text-gray-600">
              If you have any questions about these Terms of Use, please contact us:
            </p>
            <ul className="mt-4 space-y-2 text-gray-600">
              <li>Email: legal@luxuryperfume.com</li>
              <li>Phone: +1 (800) 123-4567</li>
              <li>Address: 123 Fifth Avenue, New York, NY 10001</li>
            </ul>
          </motion.div>
        </div>
      </div>

      {/* Additional Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-gray-50 py-16 px-4"
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-light mb-6">Additional Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-medium mb-2">Privacy Policy</h3>
              <p className="text-gray-600 mb-4">Learn about how we handle your data</p>
              <button className="text-black hover:text-gray-600 text-sm font-medium">
                Read More →
              </button>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">Cookie Policy</h3>
              <p className="text-gray-600 mb-4">Understand our use of cookies</p>
              <button className="text-black hover:text-gray-600 text-sm font-medium">
                Read More →
              </button>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">Legal Notice</h3>
              <p className="text-gray-600 mb-4">View our legal information</p>
              <button className="text-black hover:text-gray-600 text-sm font-medium">
                Read More →
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
} 