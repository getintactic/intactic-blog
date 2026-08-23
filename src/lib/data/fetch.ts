import { createClient } from '@/utils/supabase/server';

function toCamelCase(obj: any): any {
  if (Array.isArray(obj)) return obj.map(toCamelCase);
  if (obj !== null && typeof obj === 'object') {
    const result: any = {};
    for (const [key, value] of Object.entries(obj)) {
      const camelKey = key.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
      result[camelKey] = toCamelCase(value);
    }
    return result;
  }
  return obj;
}

export interface PostWithRelations {
  id: string; slug: string; title: string; subtitle: string; excerpt: string;
  content: string; featuredImage: string; categoryId: string | null;
  authorId: string | null; status: string; readTime: string;
  isFeatured: boolean; isTrending: boolean; tags: string[];
  metaTitle: string; metaDescription: string; ogImage: string;
  publishedAt: string | null; createdAt: string; updatedAt: string;
  authors?: { name: string; slug: string; avatarUrl: string } | null;
  blogCategories?: { name: string; slug: string; color: string } | null;
}

export interface CategoryWithCount {
  id: string; slug: string; name: string; description: string; color: string;
  sortOrder: number; postCount: number;
}

export interface AuthorWithCount {
  id: string; slug: string; name: string; email: string; avatarUrl: string;
  bio: string; role: string; postCount: number;
}

const POSTS_SELECT = `*, authors(name, slug, avatar_url), blog_categories(name, slug, color)`;

export async function getPublishedPosts(limit = 12, offset = 0) {
  try {
    const supabase = await createClient();
    const [{ count }, { data: posts }] = await Promise.all([
      supabase.from('blog_posts').select('*', { count: 'exact', head: true })
        .eq('status', 'published').neq('published_at', null),
      supabase.from('blog_posts').select(POSTS_SELECT)
        .eq('status', 'published').neq('published_at', null)
        .order('published_at', { ascending: false })
        .range(offset, offset + limit - 1),
    ]);
    return { posts: (posts || []).map(toCamelCase), total: count || 0 };
  } catch { return { posts: [], total: 0 }; }
}

export async function getPostBySlug(slug: string) {
  try {
    const supabase = await createClient();
    const { data } = await supabase.from('blog_posts').select(POSTS_SELECT)
      .eq('slug', slug).eq('status', 'published').single();
    return data ? toCamelCase(data) : null;
  } catch { return null; }
}

export async function getPostsByCategorySlug(categorySlug: string, limit = 12, offset = 0) {
  try {
    const supabase = await createClient();
    const { data: cat } = await supabase.from('blog_categories').select('id').eq('slug', categorySlug).single();
    if (!cat) return { posts: [], total: 0 };
    const [{ count }, { data: posts }] = await Promise.all([
      supabase.from('blog_posts').select('*', { count: 'exact', head: true })
        .eq('status', 'published').eq('category_id', cat.id),
      supabase.from('blog_posts').select(POSTS_SELECT)
        .eq('status', 'published').eq('category_id', cat.id)
        .order('published_at', { ascending: false }).range(offset, offset + limit - 1),
    ]);
    return { posts: (posts || []).map(toCamelCase), total: count || 0 };
  } catch { return { posts: [], total: 0 }; }
}

export async function getPostsByAuthorSlug(authorSlug: string, limit = 12, offset = 0) {
  try {
    const supabase = await createClient();
    const { data: author } = await supabase.from('authors').select('id').eq('slug', authorSlug).single();
    if (!author) return { posts: [], total: 0 };
    const [{ count }, { data: posts }] = await Promise.all([
      supabase.from('blog_posts').select('*', { count: 'exact', head: true })
        .eq('status', 'published').eq('author_id', author.id),
      supabase.from('blog_posts').select(POSTS_SELECT)
        .eq('status', 'published').eq('author_id', author.id)
        .order('published_at', { ascending: false }).range(offset, offset + limit - 1),
    ]);
    return { posts: (posts || []).map(toCamelCase), total: count || 0 };
  } catch { return { posts: [], total: 0 }; }
}

