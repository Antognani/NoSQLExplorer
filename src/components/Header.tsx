/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Database, Sparkles, BookOpen } from 'lucide-react';
import { motion } from 'motion/react';

export default function Header() {
  return (
    <header className="relative overflow-hidden bg-white text-slate-800 py-16 px-4 sm:px-6 lg:px-8 border-b border-slate-200">
      {/* Decorative grid background with subtle indigo tint */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />
      
      {/* Soft glow effects */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-20 right-10 w-72 h-72 bg-blue-500/5 blur-[80px] rounded-full pointer-events-none" />

      <div className="relative max-w-7xl mx-auto flex flex-col items-center text-center">
        {/* Portal Badge */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-50 border border-indigo-100/80 text-indigo-600 text-xs font-semibold mb-6 uppercase tracking-wider shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-500 animate-pulse-slow" />
          <span>Portal de Disciplinas IMD / UFRN</span>
        </motion.div>

        {/* Title */}
        <motion.h1 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="font-heading text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 mb-6"
        >
          NoSQL <span className="text-indigo-600">Explorer</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="max-w-3xl text-lg sm:text-xl text-slate-600 font-light leading-relaxed mb-8"
        >
          Explore o universo dos bancos de dados não relacionais através de explicações dinâmicas, 
          gráficos comparativos de desempenho e um laboratório prático com testes interativos.
        </motion.p>

        {/* Feature stats */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl p-1 bg-white/50 backdrop-blur-md rounded-2xl border border-slate-200 shadow-md"
        >
          <div className="p-4 rounded-xl hover:bg-slate-50 transition-colors">
            <div className="flex justify-center text-indigo-600 mb-2">
              <Database className="w-6 h-6" />
            </div>
            <p className="text-xl font-bold font-heading text-slate-900">4 Paradigmas</p>
            <p className="text-xs text-slate-500">Documento, K-V, Colunar e Grafo</p>
          </div>
          <div className="p-4 rounded-xl hover:bg-slate-50 transition-colors">
            <div className="flex justify-center text-indigo-600 mb-2">
              <BookOpen className="w-6 h-6" />
            </div>
            <p className="text-xl font-bold font-heading text-slate-900">Guia Teórico</p>
            <p className="text-xs text-slate-500">Prós, contras e casos de uso</p>
          </div>
          <div className="p-4 rounded-xl hover:bg-slate-50 transition-colors">
            <div className="flex justify-center text-indigo-600 mb-2">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 3.055A9.003 9.003 0 1020.945 13H11V3.055z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
              </svg>
            </div>
            <p className="text-xl font-bold font-heading text-slate-900">Benchmarks</p>
            <p className="text-xs text-slate-500">Gráficos interativos reais</p>
          </div>
          <div className="p-4 rounded-xl hover:bg-slate-50 transition-colors">
            <div className="flex justify-center text-indigo-600 mb-2">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
            </div>
            <p className="text-xl font-bold font-heading text-slate-900">Sandbox</p>
            <p className="text-xs text-slate-500">Prática real de consultas</p>
          </div>
        </motion.div>
      </div>
    </header>
  );
}
