import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q') || '';
  if (!q.trim()) return NextResponse.json({ data: [] });
  try {
    const supabase = await createClient();
    const pattern = `%${q}%`;
    const { data } = await supabase.from('blog_posts')
      .select('*, authors(name, slug, avatar_url), blog_categories(name, slug, color)')
      .eq('status', 'published')
      .or(`title.ilike.${pattern},excerpt.ilike.${pattern}`)
      .order('published_at', { ascending: false }).limit(20);
    return NextResponse.json({ data: data || [] });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
