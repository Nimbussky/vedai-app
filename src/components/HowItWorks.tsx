'use client';

import { motion } from 'framer-motion';
import { User, Sparkles, Map } from 'lucide-react';

const steps = [
  {
    icon: <User className="w-5 h-5 text-[#E8B86D]" />,
    title: '1. Enter birth details',
    description: 'Provide your exact time, date, and place of birth. We geocode the location automatically.',
  },
  {
    icon: <Map className="w-5 h-5 text-[#5B7CFF]" />,
    title: '2. Fetch precision chart',
    description: 'We query the VedAstro engine to construct your accurate D1 and divisional charts instantly.',
  },
  {
    icon: <Sparkles className="w-5 h-5 text-white" />,
    title: '3. AI reads your chart',
    description: 'Get plain-language interpretations for your dashas, transits, and planetary placements.',
  },
];

export default function HowItWorks() {
  return (
    <section className="relative py-28 px-6 md:px-12 lg:px-24 border-t border-white/5">
      <div className="max-w-6xl mx-auto">
        <div className="mb-16 md:text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-semibold mb-4 tracking-tight">
            How VedAI Works
          </h2>
          <p className="text-white/55 text-lg">
            Three simple steps to unlock ancient wisdom with modern technology.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-y-1/2 z-0" />

          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.5 }}
              className="glass-card glass-card-hover p-8 rounded-3xl z-10 relative"
            >
              <div className="w-11 h-11 rounded-2xl glass-strong flex items-center justify-center mb-6">
                {step.icon}
              </div>
              <h3 className="text-xl font-medium mb-3">{step.title}</h3>
              <p className="text-white/55 leading-relaxed text-[15px]">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
