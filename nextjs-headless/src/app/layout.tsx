import type { Metadata } from 'next';
import Link from 'next/link';

import { getSiteInfo } from '@/lib/wordpress';
import './globals.css';

const site = getSiteInfo();

export const metadata: Metadata = {
  title: { default: site.name, template: `%s · ${site.name}` },
  description:
    'A headless WordPress + Next.js sample: Gutenberg blocks rendered as React components.',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en">
      <body>
        <header className="site-header">
          <div className="wrap">
            <Link href="/" className="logo">
              {site.name}
            </Link>
            <span className="tag">WordPress → REST API → Next.js</span>
          </div>
        </header>
        <main className="wrap">{children}</main>
        <footer className="site-footer">
          <div className="wrap">
            Content from WordPress, rendered by Next.js. The Feature Card block is a React component
            fed by structured block data.
          </div>
        </footer>
      </body>
    </html>
  );
}
