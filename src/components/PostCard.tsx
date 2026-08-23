import Link from 'next/link';

interface PostCardProps {
  post: {
    id: string; slug: string; title: string; excerpt: string;
    featuredImage: string; readTime: string; publishedAt: string | null;
    authors?: { name: string; slug: string; avatarUrl: string } | null;
    blogCategories?: { name: string; slug: string; color: string } | null;
  };
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <article className="bg-white rounded-2xl border border-zinc-200 overflow-hidden hover:shadow-lg hover:border-zinc-300 transition-all duration-300">
        <div className="relative aspect-[16/9] bg-zinc-100 overflow-hidden">
          {post.featuredImage ? (
            <img src={post.featuredImage} alt={post.title} loading="lazy" decoding="async" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-zinc-300 text-4xl font-bold">I</div>
          )}
          {post.blogCategories && (
            <span className="absolute top-3 left-3 px-2.5 py-1 text-xs font-semibold text-white rounded-lg" style={{ backgroundColor: post.blogCategories.color || '#0a0a0a' }}>
              {post.blogCategories.name}
            </span>
          )}
        </div>
        <div className="p-5">
          <h3 className="text-lg font-semibold text-zinc-900 line-clamp-2 group-hover:text-blue-600 transition-colors mb-2">
            {post.title}
          </h3>
          <p className="text-sm text-zinc-500 line-clamp-2 mb-4">{post.excerpt}</p>
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>{post.authors?.name || 'Unknown'}</span>
            <div className="flex items-center gap-2">
              {post.publishedAt && <span>{new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>}
              {post.readTime && <span>· {post.readTime}</span>}
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
