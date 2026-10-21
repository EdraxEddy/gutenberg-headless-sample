import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

import BlockRenderer from '@/components/BlockRenderer';
import { getPost, getPosts, toPlainText } from '@/lib/wordpress';

/** Every published post is prerendered; new ones are generated on first visit. */
export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps<'/[slug]'>): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) {
    return {};
  }
  const title = toPlainText(post.title.rendered);
  const description = toPlainText(post.excerpt.rendered);
  return {
    title,
    description,
    openGraph: { title, description, type: 'article', publishedTime: post.date },
  };
}

export default async function PostPage({ params }: PageProps<'/[slug]'>) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) {
    notFound();
  }

  return (
    <article className="post">
      <Link href="/" className="back">
        ← All posts
      </Link>
      <h1>{toPlainText(post.title.rendered)}</h1>
      <time dateTime={post.date} className="meta">
        {new Date(post.date).toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })}
      </time>
      <div className="post-body">
        <BlockRenderer blocks={post.structured_blocks} />
      </div>
    </article>
  );
}
