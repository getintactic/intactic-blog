'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import {
  ArrowRight, TrendingUp, Clock, ArrowUpRight, Sparkles,
  BookOpen, Code2, Shield, Cloud, Cpu, Smartphone, Building2, Layers
} from 'lucide-react';

const LOGO_URL = 'https://res.cloudinary.com/dvykyd8el/image/upload/v1787611756/intactic_10_sro3ln.png';

/* ── Types ── */
interface Post {
  id: string; slug: string; title: string; excerpt: string;
  featuredImage: string; readTime: string; publishedAt: string | null;
  authors?: { name: string; slug: string; avatarUrl: string } | null;
  blogCategories?: { name: string; slug: string; color: string } | null;
}

interface Category {
  id: string; slug: string; name: string; postCount: number; color?: string;
}

/* ── Demo Posts (shown when DB is empty) ── */
const DEMO_POSTS: Post[] = [
  {
    id: 'demo-1', slug: 'building-scalable-ai-pipelines',
    title: 'Building Scalable AI Pipelines with Modern MLOps',
    excerpt: 'A deep dive into designing production-ready machine learning pipelines that handle millions of predictions daily while maintaining reliability and cost efficiency.',
    featuredImage: '/demo-images/ai-deep-learning.png', readTime: '12 min read', publishedAt: '2026-08-20T10:00:00Z',
    authors: { name: 'Rafiq Ahmed', slug: 'rafiq-ahmed', avatarUrl: '' },
    blogCategories: { name: 'AI & Machine Learning', slug: 'ai-ml', color: '#8b5cf6' },
  },
  {
    id: 'demo-2', slug: 'nextjs-16-server-components',
    title: 'Next.js 16 Server Components: A Practical Guide',
    excerpt: 'Explore how React Server Components in Next.js 16 change the way we think about data fetching, streaming, and client-server boundaries.',
    featuredImage: '/demo-images/react-nextjs.png', readTime: '9 min read', publishedAt: '2026-08-18T10:00:00Z',
    authors: { name: 'Sarah Chen', slug: 'sarah-chen', avatarUrl: '' },
    blogCategories: { name: 'Web Development', slug: 'web-development', color: '#10b981' },
  },
  {
    id: 'demo-3', slug: 'zero-trust-security-architecture',
    title: 'Zero Trust Security Architecture: Beyond the Perimeter',
    excerpt: 'Why traditional network perimeters are obsolete and how to implement a zero-trust model that protects your infrastructure from modern threats.',
    featuredImage: '/demo-images/cybersecurity.png', readTime: '11 min read', publishedAt: '2026-08-15T10:00:00Z',
    authors: { name: 'Kamal Hossain', slug: 'kamal-hossain', avatarUrl: '' },
    blogCategories: { name: 'Cybersecurity', slug: 'cybersecurity', color: '#ef4444' },
  },
  {
    id: 'demo-4', slug: 'kubernetes-multi-cluster-management',
    title: 'Kubernetes Multi-Cluster Management at Scale',
    excerpt: 'Lessons learned from managing 50+ Kubernetes clusters across multiple regions with GitOps, service mesh, and automated disaster recovery.',
    featuredImage: '/demo-images/kubernetes.png', readTime: '14 min read', publishedAt: '2026-08-12T10:00:00Z',
    authors: { name: 'Rafiq Ahmed', slug: 'rafiq-ahmed', avatarUrl: '' },
    blogCategories: { name: 'Cloud & DevOps', slug: 'cloud-devops', color: '#f59e0b' },
  },
  {
    id: 'demo-5', slug: 'typescript-advanced-patterns',
    title: 'Advanced TypeScript Patterns for Large Codebases',
    excerpt: 'Template literal types, conditional types, and discriminated unions — practical patterns we use at Intactic to keep our codebase type-safe at scale.',
    featuredImage: '/demo-images/typescript.png', readTime: '8 min read', publishedAt: '2026-08-10T10:00:00Z',
    authors: { name: 'Sarah Chen', slug: 'sarah-chen', avatarUrl: '' },
    blogCategories: { name: 'Web Development', slug: 'web-development', color: '#10b981' },
  },
  {
    id: 'demo-6', slug: 'microservices-event-driven-architecture',
    title: 'Event-Driven Microservices: Lessons from Production',
    excerpt: 'How we migrated from a monolith to event-driven microservices, the pitfalls we hit, and the patterns that actually work in production.',
    featuredImage: '/demo-images/microservices.png', readTime: '16 min read', publishedAt: '2026-08-08T10:00:00Z',
    authors: { name: 'Kamal Hossain', slug: 'kamal-hossain', avatarUrl: '' },
    blogCategories: { name: 'Software Architecture', slug: 'software-architecture', color: '#3b82f6' },
  },
  {
    id: 'demo-7', slug: 'fintech-mobile-first-strategy',
    title: 'Building a Mobile-First Fintech Product from Scratch',
    excerpt: 'From concept to 100K users — the technical decisions, regulatory considerations, and infrastructure choices behind our mobile payment platform.',
    featuredImage: '/demo-images/fintech-mobile.png', readTime: '13 min read', publishedAt: '2026-08-05T10:00:00Z',
    authors: { name: 'Rafiq Ahmed', slug: 'rafiq-ahmed', avatarUrl: '' },
    blogCategories: { name: 'Fintech & Systems', slug: 'fintech', color: '#06b6d4' },
  },
];

