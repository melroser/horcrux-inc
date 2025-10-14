'use client';

import { motion, useScroll, useTransform, useSpring, useReducedMotion } from 'framer-motion';
import { ExternalLink, Database, Zap, Shield, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { useRef } from 'react';

export default function HomePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const shouldReduce = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const { scrollYProgress: heroScrollProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  });

  // Smooth spring physics for all transforms
  const springConfig = { stiffness: 100, damping: 30, restDelta: 0.001 };

  // Progress bar
  const barWidth = useSpring(useTransform(scrollYProgress, [0, 1], ['0%', '100%']), springConfig);

  // Hero parallax with smooth spring
  const heroY = useSpring(
    useTransform(heroScrollProgress, [0, 1], [0, shouldReduce ? -50 : -200]),
    springConfig
  );
  const heroOpacity = useSpring(useTransform(heroScrollProgress, [0, 0.5, 1], [1, 0.8, 0.3]), springConfig);
  const heroScale = useSpring(
    useTransform(heroScrollProgress, [0, 1], [1, shouldReduce ? 0.98 : 0.92]),
    springConfig
  );
  const heroBlur = useSpring(
    useTransform(heroScrollProgress, [0, 1], [0, shouldReduce ? 0 : 8]),
    springConfig
  );

  // Glow intensity based on scroll
  const glowIntensity = useTransform(heroScrollProgress, [0, 0.3], [1, 0.3]);

  return (
    <div ref={containerRef} className="min-h-screen bg-black text-green-400 overflow-x-hidden relative">
      {/* Reading progress bar */}
      <motion.div
        aria-hidden="true"
        className="fixed top-0 left-0 h-[3px] bg-gradient-to-r from-green-600 via-green-400 to-green-600 z-[100] origin-left shadow-[0_0_20px_#22c55e]"
        style={{ width: barWidth }}
      />

      {/* Scanlines */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-900/5 to-transparent animate-pulse pointer-events-none" />

      {/* Grain overlay */}
      <div className="absolute inset-0 opacity-20 mix-blend-overlay pointer-events-none bg-noise" />

      {/* Radial gradient spotlight that follows scroll */}
      <motion.div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle 800px at 50% 20%, rgba(34, 197, 94, 0.08), transparent 80%)',
          opacity: glowIntensity,
        }}
      />

      <div className="relative z-10">
        {/* Header */}
        <motion.header
          className="border-b border-green-800/30 backdrop-blur-md sticky top-0 z-50 bg-black/40"
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
            <motion.div
              className="font-mono text-xl font-bold tracking-wider relative"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              whileHover={{ scale: 1.05 }}
            >
              HORCRUX●INC
              <motion.div
                className="absolute -inset-2 bg-green-500/10 blur-xl -z-10"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
            <motion.nav
              className="flex gap-6 text-sm font-mono"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/corpus"
                  className="hover:text-green-300 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500/60 relative group"
                >
                  Example Corpus
                  <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-green-400 group-hover:w-full transition-all duration-300" />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/docs"
                  className="hover:text-green-300 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500/60 relative group"
                >
                  Docs
                  <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-green-400 group-hover:w-full transition-all duration-300" />
                </Link>
              </motion.div>
            </motion.nav>
          </div>
        </motion.header>

        {/* Hero */}
        <motion.section
          ref={heroRef}
          className="max-w-6xl mx-auto px-6 py-20 min-h-screen flex items-center justify-center"
          style={{
              y: heroY,
              opacity: heroOpacity,
              scale: heroScale,
              ...(shouldReduce ? {} : { filter: heroBlur }),
          }}

        >
          <div className="text-center w-full">
            <motion.h1
              className="text-6xl md:text-8xl font-mono font-black mb-12 tracking-tighter relative inline-block"
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            >
              <motion.span
                className="relative z-10"
                animate={
                  shouldReduce
                    ? undefined
                    : {
                        textShadow: [
                          '0 0 20px #22c55e, 0 0 40px #22c55e',
                          '0 0 40px #22c55e, 0 0 80px #22c55e, 0 0 120px #22c55e',
                          '0 0 20px #22c55e, 0 0 40px #22c55e',
                        ],
                      }
                }
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              >
                HORCRUX
              </motion.span>
              <span className="text-xl md:text-2xl text-green-600 font-mono tracking-tighter align-top ml-1">
                .inc
              </span>
            </motion.h1>

            {/* Narrative text blocks with staggered scroll animations */}
            <motion.div
              className="text-2xl md:text-3xl mb-16 text-green-300/90 max-w-3xl mx-auto leading-relaxed font-light"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="inline-block"
              >
                Insist...
              </motion.span>{' '}
              <motion.span
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.7 }}
                className="inline-block"
              >
                On Your
              </motion.span>{' '}
              <motion.span
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.9 }}
                className="inline-block font-bold text-green-400"
              >
                Persistence
              </motion.span>
            </motion.div>

            <motion.div
              className="text-xl md:text-2xl mb-16 text-green-300/80 max-w-3xl mx-auto leading-relaxed space-y-2"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                Create a Memory that Persists across AI Tools,
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="pl-8"
              >
                Chats,
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 1.0 }}
                className="pl-16"
              >
                Agents,
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 1.2 }}
                className="pl-24"
              >
                Orchestrators.
              </motion.div>
            </motion.div>

            <motion.div
              className="text-xl md:text-2xl mb-16 text-green-300/80 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <motion.span
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="inline-block"
              >
                Build Your Context
              </motion.span>
              <br />
              <motion.span
                className="text-green-400 font-semibold text-2xl md:text-3xl inline-block"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.6, type: 'spring', stiffness: 200 }}
              >
                A living memory that YOU control.
              </motion.span>
            </motion.div>

            <motion.div
              className="text-xl md:text-2xl mb-16 text-green-300/80 max-w-3xl mx-auto leading-relaxed space-y-3"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <motion.div
                initial={{ opacity: 0, rotateX: 90 }}
                whileInView={{ opacity: 1, rotateX: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                style={{ transformPerspective: 1000 }}
              >
                One Big Corpus for Flexibility?
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.6 }}
                className="text-green-500 font-bold"
              >
                Or
              </motion.div>
              <motion.div
                initial={{ opacity: 0, rotateX: -90 }}
                whileInView={{ opacity: 1, rotateX: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.8 }}
                style={{ transformPerspective: 1000 }}
              >
                Fragment for Protection?
              </motion.div>
            </motion.div>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <motion.div
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              >
                <Link
                  href="/corpus"
                  className="group relative px-8 py-4 bg-green-600 hover:bg-green-500 text-black font-mono font-bold text-lg transition-all duration-200 border-2 border-green-400 hover:border-green-300 flex items-center gap-2 overflow-hidden"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '100%' }}
                    transition={{ duration: 0.6 }}
                  />
                  <span className="relative z-10">View Corpora Examples</span>
                  <ExternalLink className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform relative z-10" />
                  <motion.div
                    className="absolute inset-0 bg-green-400/20 blur-xl -z-10"
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileHover={{ opacity: 1, scale: 1.2 }}
                    transition={{ duration: 0.3 }}
                  />
                </Link>
              </motion.div>

              <motion.button
                className="relative px-8 py-4 border-2 border-green-600 hover:border-green-400 text-green-400 hover:text-green-300 font-mono font-bold text-lg transition-all duration-200 hover:bg-green-900/20 overflow-hidden group"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 400, damping: 17 }}
              >
                <motion.div
                  className="absolute inset-0 bg-green-500/10"
                  initial={{ scale: 0, opacity: 0 }}
                  whileHover={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.4 }}
                />
                <span className="relative z-10">Create Your Corpus</span>
                <motion.div
                  className="absolute inset-0 border-2 border-green-400/50 blur-md -z-10"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.button>
            </motion.div>

            {/* Scroll indicator */}
            <motion.div
              className="mt-20 flex flex-col items-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2, duration: 1 }}
            >
              <motion.p className="text-sm text-green-500/60 font-mono">Scroll to explore</motion.p>
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              >
                <ChevronDown className="w-6 h-6 text-green-500/70" />
              </motion.div>
            </motion.div>
          </div>
        </motion.section>

        {/* Features */}
        <section className="max-w-6xl mx-auto px-6 py-32 border-t border-green-800/30 relative">
          {/* Decorative line */}
          <motion.div
            className="absolute left-1/2 top-0 w-px h-32 bg-gradient-to-b from-green-500/50 to-transparent"
            initial={{ scaleY: 0 }}
            whileInView={{ scaleY: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          />

          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8 }}
          >
            <motion.h2
              className="text-4xl md:text-6xl font-mono font-bold mb-6 text-green-400 relative inline-block"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              How It Works
              <motion.div
                className="absolute -inset-4 bg-green-500/5 blur-2xl -z-10"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.4 }}
              />
            </motion.h2>
            <motion.p
              className="text-xl text-green-300/70 max-w-2xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Three core principles that make your AI interactions truly persistent
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Database,
                title: 'Persistent Memory',
                desc: 'Version-controlled JSON corpus of your professional context',
              },
              {
                icon: Zap,
                title: 'MCP Integration',
                desc: 'Native Model Context Protocol support for agent connectivity',
              },
              {
                icon: Shield,
                title: 'Privacy Layers',
                desc: 'Public showcase + private authenticated endpoints',
              },
            ].map((feature, i) => {
              const cardRef = useRef<HTMLDivElement>(null);
              const { scrollYProgress: cardProgress } = useScroll({
                target: cardRef,
                offset: ['start end', 'end start'],
              });

              const cardY = useTransform(cardProgress, [0, 0.5, 1], [50, 0, -50]);
              const cardRotate = useTransform(cardProgress, [0, 0.5, 1], [-2, 0, 2]);

              return (
                <motion.div
                  key={feature.title}
                  ref={cardRef}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.6, delay: i * 0.2 }}
                  style={shouldReduce ? {} : { y: cardY, rotateX: cardRotate }}
                  whileHover={{
                    scale: 1.03,
                    borderColor: 'rgb(34 197 94 / 0.6)',
                    transition: { duration: 0.3, type: 'spring', stiffness: 300 },
                  }}
                  className="relative border border-green-800/30 p-8 transition-colors group cursor-pointer bg-black/40 backdrop-blur-sm overflow-hidden"
                >
                  {/* Animated gradient background on hover */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    initial={false}
                  />

                  {/* Corner accents */}
                  <motion.div
                    className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-green-500/0 group-hover:border-green-500/60 transition-colors duration-300"
                    initial={false}
                  />
                  <motion.div
                    className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-green-500/0 group-hover:border-green-500/60 transition-colors duration-300"
                    initial={false}
                  />

                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    whileInView={{ scale: 1, rotate: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.6,
                      delay: i * 0.2 + 0.3,
                      type: 'spring',
                      stiffness: 200,
                    }}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="relative z-10"
                  >
                    <feature.icon className="w-10 h-10 mb-6 text-green-500 group-hover:text-green-400 transition-colors drop-shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                  </motion.div>

                  <motion.h3
                    className="text-2xl font-mono font-bold mb-3 relative z-10"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.2 + 0.4 }}
                  >
                    {feature.title}
                  </motion.h3>

                  <motion.p
                    className="text-green-300/70 leading-relaxed relative z-10"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.2 + 0.5 }}
                  >
                    {feature.desc}
                  </motion.p>

                  {/* Glow effect on hover */}
                  <motion.div
                    className="absolute inset-0 bg-green-500/10 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"
                    initial={false}
                  />
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Footer */}
        <motion.footer
          className="border-t border-green-800/30 mt-32 relative overflow-hidden"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8 }}
        >
          {/* Animated grid background */}
          <div className="absolute inset-0 opacity-10">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `linear-gradient(#22c55e 1px, transparent 1px), linear-gradient(90deg, #22c55e 1px, transparent 1px)`,
                backgroundSize: '50px 50px',
              }}
            />
          </div>

          <motion.div
            className="max-w-6xl mx-auto px-6 py-12 text-center text-green-500/60 font-mono text-lg relative z-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Made by{' '}
            <motion.a
              href="https://devs.miami"
              className="text-green-400 hover:text-green-300 text-lg transition-colors relative inline-block group"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Devs in Miami
              <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-green-400 group-hover:w-full transition-all duration-300" />
            </motion.a>
          </motion.div>

          <motion.div
            className="max-w-6xl mx-auto px-6 pb-12 text-center text-green-500/60 font-mono text-sm relative z-10"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Ⓒ Devs Miami LLC 2025 All Rights Reserved.
          </motion.div>
        </motion.footer>
      </div>
    </div>
  );
}
//
//
//
//'use client'
//
//import { motion, useScroll, useTransform } from 'framer-motion'
//import { ExternalLink, Database, Zap, Shield } from 'lucide-react'
//import Link from 'next/link'
//import { useRef } from 'react'
//
//export default function HomePage() {
//  const containerRef = useRef<HTMLDivElement>(null)
//  const { scrollYProgress } = useScroll({
//    target: containerRef,
//    offset: ["start start", "end end"]
//  })
//
//  // Parallax transforms
//  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -100])
//  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.3])
//
//  return (
//    <div ref={containerRef} className="min-h-screen bg-black text-green-400 overflow-hidden relative">
//      {/* Scanlines */}
//      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-900/5 to-transparent animate-pulse pointer-events-none" />
//
//      {/* Grain overlay */}
//      <div className="absolute inset-0 opacity-20 mix-blend-overlay pointer-events-none bg-noise" />
//
//      <div className="relative z-10">
//        {/* Header */}
//        <header className="border-b border-green-800/30 backdrop-blur-sm sticky top-0 z-50">
//          <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
//            <motion.div
//              className="font-mono text-xl font-bold tracking-wider"
//              initial={{ opacity: 0, x: -20 }}
//              animate={{ opacity: 1, x: 0 }}
//              transition={{ duration: 0.8 }}
//            >
//              HORCRUX●INC
//            </motion.div>
//            <motion.nav
//              className="flex gap-6 text-sm"
//              initial={{ opacity: 0, x: 20 }}
//              animate={{ opacity: 1, x: 0 }}
//              transition={{ duration: 0.8, delay: 0.2 }}
//            >
//              <Link href="/corpus" className="hover:text-green-300 transition-colors">
//                Example Corpus
//              </Link>
//              <Link href="/docs" className="hover:text-green-300 transition-colors">
//                Docs
//              </Link>
//            </motion.nav>
//          </div>
//        </header>
//
//        {/* Hero */}
//        <motion.section
//          className="max-w-6xl mx-auto px-6 py-20 min-h-screen flex items-center"
//          style={{ y: heroY, opacity: heroOpacity }}
//        >
//          <div className="text-center w-full">
//            <motion.h1
//              className="text-6xl md:text-8xl font-mono font-black mb-8 tracking-tighter"
//              initial={{ opacity: 0, y: 50 }}
//              animate={{ opacity: 1, y: 0 }}
//              transition={{ duration: 1, ease: "easeOut" }}
//            >
//              HORCRUX<span className="text-xl md:text-2xl text-green-600 font-mono tracking-tighter">.inc</span>
//            </motion.h1>
//
//            {/* Narrative text blocks with staggered scroll animations */}
//            <motion.div
//              className="text-xl md:text-2xl mb-12 text-green-300/80 max-w-3xl mx-auto leading-relaxed"
//              initial={{ opacity: 0, y: 30 }}
//              whileInView={{ opacity: 1, y: 0 }}
//              viewport={{ once: true, margin: "-100px" }}
//              transition={{ duration: 0.8, delay: 0.2 }}
//            >
//              <motion.span
//                initial={{ opacity: 0 }}
//                whileInView={{ opacity: 1 }}
//                viewport={{ once: true }}
//                transition={{ duration: 0.6, delay: 0.5 }}
//              >
//                Insist... On Your Persistence
//              </motion.span>
//            </motion.div>
//
//            <motion.div
//              className="text-xl md:text-2xl mb-12 text-green-300/80 max-w-3xl mx-auto leading-relaxed"
//              initial={{ opacity: 0, y: 30 }}
//              whileInView={{ opacity: 1, y: 0 }}
//              viewport={{ once: true, margin: "-50px" }}
//              transition={{ duration: 0.8, delay: 0.3 }}
//            >
//              <motion.div
//                initial={{ opacity: 0 }}
//                whileInView={{ opacity: 1 }}
//                viewport={{ once: true }}
//                transition={{ duration: 0.6, delay: 0.6 }}
//              >
//                Create a Memory that Persists across AI Tools,
//                <br />
//                <motion.span
//                  initial={{ opacity: 0, x: -20 }}
//                  whileInView={{ opacity: 1, x: 0 }}
//                  viewport={{ once: true }}
//                  transition={{ duration: 0.5, delay: 0.8 }}
//                >
//                  Chats,
//                </motion.span>
//                <br />
//                <motion.span
//                  initial={{ opacity: 0, x: -20 }}
//                  whileInView={{ opacity: 1, x: 0 }}
//                  viewport={{ once: true }}
//                  transition={{ duration: 0.5, delay: 1.0 }}
//                >
//                  Agents,
//                </motion.span>
//                <br />
//                <motion.span
//                  initial={{ opacity: 0, x: -20 }}
//                  whileInView={{ opacity: 1, x: 0 }}
//                  viewport={{ once: true }}
//                  transition={{ duration: 0.5, delay: 1.2 }}
//                >
//                  Orchestrators.
//                </motion.span>
//              </motion.div>
//            </motion.div>
//
//            <motion.div
//              className="text-xl md:text-2xl mb-12 text-green-300/80 max-w-3xl mx-auto leading-relaxed"
//              initial={{ opacity: 0, y: 30 }}
//              whileInView={{ opacity: 1, y: 0 }}
//              viewport={{ once: true, margin: "-50px" }}
//              transition={{ duration: 0.8, delay: 0.2 }}
//            >
//              <motion.span
//                initial={{ opacity: 0 }}
//                whileInView={{ opacity: 1 }}
//                viewport={{ once: true }}
//                transition={{ duration: 0.6, delay: 0.4 }}
//              >
//                Build Your Context
//              </motion.span>
//              <br />
//              <motion.span
//                className="text-green-500"
//                initial={{ opacity: 0, scale: 0.9 }}
//                whileInView={{ opacity: 1, scale: 1 }}
//                viewport={{ once: true }}
//                transition={{ duration: 0.6, delay: 0.6 }}
//              >
//                A living memory that YOU control.
//              </motion.span>
//            </motion.div>
//
//            <motion.div
//              className="text-xl md:text-2xl mb-12 text-green-300/80 max-w-3xl mx-auto leading-relaxed"
//              initial={{ opacity: 0, y: 30 }}
//              whileInView={{ opacity: 1, y: 0 }}
//              viewport={{ once: true, margin: "-50px" }}
//              transition={{ duration: 0.8, delay: 0.2 }}
//            >
//              <motion.span
//                initial={{ opacity: 0 }}
//                whileInView={{ opacity: 1 }}
//                viewport={{ once: true }}
//                transition={{ duration: 0.6, delay: 0.4 }}
//              >
//                One Big Corpus for Flexibility?
//              </motion.span>
//              <br />
//              <motion.span
//                initial={{ opacity: 0 }}
//                whileInView={{ opacity: 1 }}
//                viewport={{ once: true }}
//                transition={{ duration: 0.6, delay: 0.6 }}
//              >
//                Or
//              </motion.span>
//              <br />
//              <motion.span
//                initial={{ opacity: 0 }}
//                whileInView={{ opacity: 1 }}
//                viewport={{ once: true }}
//                transition={{ duration: 0.6, delay: 0.8 }}
//              >
//                Fragment for Protection?
//              </motion.span>
//            </motion.div>
//
//            <motion.div
//              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
//              initial={{ opacity: 0, y: 30 }}
//              whileInView={{ opacity: 1, y: 0 }}
//              viewport={{ once: true, margin: "-50px" }}
//              transition={{ duration: 0.8, delay: 0.4 }}
//            >
//              <motion.div
//                whileHover={{ scale: 1.05 }}
//                whileTap={{ scale: 0.95 }}
//              >
//                <Link
//                  href="/corpus"
//                  className="group px-8 py-4 bg-green-600 hover:bg-green-500 text-black font-mono font-bold text-lg transition-all duration-200 border-2 border-green-400 hover:border-green-300 flex items-center gap-2"
//                >
//                  View Corpora Examples
//                  <ExternalLink className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
//                </Link>
//              </motion.div>
//
//              <motion.button
//                className="px-8 py-4 border-2 border-green-600 hover:border-green-400 text-green-400 hover:text-green-300 font-mono font-bold text-lg transition-all duration-200 hover:bg-green-900/20"
//                whileHover={{ scale: 1.05 }}
//                whileTap={{ scale: 0.95 }}
//              >
//                Create Your Corpus
//              </motion.button>
//            </motion.div>
//          </div>
//        </motion.section>
//
//        {/* Features */}
//        <section className="max-w-6xl mx-auto px-6 py-20 border-t border-green-800/30">
//          <motion.div
//            className="text-center mb-16"
//            initial={{ opacity: 0, y: 30 }}
//            whileInView={{ opacity: 1, y: 0 }}
//            viewport={{ once: true, margin: "-100px" }}
//            transition={{ duration: 0.8 }}
//          >
//            <h2 className="text-4xl md:text-5xl font-mono font-bold mb-4 text-green-400">
//              How It Works
//            </h2>
//            <p className="text-xl text-green-300/70 max-w-2xl mx-auto">
//              Three core principles that make your AI interactions truly persistent
//            </p>
//          </motion.div>
//
//          <div className="grid md:grid-cols-3 gap-8">
//            {[
//              {
//                icon: Database,
//                title: 'Persistent Memory',
//                desc: 'Version-controlled JSON corpus of your professional context'
//              },
//              {
//                icon: Zap,
//                title: 'MCP Integration',
//                desc: 'Native Model Context Protocol support for agent connectivity'
//              },
//              {
//                icon: Shield,
//                title: 'Privacy Layers',
//                desc: 'Public showcase + private authenticated endpoints'
//              }
//            ].map((feature, i) => (
//              <motion.div
//                key={feature.title}
//                initial={{ opacity: 0, y: 50 }}
//                whileInView={{ opacity: 1, y: 0 }}
//                viewport={{ once: true, margin: "-50px" }}
//                transition={{ duration: 0.6, delay: i * 0.2 }}
//                whileHover={{
//                  scale: 1.02,
//                  borderColor: 'rgb(34 197 94 / 0.5)',
//                  transition: { duration: 0.2 }
//                }}
//                className="border border-green-800/30 p-6 hover:border-green-600/50 transition-colors group cursor-pointer"
//              >
//                <motion.div
//                  initial={{ scale: 0 }}
//                  whileInView={{ scale: 1 }}
//                  viewport={{ once: true }}
//                  transition={{ duration: 0.5, delay: i * 0.2 + 0.3 }}
//                >
//                  <feature.icon className="w-8 h-8 mb-4 text-green-500 group-hover:text-green-400 transition-colors" />
//                </motion.div>
//                <motion.h3
//                  className="text-xl font-mono font-bold mb-2"
//                  initial={{ opacity: 0 }}
//                  whileInView={{ opacity: 1 }}
//                  viewport={{ once: true }}
//                  transition={{ duration: 0.5, delay: i * 0.2 + 0.4 }}
//                >
//                  {feature.title}
//                </motion.h3>
//                <motion.p
//                  className="text-green-300/70 leading-relaxed"
//                  initial={{ opacity: 0 }}
//                  whileInView={{ opacity: 1 }}
//                  viewport={{ once: true }}
//                  transition={{ duration: 0.5, delay: i * 0.2 + 0.5 }}
//                >
//                  {feature.desc}
//                </motion.p>
//              </motion.div>
//            ))}
//          </div>
//        </section>
//
//        {/* Footer */}
//        <motion.footer
//          className="border-t border-green-800/30 mt-20"
//          initial={{ opacity: 0 }}
//          whileInView={{ opacity: 1 }}
//          viewport={{ once: true, margin: "-100px" }}
//          transition={{ duration: 0.8 }}
//        >
//          <div className="max-w-6xl mx-auto px-6 py-8 text-center text-green-500/60 font-mono text-lg">
//            Made by <a href="https://devs.miami" className="text-green-400 hover:text-green-300 text-lg transition-colors"> Devs in Miami </a>
//          </div>
//          <div className="max-w-6xl mx-auto px-6 py-8 text-center text-green-500/60 font-mono text-sm">
//            Ⓒ Devs Miami LLC 2025 All Rights Reserved.
//          </div>
//        </motion.footer>
//      </div>
//    </div>
//  )
//}
