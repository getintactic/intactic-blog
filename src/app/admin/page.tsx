import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';

export default async function AdminDashboard() {
  const supabase = await createClient();
  const [posts, authors, cats] = await Promise.all([
    supabase.from('blog_posts').select('*', { count: 'exact', head: true }),
    supabase.from('authors').select('*', { count: 'exact', head: true }),
    supabase.from('blog_categories').select('*', { count: 'exact', head: true }),
  ]);

  const [{ count: postCount }, { count: authorCount }, { count: catCount }] = [posts, authors, cats];
  const { data: recentPosts } = await supabase.from('blog_posts').select('id, title, status, created_at, authors(name)').order('created_at', { ascending: false }).limit(5);

  const stats = [
    { label: 'Blog Posts', count: postCount || 0, href: '/admin/blog' },
    { label: 'Authors', count: authorCount || 0, href: '/admin/authors' },
    { label: 'Categories', count: catCount || 0, href: '/admin/categories' },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {stats.map(s => (
          <Link key={s.href} href={s.href} className="bg-white rounded-xl border border-zinc-200 p-6 hover:shadow-md transition-shadow">
            <p className="text-3xl font-bold text-zinc-900">{s.count}</p>
            <p className="text-sm text-zinc-500 mt-1">{s.label}</p>
          </Link>
        ))}
      </div>
      <div className="bg-white rounded-xl border border-zinc-200 p-6">
        <h3 className="font-semibold text-zinc-900 mb-4">Recent Posts</h3>
        <div className="space-y-3">
          {(recentPosts || []).map((p: any) => (
            <div key={p.id} className="flex items-center justify-between py-2 border-b border-zinc-100 last:border-0">
              <div>
                <p className="text-sm font-medium text-zinc-900">{p.title}</p>
                <p className="text-xs text-zinc-400">{(p.authors as any)?.name || 'Unknown'}</p>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${p.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{p.status}</span>
            </div>
          ))}
          {(recentPosts || []).length === 0 && <p className="text-sm text-zinc-400">No posts yet</p>}
        </div>
      </div>
    </div>
  );
}