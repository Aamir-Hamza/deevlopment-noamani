'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function SidebarButton() {
  return (
    <motion.div
      className="fixed right-0 top-1/2 -translate-y-1/2 z-40"
      initial={{ x: 100 }}
      animate={{ x: 0 }}
      transition={{ 
        delay: 0.5, 
        duration: 0.5, 
        type: 'spring', 
        stiffness: 120 
      }}
    >
      <Link 
        href="/discount"
        className="bg-brand-pink hover:bg-brand-nude transition-colors duration-300 text-brand-dark p-3 rotate-180 flex items-center justify-center writing-vertical rounded-r-lg shadow-md"
        style={{ writingMode: 'vertical-rl' }}
      >
        <span className="text-xs font-medium tracking-widest uppercase">GET 10% OFF</span>
      </Link>
    </motion.div>
  );
}