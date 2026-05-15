import type { Metadata } from 'next';
import { Geist_Mono, Manrope, Playfair_Display } from 'next/font/google';
import './globals.css';

const manrope = Manrope({
  variable: '--font-manrope',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'PH Weather Map Dashboard',
  description: 'Real-time weather and 7-day forecast for Philippine cities using Open-Meteo API',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${manrope.variable} ${geistMono.variable} ${playfair.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
