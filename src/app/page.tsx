'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import PostCard from '@/components/PostCard';
import { Skeleton } from '@/components/ui/skeleton';

/* ── Types ── */
interface Post {
  id: string; slug: string; title: string; excerpt: string;
  featuredImage: string; readTime: string; publishedAt: string | null;
  authors?: { name: string; slug: string; avatarUrl: string } | null;
  blogCategories?: { name: string; slug: string; color: string } | null;
}

interface Category {
  id: string; slug: string; name: string; postCount: number;
}

/* ── Skeleton Components ── */
function HeroSkeleton() {
  return (
    <div className="py-16">
      <div className="grid md:grid-cols-2 gap-0 bg-white rounded-2xl overflow-hidden shadow-sm">
        <Skeleton className="aspect-[16/10] md:aspect-auto" />
        <div className="p-8 md:p-10 flex flex-col justify-center gap-4">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <div className="flex items-center gap-3 pt-2">
            <Skeleton className="w-7 h-7 rounded-full" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>
      </div>
    </div>
  );
}

function TrendingSkeleton() {
  return (
    <div className="pb-16">
      <div className="flex items-center gap-3 mb-8">
        <Skeleton className="h-6 w-24 rounded-full" />
        <Skeleton className="h-px flex-1" />
      </div>
      <div className="grid lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="p-5 bg-white rounded-2xl shadow-sm">
            <Skeleton className="h-5 w-full mb-3" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        ))}
      </div>
    </div>
  );
}

function PostGridSkeleton() {
  return (
    <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-[var(--shadow-card)]">
          <Skeleton className="aspect-[16/10]" />
          <div className="p-5 sm:p-6 space-y-3">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
            <div className="flex items-center gap-2.5 pt-1">
              <Skeleton className="w-7 h-7 rounded-full" />
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function CategoriesSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="h-10 w-full rounded-xl" />
      ))}
    </div>
  );
}

/* ── Empty State ── */
function EmptyPostsState() {
  return (
    <div className="text-center py-24">
      <div className="relative w-24 h-24 mx-auto mb-6">
        <div className="absolute inset-0 rounded-2xl border-2 border-dashed border-zinc-200 rotate-6" />
        <div className="absolute inset-2 rounded-xl bg-zinc-50 flex items-center justify-center">
          <svg className="w-8 h-8 text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
        </div>
        <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-lg bg-emerald-100" />
        <div className="absolute -top-1 -left-1 w-4 h-4 rounded-full bg-emerald-50" />
      </div>
      <p className="text-lg font-medium text-zinc-500">No posts yet</p>
      <p className="text-sm text-zinc-400 mt-1">Check back soon for new articles.</p>
    </div>
  );
}

