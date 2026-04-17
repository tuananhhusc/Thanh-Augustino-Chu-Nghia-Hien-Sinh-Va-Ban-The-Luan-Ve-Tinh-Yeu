import type { Metadata } from 'next';
import { Lora, Playfair_Display } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeToggle';

const lora = Lora({ subsets: ['vietnamese', 'latin'], variable: '--font-lora' });
const playfair = Playfair_Display({ subsets: ['vietnamese', 'latin'], variable: '--font-playfair' });

export const metadata: Metadata = {
  title: 'Thánh Augustinô: Chủ Nghĩa Hiện Sinh Và Bản Thể Luận Về Tình Yêu',
  description: 'Báo cáo nghiên cứu chuyên sâu về Thánh Augustinô, Chủ Nghĩa Hiện Sinh Và Bản Thể Luận Về Tình Yêu – đối chiếu với Kierkegaard, Sartre và Hannah Arendt.',
  keywords: ['Augustinô', 'Hiện sinh', 'Caritas', 'Ordo Amoris', 'Triết học', 'Thần học', 'Công giáo'],
  authors: [{ name: 'Augustino Research Project' }],
  openGraph: {
    title: 'Thánh Augustinô: Chủ nghĩa Hiện sinh & Bản thể luận',
    description: 'Báo cáo nghiên cứu chuyên sâu về tư tưởng của Thánh Augustinô',
    url: 'https://thanhaugustino.vn', // Cần thay bằng URL thật khi deploy
    siteName: 'Augustino Research',
    images: [
      {
        url: '/hero.png',
        width: 1200,
        height: 630,
        alt: 'Thánh Augustinô: Chủ nghĩa Hiện sinh',
      },
    ],
    locale: 'vi_VN',
    type: 'article',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Thánh Augustinô: Chủ nghĩa Hiện sinh & Bản thể luận',
    description: 'Báo cáo nghiên cứu chuyên sâu về tư tưởng của Thánh Augustinô',
    images: ['/hero.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={`${lora.variable} ${playfair.variable}`}>
      <body className="antialiased min-h-screen">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
