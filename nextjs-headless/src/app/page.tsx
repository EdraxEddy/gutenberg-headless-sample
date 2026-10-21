import Link from 'next/link';

import { getPosts, toPlainText } from '@/lib/wordpress';

export default async function HomePage() {
  const posts = await getPosts();

  return (
    <>
      <section className="intro">
        <h1>Headless WordPress, done properly</h1>
        <p>
          Posts are written in the WordPress block editor and fetched through the REST API. Custom
          blocks arrive as structured data and render as React components.
        </p>
      </section>

      <ul className="post-list">
        {posts.map((post) => (
          <li key={post.id}>
            <Link href={`/${post.slug}`} className="post-card">
              <time dateTime={post.date}>
                {new Date(post.date).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </time>
              <h2>{toPlainText(post.title.rendered)}</h2>
              <p>{toPlainText(post.excerpt.rendered)}</p>
              <span className="more" aria-hidden="true">
                Read →
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
