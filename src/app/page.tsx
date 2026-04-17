import ProgressBar from '@/components/ProgressBar';
import TableOfContents from '@/components/TableOfContents';
import ArticleRenderer, { ReferencesSection } from '@/components/ArticleRenderer';
import ThemeToggle from '@/components/ThemeToggle';
import BackToTop from '@/components/BackToTop';
import MobileToC from '@/components/MobileToC';
import MobileHeader from '@/components/MobileHeader';
import { parseArticle } from '@/utils/parser';

function calcReadingTime(blocks: ReturnType<typeof parseArticle>): number {
  const text = blocks.filter(b => b.type === 'p').map(b => b.content).join(' ');
  return Math.ceil(text.split(/\s+/).length / 200);
}

const getAssetPath = (path: string) => {
  const isProd = process.env.NODE_ENV === 'production';
  const basePath = isProd ? '/Thanh-Augustino-Chu-Nghia-Hien-Sinh-Va-Ban-The-Luan-Ve-Tinh-Yeu' : '';
  return `${basePath}${path}`;
};

export default function Home() {
  const blocks    = parseArticle();
  const titleBlock  = blocks.find(b => b.type === 'h1');
  const titleParts  = titleBlock?.content.split(':') ?? ['Báo cáo Nghiên cứu', 'Thánh Augustinô'];
  const refsBlock   = blocks.find(b => b.type === 'references');
  const references  = refsBlock?.references ?? [];
  const readingTime = calcReadingTime(blocks);
  const contentBlocks = blocks.filter(b => b.type !== 'h1' && b.type !== 'references');

  return (
    <main
      className="relative min-h-screen transition-colors duration-400"
      style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-body)' }}
    >
      <ProgressBar />
      <BackToTop />
      <MobileHeader />

      {/* ── Desktop Top Nav (Permanent) ────────────────────── */}
      <nav
        className="hidden lg:flex fixed top-0 left-0 right-0 z-40 items-center justify-between px-12 h-14 backdrop-blur-md border-b transition-colors duration-400"
        style={{
          backgroundColor: 'var(--color-nav)',
          borderColor: 'var(--color-border)',
        }}
      >
        <a
          href="#"
          className="font-serif text-sm font-bold tracking-wide opacity-80 hover:opacity-100 transition-opacity"
          style={{ color: '#800020' }}
        >
          Augustinô &amp; Hiện Sinh
        </a>
        <ThemeToggle />
      </nav>

      {/* ── Hero ───────────────────────────────────────────── */}
      <header
        className="relative w-full pt-32 pb-24 px-6 md:px-12 flex flex-col items-center border-b-[3px] border-double transition-colors duration-400 overflow-hidden"
        style={{ borderColor: 'var(--color-border)' }}
      >
        {/* Artistic Background Image */}
        <div 
          className="absolute inset-x-0 top-0 bottom-0 z-0 opacity-[0.14] pointer-events-none grayscale brightness-110"
          style={{ 
            backgroundImage: `url("${getAssetPath('/hero.png')}")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center 20%',
          }}
        />
        
        {/* Soft Radial Gradient Overlay to blend image */}
        <div 
          className="absolute inset-0 z-10 pointer-events-none"
          style={{ 
            background: 'radial-gradient(circle at center, transparent 20%, var(--color-bg) 100%)' 
          }}
        />

        <div
          className="absolute top-0 left-0 right-0 h-px z-20"
          style={{ background: 'linear-gradient(to right, transparent, var(--color-highlight), transparent)' }}
        />

        <div className="max-w-4xl mx-auto text-center relative z-20">
          <p className="text-xs md:text-sm font-body tracking-[0.25em] font-bold uppercase mb-6" style={{ color: '#D4AF37' }}>
            {titleParts[0]?.trim()}
          </p>
          <h1
            className="font-serif text-4xl md:text-6xl lg:text-8xl font-extrabold leading-[1.1] mb-8 tracking-tight"
            style={{ color: 'var(--color-heading)' }}
          >
            {titleParts[1]?.trim() ?? titleParts[0]}
          </h1>

          <div className="flex items-center justify-center gap-4 my-8" style={{ opacity: 0.5 }}>
            <div className="h-px w-16 bg-burgundy" />
            <div className="w-2 h-2 rotate-45 bg-gold" />
            <div className="h-px w-16 bg-burgundy" />
          </div>

          <p className="font-serif italic text-lg" style={{ color: 'var(--color-muted)' }}>
            Sự Giao Thoa Giữa Thần Học Giáo Phụ và Triết Học Hiện Sinh
          </p>

          <div
            className="mt-8 inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-body border"
            style={{ borderColor: 'var(--color-border)', color: 'var(--color-muted)' }}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1"/>
              <path d="M6 3v3l2 1.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
            </svg>
            Khoảng {readingTime} phút đọc · {references.length} nguồn tham khảo
          </div>
        </div>

        {/* Watermark motif */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-hidden" style={{ opacity: 0.025 }}>
          <svg width="600" height="600" viewBox="0 0 100 100">
            <path d="M50 0 L100 50 L50 100 L0 50 Z" fill="currentColor"/>
            <circle cx="50" cy="50" r="28" fill="none" stroke="currentColor" strokeWidth="1.5"/>
            <circle cx="50" cy="50" r="14" fill="none" stroke="currentColor" strokeWidth="0.8"/>
          </svg>
        </div>
      </header>

      {/* ── Main Content Layout ── */}
      {/*
        KEY FIX for sticky ToC:
        - Outer flex container: items-start (so children don't stretch)
        - aside: sticky top-[3.6rem] self-start — sticky on the aside itself
        - aside height: max-h-[calc(100vh-4rem)] overflow-y-auto
      */}
      <div className="max-w-7xl mx-auto px-4 md:px-10 py-12 flex flex-col lg:flex-row gap-10 lg:gap-16 items-start">

        {/* ── Desktop Sidebar ToC (Sticky) ── */}
        <aside
          className="hidden lg:block w-60 xl:w-64 shrink-0 sticky top-[3.6rem] self-start max-h-[calc(100vh-4rem)] overflow-y-auto no-scrollbar rounded-xl border p-5 transition-colors duration-400"
          style={{
            backgroundColor: 'var(--color-sidebar)',
            borderColor: 'var(--color-border)',
            backdropFilter: 'blur(8px)',
          }}
        >
          <TableOfContents blocks={contentBlocks} />
        </aside>

        {/* ── Article ── */}
        <article
          className="flex-1 min-w-0 rounded-2xl p-6 md:p-12 lg:p-14 border transition-colors duration-400"
          style={{
            backgroundColor: 'var(--color-surface)',
            borderColor: 'var(--color-border)',
            backdropFilter: 'blur(4px)',
          }}
        >
          <ArticleRenderer
            blocks={contentBlocks}
            references={references}
            readingTime={readingTime}
          />

          {/* Ornament divider before references */}
          <div className="flex justify-center my-20">
            <svg width="200" height="30" viewBox="0 0 200 30" fill="none">
              <line x1="0" y1="15" x2="80" y2="15" stroke="#800020" strokeWidth="0.6" strokeOpacity="0.3"/>
              <line x1="120" y1="15" x2="200" y2="15" stroke="#800020" strokeWidth="0.6" strokeOpacity="0.3"/>
              <path d="M100 3 L108 15 L100 27 L92 15 Z" stroke="#D4AF37" strokeWidth="1" fill="none" strokeOpacity="0.6"/>
              <circle cx="100" cy="15" r="2" fill="#D4AF37" fillOpacity="0.7"/>
            </svg>
          </div>

          <ReferencesSection references={references} />
        </article>
      </div>

      {/* Mobile ToC floating button */}
      <MobileToC blocks={contentBlocks} />
    </main>
  );
}
