'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { TextBlock } from '@/utils/parser';

interface MobileToCProps {
  blocks: TextBlock[];
}

export default function MobileToC({ blocks }: MobileToCProps) {
  const [open, setOpen] = useState(false);
  const headers = blocks.filter(b => b.type === 'h2' || b.type === 'h3');

  return (
    <>
      {/* Floating Hamburger Button */}
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden fixed bottom-8 left-8 z-50 flex items-center gap-2 px-4 py-2.5 rounded-full bg-navy text-parchment text-sm font-body shadow-lg hover:bg-burgundy transition-colors"
        aria-label="Mục lục"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M1 2h12M1 7h8M1 12h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
        <span className="text-xs tracking-wide">Mục lục</span>
      </button>

      {/* Drawer Overlay */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-navy/40 z-50 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed left-0 top-0 h-full w-72 z-50 bg-parchment-dark shadow-2xl overflow-y-auto p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h4 className="font-serif text-lg font-bold text-navy">Mục Lục</h4>
                <button onClick={() => setOpen(false)} className="text-navy/50 hover:text-burgundy transition-colors text-xl">✕</button>
              </div>
              <ul className="space-y-3 text-sm">
                {headers.map(h => (
                  <li key={h.id} className={h.type === 'h3' ? 'ml-4 text-xs' : 'font-medium'}>
                    <a
                      href={`#${h.id}`}
                      onClick={() => setOpen(false)}
                      className="block pl-3 border-l-2 border-transparent hover:border-burgundy hover:text-burgundy text-navy/70 transition-colors"
                    >
                      {h.content.replace(/\d+$/, '').trim()}
                    </a>
                  </li>
                ))}
              </ul>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
