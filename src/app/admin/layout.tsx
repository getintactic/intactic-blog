'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { LayoutDashboard, PenSquare, Users, Tag, LogOut, Menu, X } from 'lucide-react';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/blog', label: 'Blog Posts', icon: PenSquare },
  { href: '/admin/authors', label: 'Authors', icon: Users },
  { href: '/admin/categories', label: 'Categories', icon: Tag },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setUser(data.user);
      else router.push('/admin/login');
    });
  }, [router]);

  if (pathname === '/admin/login') return <>{children}</>;

  const signOut = async () => {
    await createClient().auth.signOut();
    router.push('/admin/login');
  };

  const pageTitle = navItems.find(n => pathname === n.href)?.label || 'Admin';

  return (
    <div className="min-h-screen bg-zinc-50 flex">
      {/* Mobile overlay */}
      {mobileOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setMobileOpen(false)} />}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-zinc-900 text-white flex flex-col transform ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform`}>
        <div className="p-6 border-b border-zinc-800">
          <h1 className="text-lg font-bold">Intactic Insights</h1>
          <p className="text-xs text-zinc-400">Admin Panel</p>
        </div>
        <nav className="flex-1 py-4 space-y-1 px-3">
          {navItems.map(item => {
            const Icon = item.icon;
            const active = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
            return (
              <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${active ? 'bg-white/10 text-white' : 'text-zinc-400 hover:text-white hover:bg-white/5'}`}>
                <Icon className="w-4 h-4" />{item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-zinc-800">
          {user && <p className="text-xs text-zinc-500 truncate mb-2">{user.email}</p>}
          <button onClick={signOut} className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors w-full px-3 py-2 rounded-lg hover:bg-white/5">
            <LogOut className="w-4 h-4" />Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-zinc-200 flex items-center px-4 lg:px-8 gap-4">
          <button className="lg:hidden p-2 text-zinc-600" onClick={() => setMobileOpen(true)}><Menu className="w-5 h-5" /></button>
          <h2 className="text-lg font-semibold text-zinc-900">{pageTitle}</h2>
        </header>
        <main className="flex-1 p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}