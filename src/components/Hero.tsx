'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Hero() {
  return (
    <section className="relative w-full min-h-[92vh] flex flex-col md:flex-row items-center justify-between px-6 md:px-12 lg:px-24 overflow-hidden pt-24 pb-16">
      {/* Ambient orbs */}
      <div className="ambient-orb top-[-10%] left-[10%] w-[500px] h-[500px] bg-[#5B7CFF]/20 opacity-60" />
      <div className="ambient-orb bottom-[-5%] right-[5%] w-[400px] h-[400px] bg-[#E8B86D]/15 opacity-50" />
      <div className="ambient-orb top-[40%] right-[30%] w-[300px] h-[300px] bg-[#5B7CFF]/10 opacity-40" />

      {/* Chart visual */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="w-full md:w-1/2 flex justify-center md:justify-start mb-14 md:mb-0 relative z-10"
      >
        <div className="relative w-full max-w-[460px] aspect-square">
          <div className="absolute inset-0 rounded-full glass-card depth-3 flex items-center justify-center p-3">
            <div className="w-full h-full rounded-full border border-white/10 animate-[spin_70s_linear_infinite] relative">
              <div className="absolute w-2.5 h-2.5 rounded-full bg-[#E8B86D] shadow-[0_0_14px_#E8B86D] top-0 left-1/2 -translate-x-1/2" />
              <div className="absolute w-2 h-2 rounded-full bg-[#5B7CFF] shadow-[0_0_12px_#5B7CFF] bottom-[15%] right-[8%]" />
            </div>
            <div className="absolute inset-[12%] rounded-full border border-white/8 animate-[spin_45s_linear_infinite_reverse]">
              <div className="absolute w-1.5 h-1.5 rounded-full bg-white/80 shadow-[0_0_8px_white] top-1/2 left-0 -translate-y-1/2" />
            </div>
            <div className="absolute inset-[22%] rounded-full glass-strong flex items-center justify-center">
              <span className="font-serif text-2xl tracking-[0.25em] text-[#E8B86D] uppercase font-light">
                VedAI
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Copy */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
        className="w-full md:w-1/2 flex flex-col items-start text-left z-10"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs tracking-wide text-white/70 mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-[#5B7CFF] animate-pulse" />
          AI-Native · Swiss Ephemeris · 8 Providers
        </div>

        <h1 className="font-serif text-5xl md:text-6xl lg:text-[4.25rem] font-semibold leading-[1.08] mb-6 tracking-tight">
          Instant Vedic Astrology,{' '}
          <span className="text-gradient-blue">Powered by AI.</span>
        </h1>

        <p className="text-lg md:text-xl text-white/60 font-light mb-10 max-w-lg leading-relaxed">
          Generate your birth chart in under 10 seconds. Precise calculations, plain-language insights, never-crash AI brain.
        </p>

        <div className="flex flex-wrap items-center gap-4">
          <Link href="/onboarding">
            <button className="btn-press bg-[#5B7CFF] hover:bg-[#4A6AF0] text-white px-8 py-4 rounded-2xl font-medium text-[15px] shadow-[0_0_28px_rgba(91,124,255,0.35)] transition-colors">
              Generate your chart free
            </button>
          </Link>
          <Link href="/panchang">
            <button className="btn-press glass-card glass-card-hover px-6 py-4 rounded-2xl font-medium text-[15px] text-white/80 hover:text-white">
              See Panchang →
            </button>
          </Link>
        </div>
      </motion.div>
    </section>
  );
}