export async function getFeaturedPosts(count = 3) {
  try {
    const supabase = await createClient();
    const { data } = await supabase.from('blog_posts').select(POSTS_SELECT)
      .eq('status', 'published').eq('is_featured', true)
      .order('published_at', { ascending: false }).limit(count);
    return (data || []).map(toCamelCase);
  } catch { return []; }
}

export async function getTrendingPosts(count = 5) {
  try {
    const supabase = await createClient();
    const { data } = await supabase.from('blog_posts').select(POSTS_SELECT)
      .eq('status', 'published').eq('is_trending', true)
      .order('published_at', { ascending: false }).limit(count);
    return (data || []).map(toCamelCase);
  } catch { return []; }
}

export async function getAllCategories(): Promise<CategoryWithCount[]> {
  try {
    const supabase = await createClient();
    const { data: categories } = await supabase.from('blog_categories')
      .select('*').order('sort_order', { ascending: true });
    if (!categories) return [];
    const { count: total } = await supabase.from('blog_posts')
      .select('*', { count: 'exact', head: true }).eq('status', 'published');
    const { data: postCounts } = await supabase.from('blog_posts')
      .select('category_id').eq('status', 'published');
    const countMap: Record<string, number> = {};
    (postCounts || []).forEach((p: any) => {
      if (p.category_id) countMap[p.category_id] = (countMap[p.category_id] || 0) + 1;
    });
    return categories.map((c: any) => toCamelCase({ ...c, postCount: countMap[c.id] || 0 }));
  } catch { return []; }
}

export async function getCategoryBySlug(slug: string) {
  try {
    const supabase = await createClient();
    const { data } = await supabase.from('blog_categories').select('*').eq('slug', slug).single();
    return data ? toCamelCase(data) : null;
  } catch { return null; }
}

export async function getAllAuthors(): Promise<AuthorWithCount[]> {
  try {
    const supabase = await createClient();
    const { data: authors } = await supabase.from('authors')
      .select('*').eq('is_active', true).order('name', { ascending: true });
    if (!authors) return [];
    const { data: postCounts } = await supabase.from('blog_posts')
      .select('author_id').eq('status', 'published');
    const countMap: Record<string, number> = {};
    (postCounts || []).forEach((p: any) => {
      if (p.author_id) countMap[p.author_id] = (countMap[p.author_id] || 0) + 1;
    });
    return authors.map((a: any) => toCamelCase({ ...a, postCount: countMap[a.id] || 0 }));
  } catch { return []; }
}

export async function getAuthorBySlug(slug: string) {
  try {
    const supabase = await createClient();
    const { data } = await supabase.from('authors').select('*').eq('slug', slug).eq('is_active', true).single();
    return data ? toCamelCase(data) : null;
  } catch { return null; }
}

export async function getRelatedPosts(postId: string, categoryId: string | null, limit = 3) {
  try {
    const supabase = await createClient();
    let query = supabase.from('blog_posts').select(POSTS_SELECT)
      .eq('status', 'published').neq('id', postId).order('published_at', { ascending: false });
    if (categoryId) query = query.eq('category_id', categoryId);
    const { data } = await query.limit(limit);
    return (data || []).map(toCamelCase);
  } catch { return []; }
}

export async function searchPosts(query: string, limit = 12) {
  try {
    const supabase = await createClient();
    const pattern = `%${query}%`;
    const { data } = await supabase.from('blog_posts').select(POSTS_SELECT)
      .eq('status', 'published')
      .or(`title.ilike.${pattern},excerpt.ilike.${pattern}`)
      .order('published_at', { ascending: false }).limit(limit);
    return (data || []).map(toCamelCase);
  } catch { return []; }
}
