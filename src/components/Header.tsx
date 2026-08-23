'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Search, ChevronDown } from 'lucide-react';

interface Category { id: string; slug: string; name: string; postCount: number; }
interface Author { id: string; slug: string; name: string; postCount: number; }

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);

  useEffect(() => {
    Promise.all([
      fetch('/api/public/categories').then(r => r.json()).then(d => d.data || []),
      fetch('/api/public/authors').then(r => r.json()).then(d => d.data || []),
    ]).then(([cats, auths]) => { setCategories(cats); setAuthors(auths); });
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-zinc-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold tracking-tight">
          Intactic <span className="text-zinc-400">Insights</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          <Link href="/" className="px-3 py-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 rounded-lg hover:bg-zinc-100 transition-colors">Home</Link>

          <div className="relative" onMouseEnter={() => setCatOpen(true)} onMouseLeave={() => setCatOpen(false)}>
            <button className="px-3 py-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 rounded-lg hover:bg-zinc-100 transition-colors flex items-center gap-1">
              Categories <ChevronDown className="w-3.5 h-3.5" />
            </button>
            {catOpen && categories.length > 0 && (
              <div className="absolute top-full left-0 mt-1 w-56 bg-white border border-zinc-200 rounded-xl shadow-lg py-2">
                {categories.map(c => (
                  <Link key={c.id} href={`/category/${c.slug}`} className="block px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900">
                    {c.name} <span className="text-zinc-400 ml-1">({c.postCount})</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="relative" onMouseEnter={() => setAuthOpen(true)} onMouseLeave={() => setAuthOpen(false)}>
            <button className="px-3 py-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 rounded-lg hover:bg-zinc-100 transition-colors flex items-center gap-1">
              Authors <ChevronDown className="w-3.5 h-3.5" />
            </button>
            {authOpen && authors.length > 0 && (
              <div className="absolute top-full left-0 mt-1 w-56 bg-white border border-zinc-200 rounded-xl shadow-lg py-2">
                {authors.map(a => (
                  <Link key={a.id} href={`/author/${a.slug}`} className="block px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900">
                    {a.name} <span className="text-zinc-400 ml-1">({a.postCount})</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <Link href="/search" className="px-3 py-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 rounded-lg hover:bg-zinc-100 transition-colors flex items-center gap-1">
            <Search className="w-4 h-4" />
          </Link>
        </nav>

        <button className="md:hidden p-2 text-zinc-600" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-zinc-200 bg-white">
          <div className="max-w-6xl mx-auto px-4 py-4 space-y-1">
            <Link href="/" className="block px-3 py-2 text-sm font-medium rounded-lg hover:bg-zinc-100" onClick={() => setMobileOpen(false)}>Home</Link>
            <Link href="/search" className="block px-3 py-2 text-sm font-medium rounded-lg hover:bg-zinc-100" onClick={() => setMobileOpen(false)}>Search</Link>
            {categories.length > 0 && (
              <>
                <div className="px-3 pt-3 pb-1 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Categories</div>
                {categories.map(c => (
                  <Link key={c.id} href={`/category/${c.slug}`} className="block px-3 py-2 text-sm rounded-lg hover:bg-zinc-100" onClick={() => setMobileOpen(false)}>
                    {c.name}
                  </Link>
                ))}
              </>
            )}
            {authors.length > 0 && (
              <>
                <div className="px-3 pt-3 pb-1 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Authors</div>
                {authors.map(a => (
                  <Link key={a.id} href={`/author/${a.slug}`} className="block px-3 py-2 text-sm rounded-lg hover:bg-zinc-100" onClick={() => setMobileOpen(false)}>
                    {a.name}
                  </Link>
                ))}
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
