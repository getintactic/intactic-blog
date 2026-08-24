import Link from 'next/link';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Search', href: '/search' },
];

const categoryLinks = [
  { label: 'Engineering', href: '/category/engineering' },
  { label: 'AI & ML', href: '/category/ai-ml' },
  { label: 'Cloud & DevOps', href: '/category/cloud-devops' },
  { label: 'Cybersecurity', href: '/category/cybersecurity' },
  { label: 'Product', href: '/category/product' },
];

const connectLinks = [
  { label: 'intactic.net', href: 'https://intactic.net', external: true },
  { label: 'LinkedIn', href: 'https://linkedin.com/company/intactic', external: true },
  { label: 'GitHub', href: 'https://github.com/intactic', external: true },
];

export default function Footer() {
  return (
    <footer className="bg-zinc-900 text-zinc-400 mt-auto">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 pt-16 pb-10">
        {/* 4-column grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Brand column */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <span className="text-base font-bold text-white">Intactic</span>{' '}
              <span className="text-base font-semibold text-emerald-400">Insights</span>
            </Link>
            <p className="text-sm leading-relaxed text-zinc-500 max-w-xs">
              Deep dives into software engineering, AI, cloud infrastructure, and cybersecurity. Written by the Intactic team.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-[11px] font-semibold text-zinc-500 uppercase tracking-widest mb-4">Navigation</h4>
            <ul className="space-y-2.5">
              {navLinks.map(link => (
                <li key={link.href}>
                  {link.external ? (
                    <a href={link.href} className="text-sm text-zinc-400 hover:text-white transition-colors duration-200">
                      {link.label}
                    </a>
                  ) : (
                    <Link href={link.href} className="text-sm text-zinc-400 hover:text-white transition-colors duration-200">
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-[11px] font-semibold text-zinc-500 uppercase tracking-widest mb-4">Categories</h4>
            <ul className="space-y-2.5">
              {categoryLinks.map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-zinc-400 hover:text-white transition-colors duration-200">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="text-[11px] font-semibold text-zinc-500 uppercase tracking-widest mb-4">Connect</h4>
            <ul className="space-y-2.5">
              {connectLinks.map(link => (
                <li key={link.href}>
                  <a href={link.href} target="_blank" rel="noopener noreferrer" className="text-sm text-zinc-400 hover:text-white transition-colors duration-200">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-12 pt-6 border-t border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-zinc-600">
            &copy; {new Date().getFullYear()} Intactic, Inc. All rights reserved.
          </p>
          <a
            href="https://intactic.net"
            className="text-xs text-zinc-600 hover:text-emerald-400 transition-colors duration-200 inline-flex items-center gap-1.5 group"
          >
            Visit intactic.net
            <svg className="w-3 h-3 transition-transform duration-200 group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}
