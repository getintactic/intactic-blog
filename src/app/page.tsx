import { getPublishedPosts, getFeaturedPosts, getTrendingPosts, getAllCategories } from '@/lib/data/fetch';
import PostCard from '@/components/PostCard';
import Link from 'next/link';

export default async function HomePage() {
  const [{ posts, total }, featured, trending, categories] = await Promise.all([
    getPublishedPosts(9),
    getFeaturedPosts(1),
    getTrendingPosts(4),
    getAllCategories(),
  ]);

  const heroPost = featured[0];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6">
      {/* Hero */}
      <section className="py-12 md:py-20">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-zinc-900">
          Intactic Insights
        </h1>
        <p className="mt-4 text-lg md:text-xl text-zinc-500 max-w-2xl">
          Deep dives into the technologies shaping tomorrow — by engineers, for engineers.
        </p>
      </section>

      {/* Featured Post */}
      {heroPost && (
        <section className="mb-16">
          <Link href={`/blog/${heroPost.slug}`} className="group block">
            <div className="grid md:grid-cols-2 gap-8 items-center bg-zinc-50 rounded-2xl border border-zinc-200 overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-[16/10] bg-zinc-200 overflow-hidden">
                {heroPost.featuredImage ? (
                  <img src={heroPost.featuredImage} alt={heroPost.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-300 text-6xl font-bold">I</div>
                )}
              </div>
              <div className="p-8">
                {heroPost.blogCategories && (
                  <span className="inline-block px-3 py-1 text-xs font-semibold text-white rounded-lg mb-4" style={{ backgroundColor: heroPost.blogCategories.color || '#0a0a0a' }}>
                    {heroPost.blogCategories.name}
                  </span>
                )}
                <h2 className="text-2xl md:text-3xl font-bold text-zinc-900 mb-3 group-hover:text-blue-600 transition-colors">
                  {heroPost.title}
                </h2>
                <p className="text-zinc-500 mb-4 line-clamp-3">{heroPost.excerpt}</p>
                <div className="flex items-center gap-3 text-sm text-zinc-400">
                  <span>{heroPost.authors?.name || 'Unknown'}</span>
                  {heroPost.publishedAt && <span>· {new Date(heroPost.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>}
                  {heroPost.readTime && <span>· {heroPost.readTime}</span>}
                </div>
              </div>
            </div>
          </Link>
        </section>
      )}

      {/* Trending */}
      {trending.length > 0 && (
        <section className="mb-16">
          <div className="flex items-center gap-2 mb-6">
            <span className="text-2xl">🔥</span>
            <h2 className="text-xl font-bold text-zinc-900">Trending</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {trending.map(post => (
              <Link key={post.id} href={`/blog/${post.slug}`} className="group">
                <div className="p-4 rounded-xl border border-zinc-200 hover:border-zinc-400 hover:shadow-sm transition-all">
                  <h3 className="font-semibold text-sm text-zinc-900 group-hover:text-blue-600 transition-colors line-clamp-2 mb-2">
                    {post.title}
                  </h3>
                  <div className="text-xs text-zinc-400">
                    {post.authors?.name} · {post.readTime}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Latest Posts + Sidebar */}
      <section className="mb-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-zinc-900">Latest Posts</h2>
        </div>
        <div className="grid lg:grid-cols-[1fr_280px] gap-8">
          <div>
            {posts.length > 0 ? (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {posts.map(post => <PostCard key={post.id} post={post} />)}
              </div>
            ) : (
              <div className="text-center py-20 text-zinc-400">
                <p className="text-lg">No posts yet</p>
                <p className="text-sm mt-1">Check back soon for new articles.</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="hidden lg:block space-y-8">
            <div>
              <h3 className="font-bold text-zinc-900 mb-4">Categories</h3>
              <div className="space-y-2">
                {categories.map(cat => (
                  <Link key={cat.id} href={`/category/${cat.slug}`} className="flex items-center justify-between py-1.5 text-sm text-zinc-600 hover:text-zinc-900 transition-colors">
                    <span>{cat.name}</span>
                    <span className="text-zinc-400">{cat.postCount}</span>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}