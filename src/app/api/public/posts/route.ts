import { NextRequest, NextResponse } from 'next/server';
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

const POSTS_SELECT = `*, authors(name, slug, avatar_url), blog_categories(name, slug, color)`;

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const limit = Math.min(parseInt(searchParams.get('limit') || '12'), 50);
  const offset = parseInt(searchParams.get('offset') || '0');
  const featured = searchParams.get('featured') === 'true';
  const trending = searchParams.get('trending') === 'true';

  try {
    const supabase = await createClient();

    let query = supabase
      .from('blog_posts')
      .select(POSTS_SELECT)
      .eq('status', 'published');

    if (featured) query = query.eq('is_featured', true);
    if (trending) query = query.eq('is_trending', true);

    // For featured/trending, no need for count — just return posts
    if (featured || trending) {
      const { data } = await query
        .order('published_at', { ascending: false })
        .limit(limit);
      return NextResponse.json({
        data: (data || []).map(toCamelCase),
        total: data?.length || 0,
      });
    }

    // For regular listing, fetch count + data in parallel
    const [{ count }, { data }] = await Promise.all([
      supabase
        .from('blog_posts')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'published')
        .neq('published_at', null),
      query
        .neq('published_at', null)
        .order('published_at', { ascending: false })
        .range(offset, offset + limit - 1),
    ]);

    return NextResponse.json({
      data: (data || []).map(toCamelCase),
      total: count || 0,
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
