import Link from 'next/link';

import { sanitizeInline } from '@/lib/sanitize';
import type { FeatureCardAttributes, WPBlock } from '@/lib/types';
import { WP_URL } from '@/lib/wordpress';
import styles from './FeatureCard.module.css';

const ACCENTS = new Set(['blue', 'violet', 'amber']);

/**
 * React twin of the `headless-sample/feature-card` block.
 * Same attributes and the same rules as render.php: an empty card renders
 * nothing, and the button needs both a label and a link.
 */
export default function FeatureCard({ attrs }: { attrs: WPBlock['attrs'] }) {
  const a = attrs as Partial<FeatureCardAttributes>;
  const title = a.title?.trim() ?? '';
  const text = a.text?.trim() ?? '';
  if (!title && !text) {
    return null;
  }

  const accent = a.accent && ACCENTS.has(a.accent) ? a.accent : 'blue';
  const url = a.ctaUrl ?? '';
  const isInternal = url.startsWith('/') && !url.startsWith('/wp-json');

  return (
    <div id={a.anchor || undefined} className={`${styles.card} ${styles[accent]}`}>
      {a.eyebrow && <p className={styles.eyebrow}>{a.eyebrow}</p>}
      {title && (
        <h3 className={styles.title} dangerouslySetInnerHTML={{ __html: sanitizeInline(title) }} />
      )}
      {text && (
        <p className={styles.text} dangerouslySetInnerHTML={{ __html: sanitizeInline(text) }} />
      )}
      {url &&
        a.ctaLabel &&
        (isInternal ? (
          <Link className={styles.cta} href={url}>
            {a.ctaLabel} <span aria-hidden="true">→</span>
          </Link>
        ) : (
          <a
            className={styles.cta}
            href={url.startsWith('/') && WP_URL ? `${WP_URL}${url}` : url}
            {...(a.opensInNewTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
          >
            {a.ctaLabel} <span aria-hidden="true">→</span>
            {a.opensInNewTab && <span className="sr-only"> (opens in a new tab)</span>}
          </a>
        ))}
    </div>
  );
}
