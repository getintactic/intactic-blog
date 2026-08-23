import { getPostsByCategorySlug, getCategoryBySlug, getAllCategories } from '@/lib/data/fetch';
import PostCard from '@/components/PostCard';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const cat = await getCategoryBySlug(slug);
  if (!cat) return { title: 'Category Not Found' };
  return { title: cat.name, description: cat.description || `All ${cat.name} articles` };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [{ posts, total }, category, categories] = await Promise.all([
    getPostsByCategorySlug(slug, 12),
    getCategoryBySlug(slug),
    getAllCategories(),
  ]);

  if (!category) notFound();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-12">
      <div className="flex items-center gap-2 text-sm text-zinc-400 mb-6">
        <Link href="/" className="hover:text-zinc-600">Home</Link>
        <span>/</span>
        <span className="text-zinc-600">{category.name}</span>
      </div>

      <div className="mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-zinc-900 mb-2">{category.name}</h1>
        {category.description && <p className="text-zinc-500 text-lg">{category.description}</p>}
        <p className="text-sm text-zinc-400 mt-2">{total} article{total !== 1 ? 's' : ''}</p>
      </div>

      {posts.length > 0 ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map(post => <PostCard key={post.id} post={post} />)}
        </div>
      ) : (
        <div className="text-center py-20 text-zinc-400">
          <p className="text-lg">No posts in this category yet</p>
        </div>
      )}
    </div>
  );
}
