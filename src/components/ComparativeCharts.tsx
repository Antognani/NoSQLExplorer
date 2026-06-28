/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import { LATENCY_BENCHMARK, THROUGHPUT_SCALABILITY, RADAR_COMPARATIVE } from '../data/nosqlData';
import { Activity, TrendingUp, Compass, Award } from 'lucide-react';
import { motion } from 'motion/react';

export default function ComparativeCharts() {
  const [activeTab, setActiveTab] = useState<'latency' | 'scalability' | 'features'>('latency');

  return (
    <section className="bg-slate-50 py-16 px-4 sm:px-6 lg:px-8 border-b border-slate-200">
      <div className="max-w-7xl mx-auto">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-indigo-600 font-bold font-heading text-xs uppercase tracking-wider bg-indigo-50 px-3 py-1.5 rounded-full border border-indigo-100/50">
            Métricas de Benchmarking
          </span>
          <h2 className="font-heading text-3xl font-extrabold text-slate-900 tracking-tight mt-3">
            Gráficos Comparativos Reais
          </h2>
          <p className="mt-4 text-lg text-slate-600 font-light">
            Compare o comportamento dos paradigmas NoSQL sob diferentes cargas de trabalho e cenários arquiteturais. 
            Escolha as abas para analisar latência, escalabilidade linear ou cobertura de recursos.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex p-1 bg-slate-200/60 rounded-2xl border border-slate-300/30 shadow-inner">
            <button
              onClick={() => setActiveTab('latency')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-heading text-sm font-semibold transition-all ${
                activeTab === 'latency'
                  ? 'bg-white text-indigo-600 shadow-md'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>Latência e Velocidade</span>
            </button>
            <button
              onClick={() => setActiveTab('scalability')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-heading text-sm font-semibold transition-all ${
                activeTab === 'scalability'
                  ? 'bg-white text-indigo-600 shadow-md'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>Vazão / Escalabilidade</span>
            </button>
            <button
              onClick={() => setActiveTab('features')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-heading text-sm font-semibold transition-all ${
                activeTab === 'features'
                  ? 'bg-white text-indigo-600 shadow-md'
                  : 'text-slate-600 hover:text-slate-800'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Matriz de Cobertura</span>
            </button>
          </div>
        </div>

        {/* Chart Window */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl">
          
          {/* Latency Tab */}
          {activeTab === 'latency' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center animate-fadeIn"
            >
              <div className="lg:col-span-7 h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={LATENCY_BENCHMARK}
                    margin={{ top: 20, right: 30, left: 10, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis label={{ value: 'Latência (ms)', angle: -90, position: 'insideLeft', style: { fill: '#475569', fontSize: 11 } }} tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '12px' }} />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '15px' }} />
                    <Bar dataKey="read" name="Operação de Leitura (ms)" fill="#4f46e5" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="write" name="Operação de Escrita (ms)" fill="#10b981" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="lg:col-span-5 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-indigo-50 rounded-xl text-indigo-600">
                    <Activity className="w-5 h-5" />
                  </div>
                  <h3 className="font-heading text-xl font-bold text-slate-800">Velocidade e Desempenho</h3>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed font-light">
                  Os bancos de dados <strong>Chave-Valor (como o Redis)</strong> são imbatíveis em termos de latência de leitura e escrita pura porque mantêm seus dados quase inteiramente em memória RAM, apresentando tempos sub-milissegundos.
                </p>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <Award className="w-4 h-4 text-amber-500" />
                    <span>Destaques Arquiteturais:</span>
                  </div>
                  <ul className="space-y-2 text-xs text-slate-600">
                    <li className="flex items-start gap-1.5">
                      <span className="text-emerald-500 font-bold">✓</span>
                      <span><strong>Redis:</strong> Latência absurdamente baixa, ideal para caching e filas.</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-emerald-500 font-bold">✓</span>
                      <span><strong>Cassandra:</strong> Gravações ultrarrápidas, pois armazena em logs sequenciais (CommitLog/MemTable).</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="text-emerald-500 font-bold">✓</span>
                      <span><strong>Neo4j:</strong> Latência de leitura aumenta conforme a profundidade do caminho (relacionamento) aumenta.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </motion.div>
          )}

          {/* Scalability Tab */}
          {activeTab === 'scalability' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center animate-fadeIn"
            >
              <div className="lg:col-span-7 h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={THROUGHPUT_SCALABILITY}
                    margin={{ top: 20, right: 30, left: 10, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis label={{ value: 'Ops/segundo (x1000)', angle: -90, position: 'insideLeft', style: { fill: '#475569', fontSize: 11 } }} tick={{ fill: '#475569', fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '12px' }} />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '15px' }} />
                    <Line type="monotone" dataKey="KeyValue" name="Redis (Chave-Valor)" stroke="#4f46e5" strokeWidth={3} activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="Document" name="MongoDB (Documento)" stroke="#818cf8" strokeWidth={3} />
                    <Line type="monotone" dataKey="WideColumn" name="Cassandra (Família Colunas)" stroke="#f43f5e" strokeWidth={3} />
                    <Line type="monotone" dataKey="Graph" name="Neo4j (Grafo)" stroke="#0d9488" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="lg:col-span-5 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-indigo-50 rounded-xl text-indigo-600">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <h3 className="font-heading text-xl font-bold text-slate-800">Escalabilidade Linear</h3>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed font-light">
                  O grande trunfo do NoSQL é a <strong>Escalabilidade Horizontal (Scale-Out)</strong>. Ao invés de comprar servidores maiores (escala vertical), adicionam-se nós de hardware comum ao cluster.
                </p>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <span>Vazão vs Clusters:</span>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Sistemas como <strong>Apache Cassandra</strong> e <strong>Amazon DynamoDB</strong> foram construídos com arquitetura descentralizada sem ponto único de falha, escalonando de forma praticamente linear com trilhões de dados distribuídos globalmente.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Features Matrix Tab */}
          {activeTab === 'features' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center animate-fadeIn"
            >
              <div className="lg:col-span-7 h-[350px] flex justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={RADAR_COMPARATIVE}>
                    <PolarGrid stroke="#e2e8f0" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#475569', fontSize: 11 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 9 }} />
                    <Radar name="Chave-Valor" dataKey="A" stroke="#4f46e5" fill="#4f46e5" fillOpacity={0.15} />
                    <Radar name="Documento" dataKey="B" stroke="#818cf8" fill="#818cf8" fillOpacity={0.15} />
                    <Radar name="Família Colunas" dataKey="C" stroke="#f43f5e" fill="#f43f5e" fillOpacity={0.15} />
                    <Radar name="Grafo" dataKey="D" stroke="#0d9488" fill="#0d9488" fillOpacity={0.15} />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '15px' }} />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '12px', color: '#fff', fontSize: '11px' }} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>

              <div className="lg:col-span-5 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-indigo-50 rounded-xl text-indigo-600">
                    <Compass className="w-5 h-5" />
                  </div>
                  <h3 className="font-heading text-xl font-bold text-slate-800">Análise de Adequação</h3>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed font-light">
                  Nenhum banco de dados é excelente em tudo. A escolha ideal depende do tipo de operação crítica que sua aplicação necessita.
                </p>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="p-2.5 bg-white border border-slate-200 rounded-xl">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Complexidade</p>
                      <p className="text-sm font-bold text-teal-600">Ganhador: Grafos</p>
                    </div>
                    <div className="p-2.5 bg-white border border-slate-200 rounded-xl">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Volume Massivo</p>
                      <p className="text-sm font-bold text-rose-500">Ganhador: Colunas</p>
                    </div>
                    <div className="p-2.5 bg-white border border-slate-200 rounded-xl">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Flexibilidade</p>
                      <p className="text-sm font-bold text-indigo-600">Ganhador: Documento</p>
                    </div>
                    <div className="p-2.5 bg-white border border-slate-200 rounded-xl">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Velocidade Pura</p>
                      <p className="text-sm font-bold text-indigo-600">Ganhador: Chave-Valor</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

        </div>
      </div>
    </section>
  );
}
