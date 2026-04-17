'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FootnoteProps {
  id: string;
  text: string;
}

export default function Footnote({ id, text }: FootnoteProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <span className="relative inline-block" onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)}>
      <a
        href={`#ref-${id}`}
        className="mx-[1px] text-[10px] font-serif font-bold text-burgundy/80 inline-flex transition-all cursor-help hover:text-navy group -translate-y-[0.4em] select-none"
      >
        <span className="opacity-0 group-hover:opacity-40 transition-opacity">[</span>
        <span className="px-[0.5px] scale-90">{id}</span>
        <span className="opacity-0 group-hover:opacity-40 transition-opacity">]</span>
      </a>
      
      <AnimatePresence>
        {isOpen && (
          <motion.span
            initial={{ opacity: 0, y: 5, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 w-64 p-3 text-xs leading-relaxed rounded-lg shadow-[0_10px_40px_rgba(0,0,0,0.3)] left-1/2 -ml-32 font-body bottom-full mb-3 pointer-events-none border border-white/10"
            style={{ 
              backgroundColor: '#1E293B', 
              color: '#F8FAFC',
              backdropFilter: 'blur(8px)'
            }}
          >
            <span className="absolute w-2 h-2 rotate-45 inline-block left-1/2 -ml-1 -bottom-1" style={{ backgroundColor: '#1E293B' }} />
            <span className="font-bold mr-1 text-gold">[{id}]</span>{text}
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}
