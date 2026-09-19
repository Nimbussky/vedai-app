'use client';

import { motion } from 'framer-motion';
import { Compass, Heart, Calendar } from 'lucide-react';

export default function Features() {
  return (
    <section className="relative py-28 px-6 md:px-12 lg:px-24">
      <div className="max-w-6xl mx-auto">
        <div className="mb-16">
          <h2 className="font-serif text-3xl md:text-4xl font-semibold mb-4 tracking-tight">
            Insights that matter
          </h2>
          <p className="text-white/55 text-lg max-w-2xl leading-relaxed">
            Don&apos;t just look at a chart. Understand what it means for your life right now.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Feature 1 */}
          <motion.div
            whileHover={{ y: -6 }}
            transition={{ type: 'spring', stiffness: 300, damping: 24 }}
            className="col-span-1 lg:col-span-2 glass-card glass-card-hover p-8 rounded-3xl overflow-hidden relative group"
          >
            <div className="absolute top-0 right-0 w-72 h-72 bg-[#5B7CFF]/15 blur-[90px] rounded-full group-hover:bg-[#5B7CFF]/25 transition-colors" />
            <Compass className="w-8 h-8 text-[#5B7CFF] mb-6 relative z-10" />
            <h3 className="text-2xl font-medium mb-3 relative z-10">Understand your career timing</h3>
            <p className="text-white/60 max-w-md leading-relaxed relative z-10">
              Discover when favorable dashas align with key transits. VedAI highlights the optimal windows for job changes, promotions, and starting new ventures.
            </p>
          </motion.div>

          {/* Feature 2 */}
          <motion.div
            whileHover={{ y: -6 }}
            transition={{ type: 'spring', stiffness: 300, damping: 24 }}
            className="col-span-1 glass-card glass-card-hover p-8 rounded-3xl relative group"
          >
            <Heart className="w-8 h-8 text-[#E8B86D] mb-6" />
            <h3 className="text-2xl font-medium mb-3">Know your compatibility</h3>
            <p className="text-white/60 leading-relaxed">
              Run synastry charts instantly. Get an AI-narrated explanation of your relationship dynamics.
            </p>
          </motion.div>

          {/* Feature 3 */}
          <motion.div
            whileHover={{ y: -6 }}
            transition={{ type: 'spring', stiffness: 300, damping: 24 }}
            className="col-span-1 lg:col-span-3 glass-card glass-card-hover p-8 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-8"
          >
            <div className="max-w-lg">
              <Calendar className="w-8 h-8 text-white mb-6" />
              <h3 className="text-2xl font-medium mb-3">Daily Panchang</h3>
              <p className="text-white/60 leading-relaxed">
                Access today&apos;s Tithi, Nakshatra, Yoga, and Karana. Know the exact auspicious windows for important activities directly from the dashboard.
              </p>
            </div>
            <div className="w-full md:w-1/3 aspect-video glass rounded-2xl flex items-center justify-center overflow-hidden">
              <div className="grid grid-cols-4 gap-3 p-5">
                {['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'].map((s, i) => (
                  <span key={i} className="text-[#E8B86D]/70 text-lg text-center">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