const DEMO_CATEGORIES: Category[] = [
  { id: 'c1', slug: 'web-development', name: 'Web Development', postCount: 2, color: '#10b981' },
  { id: 'c2', slug: 'ai-ml', name: 'AI & Machine Learning', postCount: 1, color: '#8b5cf6' },
  { id: 'c3', slug: 'cloud-devops', name: 'Cloud & DevOps', postCount: 1, color: '#f59e0b' },
  { id: 'c4', slug: 'cybersecurity', name: 'Cybersecurity', postCount: 1, color: '#ef4444' },
  { id: 'c5', slug: 'software-architecture', name: 'Software Architecture', postCount: 1, color: '#3b82f6' },
  { id: 'c6', slug: 'fintech', name: 'Fintech & Systems', postCount: 1, color: '#06b6d4' },
  { id: 'c7', slug: 'mobile-development', name: 'Mobile Development', postCount: 0, color: '#ec4899' },
  { id: 'c8', slug: 'startup-business', name: 'Startup & Business', postCount: 0, color: '#f97316' },
];

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  'web-development': <Code2 className="w-4 h-4" />,
  'ai-ml': <Cpu className="w-4 h-4" />,
  'cloud-devops': <Cloud className="w-4 h-4" />,
  'cybersecurity': <Shield className="w-4 h-4" />,
  'software-architecture': <Layers className="w-4 h-4" />,
  'fintech': <Building2 className="w-4 h-4" />,
  'mobile-development': <Smartphone className="w-4 h-4" />,
  'startup-business': <BookOpen className="w-4 h-4" />,
};

/* ── Helper Functions ── */
function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function getInitials(name: string) {
  return name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
}

/* ── Skeleton Components ── */
function HeroSkeleton() {
  return (
    <div className="py-16">
      <div className="grid lg:grid-cols-5 gap-0 bg-white rounded-2xl overflow-hidden shadow-sm">
        <Skeleton className="aspect-[16/10] lg:aspect-auto lg:col-span-3" />
        <div className="p-8 lg:p-10 flex flex-col justify-center gap-4 lg:col-span-2">
          <Skeleton className="h-6 w-28 rounded-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-4/5" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <div className="flex items-center gap-3 pt-3">
            <Skeleton className="w-9 h-9 rounded-full" />
            <Skeleton className="h-4 w-28" />
          </div>
        </div>
      </div>
    </div>
  );
}

