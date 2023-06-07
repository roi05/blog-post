import './globals.css';
import { Inter } from 'next/font/google';
import NextAuthProvider from '../lib/nextAuthProvider';
import ReactQueryProvider from '../lib/reactQueryProvider';
import Header from '../components/Header/Header';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Post it',
  description: 'Make a post',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body className={`${inter.className} bg-gray-100`}>
        <NextAuthProvider>
          <ReactQueryProvider>
            {/* @ts-expect-error Server Component */}
            <Header />
            {children}
          </ReactQueryProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
