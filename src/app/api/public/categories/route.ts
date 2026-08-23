import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data } = await supabase.from('blog_categories').select('*').order('sort_order', { ascending: true });
    const { data: postCounts } = await supabase.from('blog_posts').select('category_id').eq('status', 'published');
    const countMap: Record<string, number> = {};
    (postCounts || []).forEach((p: any) => {
      if (p.category_id) countMap[p.category_id] = (countMap[p.category_id] || 0) + 1;
    });
    const result = (data || []).map(c => ({ ...c, postCount: countMap[c.id] || 0 }));
    return NextResponse.json({ data: result });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
