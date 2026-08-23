'client';

import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { authors } from '@/lib/admin/api';
import AuthorForm from '@/components/admin/AuthorForm';

export default function EditAuthorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { authors.getById(id).then(setItem).finally(() => setLoading(false)); }, [id]);

  if (loading) return <div className='flex items-center justify-center py-20'><div className='w-8 h-8 border-2 border-zinc-300 border-t-zinc-900 rounded-full animate-spin' /></div>;
  if (!item) return <div className='text-center py-20 text-zinc-400'>Author not found</div>;

  return (
    <div>
      <Link href='/admin/authors' className='inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-900 mb-6'><ArrowLeft className='w-4 h-4' />Back</Link>
      <h1 className='text-2xl font-bold mb-6'>Edit Author</h1>
      <AuthorForm initialData={item} mode='edit' onSubmit={async (data: any) => { await authors.update(id, data); router.push('/admin/authors'); }} />
    </div>
  );
}