'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

const sections = [
  {
    title: 'Website Usage',
    content: [
      'This website is operated by LUXE. Throughout the site, the terms "we", "us" and "our" refer to LUXE.',
      'By visiting our site and/or purchasing something from us, you engage in our "Service" and agree to be bound by the following terms and conditions.',
      'Please read these Terms of Use carefully before accessing or using our website.'
    ]
  },
  {
    title: 'Acceptable Use',
    content: [
      'You agree to use our website for lawful purposes only.',
      'You must not use our website in any way that causes, or may cause, damage to the website.',
      'You must not use our website in any way that impacts user access to our website.',
      'You must not use our website contrary to applicable laws and regulations.'
    ]
  },
  {
    title: 'User Content',
    content: [
      'Users may post reviews, comments, and other content.',
      'Content must not be illegal, obscene, threatening, defamatory, or invasive of privacy.',
      'Content must not infringe intellectual property rights.',
      'We reserve the right to remove or edit user content.'
    ]
  },
  {
    title: 'Account Registration',
    content: [
      'You may need to register for an account to access certain features.',
      'You must provide accurate and complete information when creating an account.',
      'You are responsible for maintaining the confidentiality of your account.',
      'You must notify us immediately of any unauthorized use of your account.'
    ]
  },
  {
    title: 'Website Access',
    content: [
      'We reserve the right to withdraw or modify our website service.',
      'We do not guarantee that our website will be available at all times.',
      'We may restrict access to some parts of our website.',
      'We may disable your access to our website.'
    ]
  },
  {
    title: 'Links to Other Websites',
    content: [
      'Our website may contain links to third-party websites.',
      'We have no control over the content of third-party websites.',
      'We are not responsible for the content of linked third-party websites.',
      'You should review the terms of use of third-party websites.'
    ]
  },
  {
    title: 'Modifications',
    content: [
      'We may revise these terms of use at any time.',
      'By using this website you agree to be bound by the current version.',
      'We will notify users of any material changes to these terms.',
      'Your continued use constitutes acceptance of changes.'
    ]
  }
];

export default function TermsOfUsePage() {
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
          alt="Terms of Use"
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
            TERMS OF USE
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="text-xl font-light"
          >
            Guidelines for using our website and services
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
            <h2 className="text-2xl font-light mb-4">Questions About Our Terms?</h2>
            <p className="text-gray-600">
              If you have any questions about these Terms of Use, please contact our legal team:
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