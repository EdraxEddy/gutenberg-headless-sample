/**
 * WordPress data layer.
 *
 * Reads posts from the WordPress REST API, including the `structured_blocks`
 * field added by the Feature Card plugin. Results are cached with Next.js
 * Cache Components ('use cache' + cacheLife), so pages are served statically
 * and refreshed in the background. A WordPress webhook can call
 * revalidateTag('wp-posts') for instant updates after publishing.
 *
 * Without WP_API_URL the app reads a committed snapshot of the same REST
 * responses (src/data/snapshot.json), so the demo runs anywhere.
 */
import { cacheLife, cacheTag } from 'next/cache';

import snapshot from '@/data/snapshot.json';
import type { WPPost } from './types';

const FIELDS = 'id,slug,date,modified,title,excerpt,structured_blocks';

/** Base URL of the WordPress site, without a trailing slash. */
export const WP_URL = process.env.WP_API_URL?.replace(/\/+$/, '') ?? '';

async function fetchFromWordPress<T>(path: string): Promise<T> {
  const res = await fetch(`${WP_URL}/wp-json/wp/v2/${path}`, {
    headers: { Accept: 'application/json' },
  });
  if (!res.ok) {
    throw new Error(`WordPress REST ${res.status} for ${path}`);
  }
  return res.json() as Promise<T>;
}

export async function getPosts(): Promise<WPPost[]> {
  'use cache';
  cacheLife('minutes');
  cacheTag('wp-posts');

  if (!WP_URL) {
    return snapshot.posts as WPPost[];
  }
  return fetchFromWordPress<WPPost[]>(`posts?per_page=50&_fields=${FIELDS}`);
}

export async function getPost(slug: string): Promise<WPPost | null> {
  'use cache';
  cacheLife('minutes');
  cacheTag('wp-posts', `wp-post-${slug}`);

  if (!WP_URL) {
    return (snapshot.posts as WPPost[]).find((p) => p.slug === slug) ?? null;
  }
  const posts = await fetchFromWordPress<WPPost[]>(
    `posts?slug=${encodeURIComponent(slug)}&_fields=${FIELDS}`,
  );
  return posts[0] ?? null;
}

export function getSiteInfo() {
  return snapshot.site;
}

/** Plain text from a rendered HTML string (titles, excerpts for meta tags). */
export function toPlainText(html: string): string {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&#8217;|&rsquo;/g, '’')
    .replace(/&#8220;|&#8221;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;|&#160;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}
