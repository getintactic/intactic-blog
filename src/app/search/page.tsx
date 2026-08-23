'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, X } from 'lucide-react';
import PostCard from '@/components/PostCard';

function SearchContent() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get('q') || '';

  const doSearch = async (q: string) => {
    if (!q.trim()) { setResults([]); return; }
    setLoading(true);
    try {
      const res = await fetch(`/api/public/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      setResults(data.data || []);
    } catch { setResults([]); }
    setLoading(false);
  };

  useEffect(() => { if (initialQuery) { setQuery(initialQuery); doSearch(initialQuery); } }, [initialQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/search?q=${encodeURIComponent(query)}`);
    doSearch(query);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 md:py-12">
      <form onSubmit={handleSubmit} className="relative mb-10">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
        <input type="text" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search articles..." className="w-full pl-12 pr-12 py-4 text-lg border border-zinc-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white" />
        {query && (
          <button type="button" onClick={() => { setQuery(''); setResults([]); router.push('/search'); }} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600">
            <X className="w-5 h-5" />
          </button>
        )}
      </form>
      {loading && <p className="text-center text-zinc-400 py-10">Searching...</p>}
      {!loading && results.length > 0 && (
        <div>
          <p className="text-sm text-zinc-400 mb-6">{results.length} result{results.length !== 1 ? 's' : ''} found</p>
          <div className="grid sm:grid-cols-2 gap-6">{results.map((post: any) => <PostCard key={post.id} post={post} />)}</div>
        </div>
      )}
      {!loading && initialQuery && results.length === 0 && (
        <div className="text-center py-20 text-zinc-400">
          <p className="text-lg">No results found for &quot;{initialQuery}&quot;</p>
          <p className="text-sm mt-1">Try different keywords.</p>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center py-20"><div className="w-8 h-8 border-2 border-zinc-300 border-t-zinc-900 rounded-full animate-spin" /></div>}>
      <SearchContent />
    </Suspense>
  );
}
