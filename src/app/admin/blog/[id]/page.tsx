'use client';

import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { blogPosts } from '@/lib/admin/api';
import BlogPostForm from '@/components/admin/BlogPostForm';

export default function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    blogPosts.getById(id).then(setPost).finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async (data: any) => {
    await blogPosts.update(id, data);
    router.push('/admin/blog');
  };

  if (loading) return <div className='flex items-center justify-center py-20'><div className='w-8 h-8 border-2 border-zinc-300 border-t-zinc-900 rounded-full animate-spin' /></div>;
  if (!post) return <div className='text-center py-20 text-zinc-400'>Post not found</div>;

  return (
    <div>
      <Link href='/admin/blog' className='inline-flex items-center gap-1 text-sm text-zinc-500 hover:text-zinc-900 mb-6'><ArrowLeft className='w-4 h-4' />Back</Link>
      <h1 className='text-2xl font-bold mb-6'>Edit Post</h1>
      <BlogPostForm initialData={post} mode='edit' onSubmit={handleSubmit} />
    </div>
  );
}