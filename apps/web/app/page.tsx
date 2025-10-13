'use client'

import { motion } from 'framer-motion'
import { ExternalLink, Database, Zap, Shield } from 'lucide-react'
import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-green-400 overflow-hidden relative">
      {/* Scanlines */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-900/5 to-transparent animate-pulse pointer-events-none" />
      
      {/* Grain overlay */}
      <div className="absolute inset-0 opacity-20 mix-blend-overlay pointer-events-none bg-noise" />

      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-green-800/30 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
            <motion.div 
              className="font-mono text-xl font-bold tracking-wider"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              HORCRUX
            </motion.div>
            <nav className="flex gap-6 text-sm">
              <Link href="/corpus" className="hover:text-green-300 transition-colors">
                Example Shard
              </Link>
              <Link href="/docs" className="hover:text-green-300 transition-colors">
                Docs
              </Link>
            </nav>
          </div>
        </header>

        {/* Hero */}
        <section className="max-w-6xl mx-auto px-6 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.h1 
              className="text-6xl md:text-8xl font-mono font-black mb-8 tracking-tighter"
              animate={{ 
                textShadow: [
                  '0 0 20px #22c55e',
                  '0 0 40px #22c55e, 0 0 60px #22c55e',
                  '0 0 20px #22c55e'
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              HORCRUX
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl mb-12 text-green-300/80 max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Persistent personal context for agents.
              <br />
              <span className="text-green-500">A living memory interface for AI systems.</span>
            </motion.p>

            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Link 
                href="/corpus"
                className="group px-8 py-4 bg-green-600 hover:bg-green-500 text-black font-mono font-bold text-lg transition-all duration-200 border-2 border-green-400 hover:border-green-300 flex items-center gap-2"
              >
                View Example Shard
                <ExternalLink className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <button className="px-8 py-4 border-2 border-green-600 hover:border-green-400 text-green-400 hover:text-green-300 font-mono font-bold text-lg transition-all duration-200 hover:bg-green-900/20">
                Mint Your Shard
              </button>
            </motion.div>
          </motion.div>
        </section>

        {/* Features */}
        <section className="max-w-6xl mx-auto px-6 py-20 border-t border-green-800/30">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Database,
                title: 'Persistent Memory',
                desc: 'Version-controlled JSON corpus of your professional context'
              },
              {
                icon: Zap,
                title: 'MCP Integration',
                desc: 'Native Model Context Protocol support for agent connectivity'
              },
              {
                icon: Shield,
                title: 'Privacy Layers',
                desc: 'Public showcase + private authenticated endpoints'
              }
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + i * 0.2 }}
                className="border border-green-800/30 p-6 hover:border-green-600/50 transition-colors group"
              >
                <feature.icon className="w-8 h-8 mb-4 text-green-500 group-hover:text-green-400 transition-colors" />
                <h3 className="text-xl font-mono font-bold mb-2">{feature.title}</h3>
                <p className="text-green-300/70 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-green-800/30 mt-20">
          <div className="max-w-6xl mx-auto px-6 py-8 text-center text-green-500/60 font-mono text-sm">
            Made in Miami • Open Source • MCP Compatible
          </div>
        </footer>
      </div>
    </div>
  )
}
