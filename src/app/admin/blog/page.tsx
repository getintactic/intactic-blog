'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { blogPosts } from '@/lib/admin/api';
import { StatusBadge } from '@/components/admin/StatusBadge';

export default function BlogListPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try { setPosts(await blogPosts.getAll()); } catch {}
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this post?')) return;
    await blogPosts.delete(id);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Blog Posts</h1>
        <Link href="/admin/blog/new" className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white rounded-lg text-sm font-medium hover:bg-zinc-800">
          <Plus className="w-4 h-4" />New Post
        </Link>
      </div>
      {loading ? (
        <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-14 bg-zinc-200 rounded-lg animate-pulse" />)}</div>
      ) : posts.length === 0 ? (
        <div className="text-center py-16 text-zinc-400">No posts yet. Create your first post!</div>
      ) : (
        <div className="bg-white rounded-xl border border-zinc-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="border-b border-zinc-200 bg-zinc-50">
                <th className="text-left text-xs font-semibold text-zinc-500 uppercase px-4 py-3">Title</th>
                <th className="text-left text-xs font-semibold text-zinc-500 uppercase px-4 py-3 hidden sm:table-cell">Author</th>
                <th className="text-left text-xs font-semibold text-zinc-500 uppercase px-4 py-3">Status</th>
                <th className="text-right text-xs font-semibold text-zinc-500 uppercase px-4 py-3">Actions</th>
              </tr></thead>
              <tbody>
                {posts.map(post => (
                  <tr key={post.id} className="border-b border-zinc-100 last:border-0 hover:bg-zinc-50">
                    <td className="px-4 py-3"><p className="text-sm font-medium text-zinc-900 truncate max-w-[300px]">{post.title}</p></td>
                    <td className="px-4 py-3 hidden sm:table-cell text-sm text-zinc-500">{(post.authors as any)?.name || '-'}</td>
                    <td className="px-4 py-3"><StatusBadge status={post.status} variant={post.status === 'published' ? 'success' : post.status === 'draft' ? 'warning' : 'default'} /></td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link href={`/admin/blog/${post.id}`} className="p-1.5 text-zinc-400 hover:text-zinc-900 rounded-lg hover:bg-zinc-100"><Pencil className="w-4 h-4" /></Link>
                        <button onClick={() => handleDelete(post.id)} className="p-1.5 text-zinc-400 hover:text-red-600 rounded-lg hover:bg-red-50"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}