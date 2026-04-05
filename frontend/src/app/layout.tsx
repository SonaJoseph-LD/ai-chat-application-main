import React from 'react';
import { Inter } from 'next/font/google';
import Sidebar from '../components/Sidebar';
import { Providers } from '../components/Providers';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'AI Chat Application',
  description: 'A chat application powered by AI with context memory.',
};

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en" className={inter.className}>
      <Providers>
        <body className="flex h-screen overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-auto bg-gray-100">{children}</main>
        </body>
      </Providers>
    </html>
  );
};

export default RootLayout;