/* ── Main Page ── */
export default function HomePage() {
  const [heroPost, setHeroPost] = useState<Post | null>(null);
  const [trending, setTrending] = useState<Post[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [featuredRes, trendingRes, postsRes, categoriesRes] = await Promise.all([
          fetch('/api/public/posts?featured=true&limit=1').then(r => r.json()),
          fetch('/api/public/posts?trending=true&limit=4').then(r => r.json()),
          fetch('/api/public/posts?limit=9').then(r => r.json()),
          fetch('/api/public/categories').then(r => r.json()),
        ]);

        if (featuredRes.data?.length > 0) setHeroPost(featuredRes.data[0]);
        if (trendingRes.data) setTrending(trendingRes.data);
        if (postsRes.data) setPosts(postsRes.data);
        if (categoriesRes.data) {
          setCategories(categoriesRes.data.map((c: any) => ({
            id: c.id,
            slug: c.slug,
            name: c.name,
            postCount: c.postCount ?? 0,
          })));
        }
      } catch {
        // Silently fail — empty states will show
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div>
      {/* ── Hero Section (static, always visible) ── */}
      <section className="relative overflow-hidden bg-zinc-900 py-20 md:py-32">
        {/* Subtle geometric pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
        {/* Emerald gradient glow */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-emerald-600/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/4" />

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
          {/* Emerald accent line */}
          <div className="w-12 h-1 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-400 mb-8" />
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white">
            Intactic{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-500">Insights</span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-zinc-400 max-w-2xl leading-relaxed">
            Deep dives into the technologies shaping tomorrow — by engineers, for engineers.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* ── Featured Post ── */}
        {loading ? (
          <HeroSkeleton />
        ) : heroPost ? (
          <section className="py-16">
            <Link href={`/blog/${heroPost.slug}`} className="group block">
              <div className="grid md:grid-cols-2 gap-0 bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300">
                <div className="relative aspect-[16/10] bg-zinc-100 overflow-hidden">
                  {heroPost.featuredImage ? (
                    <img src={heroPost.featuredImage} alt={heroPost.title} className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500 ease-out" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-200 text-6xl font-bold select-none">I</div>
                  )}
                  <div className="post-card-image absolute inset-0" />
                  {heroPost.blogCategories && (
                    <span
                      className="absolute bottom-4 left-4 z-10 px-3 py-1 text-[11px] font-semibold text-white rounded-full tracking-wide"
                      style={{ backgroundColor: heroPost.blogCategories.color || '#059669' }}
                    >
                      {heroPost.blogCategories.name}
                    </span>
                  )}
                </div>
                <div className="p-8 md:p-10 flex flex-col justify-center">
                  <h2 className="text-2xl md:text-3xl font-bold text-zinc-900 leading-snug mb-3 group-hover:text-emerald-700 transition-colors duration-200">
                    {heroPost.title}
                  </h2>
                  <p className="text-zinc-500 leading-relaxed mb-5 line-clamp-3">{heroPost.excerpt}</p>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[11px] font-bold flex-shrink-0 select-none">
                      {heroPost.authors?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'I'}
                    </div>
                    <span className="font-medium text-zinc-700">{heroPost.authors?.name || 'Unknown'}</span>
                    <span className="text-zinc-300">·</span>
                    {heroPost.publishedAt && (
                      <time className="text-zinc-400" dateTime={heroPost.publishedAt}>
                        {new Date(heroPost.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </time>
                    )}
                    {heroPost.readTime && (
                      <>
                        <span className="text-zinc-300">·</span>
                        <span className="text-zinc-400">{heroPost.readTime}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          </section>
        ) : null}

        {/* ── Trending ── */}
        {loading ? (
          <TrendingSkeleton />
        ) : trending.length > 0 ? (
          <section className="pb-16">
            <div className="flex items-center gap-3 mb-8">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-white bg-emerald-600 rounded-full tracking-wide">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                Trending
              </span>
              <div className="flex-1 h-px bg-zinc-200" />
            </div>
            <div className="flex lg:grid lg:grid-cols-4 gap-4 overflow-x-auto snap-x snap-mandatory pb-2 lg:pb-0 -mx-4 px-4 lg:mx-0 lg:px-0 scrollbar-hide">
              {trending.map(post => (
                <Link key={post.id} href={`/blog/${post.slug}`} className="group snap-start flex-shrink-0 w-[280px] lg:w-auto">
                  <div className="h-full p-5 bg-white rounded-2xl shadow-sm hover:shadow-xl transition-shadow duration-300">
                    <h3 className="font-semibold text-[15px] text-zinc-900 group-hover:text-emerald-700 transition-colors duration-200 line-clamp-2 mb-3 leading-snug">
                      {post.title}
                    </h3>
                    <div className="flex items-center gap-2 text-[13px] text-zinc-400">
                      <span className="font-medium text-zinc-600">{post.authors?.name}</span>
                      <span className="text-zinc-300">·</span>
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        {/* ── Latest Posts + Sidebar ── */}
        <section className="py-16">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-2xl font-bold text-zinc-900">Latest Posts</h2>
              <p className="text-sm text-zinc-400 mt-1">Stay updated with our newest articles</p>
            </div>
          </div>
          <div className="grid lg:grid-cols-[1fr_260px] gap-10">
            <div>
              {loading ? (
                <PostGridSkeleton />
              ) : posts.length > 0 ? (
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {posts.map(post => <PostCard key={post.id} post={post} />)}
                </div>
              ) : (
                <EmptyPostsState />
              )}
            </div>

            {/* ── Categories Sidebar ── */}
            <aside className="hidden lg:block">
              <div className="sticky top-24">
                <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-5">Categories</h3>
                {loading ? (
                  <div className="bg-white rounded-2xl shadow-sm p-5">
                    <CategoriesSkeleton />
                  </div>
                ) : categories.length > 0 ? (
                  <div className="bg-white rounded-2xl shadow-sm p-5 space-y-1">
                    {categories.map(cat => (
                      <Link
                        key={cat.id}
                        href={`/category/${cat.slug}`}
                        className="flex items-center justify-between py-2.5 px-3 text-sm text-zinc-600 hover:text-emerald-700 hover:bg-emerald-50/50 rounded-xl transition-colors duration-200 group"
                      >
                        <span className="font-medium">{cat.name}</span>
                        <span className="text-xs font-medium text-zinc-400 group-hover:text-emerald-600 bg-zinc-100 group-hover:bg-emerald-100 px-2 py-0.5 rounded-full transition-colors duration-200">
                          {cat.postCount}
                        </span>
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>
            </aside>
          </div>
        </section>
      </div>
    </div>
  );
}