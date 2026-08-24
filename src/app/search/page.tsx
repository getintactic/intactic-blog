'use client';

import { Suspense, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, X, FileText } from 'lucide-react';
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

  const showResults = initialQuery && !loading;
  const hasResults = results.length > 0;
  const noResults = initialQuery && !loading && !hasResults;

  return (
    <div className="max-w-2xl mx-auto px-5 sm:px-8 py-12 md:py-20">
      {/* Search input — centered, pill-shaped */}
      <div className="mb-14">
        <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 text-center mb-6 tracking-tight">
          Search articles
        </h1>
        <form onSubmit={handleSubmit} className="relative">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Type to search..."
            autoFocus
            className="w-full pl-13 pr-12 py-4 text-[15px] border border-zinc-200 rounded-full bg-white shadow-sm placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all duration-200"
            style={{ paddingLeft: '3.125rem' }}
          />
          {query && (
            <button
              type="button"
              onClick={() => { setQuery(''); setResults([]); router.push('/search'); }}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-0.5 rounded-full text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </form>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex items-center justify-center py-16">
          <div className="w-6 h-6 border-2 border-zinc-200 border-t-emerald-500 rounded-full animate-spin" />
        </div>
      )}

      {/* Results */}
      {showResults && hasResults && (
        <div>
          <p className="text-sm text-zinc-400 mb-8">
            {results.length} result{results.length !== 1 ? 's' : ''} found
          </p>
          <div className="grid sm:grid-cols-2 gap-5">
            {results.map((post: any) => <PostCard key={post.id} post={post} />)}
          </div>
        </div>
      )}

      {/* Empty state — no query yet */}
      {!initialQuery && !loading && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-14 h-14 rounded-2xl bg-zinc-100 flex items-center justify-center mb-5">
            <FileText className="w-6 h-6 text-zinc-300" />
          </div>
          <p className="text-sm text-zinc-400">Start typing to search across all articles</p>
        </div>
      )}

      {/* No results state */}
      {noResults && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-14 h-14 rounded-2xl bg-zinc-100 flex items-center justify-center mb-5">
            <Search className="w-6 h-6 text-zinc-300" />
          </div>
          <p className="text-base font-medium text-zinc-600 mb-1">
            No results for &quot;{initialQuery}&quot;
          </p>
          <p className="text-sm text-zinc-400">Try different keywords or check for typos.</p>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-zinc-200 border-t-emerald-500 rounded-full animate-spin" />
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
