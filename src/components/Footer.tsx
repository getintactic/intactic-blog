import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';

const LOGO_URL = 'https://res.cloudinary.com/dvykyd8el/image/upload/v1787611756/intactic_10_sro3ln.png';

const categoryLinks = [
  { label: 'Web Development', href: '/category/web-development' },
  { label: 'AI & Machine Learning', href: '/category/ai-ml' },
  { label: 'Cloud & DevOps', href: '/category/cloud-devops' },
  { label: 'Cybersecurity', href: '/category/cybersecurity' },
  { label: 'Software Architecture', href: '/category/software-architecture' },
];

const socialLinks = [
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com/company/intactic',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
    ),
  },
  {
    label: 'GitHub',
    href: 'https://github.com/intactic',
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
    ),
  },
];

export default function Footer() {
  return (
    <footer className="bg-zinc-950 text-zinc-400 mt-auto border-t border-white/5">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 pt-16 pb-8">
        {/* Top section: Brand + Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-5">
            <Link href="/" className="inline-flex items-center gap-2.5 mb-4 group">
              <img src={LOGO_URL} alt="Intactic" className="h-7 object-contain brightness-0 invert opacity-80 group-hover:opacity-100 transition-opacity" />
              <span className="text-base font-bold text-white">Insights</span>
            </Link>
            <p className="text-sm leading-relaxed text-zinc-500 max-w-sm mb-6">
              Deep dives into software engineering, AI, cloud infrastructure, and cybersecurity. Written by the engineers at Intactic.
            </p>
            {/* Social Links */}
            <div className="flex items-center gap-3">
              {socialLinks.map(link => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-zinc-500 hover:text-white transition-all duration-200"
                  aria-label={link.label}
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="lg:col-span-2">
            <h4 className="text-[11px] font-semibold text-zinc-500 uppercase tracking-widest mb-4">Navigation</h4>
            <ul className="space-y-3">
              <li><Link href="/" className="text-sm text-zinc-500 hover:text-white transition-colors duration-200">Home</Link></li>
              <li><Link href="/search" className="text-sm text-zinc-500 hover:text-white transition-colors duration-200">Search</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div className="lg:col-span-3">
            <h4 className="text-[11px] font-semibold text-zinc-500 uppercase tracking-widest mb-4">Categories</h4>
            <ul className="space-y-3">
              {categoryLinks.map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-zinc-500 hover:text-white transition-colors duration-200">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="lg:col-span-2">
            <h4 className="text-[11px] font-semibold text-zinc-500 uppercase tracking-widest mb-4">Company</h4>
            <ul className="space-y-3">
              <li>
                <a href="https://intactic.net" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-emerald-400 transition-colors duration-200 group">
                  intactic.net
                  <ArrowUpRight className="w-3 h-3 text-zinc-600 group-hover:text-emerald-500 transition-colors" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-14 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[12px] text-zinc-600">
            &copy; {new Date().getFullYear()} Intactic, Inc. All rights reserved.
          </p>
          <a
            href="https://intactic.net"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[12px] text-zinc-600 hover:text-emerald-400 transition-colors duration-200 inline-flex items-center gap-1.5 group"
          >
            Visit intactic.net
            <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </a>
        </div>
      </div>
    </footer>
  );
}
