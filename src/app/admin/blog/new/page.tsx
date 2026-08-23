'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { blogPosts, authors, blogCategories } from '@/lib/admin/api';
import { BlogPostForm } from '@/components/admin/BlogPostForm';

export default function NewBlogPostPage() {
  const router = useRouter();
  const handleSubmit = async (data: any) => {
    await blogPosts.create(data);
    router.push('/admin/blog');
  };
  return (
    <div>
      <Link href='/admin/blog' className='inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-900 mb-6'><ArrowLeft className='w-4 h-4' />Back</Link>
      <h1 className='text-2xl font-bold mb-6'>Create Post</h1>
      <BlogPostForm initialData={null} mode='create' onSubmit={handleSubmit} />
    </div>
  );
}