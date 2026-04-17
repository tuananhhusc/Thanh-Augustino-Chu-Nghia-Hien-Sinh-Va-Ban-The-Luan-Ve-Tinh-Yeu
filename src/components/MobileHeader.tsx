'use client';

import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import ThemeToggle from './ThemeToggle';

export default function MobileHeader() {
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState(true);
  const [lastScroll, setLastScroll] = useState(0);

  useEffect(() => {
    const updateHeader = () => {
      const current = scrollY.get();
      if (current < 100) {
        setVisible(true);
      } else {
        // Hide if scrolling down, show if scrolling up
        if (current > lastScroll) setVisible(false);
        else setVisible(true);
      }
      setLastScroll(current);
    };
    const unsubscribe = scrollY.on('change', updateHeader);
    return () => unsubscribe();
  }, [scrollY, lastScroll]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.nav
          initial={{ y: -60 }}
          animate={{ y: 0 }}
          exit={{ y: -60 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="fixed top-0 left-0 right-0 z-40 lg:hidden flex items-center justify-between px-6 h-14 backdrop-blur-md border-b"
          style={{
            backgroundColor: 'var(--color-nav)',
            borderColor: 'var(--color-border)',
          }}
        >
          <a href="#" className="font-serif text-sm font-bold text-burgundy">
            Augustinô & Hiện Sinh
          </a>
          <ThemeToggle />
        </motion.nav>
      )}
    </AnimatePresence>
  );
}
