/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Github, Instagram, Link, GraduationCap } from 'lucide-react';
import { motion } from 'motion/react';

export default function Footer() {
  return (
    <footer className="bg-white text-slate-600 py-16 px-4 sm:px-6 lg:px-8 border-t border-slate-200">
      <div className="max-w-7xl mx-auto flex flex-col items-center space-y-10">
        
        {/* Logos Container */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-8 sm:gap-12 pb-2">
          {/* UFRN Logo */}
          <a 
            href="https://www.ufrn.br" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex flex-col items-center hover:scale-105 transition-all duration-300 grayscale opacity-80 hover:grayscale-0 hover:opacity-100"
            title="UFRN - Universidade Federal do Rio Grande do Norte"
          >
            <svg viewBox="0 0 460 120" className="h-11 w-auto overflow-visible" xmlns="http://www.w3.org/2000/svg">
              {/* "U" */}
              <text x="10" y="95" fill="#009fe3" fontFamily="system-ui, -apple-system, sans-serif" fontSize="110" fontWeight="900" fontStyle="italic" letterSpacing="-4">U</text>
              
              {/* Blue Parallelogram for "F" */}
              <polygon points="125,12 215,12 185,108 95,108" fill="#1c419c" />
              
              {/* "F" inside Parallelogram */}
              <text x="135" y="94" fill="#ffffff" fontFamily="system-ui, -apple-system, sans-serif" fontSize="110" fontWeight="900" fontStyle="italic">F</text>
              
              {/* "R" and "N" */}
              <text x="210" y="95" fill="#009fe3" fontFamily="system-ui, -apple-system, sans-serif" fontSize="110" fontWeight="900" fontStyle="italic" letterSpacing="-4">RN</text>
            </svg>
          </a>

          {/* Divider line */}
          <div className="hidden sm:block w-px h-12 bg-slate-200" />

          {/* IMD Logo */}
          <a 
            href="https://www.metropoledigital.ufrn.br/portal/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="flex flex-col items-center hover:scale-105 transition-all duration-300 grayscale opacity-80 hover:grayscale-0 hover:opacity-100"
            title="IMD - Instituto Metrópole Digital"
          >
            <img 
              src="https://info.imd.ufrn.br/images/logo-imd.png" 
              alt="IMD - Instituto Metrópole Digital" 
              className="h-10 w-auto object-contain"
              referrerPolicy="no-referrer"
              onError={(e) => {
                // Secondary URL fallback
                e.currentTarget.onerror = (err) => {
                  // Final Fail-safe SVG backup if network blocks portal
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 160 40'%3E%3Ctext x='10' y='26' fill='%230f172a' font-family='sans-serif' font-weight='bold' font-size='15'%3Emetr%C3%B3pole%3C/text%3E%3Ctext x='100' y='26' fill='%234f46e5' font-family='sans-serif' font-weight='normal' font-size='15'%3Edigital%3C/text%3E%3C/svg%3E";
                };
                e.currentTarget.src = "https://www.imd.ufrn.br/portal/assets/images/logo_imd.png";
              }}
            />
          </a>
        </div>

        {/* Informative text & Context */}
        <div className="text-center space-y-3 max-w-2xl">
          <div className="flex items-center justify-center gap-2 text-slate-800 text-sm font-semibold tracking-wide">
            <GraduationCap className="w-4 h-4 text-indigo-600 animate-pulse-slow" />
            <a 
              href="https://portaldasdisciplinas.imd.ufrn.br" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-indigo-600 hover:underline transition-all duration-300"
            >
              Portal das Disciplinas do IMD/UFRN
            </a>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-light">
            Este projeto educacional foi concebido como um recurso pedagógico para estudantes do IMD, 
            facilitando a compreensão teórica e prática das disciplinas de Banco de Dados. 
            Desenvolvido utilizando as melhores práticas de engenharia de software e interfaces responsivas.
          </p>
        </div>

        {/* Developer Credit Block with interactive hyperlink */}
        <div className="w-full max-w-md border-t border-slate-100 pt-8 flex flex-col items-center space-y-4">
          <motion.a 
            href="https://instagram.com/antognani" 
            target="_blank" 
            rel="noopener noreferrer"
            className="group flex items-center gap-2 px-5 py-2.5 bg-slate-50 hover:bg-indigo-50/55 text-slate-800 hover:text-indigo-600 border border-slate-200 hover:border-indigo-100 rounded-2xl text-xs font-semibold shadow-sm transition-all hover:scale-105"
            whileHover={{ y: -2 }}
          >
            <Instagram className="w-4 h-4 text-pink-500 group-hover:scale-110 transition-transform" />
            <span>Feito por <strong className="font-bold underline decoration-pink-500 group-hover:text-indigo-600 transition-colors">Antonio Gabriel @antognani</strong></span>
          </motion.a>

          <p className="text-[10px] text-slate-400 font-mono">
            &copy; 2026 • Natal / RN • Todos os Direitos Reservados
          </p>
        </div>

      </div>
    </footer>
  );
}