function PostGridSkeleton() {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-[var(--shadow-card)]">
          <Skeleton className="aspect-[16/10]" />
          <div className="p-5 sm:p-6 space-y-3">
            <Skeleton className="h-4 w-24 rounded-full" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <div className="flex items-center gap-2.5 pt-2">
              <Skeleton className="w-8 h-8 rounded-full" />
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Post Card Component ── */
function PostCardItem({ post }: { post: Post }) {
  const authorName = post.authors?.name || 'Intactic Team';
  const initials = getInitials(authorName);
  const catColor = post.blogCategories?.color || '#059669';

  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <article className="bg-white rounded-2xl overflow-hidden shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-all duration-300 hover:-translate-y-0.5">
        {/* Image */}
        <div className="relative aspect-[16/10] bg-zinc-100 overflow-hidden">
          {post.featuredImage ? (
            <img
              src={post.featuredImage}
              alt={post.title}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-zinc-100 to-zinc-200 flex items-center justify-center">
              <BookOpen className="w-10 h-10 text-zinc-300" />
            </div>
          )}
          <div className="post-card-image absolute inset-0" />
          {post.blogCategories && (
            <span
              className="absolute top-3 left-3 z-10 px-3 py-1 text-[11px] font-semibold text-white rounded-lg tracking-wide backdrop-blur-sm"
              style={{ backgroundColor: `${catColor}dd` }}
            >
              {post.blogCategories.name}
            </span>
          )}
        </div>
        {/* Content */}
        <div className="p-5 sm:p-6">
          <h3 className="text-[17px] font-semibold text-zinc-900 leading-snug line-clamp-2 mb-2 group-hover:text-emerald-700 transition-colors duration-200">
            {post.title}
          </h3>
          <p className="text-sm text-zinc-500 leading-relaxed line-clamp-2 mb-4">
            {post.excerpt}
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 text-[13px]">
              <div
                className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold text-white select-none"
                style={{ backgroundColor: catColor }}
              >
                {initials}
              </div>
              <div className="flex flex-col">
                <span className="font-medium text-zinc-800 text-[13px] leading-tight">{authorName}</span>
                {post.publishedAt && (
                  <span className="text-zinc-400 text-[11px]">{formatDate(post.publishedAt)}</span>
                )}
              </div>
            </div>
            {post.readTime && (
              <span className="text-[11px] text-zinc-400 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {post.readTime.replace(' min read', '')}
              </span>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}

/* ── Featured Post Component ── */
function FeaturedPost({ post }: { post: Post }) {
  const authorName = post.authors?.name || 'Intactic Team';
  const initials = getInitials(authorName);
  const catColor = post.blogCategories?.color || '#059669';

  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <div className="grid lg:grid-cols-5 gap-0 bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-[var(--shadow-card-hover)] transition-all duration-300">
        {/* Image Side */}
        <div className="relative aspect-[16/10] lg:aspect-auto lg:col-span-3 bg-zinc-100 overflow-hidden">
          {post.featuredImage ? (
            <img src={post.featuredImage} alt={post.title} className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-zinc-100 to-zinc-200 flex items-center justify-center">
              <BookOpen className="w-16 h-16 text-zinc-300" />
            </div>
          )}
          <div className="post-card-image absolute inset-0" />
          <div className="absolute top-4 left-4 flex items-center gap-2 z-10">
            <span className="px-3 py-1.5 text-[11px] font-bold text-white bg-emerald-600 rounded-lg tracking-wide uppercase flex items-center gap-1.5">
              <Sparkles className="w-3 h-3" />
              Featured
            </span>
            {post.blogCategories && (
              <span className="px-3 py-1.5 text-[11px] font-semibold text-white rounded-lg tracking-wide backdrop-blur-sm" style={{ backgroundColor: `${catColor}dd` }}>
                {post.blogCategories.name}
              </span>
            )}
          </div>
        </div>
        {/* Content Side */}
        <div className="p-8 lg:p-10 flex flex-col justify-center lg:col-span-2">
          <h2 className="text-2xl lg:text-[28px] font-bold text-zinc-900 leading-tight mb-3 group-hover:text-emerald-700 transition-colors duration-200">
            {post.title}
          </h2>
          <p className="text-[15px] text-zinc-500 leading-relaxed mb-6 line-clamp-3">
            {post.excerpt}
          </p>
          <div className="flex items-center gap-3 mb-6">
            <div
              className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-[12px] font-bold text-white select-none"
              style={{ backgroundColor: catColor }}
            >
              {initials}
            </div>
            <div>
              <span className="block font-semibold text-zinc-800 text-sm">{authorName}</span>
              <span className="block text-zinc-400 text-[12px]">{post.publishedAt ? formatDate(post.publishedAt) : ''} · {post.readTime}</span>
            </div>
          </div>
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 group-hover:gap-3 transition-all duration-200">
            Read Article
            <ArrowRight className="w-4 h-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}

/* ── Newsletter Section ── */
function NewsletterSection() {
  return (
    <section className="py-16">
      <div className="relative overflow-hidden bg-zinc-900 rounded-3xl px-6 py-12 sm:px-12 sm:py-16">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-60 h-60 bg-emerald-600/8 rounded-full blur-[60px] translate-y-1/2 -translate-x-1/4" />

        <div className="relative max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-6">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[12px] font-semibold text-emerald-400 tracking-wide">Stay Updated</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            Get the latest from Intactic
          </h2>
          <p className="text-zinc-400 text-[15px] mb-8 max-w-md mx-auto leading-relaxed">
            Weekly deep dives into engineering, AI, and cloud — delivered to your inbox. No spam, ever.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 px-4 py-3 bg-white/10 border border-white/10 rounded-xl text-white placeholder:text-zinc-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
            />
            <button className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-xl transition-colors duration-200 flex items-center justify-center gap-2 whitespace-nowrap">
              Subscribe
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <p className="text-zinc-600 text-[11px] mt-4">Join 2,000+ engineers. Unsubscribe anytime.</p>
        </div>
      </div>
    </section>
  );
}

/* ── Category Card ── */
function CategoryCard({ cat }: { cat: Category }) {
  const icon = CATEGORY_ICONS[cat.slug];
  return (
    <Link
      href={`/category/${cat.slug}`}
      className="group flex items-center gap-3.5 p-4 bg-white rounded-2xl shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-all duration-300 hover:-translate-y-0.5"
    >
      <div
        className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-white transition-transform duration-300 group-hover:scale-110"
        style={{ backgroundColor: cat.color || '#10b981' }}
      >
        {icon || <BookOpen className="w-4 h-4" />}
      </div>
      <div className="flex-1 min-w-0">
        <span className="block text-sm font-semibold text-zinc-900 group-hover:text-emerald-700 transition-colors truncate">{cat.name}</span>
        <span className="block text-[12px] text-zinc-400">{cat.postCount} article{cat.postCount !== 1 ? 's' : ''}</span>
      </div>
      <ArrowUpRight className="w-4 h-4 text-zinc-300 group-hover:text-emerald-600 transition-colors flex-shrink-0" />
    </Link>
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
            id: c.id, slug: c.slug, name: c.name, color: c.color,
            postCount: c.postCount ?? 0,
          })));
        }
      } catch {
        // Silently fail — demo content will show
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Use demo data when real data is empty
  const displayHero = heroPost || DEMO_POSTS[0];
  const displayTrending = trending.length > 0 ? trending : DEMO_POSTS.slice(0, 4);
  const displayPosts = posts.length > 0 ? posts : DEMO_POSTS.slice(1);
  const displayCategories = categories.length > 0 ? categories : DEMO_CATEGORIES;
  const showDemo = posts.length === 0 && !loading;

  return (
    <div>
      {/* ── Hero Banner ── */}
      <section className="relative overflow-hidden bg-zinc-950 border-b border-white/5">
        {/* Background effects */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 opacity-[0.02]" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-emerald-500/[0.07] rounded-full blur-[120px]" />
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-emerald-400/[0.04] rounded-full blur-[100px]" />
        </div>

        <div className="relative max-w-6xl mx-auto px-5 sm:px-8 py-16 md:py-24 lg:py-28">
          <div className="max-w-3xl">
            {/* Logo + tagline */}
            <div className="flex items-center gap-3 mb-8">
              <img src={LOGO_URL} alt="Intactic" className="h-8 object-contain brightness-0 invert opacity-80" />
              <div className="h-5 w-px bg-white/20" />
              <span className="text-[13px] font-medium text-emerald-400 tracking-wide">Engineering Blog</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.1]">
              Ideas, insights &amp;{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-300">
                engineering depth
              </span>
            </h1>
            <p className="mt-5 text-base sm:text-lg text-zinc-400 max-w-xl leading-relaxed">
              Deep dives into the technologies we use at Intactic — by the engineers building them.
            </p>

            {/* Stats row */}
            <div className="flex items-center gap-8 mt-10 pt-8 border-t border-white/10">
              <div>
                <div className="text-2xl font-bold text-white">{showDemo ? '7' : posts.length}+</div>
                <div className="text-[12px] text-zinc-500 mt-0.5">Articles</div>
              </div>
              <div className="w-px h-10 bg-white/10" />
              <div>
                <div className="text-2xl font-bold text-white">{showDemo ? '3' : '3'}+</div>
                <div className="text-[12px] text-zinc-500 mt-0.5">Engineers</div>
              </div>
              <div className="w-px h-10 bg-white/10" />
              <div>
                <div className="text-2xl font-bold text-white">{showDemo ? '6' : '6'}+</div>
                <div className="text-[12px] text-zinc-500 mt-0.5">Topics</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        {/* ── Featured Post ── */}
        {loading ? (
          <HeroSkeleton />
        ) : displayHero ? (
          <section className="py-12 md:py-16">
            <div className="flex items-center gap-3 mb-8">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[12px] font-semibold text-emerald-700 bg-emerald-50 rounded-full tracking-wide">
                <Sparkles className="w-3.5 h-3.5" />
                Featured Article
              </span>
              <div className="flex-1 h-px bg-zinc-200" />
            </div>
            <FeaturedPost post={displayHero} />
          </section>
        ) : null}

        {/* ── Trending Topics ── */}
        {!loading && displayTrending.length > 0 && (
          <section className="pb-12 md:pb-16">
            <div className="flex items-center gap-3 mb-8">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 text-[12px] font-semibold text-white bg-zinc-900 rounded-full tracking-wide">
                <TrendingUp className="w-3.5 h-3.5" />
                Trending
              </span>
              <div className="flex-1 h-px bg-zinc-200" />
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {displayTrending.map(post => (
                <Link key={post.id} href={`/blog/${post.slug}`} className="group block">
                  <div className="h-full p-5 bg-white rounded-2xl shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-all duration-300 hover:-translate-y-0.5">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">{post.blogCategories?.name}</span>
                    </div>
                    <h3 className="font-semibold text-[15px] text-zinc-900 group-hover:text-emerald-700 transition-colors duration-200 line-clamp-2 mb-3 leading-snug">
                      {post.title}
                    </h3>
                    <div className="flex items-center gap-2 text-[12px] text-zinc-400">
                      <span className="font-medium text-zinc-600">{post.authors?.name}</span>
                      <span className="text-zinc-300">·</span>
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ── Latest Posts ── */}
        <section className="py-12 md:py-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl font-bold text-zinc-900">Latest Articles</h2>
              <p className="text-sm text-zinc-400 mt-1">Stay updated with our newest deep dives</p>
            </div>
          </div>
          {loading ? (
            <PostGridSkeleton />
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayPosts.slice(0, 6).map(post => (
                <PostCardItem key={post.id} post={post} />
              ))}
            </div>
          )}
        </section>

        {/* ── Explore Topics ── */}
        {!loading && displayCategories.length > 0 && (
          <section className="py-12 md:py-16">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-xl font-bold text-zinc-900">Explore Topics</h2>
                <p className="text-sm text-zinc-400 mt-1">Browse by category</p>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {displayCategories.slice(0, 8).map(cat => (
                <CategoryCard key={cat.id} cat={cat} />
              ))}
            </div>
          </section>
        )}

        {/* ── Newsletter ── */}
        <NewsletterSection />
      </div>
    </div>
  );
}
