export default function Footer() {
  return (
    <footer className="bg-zinc-50 border-t border-zinc-200 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-zinc-500">&copy; {new Date().getFullYear()} Intactic. All rights reserved.</p>
        <a href="https://intactic.net" className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors">intactic.net &rarr;</a>
      </div>
    </footer>
  );
}
