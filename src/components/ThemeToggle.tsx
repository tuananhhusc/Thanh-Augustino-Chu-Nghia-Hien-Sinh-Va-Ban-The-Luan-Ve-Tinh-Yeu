'use client';

import { useState, useEffect, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Theme = 'parchment' | 'sepia' | 'midnight';

interface ThemeCtx {
  theme: Theme;
  setTheme: (t: Theme) => void;
}

export const ThemeContext = createContext<ThemeCtx>({ theme: 'parchment', setTheme: () => {} });
export const useTheme = () => useContext(ThemeContext);

const themes: { id: Theme; label: string; icon: string; bg: string; border: string }[] = [
  { id: 'parchment', label: 'Parchment', icon: '☀', bg: 'bg-[#FDFBF7]', border: 'border-[#D4AF37]' },
  { id: 'sepia',     label: 'Sepia',     icon: '📜', bg: 'bg-[#F1E7D0]', border: 'border-[#8B6914]' },
  { id: 'midnight',  label: 'Đêm',       icon: '🌙', bg: 'bg-[#0A192F]', border: 'border-[#D4AF37]' },
];

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('parchment');

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-current/20 text-sm font-body hover:border-gold transition-colors"
        aria-label="Chọn chế độ màu"
      >
        <span>{themes.find(t => t.id === theme)?.icon}</span>
        <span className="hidden sm:inline text-xs tracking-wide">
          {themes.find(t => t.id === theme)?.label}
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute top-10 right-0 z-50 flex flex-col gap-1 p-2 rounded-xl shadow-xl border border-current/10 bg-white/90 backdrop-blur-sm"
          >
            {themes.map(t => (
              <button
                key={t.id}
                onClick={() => { setTheme(t.id); setOpen(false); }}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-body transition-all w-full text-left hover:bg-gold/10 ${theme === t.id ? 'font-bold text-burgundy' : 'text-navy'}`}
              >
                <span className={`w-4 h-4 rounded-full border ${t.bg} ${t.border}`} />
                {t.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
