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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-12">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-zinc-400 mb-8">
        <Link href="/" className="hover:text-zinc-600">Home</Link>
        <span>/</span>
        {post.blogCategories && (
          <>
            <Link href={`/category/${post.blogCategories.slug}`} className="hover:text-zinc-600">{post.blogCategories.name}</Link>
            <span>/</span>
          </>
        )}
        <span className="text-zinc-600 truncate max-w-[200px]">{post.title}</span>
      </div>

      <div className="grid lg:grid-cols-[1fr_240px] gap-12">
        {/* Article */}
        <article className="max-w-none">
          {/* Header */}
          <header className="mb-10">
            {post.blogCategories && (
              <Link href={`/category/${post.blogCategories.slug}`} className="inline-block px-3 py-1 text-xs font-semibold text-white rounded-lg mb-4" style={{ backgroundColor: post.blogCategories.color || '#0a0a0a' }}>
                {post.blogCategories.name}
              </Link>
            )}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-zinc-900 leading-tight mb-4">{post.title}</h1>
            {post.subtitle && <p className="text-xl text-zinc-500 mb-6">{post.subtitle}</p>}
            <div className="flex items-center gap-4 text-sm text-zinc-500">
              {post.authors && (
                <Link href={`/author/${post.authors.slug}`} className="flex items-center gap-2 hover:text-zinc-900 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-zinc-200 flex items-center justify-center text-xs font-bold text-zinc-600">
                    {post.authors.avatarUrl ? <img src={post.authors.avatarUrl} alt={post.authors.name} className="w-full h-full rounded-full object-cover" /> : post.authors.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <span className="font-medium">{post.authors.name}</span>
                </Link>
              )}
              {post.authors?.role && <span>· {post.authors.role}</span>}
              {post.publishedAt && <span>· {new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>}
              {post.readTime && <span>· {post.readTime}</span>}
            </div>
          </header>

          {/* Featured Image */}
          {post.featuredImage && (
            <div className="aspect-[16/9] rounded-2xl overflow-hidden bg-zinc-100 mb-10">
              <img src={post.featuredImage} alt={post.title} className="w-full h-full object-cover" />
            </div>
          )}

          {/* Content */}
          <div className="article-content" dangerouslySetInnerHTML={{ __html: finalHtml }} />

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-10 pt-8 border-t border-zinc-200">
              <div className="flex flex-wrap gap-2">
                {post.tags.map(tag => (
                  <span key={tag} className="px-3 py-1 text-sm bg-zinc-100 text-zinc-600 rounded-full">{tag}</span>
                ))}
              </div>
            </div>
          )}

          {/* Author Bio */}
          {post.authors && (
            <div className="mt-10 p-6 bg-zinc-50 rounded-2xl border border-zinc-200">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-full bg-zinc-200 flex items-center justify-center text-lg font-bold text-zinc-600 flex-shrink-0">
                  {post.authors.avatarUrl ? <img src={post.authors.avatarUrl} alt={post.authors.name} className="w-full h-full rounded-full object-cover" /> : post.authors.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <Link href={`/author/${post.authors.slug}`} className="font-semibold text-zinc-900 hover:text-blue-600 transition-colors">{post.authors.name}</Link>
                  {post.authors.role && <p className="text-sm text-zinc-500">{post.authors.role}</p>}
                </div>
              </div>
            </div>
          )}

          {/* Related Posts */}
          {related.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold text-zinc-900 mb-6">Related Posts</h2>
              <div className="grid sm:grid-cols-3 gap-6">
                {related.map(r => <PostCard key={r.id} post={r} />)}
              </div>
            </div>
          )}
        </article>

        {/* TOC Sidebar */}
        {headings.length > 0 && (
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-4">On this page</h3>
              <nav className="space-y-1.5 max-h-[calc(100vh-120px)] overflow-y-auto">
                {headings.map(h => (
                  <a key={h.id} href={`#${h.id}`} className="block text-sm text-zinc-500 hover:text-zinc-900 transition-colors py-1 line-clamp-2">
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
