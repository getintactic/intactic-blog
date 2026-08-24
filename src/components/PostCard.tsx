import Link from 'next/link';
import { Clock, BookOpen } from 'lucide-react';

interface PostCardProps {
  post: {
    id: string; slug: string; title: string; excerpt: string;
    featuredImage: string; readTime: string; publishedAt: string | null;
    authors?: { name: string; slug: string; avatarUrl: string } | null;
    blogCategories?: { name: string; slug: string; color: string } | null;
  };
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map(w => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function PostCard({ post }: PostCardProps) {
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
          {/* Gradient overlay */}
          <div className="post-card-image absolute inset-0" />

          {/* Category badge */}
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
          <h3 className="text-[17px] font-semibold text-zinc-900 leading-snug line-clamp-2 mb-2.5 group-hover:text-emerald-700 transition-colors duration-200">
            {post.title}
          </h3>
          <p className="text-sm text-zinc-500 leading-relaxed line-clamp-2 mb-4">
            {post.excerpt}
          </p>

          {/* Meta row */}
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
