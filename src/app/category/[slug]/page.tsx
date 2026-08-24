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
    <div>
      {/* ── Hero Banner ── */}
      <section className="relative overflow-hidden bg-zinc-900 py-16 md:py-20">
        {/* Subtle geometric pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
        {/* Emerald glow */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px]" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-zinc-500 mb-6">
            <Link href="/" className="hover:text-zinc-300 transition-colors duration-200">Home</Link>
            <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            <span className="text-zinc-300">{category.name}</span>
          </div>

          <div className="flex items-end gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">{category.name}</h1>
              {category.description && <p className="text-zinc-400 text-lg mt-3 max-w-xl leading-relaxed">{category.description}</p>}
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-emerald-300 bg-emerald-500/10 rounded-full border border-emerald-500/20 flex-shrink-0 mb-1">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
              {total} article{total !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </section>

      {/* ── Post Grid ── */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        {posts.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map(post => <PostCard key={post.id} post={post} />)}
          </div>
        ) : (
          <div className="text-center py-24">
            <div className="relative w-20 h-20 mx-auto mb-6">
              <div className="absolute inset-0 rounded-2xl border-2 border-dashed border-zinc-200 rotate-6" />
              <div className="absolute inset-2 rounded-xl bg-zinc-50 flex items-center justify-center">
                <svg className="w-7 h-7 text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-lg bg-emerald-100" />
            </div>
            <p className="text-lg font-medium text-zinc-500">No posts in this category yet</p>
            <p className="text-sm text-zinc-400 mt-1">Check back soon for new articles.</p>
          </div>
        )}
      </div>
    </div>
  );
}