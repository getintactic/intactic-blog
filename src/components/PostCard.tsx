import Link from 'next/link';

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
  const authorName = post.authors?.name || 'Unknown';
  const initials = getInitials(authorName);

  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <article className="bg-white rounded-2xl overflow-hidden shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-shadow duration-300">
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
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-5xl font-black text-zinc-200 select-none">I</span>
            </div>
          )}
          {/* Gradient overlay */}
          <div className="post-card-image absolute inset-0" />

          {/* Category badge on image */}
          {post.blogCategories && (
            <span
              className="absolute bottom-3 left-3 z-10 px-3 py-1 text-[11px] font-semibold text-white rounded-full tracking-wide"
              style={{ backgroundColor: post.blogCategories.color || '#059669' }}
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
          <div className="flex items-center gap-2.5 text-[13px]">
            {/* Avatar circle */}
            <div className="flex-shrink-0 w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[11px] font-bold select-none">
              {initials}
            </div>
            <span className="font-medium text-zinc-700 truncate max-w-[140px]">
              {authorName}
            </span>
            <span className="text-zinc-300">·</span>
            {post.publishedAt && (
              <time className="text-zinc-400 whitespace-nowrap" dateTime={post.publishedAt}>
                {formatDate(post.publishedAt)}
              </time>
            )}
            {post.readTime && (
              <>
                <span className="text-zinc-300">·</span>
                <span className="text-zinc-400 whitespace-nowrap">{post.readTime}</span>
              </>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}
