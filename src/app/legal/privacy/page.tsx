'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Shield, Lock, Eye, Database, Server, UserCheck, Bell, Settings } from 'lucide-react';

const sections = [
  {
    title: 'Information We Collect',
    icon: Database,
    content: [
      'Personal identification information (Name, email address, phone number, etc.)',
      'Billing information (Credit card details, billing address, etc.)',
      'Account preferences and settings',
      'Shopping history and preferences',
      'Device and browser information',
      'Location data (with your consent)'
    ]
  },
  {
    title: 'How We Use Your Information',
    icon: Server,
    content: [
      'To process your orders and provide customer service',
      'To send you order updates and shipping notifications',
      'To personalize your shopping experience',
      'To improve our website and services',
      'To send marketing communications (with your consent)',
      'To prevent fraud and maintain security'
    ]
  },
  {
    title: 'Information Sharing',
    icon: UserCheck,
    content: [
      'We do not sell your personal information to third parties',
      'We share information with service providers who help us operate our business',
      'We may share information for legal compliance',
      'We share information with shipping partners to deliver your orders',
      'We may share anonymous, aggregated data for analytics'
    ]
  },
  {
    title: 'Data Security',
    icon: Shield,
    content: [
      'We use industry-standard security measures',
      'All payment information is encrypted',
      'Regular security audits and updates',
      'Limited employee access to personal data',
      'Secure data storage and transmission'
    ]
  },
  {
    title: 'Your Privacy Rights',
    icon: Lock,
    content: [
      'Right to access your personal information',
      'Right to correct or update your information',
      'Right to opt-out of marketing communications',
      'Right to delete your account and data',
      'Right to data portability'
    ]
  },
  {
    title: 'Cookies and Tracking',
    icon: Eye,
    content: [
      'We use cookies to improve site functionality',
      'Cookies help us remember your preferences',
      'You can control cookie settings in your browser',
      'We use analytics to understand site usage',
      'Third-party cookies may be present on our site'
    ]
  },
  {
    title: 'Marketing Communications',
    icon: Bell,
    content: [
      'You can choose to receive marketing emails',
      'Easy unsubscribe option in every email',
      'SMS marketing requires explicit consent',
      'Preference center to manage communications',
      'Regular updates about new products and offers'
    ]
  },
  {
    title: 'Privacy Settings',
    icon: Settings,
    content: [
      'Control your privacy preferences',
      'Manage marketing preferences',
      'Update personal information',
      'Download your data',
      'Delete your account'
    ]
  }
];

export default function PrivacyPolicyPage() {
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
          alt="Privacy Policy"
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
            PRIVACY POLICY
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="text-xl font-light"
          >
            How we collect, use, and protect your information
          </motion.p>
        </div>
      </motion.div>

      {/* Privacy Content */}
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-600 mb-12">
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>

          <p className="text-gray-600 mb-12">
            At LUXE, we take your privacy seriously. This Privacy Policy describes how we collect, use, 
            and protect your personal information when you use our website and services. By using our website, 
            you agree to the collection and use of information in accordance with this policy.
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
              <div className="flex items-center mb-6">
                <section.icon className="w-6 h-6 mr-3" />
                <h2 className="text-2xl font-light">{section.title}</h2>
              </div>
              <div className="space-y-4">
                {section.content.map((item, i) => (
                  <div key={i} className="flex items-start">
                    <div className="w-2 h-2 bg-black rounded-full mt-2 mr-4" />
                    <p className="text-gray-600 flex-1">
                      {item}
                    </p>
                  </div>
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
            <h2 className="text-2xl font-light mb-4">Contact Us About Privacy</h2>
            <p className="text-gray-600">
              If you have any questions about our Privacy Policy or how we handle your information, 
              please contact our Privacy Team:
            </p>
            <ul className="list-disc list-inside text-gray-600 mt-4">
              <li>Email: privacy@luxeperfume.com</li>
              <li>Phone: 1-800-LUXE-PRIVACY</li>
              <li>Address: 123 Luxury Avenue, New York, NY 10001</li>
            </ul>
          </motion.div>
        </div>
      </div>
    </div>
  );
} 