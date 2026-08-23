'use client';

import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { blogCategories } from '@/lib/admin/api';

export default function CategoriesPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<any>(null);
  const [showNew, setShowNew] = useState(false);

  const load = async () => { setLoading(true); try { setItems(await blogCategories.getAll()); } catch {} setLoading(false); };
  useEffect(() => { load(); }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const data = {
      name: (form.elements.namedItem('name') as HTMLInputElement).value,
      slug: (form.elements.namedItem('slug') as HTMLInputElement).value,
      description: (form.elements.namedItem('description') as HTMLTextAreaElement).value,
      color: (form.elements.namedItem('color') as HTMLInputElement).value,
    };
    if (editing) await blogCategories.update(editing.id, data);
    else await blogCategories.create(data);
    setEditing(null); setShowNew(false); load();
  };

  const handleDelete = async (id: string) => { if (!confirm('Delete this category?')) return; await blogCategories.delete(id); load(); };

  return (
    <div>
      <div className='flex items-center justify-between mb-6'>
        <h1 className='text-2xl font-bold'>Categories</h1>
        <button onClick={() => setShowNew(true)} className='inline-flex items-center gap-2 px-4 py-2 bg-zinc-900 text-white rounded-lg text-sm font-medium hover:bg-zinc-800'>
          <Plus className='w-4 h-4' />New Category
        </button>
      </div>

      {(showNew || editing) && (
        <form onSubmit={handleSave} className='bg-white rounded-xl border border-zinc-200 p-6 mb-6 grid sm:grid-cols-2 gap-4'>
          <div><label className='block text-sm font-medium mb-1'>Name</label><input name='name' defaultValue={editing?.name || ''} required className='w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm' /></div>
          <div><label className='block text-sm font-medium mb-1'>Slug</label><input name='slug' defaultValue={editing?.slug || ''} required className='w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm' /></div>
          <div><label className='block text-sm font-medium mb-1'>Color</label><input name='color' type='color' defaultValue={editing?.color || '#0a0a0a'} className='w-full h-10 rounded-lg border border-zinc-300' /></div>
          <div><label className='block text-sm font-medium mb-1'>Description</label><textarea name='description' defaultValue={editing?.description || ''} rows={2} className='w-full px-3 py-2 border border-zinc-300 rounded-lg text-sm' /></div>
          <div className='sm:col-span-2 flex gap-2'>
            <button type='submit' className='px-4 py-2 bg-zinc-900 text-white rounded-lg text-sm font-medium hover:bg-zinc-800'>Save</button>
            <button type='button' onClick={() => { setEditing(null); setShowNew(false); }} className='px-4 py-2 border border-zinc-300 rounded-lg text-sm hover:bg-zinc-50'>Cancel</button>
          </div>
        </form>
      )}

      {loading ? <div className='space-y-3'>{Array.from({ length: 3 }).map((_, i) => <div key={i} className='h-12 bg-zinc-200 rounded-lg animate-pulse' />)}</div> : (
        <div className='bg-white rounded-xl border border-zinc-200 overflow-x-auto'>
          <table className='w-full'>
            <thead><tr className='border-b border-zinc-200 bg-zinc-50'>
              <th className='text-left text-xs font-semibold text-zinc-500 uppercase px-4 py-3'>Name</th>
              <th className='text-left text-xs font-semibold text-zinc-500 uppercase px-4 py-3'>Slug</th>
              <th className='text-left text-xs font-semibold text-zinc-500 uppercase px-4 py-3'>Color</th>
              <th className='text-right text-xs font-semibold text-zinc-500 uppercase px-4 py-3'>Actions</th>
            </tr></thead>
            <tbody>
              {items.map(c => (
                <tr key={c.id} className='border-b border-zinc-100 last:border-0 hover:bg-zinc-50'>
                  <td className='px-4 py-3 text-sm font-medium'>{c.name}</td>
                  <td className='px-4 py-3 text-sm text-zinc-500'>{c.slug}</td>
                  <td className='px-4 py-3'><div className='w-6 h-6 rounded' style={{ backgroundColor: c.color }} /></td>
                  <td className='px-4 py-3 text-right'>
                    <div className='flex items-center justify-end gap-1'>
                      <button onClick={() => setEditing(c)} className='p-1.5 text-zinc-400 hover:text-zinc-900 rounded-lg hover:bg-zinc-100'><Pencil className='w-4 h-4' /></button>
                      <button onClick={() => handleDelete(c.id)} className='p-1.5 text-zinc-400 hover:text-red-600 rounded-lg hover:bg-red-50'><Trash2 className='w-4 h-4' /></button>
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