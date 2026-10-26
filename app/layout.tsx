import type { Metadata, Viewport } from 'next';
import { Source_Serif_4 } from 'next/font/google';
import './globals.css';

// Source Serif 4 é a única família da LP (handoff, seção Typography).
const serif = Source_Serif_4({
  subsets: ['latin'],
  weight: ['400', '600'],
  style: ['normal', 'italic'],
  variable: '--font-source-serif',
  display: 'swap',
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'So Sales | Marketing e vendas para clínicas em Belo Horizonte',
  description:
    'Assessoria de marketing e vendas para clínicas de Belo Horizonte. Organizamos o funil, planejamos as ofertas e conduzimos a gestão de ponta a ponta.',
  icons: { icon: '/logo-sosales.png' },
  openGraph: {
    title: 'So Sales | Marketing e vendas para clínicas',
    description: 'Solicite um diagnóstico da sua clínica.',
    url: siteUrl,
    siteName: 'So Sales',
    locale: 'pt_BR',
    type: 'website',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0b0a09',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={serif.variable}>
      <body>{children}</body>
    </html>
  );
}
