/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { FileJson, KeyRound, Columns4, Network, Check, AlertTriangle, Lightbulb } from 'lucide-react';
import { NOSQL_TYPES } from '../data/nosqlData';
import { motion, AnimatePresence } from 'motion/react';

const ICONS: Record<string, any> = {
  FileJson,
  KeyRound,
  Columns4,
  Network
};

// Raw visual mock data templates to display structural differences
const STRUCTURAL_MOCKS: Record<string, string> = {
  document: `{
  "_id": "64bf8cd5e1",
  "name": "Antonio Gabriel",
  "academic_info": {
    "institute": "IMD",
    "university": "UFRN",
    "enrollment": 20260012
  },
  "courses": [
    { "code": "IMD001", "name": "NoSQL" },
    { "code": "IMD002", "name": "Web Dev" }
  ],
  "active": true
}`,
  keyvalue: `// Dicionário global de Chaves Rápidas
"session:usr_antognani" ➔ "{\\"role\\":\\"admin\\", \\"status\\":\\"active\\"}"
"stat:portal:views"     ➔ "14205"
"config:theme"          ➔ "slate-dark"
"cart:user:301"         ➔ "[104, 203, 506]"`,
  widecolumn: `RowKey: "usr_antognani"
├── ColumnFamily: "personal"
│   ├── name ➔ "Antonio Gabriel"
│   └── email ➔ "antognani1@gmail.com"
├── ColumnFamily: "academic"
│   ├── institute ➔ "IMD"
│   └── university ➔ "UFRN"
└── ColumnFamily: "security"
    └── last_ip ➔ "200.17.1.5"`,
  graph: `Nodes (Vértices):
  (A: Estudante { name: "Antonio Gabriel" })
  (B: Instituto { name: "IMD" })
  (C: Universidade { name: "UFRN" })

Relationships (Arestas/Conexões):
  (A) ➔ [:ESTUDA_NO] ➔ (B)
  (B) ➔ [:PERTENCE_A] ➔ (C)`
};

export default function DatabaseSelector() {
  const [activeType, setActiveType] = useState<string>('document');
  const activeInfo = NOSQL_TYPES.find((t) => t.id === activeType) || NOSQL_TYPES[0];
  const ActiveIcon = ICONS[activeInfo.icon] || FileJson;

  return (
    <section className="bg-white py-16 px-4 sm:px-6 lg:px-8 border-b border-slate-200">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="font-heading text-3xl font-extrabold text-slate-900 tracking-tight">
            Os 4 Paradigmas NoSQL
          </h2>
          <p className="mt-4 text-lg text-slate-600 font-light">
            Diferente do modelo relacional tradicional que padroniza tudo em tabelas e chaves estrangeiras, 
            o NoSQL oferece quatro estruturas distintas projetadas para necessidades específicas.
          </p>
        </div>

        {/* Dynamic Paradigm Selector Tabs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {NOSQL_TYPES.map((type) => {
            const IconComponent = ICONS[type.icon] || FileJson;
            const isSelected = type.id === activeType;
            return (
              <button
                id={`tab-btn-${type.id}`}
                key={type.id}
                onClick={() => setActiveType(type.id)}
                className={`relative flex flex-col items-center p-5 rounded-2xl border text-center transition-all duration-300 ${
                  isSelected
                    ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg scale-[1.02]'
                    : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:border-indigo-300'
                }`}
              >
                <div className={`p-3 rounded-xl mb-3 ${isSelected ? 'bg-indigo-500 text-white' : 'bg-slate-200/50 text-slate-700'}`}>
                  <IconComponent className="w-6 h-6" />
                </div>
                <span className="font-heading font-bold text-sm sm:text-base">{type.name}</span>
                <span className={`text-[10px] mt-1 ${isSelected ? 'text-indigo-100' : 'text-slate-400'}`}>
                  Ex: {type.databases[0]}
                </span>
                
                {isSelected && (
                  <motion.div 
                    layoutId="activeIndicator"
                    className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-indigo-600 rotate-45 rounded-sm"
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Content Box */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeType}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-lg"
          >
            {/* Left Column: Theoretical Explanations */}
            <div className="lg:col-span-7 p-6 sm:p-10 text-slate-700 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
                    <ActiveIcon className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="font-heading text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-950">
                      {activeInfo.name}
                    </h3>
                    <p className="text-xs text-indigo-600 font-mono">Estrutura: {activeInfo.structure}</p>
                  </div>
                </div>

                <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-8 font-light">
                  {activeInfo.description}
                </p>

                {/* Pros and Cons */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {/* Pros */}
                  <div className="space-y-3">
                    <h4 className="font-heading text-sm font-bold text-emerald-600 uppercase tracking-wider flex items-center gap-1.5">
                      <Check className="w-4 h-4" /> Vantagens
                    </h4>
                    <ul className="space-y-2">
                      {activeInfo.pros.map((pro, i) => (
                        <li key={i} className="text-xs text-slate-600 flex items-start gap-2">
                          <span className="text-emerald-500 mt-0.5">•</span>
                          <span>{pro}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Cons */}
                  <div className="space-y-3">
                    <h4 className="font-heading text-sm font-bold text-rose-600 uppercase tracking-wider flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4" /> Desvantagens
                    </h4>
                    <ul className="space-y-2">
                      {activeInfo.cons.map((con, i) => (
                        <li key={i} className="text-xs text-slate-600 flex items-start gap-2">
                          <span className="text-rose-500 mt-0.5">•</span>
                          <span>{con}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Best Cases */}
                <div className="space-y-3 mb-8">
                  <h4 className="font-heading text-sm font-bold text-amber-600 uppercase tracking-wider flex items-center gap-1.5">
                    <Lightbulb className="w-4 h-4" /> Casos de Uso Ideais
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {activeInfo.bestUseCases.map((useCase, i) => (
                      <span
                        key={i}
                        className="text-xs px-3 py-1 bg-slate-50 border border-slate-200 rounded-lg text-slate-600 font-medium"
                      >
                        {useCase}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Technologies logos */}
              <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold block mb-1">
                    Bancos de dados populares:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {activeInfo.databases.map((db, i) => (
                      <span key={i} className="text-xs font-semibold px-2.5 py-1 bg-indigo-50 text-indigo-700 border border-indigo-100/60 rounded-md">
                        {db}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Visualizer of Code/Representation */}
            <div className="lg:col-span-5 bg-slate-950 p-6 sm:p-10 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-slate-800">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider font-mono">
                    Representação Lógica dos Dados
                  </span>
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                  </div>
                </div>

                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 font-mono text-xs sm:text-sm text-indigo-300 leading-relaxed overflow-x-auto whitespace-pre min-h-[220px]">
                  {STRUCTURAL_MOCKS[activeType]}
                </div>
              </div>

              <div className="mt-6 text-slate-500 text-xs text-center border-t border-slate-100 pt-4 font-light">
                Esquemas flexíveis permitem que cada registro evolua sem migrações complexas de banco de dados.
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
