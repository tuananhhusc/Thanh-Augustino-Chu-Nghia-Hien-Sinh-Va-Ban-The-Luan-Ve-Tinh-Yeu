'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TextBlock } from '@/utils/parser';

interface ToCProps {
  blocks: TextBlock[];
}

export default function TableOfContents({ blocks }: ToCProps) {
  const [activeId, setActiveId] = useState<string>('');
  const headers = blocks.filter(b => b.type === 'h2' || b.type === 'h3');

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { rootMargin: '-15% 0px -65% 0px' }
    );
    headers.forEach(h => {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blocks]);

  return (
    <nav className="font-body">
      <h4
        className="text-[11px] font-bold tracking-[0.18em] uppercase mb-5 pb-2 border-b"
        style={{ color: '#800020', borderColor: 'var(--color-border)' }}
      >
        Mục Lục
      </h4>
      <ul className="space-y-2.5 text-[12.5px]">
        {headers.map((header) => {
          const isActive = activeId === header.id;
          return (
            <li
              key={header.id}
              className={`transition-all duration-300 ${header.type === 'h3' ? 'ml-3' : 'font-medium'}`}
            >
              <a
                href={`#${header.id}`}
                className="relative flex pl-3 border-l-2 transition-colors leading-snug"
                style={{
                  borderColor: isActive ? '#800020' : 'transparent',
                  color: isActive ? '#800020' : 'var(--color-muted)',
                }}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeToC"
                    className="absolute left-[-2px] top-0 bottom-0 w-0.5 bg-burgundy"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                )}
                {header.content.replace(/\d+$/, '').trim()}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
