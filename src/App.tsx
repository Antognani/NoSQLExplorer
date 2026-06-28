/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import Header from './components/Header';
import DatabaseSelector from './components/DatabaseSelector';
import CAPTheorem from './components/CAPTheorem';
import ComparativeCharts from './components/ComparativeCharts';
import Playground from './components/Playground';
import Footer from './components/Footer';
import { Database, Zap, BookOpen, Layers } from 'lucide-react';
import { motion } from 'motion/react';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 antialiased selection:bg-indigo-600 selection:text-white">
      {/* 1. Header Section */}
      <Header />

      {/* Floating navigation anchor helper */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-4 py-3 shadow-sm hidden md:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-indigo-600" />
            <span className="font-heading font-extrabold text-sm text-slate-900">NoSQL Explorer</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="#paradigmas" className="text-xs font-semibold text-slate-600 hover:text-indigo-600 transition-colors flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5" />
              <span>4 Paradigmas</span>
            </a>
            <a href="#teorema-cap" className="text-xs font-semibold text-slate-600 hover:text-indigo-600 transition-colors flex items-center gap-1">
              <Layers className="w-3.5 h-3.5" />
              <span>Teorema CAP</span>
            </a>
            <a href="#comparativos" className="text-xs font-semibold text-slate-600 hover:text-indigo-600 transition-colors flex items-center gap-1">
              <Zap className="w-3.5 h-3.5" />
              <span>Benchmarks</span>
            </a>
            <a 
              href="#playground" 
              className="text-xs font-bold px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition-all shadow-md flex items-center gap-1"
            >
              <span>Sandbox Prática</span>
            </a>
          </div>
        </div>
      </div>

      <main className="relative">
        
        {/* Section 1: Paradigmas NoSQL */}
        <div id="paradigmas" className="scroll-mt-14">
          <DatabaseSelector />
        </div>

        {/* Section 2: Teorema CAP */}
        <div id="teorema-cap" className="scroll-mt-14">
          <CAPTheorem />
        </div>

        {/* Section 3: Gráficos Comparativos */}
        <div id="comparativos" className="scroll-mt-14">
          <ComparativeCharts />
        </div>

        {/* Section 4: Playground Laboratório */}
        <div id="playground" className="scroll-mt-14">
          <Playground />
        </div>

      </main>

      {/* 5. Footer Section with University and Institute Identity */}
      <Footer />
    </div>
  );
}
