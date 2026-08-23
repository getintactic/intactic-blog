import { getPostsByAuthorSlug, getAuthorBySlug } from '@/lib/data/fetch';
import PostCard from '@/components/PostCard';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const author = await getAuthorBySlug(slug);
  if (!author) return { title: 'Author Not Found' };
  return { title: `${author.name} — Author`, description: author.bio || `Articles by ${author.name}` };
}

export default async function AuthorPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [{ posts, total }, author] = await Promise.all([
    getPostsByAuthorSlug(slug, 12),
    getAuthorBySlug(slug),
  ]);

  if (!author) notFound();

  const socialLinks = author.socialLinks || {};

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-12">
      <div className="flex items-center gap-2 text-sm text-zinc-400 mb-6">
        <Link href="/" className="hover:text-zinc-600">Home</Link>
        <span>/</span>
        <span className="text-zinc-600">{author.name}</span>
      </div>

      <div className="flex flex-col sm:flex-row items-start gap-6 mb-10 p-6 bg-zinc-50 rounded-2xl border border-zinc-200">
        <div className="w-20 h-20 rounded-full bg-zinc-200 flex items-center justify-center text-2xl font-bold text-zinc-600 flex-shrink-0">
          {author.avatarUrl ? <img src={author.avatarUrl} alt={author.name} className="w-full h-full rounded-full object-cover" /> : author.name.split(' ').map(n => n[0]).join('')}
        </div>
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 mb-1">{author.name}</h1>
          {author.role && <p className="text-zinc-500 mb-2">{author.role}</p>}
          {author.bio && <p className="text-zinc-600 mb-3">{author.bio}</p>}
          <p className="text-sm text-zinc-400">{total} article{total !== 1 ? 's' : ''}</p>
          <div className="flex gap-3 mt-3">
            {socialLinks.twitter && <a href={socialLinks.twitter} target="_blank" className="text-sm text-zinc-400 hover:text-zinc-900">Twitter</a>}
            {socialLinks.linkedin && <a href={socialLinks.linkedin} target="_blank" className="text-sm text-zinc-400 hover:text-zinc-900">LinkedIn</a>}
            {socialLinks.github && <a href={socialLinks.github} target="_blank" className="text-sm text-zinc-400 hover:text-zinc-900">GitHub</a>}
          </div>
        </div>
      </div>

      {posts.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map(post => <PostCard key={post.id} post={post} />)}
        </div>
      ) : (
        <div className="text-center py-20 text-zinc-400">
          <p className="text-lg">No posts by this author yet</p>
        </div>
      )}
    </div>
  );
}