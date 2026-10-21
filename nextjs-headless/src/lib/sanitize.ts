/**
 * HTML coming from WordPress is sanitised before it reaches the page:
 * a compromised editor account should never be able to inject scripts
 * into the front end.
 */
import sanitizeHtml from 'sanitize-html';

/** Inline formatting allowed inside RichText attributes (bold, italic, links). */
export function sanitizeInline(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: ['strong', 'em', 'a', 'code'],
    allowedAttributes: { a: ['href', 'target', 'rel'] },
    allowedSchemes: ['http', 'https', 'mailto'],
  });
}

/** Full block HTML (fallback rendering of core blocks). */
export function sanitizeBlockHtml(html: string): string {
  return sanitizeHtml(html, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'figure', 'figcaption']),
    allowedAttributes: {
      '*': ['class', 'id'],
      a: ['href', 'target', 'rel'],
      img: ['src', 'alt', 'width', 'height', 'loading'],
    },
    allowedSchemes: ['http', 'https', 'mailto'],
  });
}
