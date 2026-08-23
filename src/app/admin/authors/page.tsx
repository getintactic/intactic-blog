'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { authors } from '@/lib/admin/api';

export default function AuthorsListPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => { setLoading(true); try { setItems(await authors.getAll()); } catch {} setLoading(false); };
  useEffect(() => { load(); }, []);

  const handleDelete = async (id: string) => { if (!confirm('Delete this author?')) return; await authors.delete(id); load(); };

  return (
    <div>
      <div className='flex items-center justify-between mb-6'>
        <h1 className='text-2xl font-bold'>Authors</h1>
        <Link href='/admin/authors/new' className='inline-flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white rounded-lg text-sm font-medium hover:bg-zinc-800'>
          <Plus className='w-4 h-4' />New Author
        </Link>
      </div>
      {loading ? <div className='space-y-3'>{Array.from({ length: 3 }).map((_, i) => <div key={i} className='h-14 bg-zinc-200 rounded-lg animate-pulse' />)}</div> : items.length === 0 ? (
        <div className='text-center py-16 text-zinc-400'>No authors yet</div>
      ) : (
        <div className='bg-white rounded-xl border border-zinc-200 overflow-x-auto'>
          <table className='w-full'>
            <thead><tr className='border-b border-zinc-200 bg-zinc-50'>
              <th className='text-left text-xs font-semibold text-zinc-500 uppercase px-4 py-3'>Name</th>
              <th className='text-left text-xs font-semibold text-zinc-500 uppercase px-4 py-3 hidden sm:table-cell'>Email</th>
              <th className='text-left text-xs font-semibold text-zinc-500 uppercase px-4 py-3'>Active</th>
              <th className='text-right text-xs font-semibold text-zinc-500 uppercase px-4 py-3'>Actions</th>
            </tr></thead>
            <tbody>
              {items.map(a => (
                <tr key={a.id} className='border-b border-zinc-100 last:border-0 hover:bg-zinc-50'>
                  <td className='px-4 py-3 text-sm font-medium'>{a.name}</td>
                  <td className='px-4 py-3 text-sm text-zinc-500 hidden sm:table-cell'>{a.email}</td>
                  <td className='px-4 py-3'><span className={`text-xs px-2 py-1 rounded-full font-medium ${a.is_active ? 'bg-green-100 text-green-700' : 'bg-zinc-100 text-zinc-500'}`}>{a.is_active ? 'Active' : 'Inactive'}</span></td>
                  <td className='px-4 py-3 text-right'>
                    <div className='flex items-center justify-end gap-1'>
                      <Link href={`/admin/authors/${a.id}`} className='p-1.5 text-zinc-400 hover:text-zinc-900 rounded-lg hover:bg-zinc-100'><Pencil className='w-4 h-4' /></Link>
                      <button onClick={() => handleDelete(a.id)} className='p-1.5 text-zinc-400 hover:text-red-600 rounded-lg hover:bg-red-50'><Trash2 className='w-4 h-4' /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}