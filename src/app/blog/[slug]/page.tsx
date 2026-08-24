import { getPostBySlug, getAllCategories, getRelatedPosts } from '@/lib/data/fetch';
import { remark } from 'remark';
import html from 'remark-html';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import { rehype } from 'rehype';
import rehypeHighlight from 'rehype-highlight';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import PostCard from '@/components/PostCard';

function extractHeadings(content: string) {
  const headings: { id: string; text: string; level: number }[] = [];
  const regex = /^###\s+(.+)$/gm;
  let match;
  while ((match = regex.exec(content)) !== null) {
    const id = match[1].toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    headings.push({ id, text: match[1], level: 3 });
  }
  return headings;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: 'Post Not Found' };
  return {
    title: post.title,
    description: post.metaDescription || post.excerpt,
    openGraph: { title: post.metaTitle || post.title, description: post.metaDescription || post.excerpt, images: post.ogImage || post.featuredImage ? [post.ogImage || post.featuredImage] : [] },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [post, categories, related] = await Promise.all([
    getPostBySlug(slug),
    getAllCategories(),
    getPostBySlug(slug).then(p => p ? getRelatedPosts(p.id, p.categoryId, 3) : []),
  ]);

  if (!post) notFound();

  const processedContent = await remark()
    .use(remarkGfm)
    .use(html, { sanitize: false })
    .process(post.content || '');
  const contentHtml = String(processedContent);

  const highlightedContent = await rehype()
    .use(rehypeHighlight)
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings, { behavior: 'wrap' })
    .process(contentHtml);
  const finalHtml = String(highlightedContent);

  const headings = extractHeadings(post.content || '');

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-16">
      {/* ── Breadcrumb ── */}
      <div className="flex items-center gap-2 text-sm text-zinc-400 mb-10">
        <Link href="/" className="hover:text-emerald-600 transition-colors duration-200">Home</Link>
        <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
        {post.blogCategories && (
          <>
            <Link href={`/category/${post.blogCategories.slug}`} className="hover:text-emerald-600 transition-colors duration-200">{post.blogCategories.name}</Link>
            <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
          </>
        )}
        <span className="text-zinc-600 truncate max-w-[200px]">{post.title}</span>
      </div>

      <div className="grid lg:grid-cols-[1fr_220px] gap-12 lg:gap-16">
        {/* ── Article ── */}
        <article className="max-w-none">
          {/* Header */}
          <header className="mb-10">
            {post.blogCategories && (
              <Link href={`/category/${post.blogCategories.slug}`} className="inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-semibold text-white rounded-full tracking-wide mb-6" style={{ backgroundColor: post.blogCategories.color || '#059669' }}>
                {post.blogCategories.name}
              </Link>
            )}
            <h1 className="text-3xl md:text-4xl lg:text-[2.75rem] font-extrabold text-zinc-900 leading-[1.15] tracking-tight mb-5">
              {post.title}
            </h1>
            {post.subtitle && <p className="text-xl md:text-2xl text-zinc-500 leading-relaxed mb-8 font-light">{post.subtitle}</p>}
            {/* Author row */}
            <div className="flex items-center gap-4 py-4 border-y border-zinc-100">
              {post.authors && (
                <Link href={`/author/${post.authors.slug}`} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-sm font-bold flex-shrink-0 select-none">
                    {post.authors.avatarUrl ? <img src={post.authors.avatarUrl} alt={post.authors.name} className="w-full h-full rounded-full object-cover" /> : post.authors.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                  </div>
                  <div>
                    <span className="font-semibold text-zinc-900 text-sm block">{post.authors.name}</span>
                    {post.authors.role && <span className="text-xs text-zinc-400">{post.authors.role}</span>}
                  </div>
                </Link>
              )}
              <div className="flex items-center gap-2 text-sm text-zinc-400 ml-auto">
                {post.publishedAt && (
                  <time dateTime={post.publishedAt} className="flex items-center gap-1.5">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>
                    {new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </time>
                )}
                {post.readTime && (
                  <>
                    <span className="text-zinc-200">·</span>
                    <span className="flex items-center gap-1.5">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      {post.readTime}
                    </span>
                  </>
                )}
              </div>
            </div>
          </header>

          {/* ── Featured Image ── */}
          {post.featuredImage && (
            <div className="aspect-[16/9] rounded-2xl overflow-hidden bg-zinc-100 mb-12 shadow-sm">
              <img src={post.featuredImage} alt={post.title} className="w-full h-full object-cover" />
            </div>
          )}

          {/* ── Content ── */}
          <div className="article-content" dangerouslySetInnerHTML={{ __html: finalHtml }} />

          {/* ── Tags ── */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-12 pt-8 border-t border-zinc-100">
              <div className="flex flex-wrap gap-2">
                {post.tags.map(tag => (
                  <span key={tag} className="px-3.5 py-1.5 text-sm text-zinc-500 border border-zinc-200 rounded-full hover:border-emerald-400 hover:text-emerald-700 transition-colors duration-200 cursor-default">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* ── Author Bio Card ── */}
          {post.authors && (
            <div className="mt-12 p-6 md:p-8 bg-[#f5f5f0] rounded-2xl">
              <div className="flex flex-col sm:flex-row items-start gap-5">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-xl font-bold flex-shrink-0 select-none">
                  {post.authors.avatarUrl ? <img src={post.authors.avatarUrl} alt={post.authors.name} className="w-full h-full rounded-full object-cover" /> : post.authors.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                </div>
                <div className="flex-1">
                  <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-1">Written by</p>
                  <Link href={`/author/${post.authors.slug}`} className="text-lg font-bold text-zinc-900 hover:text-emerald-700 transition-colors duration-200">
                    {post.authors.name}
                  </Link>
                  {post.authors.role && <p className="text-sm text-zinc-500 mt-0.5">{post.authors.role}</p>}
                  {post.authors.bio && <p className="text-sm text-zinc-600 mt-3 leading-relaxed">{post.authors.bio}</p>}
                  {/* Social links as icon buttons */}
                  {(post.authors as any).socialLinks && (() => {
                    const sl = (post.authors as any).socialLinks;
                    return (
                      <div className="flex gap-2 mt-4">
                        {sl.twitter && (
                          <a href={sl.twitter} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white shadow-sm flex items-center justify-center text-zinc-400 hover:text-emerald-600 hover:shadow-md transition-all duration-200">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                          </a>
                        )}
                        {sl.linkedin && (
                          <a href={sl.linkedin} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white shadow-sm flex items-center justify-center text-zinc-400 hover:text-emerald-600 hover:shadow-md transition-all duration-200">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                          </a>
                        )}
                        {sl.github && (
                          <a href={sl.github} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white shadow-sm flex items-center justify-center text-zinc-400 hover:text-emerald-600 hover:shadow-md transition-all duration-200">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
                          </a>
                        )}
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>
          )}

          {/* ── Related Posts ── */}
          {related.length > 0 && (
            <div className="mt-16 pt-12 border-t border-zinc-100">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-1 h-6 rounded-full bg-emerald-500" />
                <h2 className="text-xl font-bold text-zinc-900">Related Posts</h2>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {related.map(r => <PostCard key={r.id} post={r} />)}
              </div>
            </div>
          )}
        </article>

        {/* ── TOC Sidebar ── */}
        {headings.length > 0 && (
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-4">On this page</h3>
              <nav className="space-y-0.5 max-h-[calc(100vh-120px)] overflow-y-auto">
                {headings.map(h => (
                  <a
                    key={h.id}
                    href={`#${h.id}`}
                    className="block text-sm text-zinc-500 hover:text-emerald-700 transition-colors duration-200 py-1.5 pl-3 border-l-2 border-transparent hover:border-emerald-400 line-clamp-2"
                  >
                    {h.text}
                  </a>
                ))}
              </nav>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}