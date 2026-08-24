import Link from 'next/link';
import { Github, Linkedin, ArrowUpRight, Heart } from 'lucide-react';

const LOGO_URL = 'https://res.cloudinary.com/dvykyd8el/image/upload/v1787611756/intactic_10_sro3ln.png';

const categoryLinks = [
  { label: 'Web Development', href: '/category/web-development' },
  { label: 'AI & Machine Learning', href: '/category/ai-ml' },
  { label: 'Cloud & DevOps', href: '/category/cloud-devops' },
  { label: 'Cybersecurity', href: '/category/cybersecurity' },
  { label: 'Software Architecture', href: '/category/software-architecture' },
];

const socialLinks = [
  { label: 'LinkedIn', href: 'https://linkedin.com/company/intactic', icon: <Linkedin className="w-4 h-4" /> },
  { label: 'GitHub', href: 'https://github.com/intactic', icon: <Github className="w-4 h-4" /> },
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
          <p className="text-[12px] text-zinc-600 flex items-center gap-1.5">
            &copy; {new Date().getFullYear()} Intactic, Inc. Built with
            <Heart className="w-3 h-3 text-emerald-600" />
            by the Intactic team.
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
