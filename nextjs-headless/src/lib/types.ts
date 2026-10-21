/** Shape of the REST responses this app reads (only the fields it requests). */

export interface WPBlock {
  /** Block name, e.g. "core/paragraph" or "headless-sample/feature-card". */
  name: string;
  /** Attributes, already merged with the block.json defaults by the plugin. */
  attrs: Record<string, unknown>;
  /** Server-rendered HTML, used as a fallback for blocks without a component. */
  html: string;
  innerBlocks: WPBlock[];
}

export interface WPPost {
  id: number;
  slug: string;
  date: string;
  modified: string;
  title: { rendered: string };
  excerpt: { rendered: string };
  structured_blocks: WPBlock[];
}

/** Attributes of the Feature Card block (mirror of its block.json). */
export interface FeatureCardAttributes {
  eyebrow: string;
  title: string;
  text: string;
  ctaLabel: string;
  ctaUrl: string;
  opensInNewTab: boolean;
  accent: 'blue' | 'violet' | 'amber';
  anchor?: string;
}
