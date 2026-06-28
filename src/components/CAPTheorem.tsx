/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { AlertCircle, HelpCircle, ArrowRightLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CAPDetail {
  title: string;
  concept: string;
  explanation: string;
  dbs: string[];
  type: string;
}

const CAP_DETAILS: Record<string, CAPDetail> = {
  C: {
    title: 'Consistência (Consistency)',
    concept: 'Garantia de que todos os nós veem os mesmos dados ao mesmo tempo.',
    explanation: 'Qualquer leitura no sistema retorna a escrita mais recente ou um erro. Se uma atualização ocorrer, nenhum usuário poderá ler o estado antigo em nenhum servidor.',
    dbs: ['MongoDB', 'Redis', 'HBase', 'PostgreSQL (Relacional)'],
    type: 'Propriedade'
  },
  A: {
    title: 'Disponibilidade (Availability)',
    concept: 'Garantia de que cada requisição recebe uma resposta (sem erro), mesmo que não contenha a escrita mais recente.',
    explanation: 'O sistema continua funcionando e respondendo a todas as solicitações com sucesso, mesmo se alguns nós estiverem inoperantes. No entanto, não há garantia de consistência imediata.',
    dbs: ['Cassandra', 'DynamoDB', 'CouchDB', 'Riak'],
    type: 'Propriedade'
  },
  P: {
    title: 'Tolerância a Partição (Partition Tolerance)',
    concept: 'O sistema continua a funcionar apesar de perdas de mensagens ou falhas físicas na rede entre nós.',
    explanation: 'Em sistemas distribuídos modernos, a rede inevitavelmente falhará ou sofrerá atrasos em algum momento. Portanto, a Tolerância a Partições é obrigatória. Devemos escolher entre C ou A.',
    dbs: ['Cassandra', 'DynamoDB', 'MongoDB', 'Redis', 'HBase'],
    type: 'Propriedade'
  },
  CP: {
    title: 'Consistência + Tolerância a Partição (CP)',
    concept: 'Escolhe a precisão absoluta de dados em detrimento da disponibilidade caso ocorra uma falha de rede.',
    explanation: 'Se houver uma partição na rede, o sistema bloqueará ou rejeitará gravações/leituras em nós desconectados para evitar dados divergentes, preferindo consistência estrita.',
    dbs: ['MongoDB', 'Redis', 'HBase', 'Bigtable'],
    type: 'Compromisso NoSQL'
  },
  AP: {
    title: 'Disponibilidade + Tolerância a Partição (AP)',
    concept: 'Escolhe manter o sistema respondendo a todo custo, aceitando que dados antigos sejam retornados temporariamente.',
    explanation: 'Caso a rede sofra partições, todos os nós continuam respondendo e aceitando escritas localmente. Os dados se reconciliam eventualmente (Consistência Eventual).',
    dbs: ['Apache Cassandra', 'Amazon DynamoDB', 'CouchDB', 'Riak'],
    type: 'Compromisso NoSQL'
  },
  CA: {
    title: 'Consistência + Disponibilidade (CA)',
    concept: 'Prioriza consistência e disponibilidade simultâneas, mas exige uma rede 100% livre de falhas.',
    explanation: 'Sistemas CA não podem tolerar falhas de rede. Na prática do mundo real e em redes distribuídas, "CA pura" não existe pois partições de rede são inevitáveis. É a área clássica de bancos relacionais locais.',
    dbs: ['RDBMS Tradicionais (PostgreSQL/MySQL rodando em nó único)'],
    type: 'Compromisso SQL'
  }
};

export default function CAPTheorem() {
  const [selectedKey, setSelectedKey] = useState<string>('CP');

  return (
    <section className="bg-slate-50 py-16 px-4 sm:px-6 lg:px-8 border-b border-slate-200">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="font-heading text-3xl font-extrabold text-slate-900 tracking-tight">
            Teorema CAP & NoSQL
          </h2>
          <p className="mt-4 text-lg text-slate-600 font-light">
            O Teorema de Brewer afirma que um sistema de dados distribuído só pode fornecer simultaneamente 
            duas das três garantias fundamentais. Descubra os trade-offs clicando nos elementos interativos abaixo.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Interactive SVG Triangle Canvas */}
          <div className="lg:col-span-6 flex flex-col items-center">
            <div className="relative w-full max-w-[400px] aspect-square bg-white rounded-3xl border border-slate-200 shadow-md p-8 flex items-center justify-center">
              
              <svg viewBox="0 0 300 280" className="w-full h-full select-none overflow-visible">
                {/* Connection lines (Sides) */}
                {/* Side CA (Left to Right bottom) */}
                <line x1="50" y1="220" x2="250" y2="220" stroke={selectedKey === 'CA' ? '#4f46e5' : '#e2e8f0'} strokeWidth={selectedKey === 'CA' ? '6' : '3'} className="transition-all duration-300" />
                {/* Side CP (Top to Left) */}
                <line x1="150" y1="50" x2="50" y2="220" stroke={selectedKey === 'CP' ? '#4f46e5' : '#e2e8f0'} strokeWidth={selectedKey === 'CP' ? '6' : '3'} className="transition-all duration-300" />
                {/* Side AP (Top to Right) */}
                <line x1="150" y1="50" x2="250" y2="220" stroke={selectedKey === 'AP' ? '#4f46e5' : '#e2e8f0'} strokeWidth={selectedKey === 'AP' ? '6' : '3'} className="transition-all duration-300" />

                {/* Shaded center area */}
                <polygon points="150,50 50,220 250,220" fill="url(#grad)" className="opacity-10 pointer-events-none" />
                
                {/* Definitions for gradients */}
                <defs>
                  <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#4f46e5" />
                    <stop offset="100%" stopColor="#818cf8" />
                  </linearGradient>
                </defs>

                {/* Side Labels buttons (Middle of lines) */}
                {/* CP Selector */}
                <g className="cursor-pointer" onClick={() => setSelectedKey('CP')}>
                  <rect x="55" y="115" width="40" height="26" rx="6" fill={selectedKey === 'CP' ? '#4f46e5' : '#f8fafc'} stroke={selectedKey === 'CP' ? '#4f46e5' : '#e2e8f0'} strokeWidth="1" className="transition-colors duration-300" />
                  <text x="75" y="132" textAnchor="middle" fill={selectedKey === 'CP' ? '#ffffff' : '#475569'} fontSize="11" fontWeight="bold">CP</text>
                </g>

                {/* AP Selector */}
                <g className="cursor-pointer" onClick={() => setSelectedKey('AP')}>
                  <rect x="205" y="115" width="40" height="26" rx="6" fill={selectedKey === 'AP' ? '#4f46e5' : '#f8fafc'} stroke={selectedKey === 'AP' ? '#4f46e5' : '#e2e8f0'} strokeWidth="1" className="transition-colors duration-300" />
                  <text x="225" y="132" textAnchor="middle" fill={selectedKey === 'AP' ? '#ffffff' : '#475569'} fontSize="11" fontWeight="bold">AP</text>
                </g>

                {/* CA Selector */}
                <g className="cursor-pointer" onClick={() => setSelectedKey('CA')}>
                  <rect x="130" y="207" width="40" height="26" rx="6" fill={selectedKey === 'CA' ? '#4f46e5' : '#f8fafc'} stroke={selectedKey === 'CA' ? '#4f46e5' : '#e2e8f0'} strokeWidth="1" className="transition-colors duration-300" />
                  <text x="150" y="224" textAnchor="middle" fill={selectedKey === 'CA' ? '#ffffff' : '#475569'} fontSize="11" fontWeight="bold">CA</text>
                </g>

                {/* Corners (Vertice Nodes) */}
                {/* Top Corner: Partition Tolerance */}
                <g className="cursor-pointer" onClick={() => setSelectedKey('P')}>
                  <circle cx="150" cy="50" r="24" fill={selectedKey === 'P' ? '#4f46e5' : '#ffffff'} stroke="#4f46e5" strokeWidth="3" className="transition-all duration-300 hover:scale-110" />
                  <text x="150" y="54" textAnchor="middle" fill={selectedKey === 'P' ? '#ffffff' : '#4f46e5'} fontSize="14" fontWeight="bold">P</text>
                  <text x="150" y="20" textAnchor="middle" fill="#1e293b" fontSize="11" fontWeight="600">Partição (P)</text>
                </g>

                {/* Left Corner: Consistency */}
                <g className="cursor-pointer" onClick={() => setSelectedKey('C')}>
                  <circle cx="50" cy="220" r="24" fill={selectedKey === 'C' ? '#4f46e5' : '#ffffff'} stroke="#4f46e5" strokeWidth="3" className="transition-all duration-300 hover:scale-110" />
                  <text x="50" y="224" textAnchor="middle" fill={selectedKey === 'C' ? '#ffffff' : '#4f46e5'} fontSize="14" fontWeight="bold">C</text>
                  <text x="50" y="258" textAnchor="middle" fill="#1e293b" fontSize="11" fontWeight="600">Consistência (C)</text>
                </g>

                {/* Right Corner: Availability */}
                <g className="cursor-pointer" onClick={() => setSelectedKey('A')}>
                  <circle cx="250" cy="220" r="24" fill={selectedKey === 'A' ? '#4f46e5' : '#ffffff'} stroke="#4f46e5" strokeWidth="3" className="transition-all duration-300 hover:scale-110" />
                  <text x="250" y="224" textAnchor="middle" fill={selectedKey === 'A' ? '#ffffff' : '#4f46e5'} fontSize="14" fontWeight="bold">A</text>
                  <text x="250" y="258" textAnchor="middle" fill="#1e293b" fontSize="11" fontWeight="600">Disponibilidade (A)</text>
                </g>
              </svg>

              {/* Helper badge */}
              <div className="absolute bottom-3 right-3 flex items-center gap-1 text-[10px] text-slate-400">
                <HelpCircle className="w-3 h-3" />
                <span>Clique nos vértices ou lados</span>
              </div>
            </div>

            {/* Selector shortcut row */}
            <div className="flex gap-2 mt-4 flex-wrap justify-center">
              {Object.keys(CAP_DETAILS).map((k) => (
                <button
                  key={k}
                  onClick={() => setSelectedKey(k)}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg border transition-all ${
                    selectedKey === k
                      ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {k}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Info Board */}
          <div className="lg:col-span-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={selectedKey}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md h-full flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      CAP_DETAILS[selectedKey].type.includes('Compromisso') 
                        ? 'bg-indigo-100 text-indigo-800' 
                        : CAP_DETAILS[selectedKey].type.includes('Propriedade')
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      {CAP_DETAILS[selectedKey].type}
                    </span>
                    <div className="text-slate-400">
                      <ArrowRightLeft className="w-4 h-4" />
                    </div>
                  </div>

                  <h3 className="font-heading text-2xl font-bold text-slate-900 mb-3">
                    {CAP_DETAILS[selectedKey].title}
                  </h3>

                  <p className="text-slate-800 font-medium text-sm sm:text-base leading-relaxed border-l-4 border-indigo-600 pl-3 mb-4">
                    {CAP_DETAILS[selectedKey].concept}
                  </p>

                  <p className="text-slate-600 text-sm leading-relaxed mb-6">
                    {CAP_DETAILS[selectedKey].explanation}
                  </p>
                </div>

                <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                    Bancos associados / exemplos:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {CAP_DETAILS[selectedKey].dbs.map((db, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 text-xs font-medium shadow-sm hover:border-indigo-400 transition-colors"
                      >
                        {db}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Warning banner */}
        <div className="mt-12 p-4 rounded-2xl bg-amber-50 border border-amber-200 flex gap-3 items-start max-w-4xl mx-auto">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-xs sm:text-sm text-amber-800 leading-relaxed">
            <strong>Nota teórica:</strong> O Teorema CAP foca na consistência estrita no pior cenário (partição de rede). Muitos bancos de dados modernos permitem <strong>configurar</strong> o nível de consistência em tempo de execução (ex: Leituras Consistentes no DynamoDB ou escrita com Quórum no Cassandra), tornando os limites do CAP mais maleáveis em condições normais de rede.
          </p>
        </div>
      </div>
    </section>
  );
}
