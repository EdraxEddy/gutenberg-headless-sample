import type { ComponentType } from 'react';

import { sanitizeBlockHtml } from '@/lib/sanitize';
import type { WPBlock } from '@/lib/types';
import FeatureCard from './FeatureCard';

/**
 * Custom blocks that render as real React components.
 * Add a line here for every block that deserves its own component.
 */
const COMPONENTS: Record<string, ComponentType<{ attrs: WPBlock['attrs'] }>> = {
  'headless-sample/feature-card': FeatureCard,
};

/**
 * Renders the `structured_blocks` of a post.
 *
 * Known blocks become components fed by their attributes; every other block
 * falls back to the HTML WordPress rendered for it, sanitised. Nothing that the
 * editor added ever disappears from the page.
 */
export default function BlockRenderer({ blocks }: { blocks: WPBlock[] }) {
  return (
    <>
      {blocks.map((block, index) => {
        const Component = COMPONENTS[block.name];
        if (Component) {
          return <Component key={`${block.name}-${index}`} attrs={block.attrs} />;
        }
        return (
          <div
            key={`${block.name}-${index}`}
            className="wp-block-fallback"
            data-block={block.name}
            dangerouslySetInnerHTML={{ __html: sanitizeBlockHtml(block.html) }}
          />
        );
      })}
    </>
  );
}
