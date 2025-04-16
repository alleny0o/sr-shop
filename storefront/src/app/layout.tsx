import { Barlow, Montserrat, Lexend } from 'next/font/google';
import "./globals.css";

// Global cart state provider
import { CartProvider } from "@/providers/cart";

// Configure fonts - selected for minimalist laser works aesthetics
const lexend = Lexend({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-lexend',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-montserrat',
});

const barlow = Barlow({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-barlow',
  weight: ['400', '500', '600', '700'],
});

// Root application layout
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${lexend.variable} ${montserrat.variable} ${barlow.variable} antialiased`}>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}