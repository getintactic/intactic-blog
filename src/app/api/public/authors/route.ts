import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data } = await supabase.from('authors').select('*').eq('is_active', true).order('name');
    const { data: postCounts } = await supabase.from('blog_posts').select('author_id').eq('status', 'published');
    const countMap: Record<string, number> = {};
    (postCounts || []).forEach((p: any) => {
      if (p.author_id) countMap[p.author_id] = (countMap[p.author_id] || 0) + 1;
    });
    const result = (data || []).map(a => ({ ...a, postCount: countMap[a.id] || 0 }));
    return NextResponse.json({ data: result });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
