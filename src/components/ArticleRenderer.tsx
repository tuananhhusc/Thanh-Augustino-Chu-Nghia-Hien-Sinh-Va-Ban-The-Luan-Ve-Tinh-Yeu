'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { TextBlock } from '@/utils/parser';
import Footnote from './Footnote';

interface Props {
  blocks: TextBlock[];
  references: { id: string; text: string }[];
  readingTime: number;
}

// ── Animated paragraph wrapper ────────────────────────────────────────────────
function AnimatedBlock({ children, className }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 18 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ── Gothic SVG chapter divider ─────────────────────────────────────────────────
function GothicDivider() {
  return (
    <div className="flex items-center justify-center my-6 select-none opacity-40" aria-hidden>
      <svg width="320" height="28" viewBox="0 0 320 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <line x1="0" y1="14" x2="128" y2="14" stroke="currentColor" strokeWidth="0.5" />
        <line x1="192" y1="14" x2="320" y2="14" stroke="currentColor" strokeWidth="0.5" />
        {/* Central Gothic cross-diamond motif */}
        <path d="M160 2 L168 14 L160 26 L152 14 Z" stroke="#D4AF37" strokeWidth="1" fill="none" />
        <circle cx="160" cy="14" r="2.5" fill="#D4AF37" />
        {/* Small flanking lozenges using theme body color */}
        <path d="M138 14 L141 10 L144 14 L141 18 Z" fill="currentColor" />
        <path d="M176 14 L179 10 L182 14 L179 18 Z" fill="currentColor" />
      </svg>
    </div>
  );
}

// ── Copy to clipboard button for references ────────────────────────────────────
function CopyBibButton({ text, id }: { text: string; id: string }) {
  const [copied, setCopied] = useState(false);
  const chicago = `[${id}] ${text}`;
  return (
    <button
      title="Sao chép trích dẫn (Chicago)"
      onClick={() => {
        navigator.clipboard.writeText(chicago);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      className="ml-2 text-[10px] px-1.5 py-0.5 rounded border border-navy/20 text-navy/40 hover:text-burgundy hover:border-burgundy transition-all font-body"
    >
      {copied ? '✓' : 'Copy'}
    </button>
  );
}

export default function ArticleRenderer({ blocks, references, readingTime }: Props) {
  // Positive Lookbehind: only match the NUMBER, not consuming punctuation before it
  const footnoteRegex = /(?<=[^\d\s])([1-9][0-9]?)(?!\d)/g;

  const renderContent = (text: string): React.ReactNode[] => {
    if (!text) return [];
    const parts: React.ReactNode[] = [];
    let lastIndex = 0;
    const regex = new RegExp(footnoteRegex.source, 'g');
    let match: RegExpExecArray | null;

    while ((match = regex.exec(text)) !== null) {
      const refId = match[1];
      const matchIndex = match.index;
      parts.push(<span key={`t-${matchIndex}`}>{text.slice(lastIndex, matchIndex)}</span>);
      const ref = references.find(r => r.id === refId);
      if (ref) {
        parts.push(<Footnote key={`f-${matchIndex}`} id={refId} text={ref.text} />);
      } else {
        parts.push(<span key={`n-${matchIndex}`}>{refId}</span>);
      }
      lastIndex = regex.lastIndex;
    }
    parts.push(<span key={`e-${lastIndex}`}>{text.slice(lastIndex)}</span>);
    return parts;
  };

  const renderTable = (tableData: string[][]) => {
    if (!tableData?.length) return null;
    return (
      <div
        className="my-10 overflow-x-auto rounded-xl shadow-sm border overflow-hidden"
        style={{ borderColor: 'var(--color-border)' }}
      >
        <table className="w-full text-left border-collapse min-w-[480px]">
          <thead>
            <tr style={{ backgroundColor: 'rgba(10, 25, 47, 0.95)', color: '#FDFBF7' }} className="font-serif">
              {tableData[0].map((h, i) => (
                <th key={i} className="p-4 font-semibold text-sm tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="text-sm">
            {tableData.slice(1).map((row, ri) => (
              <tr
                key={ri}
                className="transition-colors border-b"
                style={{
                  borderColor: 'var(--color-border)',
                  backgroundColor: ri % 2 === 0 ? 'var(--color-highlight)' : 'transparent'
                }}
              >
                {row.map((cell, ci) => (
                  <td key={ci} className={`p-4 leading-relaxed ${ci === 0 ? 'font-serif font-semibold text-burgundy' : ''}`} style={ci !== 0 ? { color: 'var(--color-body)' } : {}}>
                    {renderContent(cell)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // Detect long quoted passages (starts with « or contains a colon after a name)
  const isBlockquote = (text: string) =>
    (text.startsWith('"') && text.includes('"')) ||
    text.startsWith('«') ||
    (text.length > 80 && text.match(/^"[^"]+"/));

  return (
    <div className="article-content font-body">
      {/* Reading Time Badge */}
      <div
        className="flex items-center gap-3 mb-10 text-sm font-body border-b pb-6"
        style={{ color: 'var(--color-muted)', borderColor: 'var(--color-border)' }}
      >
        <span style={{ color: '#D4AF37' }}>✦</span>
        <span>Khoảng <strong style={{ color: 'var(--color-body)' }}>{readingTime} phút</strong> đọc</span>
        <span style={{ color: '#D4AF37' }}>✦</span>
        <span>{references.length} nguồn tham khảo</span>
      </div>

      <div className="space-y-7 leading-[1.85] text-[1.05rem] md:text-lg max-w-[72ch] mx-auto text-body/95">
        {blocks.map((block, idx) => {

          if (block.type === 'h2') {
            return (
              <div key={block.id}>
                <GothicDivider />
                <AnimatedBlock>
                  <h2
                    id={block.id}
                    className="font-serif text-3xl md:text-4xl font-bold mt-10 mb-6 scroll-mt-28 leading-snug"
                    style={{ color: 'var(--color-heading)' }}
                  >
                    {renderContent(block.content)}
                  </h2>
                </AnimatedBlock>
              </div>
            );
          }

          if (block.type === 'h3') {
            return (
              <AnimatedBlock key={block.id}>
                <h3
                  id={block.id}
                  className="font-serif text-xl md:text-2xl font-semibold mt-10 mb-3 scroll-mt-28 border-l-[3px] border-gold pl-4"
                  style={{ color: '#800020' }}
                >
                  {renderContent(block.content)}
                </h3>
              </AnimatedBlock>
            );
          }

          if (block.type === 'table1' || block.type === 'table2') {
            return (
              <AnimatedBlock key={block.id}>
                {renderTable(block.tableData!)}
              </AnimatedBlock>
            );
          }

          if (block.type === 'p') {
            const isFirstAfterH2 = idx > 0 && blocks[idx - 1].type === 'h2';
            const content = block.content;

            // Detect blockquote: starts with a quote mark, usually italic Latin/French
            if (isBlockquote(content)) {
              return (
                <AnimatedBlock key={block.id}>
                  <blockquote
                    className="relative my-8 pl-8 pr-4 py-4 border-l-4 border-gold/60 italic font-serif text-[1.05em] rounded-r-lg"
                    style={{ color: 'var(--color-muted)', backgroundColor: 'var(--color-highlight)' }}
                  >
                    <span className="absolute -top-3 -left-3 text-5xl font-serif select-none leading-none" style={{ color: '#D4AF3766' }}>&ldquo;</span>
                    {renderContent(content)}
                  </blockquote>
                </AnimatedBlock>
              );
            }

            return (
              <AnimatedBlock key={block.id}>
                <p className={`text-left font-body ${isFirstAfterH2 ? 'drop-cap' : ''}`}>
                  {renderContent(content)}
                </p>
              </AnimatedBlock>
            );
          }

          return null;
        })}
      </div>
    </div>
  );
}

// ── References section (exported separately) ───────────────────────────────────
export function ReferencesSection({ references }: { references: { id: string; text: string }[] }) {
  return (
    <section id="references" className="mt-16 pt-10 border-t" style={{ borderColor: 'var(--color-border)' }}>
      <h2 className="font-serif text-3xl font-bold mb-2" style={{ color: 'var(--color-heading)' }}>Nguồn Trích Dẫn</h2>
      <p className="text-sm font-body mb-8" style={{ color: 'var(--color-muted)' }}>Di chuột vào số trích dẫn trong bài để xem nhanh • Click để nhảy tới nguồn</p>
      <ul className="space-y-3">
        {references.map((ref) => (
          <li
            id={`ref-${ref.id}`}
            key={ref.id}
            className="text-sm transition-colors pl-8 relative group"
            style={{ color: 'var(--color-body)' }}
          >
            <span className="absolute left-0 top-0 font-bold text-burgundy text-xs pt-0.5 font-body">[{ref.id}]</span>
            <span>
              {ref.text.split(/(https?:\/\/[^\s]+)/g).map((part, i) =>
                part.match(/https?:\/\/[^\s]+/)
                  ? <a key={i} href={part} target="_blank" rel="noopener noreferrer" className="text-navy underline decoration-gold/40 hover:decoration-gold underline-offset-4 break-all">{part}</a>
                  : <span key={i}>{part}</span>
              )}
            </span>
            <CopyBibButton text={ref.text} id={ref.id} />
          </li>
        ))}
      </ul>
    </section>
  );
}
