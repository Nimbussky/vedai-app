import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-white/5 py-14 px-6 md:px-12 lg:px-24">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="text-center md:text-left">
          <span className="font-serif text-2xl font-semibold tracking-tight">VedAI</span>
          <p className="text-white/40 text-sm mt-2">Precision Vedic Astrology powered by AI.</p>
        </div>

        <div className="flex flex-wrap justify-center md:justify-end gap-x-8 gap-y-3 text-sm text-white/50">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <Link href="/panchang" className="hover:text-white transition-colors">Panchang</Link>
          <Link href="/compatibility" className="hover:text-white transition-colors">Compatibility</Link>
          <Link href="/about" className="hover:text-white transition-colors">About</Link>
          <Link href="/methodology" className="hover:text-white transition-colors">Methodology</Link>
          <a
            href="https://github.com/VedAstro/VedAstro"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#E8B86D] transition-colors"
          >
            Powered by VedAstro
          </a>
        </div>
      </div>
    </footer>
  );
}
