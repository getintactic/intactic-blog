'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Search, ChevronDown, ArrowRight, Rss, Zap } from 'lucide-react';

const LOGO_URL = 'https://res.cloudinary.com/dvykyd8el/image/upload/v1787611756/intactic_10_sro3ln.png';

interface Category { id: string; slug: string; name: string; postCount: number; }
interface Author { id: string; slug: string; name: string; postCount: number; }

export default function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
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

  // Scroll listener for header shrink
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    if (mobileOpen) document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [mobileOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled
        ? 'bg-white/90 backdrop-blur-2xl shadow-[0_1px_3px_rgba(0,0,0,0.06)]'
        : 'bg-white/70 backdrop-blur-xl'
    }`}>
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className={`flex items-center justify-between transition-all duration-300 ${scrolled ? 'h-14' : 'h-[72px]'}`}>
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group select-none">
            <img
              src={LOGO_URL}
              alt="Intactic"
              className={`object-contain transition-all duration-300 ${scrolled ? 'h-7' : 'h-9'}`}
            />
            <span className={`font-semibold text-zinc-900 tracking-tight transition-all duration-300 ${scrolled ? 'text-[15px]' : 'text-lg'}`}>
              Insights
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-0.5">
            <Link
              href="/"
              className={`nav-link px-3.5 py-2 text-[13.5px] font-medium rounded-lg transition-colors duration-200 ${
                pathname === '/' ? 'active text-zinc-900 bg-zinc-100/80' : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100/60'
              }`}
            >
              Home
            </Link>

            {/* Categories Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => { clearTimeout(catTimer.current); setCatOpen(true); }}
              onMouseLeave={() => { catTimer.current = setTimeout(() => setCatOpen(false), 150); }}
            >
              <button className={`px-3.5 py-2 text-[13.5px] font-medium flex items-center gap-1 rounded-lg transition-colors duration-200 ${
                pathname.startsWith('/category') ? 'text-zinc-900 bg-zinc-100/80' : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100/60'
              }`}>
                Categories
                <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${catOpen ? 'rotate-180' : ''}`} />
              </button>
              {catOpen && categories.length > 0 && (
                <div className="dropdown-panel absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 py-1.5 z-50">
                  {categories.slice(0, 8).map(c => (
                    <Link
                      key={c.id}
                      href={`/category/${c.slug}`}
                      className="flex items-center justify-between px-4 py-2.5 text-sm text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100/80 rounded-lg mx-1.5 w-[calc(100%-12px)] transition-colors"
                    >
                      <span className="font-medium">{c.name}</span>
                      <span className="text-[11px] font-medium text-zinc-400 bg-zinc-100 px-2 py-0.5 rounded-full tabular-nums">{c.postCount}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Authors Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => { clearTimeout(authTimer.current); setAuthOpen(true); }}
              onMouseLeave={() => { authTimer.current = setTimeout(() => setAuthOpen(false), 150); }}
            >
              <button className={`px-3.5 py-2 text-[13.5px] font-medium flex items-center gap-1 rounded-lg transition-colors duration-200 ${
                pathname.startsWith('/author') ? 'text-zinc-900 bg-zinc-100/80' : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100/60'
              }`}>
                Authors
                <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${authOpen ? 'rotate-180' : ''}`} />
              </button>
              {authOpen && authors.length > 0 && (
                <div className="dropdown-panel absolute top-full left-1/2 -translate-x-1/2 mt-2 w-56 py-1.5 z-50">
                  {authors.slice(0, 6).map(a => (
                    <Link
                      key={a.id}
                      href={`/author/${a.slug}`}
                      className="flex items-center justify-between px-4 py-2.5 text-sm text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100/80 rounded-lg mx-1.5 w-[calc(100%-12px)] transition-colors"
                    >
                      <span className="font-medium">{a.name}</span>
                      <span className="text-[11px] font-medium text-zinc-400 bg-zinc-100 px-2 py-0.5 rounded-full tabular-nums">{a.postCount}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-1.5">
            <Link
              href="/search"
              className="p-2 rounded-lg text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 transition-all duration-200"
              aria-label="Search"
            >
              <Search className="w-[18px] h-[18px]" />
            </Link>

            {/* CTA - Desktop only */}
            <Link
              href="https://intactic.net"
              target="_blank"
              className="hidden md:inline-flex items-center gap-1.5 px-4 py-2 text-[13px] font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors duration-200"
            >
              <Zap className="w-3.5 h-3.5" />
              Visit Intactic
            </Link>

            {/* Mobile Hamburger */}
            <button
              className="md:hidden p-2 -mr-2 rounded-lg text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100 transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Panel */}
      {mobileOpen && (
        <>
          {/* Backdrop */}
          <div
            className="md:hidden fixed inset-0 top-[72px] bg-black/20 backdrop-blur-sm z-40"
            onClick={() => setMobileOpen(false)}
          />
          <div className="md:hidden mobile-panel border-t border-zinc-200/60 relative z-50">
            <div className="max-w-6xl mx-auto px-5 py-5 space-y-1">
              <Link
                href="/"
                className={`block px-4 py-2.5 text-sm font-medium rounded-xl transition-colors ${
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
                className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-zinc-700 rounded-xl hover:bg-zinc-100 transition-colors"
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
                  {categories.slice(0, 6).map(c => (
                    <Link
                      key={c.id}
                      href={`/category/${c.slug}`}
                      className="flex items-center justify-between px-4 py-2.5 text-sm text-zinc-600 rounded-xl hover:bg-zinc-100 transition-colors"
                      onClick={() => setMobileOpen(false)}
                    >
                      <span>{c.name}</span>
                      <span className="text-xs text-zinc-400 tabular-nums bg-zinc-100 px-2 py-0.5 rounded-full">{c.postCount}</span>
                    </Link>
                  ))}
                </>
              )}

              {authors.length > 0 && (
                <>
                  <div className="pt-4 pb-1.5 px-4">
                    <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-widest">Authors</span>
                  </div>
                  {authors.slice(0, 4).map(a => (
                    <Link
                      key={a.id}
                      href={`/author/${a.slug}`}
                      className="px-4 py-2.5 text-sm text-zinc-600 rounded-xl hover:bg-zinc-100 transition-colors"
                      onClick={() => setMobileOpen(false)}
                    >
                      {a.name}
                    </Link>
                  ))}
                </>
              )}

              {/* Mobile CTA */}
              <div className="pt-5 px-4">
                <Link
                  href="https://intactic.net"
                  target="_blank"
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  Visit Intactic
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </header>
  );
}
