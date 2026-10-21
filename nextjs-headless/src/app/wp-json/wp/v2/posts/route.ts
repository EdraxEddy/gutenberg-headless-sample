import snapshot from '@/data/snapshot.json';

/**
 * Demo only: serves the committed REST snapshot at the same path WordPress
 * uses, so the "See the JSON" link in a post works without a public WordPress.
 * With WP_API_URL set, links to /wp-json/... point to the real site instead.
 */
export async function GET() {
  return Response.json(snapshot.posts);
}
