'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { authors } from '@/lib/admin/api';
import { AuthorForm } from '@/components/admin/AuthorForm';

export default function NewAuthorPage() {
  const router = useRouter();
  return (
    <div>
      <Link href='/admin/authors' className='inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-900 mb-6'><ArrowLeft className='w-4 h-4' />Back</Link>
      <h1 className='text-2xl font-bold mb-6'>Create Author</h1>
      <AuthorForm initialData={null} mode='create' onSubmit={async (data: any) => { await authors.create(data); router.push('/admin/authors'); }} />
    </div>
  );
}