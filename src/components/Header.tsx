'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Search, ChevronDown } from 'lucide-react';

interface Category { id: string; slug: string; name: string; postCount: number; }
interface Author { id: string; slug: string; name: string; postCount: number; }

export default function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const catTimer = useRef<ReturnType<typeof setTimeout>>();
  const authTimer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    Promise.all([
      fetch('/api/public/categories').then(r => r.json()).then(d => d.data || []),
      fetch('/api/public/authors').then(r => r.json()).then(d => d.data || []),
    ]).then(([cats, auths]) => { setCategories(cats); setAuthors(auths); });
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Close mobile panel on escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    if (mobileOpen) document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [mobileOpen]);

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-zinc-200/60">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-baseline gap-0.5 tracking-tight select-none">
          <span className="text-lg font-bold text-zinc-900">Intactic</span>
          <span className="text-lg font-semibold text-emerald-600">Insights</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          <Link href="/" className={`nav-link px-3.5 py-2 text-[13.5px] font-medium ${pathname === '/' ? 'active' : ''}`}>
            Home
          </Link>

          {/* Categories Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => { clearTimeout(catTimer.current); setCatOpen(true); }}
            onMouseLeave={() => { catTimer.current = setTimeout(() => setCatOpen(false), 120); }}
          >
            <button className="nav-link px-3.5 py-2 text-[13.5px] font-medium flex items-center gap-1">
              Categories
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${catOpen ? 'rotate-180' : ''}`} />
            </button>
            {catOpen && categories.length > 0 && (
              <div className="dropdown-panel absolute top-full left-1/2 -translate-x-1/2 mt-2.5 w-60 py-2 z-50">
                {categories.map(c => (
                  <Link
                    key={c.id}
                    href={`/category/${c.slug}`}
                    className="flex items-center justify-between px-4 py-2.5 text-sm text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100/80 transition-colors"
                  >
                    <span>{c.name}</span>
                    <span className="text-[11px] font-medium text-zinc-400 tabular-nums">{c.postCount}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Authors Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => { clearTimeout(authTimer.current); setAuthOpen(true); }}
            onMouseLeave={() => { authTimer.current = setTimeout(() => setAuthOpen(false), 120); }}
          >
            <button className="nav-link px-3.5 py-2 text-[13.5px] font-medium flex items-center gap-1">
              Authors
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${authOpen ? 'rotate-180' : ''}`} />
            </button>
            {authOpen && authors.length > 0 && (
              <div className="dropdown-panel absolute top-full left-1/2 -translate-x-1/2 mt-2.5 w-60 py-2 z-50">
                {authors.map(a => (
                  <Link
                    key={a.id}
                    href={`/author/${a.slug}`}
                    className="flex items-center justify-between px-4 py-2.5 text-sm text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100/80 transition-colors"
                  >
                    <span>{a.name}</span>
                    <span className="text-[11px] font-medium text-zinc-400 tabular-nums">{a.postCount}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Search */}
          <Link href="/search" className="ml-1 p-2 rounded-full text-zinc-400 hover:text-zinc-900 hover:bg-zinc-100 transition-all duration-200">
            <Search className="w-[18px] h-[18px]" />
          </Link>
        </nav>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden p-2 -mr-2 rounded-lg text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Panel — Glassmorphism Slide-in */}
      {mobileOpen && (
        <div className="md:hidden mobile-panel border-t border-zinc-200/60">
          <div className="max-w-6xl mx-auto px-5 py-5 space-y-1">
            <Link
              href="/"
              className={`block px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                pathname === '/'
                  ? 'text-emerald-700 bg-emerald-50'
                  : 'text-zinc-700 hover:bg-zinc-100'
              }`}
              onClick={() => setMobileOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/search"
              className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-zinc-700 rounded-lg hover:bg-zinc-100 transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              <Search className="w-4 h-4 text-zinc-400" />
              Search
            </Link>

            {categories.length > 0 && (
              <>
                <div className="pt-4 pb-1.5 px-4">
                  <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-widest">Categories</span>
                </div>
                {categories.map(c => (
                  <Link
                    key={c.id}
                    href={`/category/${c.slug}`}
                    className="flex items-center justify-between px-4 py-2.5 text-sm text-zinc-600 rounded-lg hover:bg-zinc-100 transition-colors"
                    onClick={() => setMobileOpen(false)}
                  >
                    <span>{c.name}</span>
                    <span className="text-xs text-zinc-400 tabular-nums">{c.postCount}</span>
                  </Link>
                ))}
              </>
            )}

            {authors.length > 0 && (
              <>
                <div className="pt-4 pb-1.5 px-4">
                  <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-widest">Authors</span>
                </div>
                {authors.map(a => (
                  <Link
                    key={a.id}
                    href={`/author/${a.slug}`}
                    className="px-4 py-2.5 text-sm text-zinc-600 rounded-lg hover:bg-zinc-100 transition-colors"
                    onClick={() => setMobileOpen(false)}
                  >
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
