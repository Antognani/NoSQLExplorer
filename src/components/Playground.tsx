/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  FileJson, KeyRound, Columns4, Network, Plus, Trash2, Search, 
  Terminal, Share2, HelpCircle, AlertCircle, Play, RefreshCw, Sparkles, Check
} from 'lucide-react';
import { 
  INITIAL_DOCUMENTS, INITIAL_KEY_VALUES, INITIAL_WIDE_COLUMNS, 
  INITIAL_GRAPH_NODES, INITIAL_GRAPH_EDGES 
} from '../data/nosqlData';
import { DocumentData, KeyValueData, ColumnFamilyData, GraphNode, GraphEdge } from '../types';
import { motion, AnimatePresence } from 'motion/react';

export default function Playground() {
  const [paradigm, setParadigm] = useState<'document' | 'keyvalue' | 'widecolumn' | 'graph'>('document');

  // --- 1. DOCUMENT STORE STATE & HANDLERS ---
  const [documents, setDocuments] = useState<DocumentData[]>(INITIAL_DOCUMENTS);
  const [docSearch, setDocSearch] = useState('');
  const [docCategory, setDocCategory] = useState('Todos');
  const [docMaxPrice, setDocMaxPrice] = useState<number>(1500);
  const [docOnlyInStock, setDocOnlyInStock] = useState(false);
  const [newDocJSON, setNewDocJSON] = useState(`{
  "title": "Teclado Bluetooth Silent",
  "category": "Periféricos",
  "price": 450.00,
  "tags": ["Office", "Wireless"],
  "inStock": true,
  "metadata": { "views": 100, "rating": 4.0 }
}`);
  const [docError, setDocError] = useState<string | null>(null);

  const handleAddDocument = () => {
    try {
      const parsed = JSON.parse(newDocJSON);
      if (!parsed.title || !parsed.category || typeof parsed.price !== 'number') {
        throw new Error('O documento deve conter ao menos: "title" (texto), "category" (texto) e "price" (número)');
      }
      const newDoc: DocumentData = {
        id: `doc_${Date.now()}`,
        title: parsed.title,
        category: parsed.category,
        price: parsed.price,
        tags: Array.isArray(parsed.tags) ? parsed.tags : ['Geral'],
        inStock: parsed.inStock !== undefined ? !!parsed.inStock : true,
        metadata: parsed.metadata || { views: 1, rating: 5.0 }
      };
      setDocuments([newDoc, ...documents]);
      setDocError(null);
      // Reset JSON template
      setNewDocJSON(`{
  "title": "Produto_${Math.floor(Math.random() * 1000)}",
  "category": "Eletrônicos",
  "price": ${parseFloat((Math.random() * 500 + 50).toFixed(2))},
  "tags": ["Novidade"],
  "inStock": true,
  "metadata": { "views": 10, "rating": 4.5 }
}`);
    } catch (err: any) {
      setDocError(err.message || 'Erro ao analisar JSON. Verifique as vírgulas e aspas duplas.');
    }
  };

  const handleDeleteDocument = (id: string) => {
    setDocuments(documents.filter(d => d.id !== id));
  };

  const filteredDocs = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(docSearch.toLowerCase()) || 
                          doc.tags.some(t => t.toLowerCase().includes(docSearch.toLowerCase()));
    const matchesCategory = docCategory === 'Todos' || doc.category === docCategory;
    const matchesPrice = doc.price <= docMaxPrice;
    const matchesStock = !docOnlyInStock || doc.inStock;
    return matchesSearch && matchesCategory && matchesPrice && matchesStock;
  });


  // --- 2. KEY-VALUE STORE STATE & HANDLERS ---
  const [keyValues, setKeyValues] = useState<KeyValueData[]>(INITIAL_KEY_VALUES);
  const [cliCommand, setCliCommand] = useState('');
  const [cliFeedback, setCliFeedback] = useState<string>('Disparador Redis: digite um comando ou use os botões rápidos.');
  const [kvKey, setKvKey] = useState('');
  const [kvVal, setKvVal] = useState('');
  const [kvType, setKvType] = useState('String');
  const [searchKVTerm, setSearchKVTerm] = useState('');

  const executeRedisCommand = (cmdStr: string) => {
    const cleaned = cmdStr.trim();
    if (!cleaned) return;

    const parts = cleaned.split(/\s+/);
    const action = parts[0].toUpperCase();
    const key = parts[1];
    const val = parts.slice(2).join(' ');

    if (action === 'SET') {
      if (!key || !val) {
        setCliFeedback('❌ Erro de sintaxe: SET <chave> <valor>');
        return;
      }
      // Upsert
      setKeyValues(prev => {
        const exists = prev.some(kv => kv.key === key);
        if (exists) {
          return prev.map(kv => kv.key === key ? { ...kv, value: val, updatedAt: new Date().toLocaleTimeString() } : kv);
        } else {
          return [...prev, { key, value: val, type: 'String', updatedAt: new Date().toLocaleTimeString() }];
        }
      });
      setCliFeedback(`OK: Chave "${key}" gravada com sucesso!`);
    } else if (action === 'GET') {
      if (!key) {
        setCliFeedback('❌ Erro de sintaxe: GET <chave>');
        return;
      }
      const found = keyValues.find(kv => kv.key === key);
      if (found) {
        setCliFeedback(`➔ GET ${key}: "${found.value}" (Tipo: ${found.type})`);
      } else {
        setCliFeedback(`(nil) - Chave "${key}" não encontrada.`);
      }
    } else if (action === 'DEL') {
      if (!key) {
        setCliFeedback('❌ Erro de sintaxe: DEL <chave>');
        return;
      }
      const exists = keyValues.some(kv => kv.key === key);
      if (exists) {
        setKeyValues(prev => prev.filter(kv => kv.key !== key));
        setCliFeedback(`(integer) 1 - Chave "${key}" removida.`);
      } else {
        setCliFeedback(`(integer) 0 - Chave "${key}" não existia.`);
      }
    } else if (action === 'KEYS') {
      const match = keyTextSearch(key || '*');
      setCliFeedback(`Chaves correspondentes: [${match.join(', ')}]`);
    } else {
      setCliFeedback(`❌ Comando desconhecido "${action}". Comandos aceitos: SET, GET, DEL, KEYS`);
    }
  };

  const keyTextSearch = (pattern: string) => {
    if (pattern === '*' || !pattern) return keyValues.map(kv => kv.key);
    const regexStr = pattern.replace(/\*/g, '.*');
    try {
      const rx = new RegExp(`^${regexStr}$`, 'i');
      return keyValues.filter(kv => rx.test(kv.key)).map(kv => kv.key);
    } catch {
      return keyValues.map(kv => kv.key);
    }
  };

  const handleKvFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!kvKey || !kvVal) return;
    executeRedisCommand(`SET ${kvKey} ${kvVal}`);
    // Update the type specifically
    setKeyValues(prev => prev.map(kv => kv.key === kvKey ? { ...kv, type: kvType } : kv));
    setKvKey('');
    setKvVal('');
  };


  // --- 3. WIDE-COLUMN STORE STATE & HANDLERS ---
  const [columns, setColumns] = useState<ColumnFamilyData[]>(INITIAL_WIDE_COLUMNS);
  const [newRowKey, setNewRowKey] = useState('');
  const [colFamily, setColFamily] = useState<'personal' | 'activity' | 'preferences'>('personal');
  const [colKey, setColKey] = useState('');
  const [colVal, setColVal] = useState('');

  const handleAddColumnValue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRowKey || !colKey || !colVal) return;

    setColumns(prev => {
      const rowIndex = prev.findIndex(r => r.rowKey === newRowKey);
      if (rowIndex >= 0) {
        // Update existing row
        const updated = [...prev];
        const row = updated[rowIndex];
        updated[rowIndex] = {
          ...row,
          families: {
            ...row.families,
            [colFamily]: {
              ...row.families[colFamily],
              [colKey]: colVal
            }
          }
        };
        return updated;
      } else {
        // Create new row with empty families
        const newRow: ColumnFamilyData = {
          rowKey: newRowKey,
          families: {
            personal: { name: '', email: '', role: '' },
            activity: { lastLogin: '', loginCount: '' },
            preferences: { theme: 'system', notifications: 'true' }
          }
        };
        // @ts-ignore
        newRow.families[colFamily][colKey] = colVal;
        return [...prev, newRow];
      }
    });

    setColKey('');
    setColVal('');
  };


  // --- 4. GRAPH DATABASE STATE & HANDLERS ---
  const [nodes, setNodes] = useState<GraphNode[]>(INITIAL_GRAPH_NODES);
  const [edges, setEdges] = useState<GraphEdge[]>(INITIAL_GRAPH_EDGES);
  
  const [nodeLabel, setNodeLabel] = useState('');
  const [nodeType, setNodeType] = useState<'student' | 'professor' | 'course' | 'department'>('student');
  
  const [edgeSource, setEdgeSource] = useState('');
  const [edgeTarget, setEdgeTarget] = useState('');
  const [edgeLabel, setEdgeLabel] = useState('');

  const [selectedGraphNode, setSelectedGraphNode] = useState<string | null>('1');

  const handleAddNode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nodeLabel.trim()) return;
    const newId = `${nodes.length + 1}`;
    const newNode: GraphNode = {
      id: newId,
      label: nodeLabel.trim(),
      type: nodeType
    };
    setNodes([...nodes, newNode]);
    setSelectedGraphNode(newId);
    setNodeLabel('');
  };

  const handleAddEdge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!edgeSource || !edgeTarget || !edgeLabel.trim()) return;
    const newEdge: GraphEdge = {
      id: `e_${Date.now()}`,
      source: edgeSource,
      target: edgeTarget,
      label: edgeLabel.trim().toUpperCase()
    };
    setEdges([...edges, newEdge]);
    setEdgeLabel('');
  };

  const handleDeleteNode = (id: string) => {
    setNodes(nodes.filter(n => n.id !== id));
    setEdges(edges.filter(e => e.source !== id && e.target !== id));
    if (selectedGraphNode === id) setSelectedGraphNode(null);
  };

  const getConnectedElements = (nodeId: string | null) => {
    if (!nodeId) return { connectedEdges: [], connectedNodes: [] };
    const connectedEdges = edges.filter(e => e.source === nodeId || e.target === nodeId);
    const connectedNodeIds = new Set<string>();
    connectedEdges.forEach(e => {
      connectedNodeIds.add(e.source);
      connectedNodeIds.add(e.target);
    });
    connectedNodeIds.delete(nodeId);
    const connectedNodes = nodes.filter(n => connectedNodeIds.has(n.id));
    return { connectedEdges, connectedNodes };
  };

  const { connectedEdges, connectedNodes } = getConnectedElements(selectedGraphNode);
  const currentNodeInfo = nodes.find(n => n.id === selectedGraphNode);

  return (
    <section id="playground" className="bg-slate-50 py-16 px-4 sm:px-6 lg:px-8 text-slate-800 border-b border-slate-200">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Text */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-semibold rounded-full uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Sandbox Interativa</span>
          </div>
          <h2 className="font-heading text-3xl font-extrabold tracking-tight text-slate-900">
            Laboratório Prático NoSQL
          </h2>
          <p className="mt-4 text-slate-600 font-light text-base sm:text-lg">
            Experimente em tempo real como cada banco armazena, modela, altera e consulta dados fictícios 
            baseados no contexto institucional do IMD/UFRN.
          </p>
        </div>

        {/* Sandbox Paradigm Selection Buttons */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          <button
            id="sandbox-tab-document"
            onClick={() => setParadigm('document')}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-heading text-sm font-bold transition-all border ${
              paradigm === 'document'
                ? 'bg-indigo-600 border-indigo-500 text-white shadow-sm scale-[1.02]'
                : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-300 hover:bg-slate-50'
            }`}
          >
            <FileJson className="w-4 h-4" />
            <span>Coleção de Documentos</span>
          </button>
          <button
            id="sandbox-tab-keyvalue"
            onClick={() => setParadigm('keyvalue')}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-heading text-sm font-bold transition-all border ${
              paradigm === 'keyvalue'
                ? 'bg-indigo-600 border-indigo-500 text-white shadow-sm scale-[1.02]'
                : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-300 hover:bg-slate-50'
            }`}
          >
            <KeyRound className="w-4 h-4" />
            <span>Redis K-V Store</span>
          </button>
          <button
            id="sandbox-tab-widecolumn"
            onClick={() => setParadigm('widecolumn')}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-heading text-sm font-bold transition-all border ${
              paradigm === 'widecolumn'
                ? 'bg-indigo-600 border-indigo-500 text-white shadow-sm scale-[1.02]'
                : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-300 hover:bg-slate-50'
            }`}
          >
            <Columns4 className="w-4 h-4" />
            <span>Wide-Column Family</span>
          </button>
          <button
            id="sandbox-tab-graph"
            onClick={() => setParadigm('graph')}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-heading text-sm font-bold transition-all border ${
              paradigm === 'graph'
                ? 'bg-indigo-600 border-indigo-500 text-white shadow-sm scale-[1.02]'
                : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-300 hover:bg-slate-50'
            }`}
          >
            <Network className="w-4 h-4" />
            <span>Banco de Grafos</span>
          </button>
        </div>

        {/* Dynamic Sandbox Main Window */}
        <div className="bg-slate-900 rounded-3xl border border-slate-800 shadow-xl p-6 sm:p-8 min-h-[500px]">
          
          {/* ==================== 1. DOCUMENT PLAYGROUND ==================== */}
          {paradigm === 'document' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
              {/* Context bar */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
                <div>
                  <h3 className="font-heading text-lg font-bold text-indigo-400 flex items-center gap-2">
                    <FileJson className="w-5 h-5" /> Banco de Documentos (JSON Coleção)
                  </h3>
                  <p className="text-xs text-slate-400 font-light">Coleções são esquemas livres. Você pode filtrar e incluir atributos à vontade.</p>
                </div>
                <div className="text-xs text-indigo-300/80 font-mono bg-indigo-950/40 px-3 py-1 rounded-lg border border-indigo-900/40">
                  Total na coleção: {documents.length} docs
                </div>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                {/* Left side: Query Filters & Insert */}
                <div className="xl:col-span-4 space-y-6">
                  {/* Search Query form */}
                  <div className="bg-slate-900/50 p-5 rounded-2xl border border-slate-800 space-y-4">
                    <h4 className="font-heading text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                      <Search className="w-4 h-4 text-indigo-500" /> Filtrar Documentos
                    </h4>
                    
                    <div className="space-y-1">
                      <label className="text-xs text-slate-400">Palavra-chave (Título/Tags)</label>
                      <input 
                        type="text" 
                        value={docSearch}
                        onChange={(e) => setDocSearch(e.target.value)}
                        placeholder="Ex: Gamer, Teclado..."
                        className="w-full text-xs px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl focus:border-indigo-500 text-slate-100 outline-none transition-colors"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs text-slate-400">Categoria</label>
                        <select 
                          value={docCategory}
                          onChange={(e) => setDocCategory(e.target.value)}
                          className="w-full text-xs px-2.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 outline-none"
                        >
                          <option value="Todos">Todos</option>
                          <option value="Eletrônicos">Eletrônicos</option>
                          <option value="Periféricos">Periféricos</option>
                          <option value="Móveis">Móveis</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs text-slate-400">Preço Máximo: R$ {docMaxPrice}</label>
                        <input 
                          type="range" 
                          min="100" 
                          max="1500" 
                          step="50"
                          value={docMaxPrice}
                          onChange={(e) => setDocMaxPrice(parseInt(e.target.value))}
                          className="w-full h-1 bg-slate-850 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <input 
                        type="checkbox" 
                        id="instock"
                        checked={docOnlyInStock}
                        onChange={(e) => setDocOnlyInStock(e.target.checked)}
                        className="rounded border-slate-800 bg-slate-950 text-indigo-500 focus:ring-0 w-4 h-4"
                      />
                      <label htmlFor="instock" className="text-xs text-slate-300 cursor-pointer">Apenas em Estoque</label>
                    </div>
                  </div>

                  {/* Insert Document JSON */}
                  <div className="bg-slate-900/50 p-5 rounded-2xl border border-slate-800 space-y-4">
                    <h4 className="font-heading text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                      <Plus className="w-4 h-4 text-emerald-500" /> Inserir Novo Documento
                    </h4>
                    <textarea
                      value={newDocJSON}
                      onChange={(e) => setNewDocJSON(e.target.value)}
                      rows={8}
                      className="w-full font-mono text-xs p-3 bg-slate-950 border border-slate-800 rounded-xl text-indigo-300 focus:border-emerald-500 outline-none transition-colors"
                    />
                    
                    {docError && (
                      <div className="p-3 bg-rose-950/40 border border-rose-900/50 rounded-xl flex gap-2 items-start text-xs text-rose-300">
                        <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                        <span>{docError}</span>
                      </div>
                    )}

                    <button
                      onClick={handleAddDocument}
                      className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-heading font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Adicionar Documento JSON</span>
                    </button>
                  </div>
                </div>

                {/* Right side: Live collection document viewer */}
                <div className="xl:col-span-8 space-y-4">
                  <h4 className="font-heading text-sm font-bold text-slate-400 uppercase tracking-wider">
                    Coleção: <code className="text-indigo-400">db.produtos</code> ({filteredDocs.length} exibidos)
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[550px] overflow-y-auto pr-1">
                    <AnimatePresence mode="popLayout">
                      {filteredDocs.length > 0 ? (
                        filteredDocs.map((doc) => (
                          <motion.div
                            key={doc.id}
                            layout
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="bg-slate-950 rounded-2xl p-5 border border-slate-800/80 hover:border-indigo-900/50 transition-colors flex flex-col justify-between shadow-xl relative group"
                          >
                            <button
                              onClick={() => handleDeleteDocument(doc.id)}
                              className="absolute top-4 right-4 p-1.5 bg-slate-900 hover:bg-rose-950 text-slate-500 hover:text-rose-400 rounded-lg border border-slate-800 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                              title="Remover Documento"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>

                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-[10px] bg-indigo-950/60 text-indigo-400 border border-indigo-900/40 px-2 py-0.5 rounded-md font-semibold">
                                  {doc.category}
                                </span>
                                <span className={`text-[10px] px-2 py-0.5 rounded-md font-semibold ${
                                  doc.inStock 
                                    ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-900/40' 
                                    : 'bg-rose-950/60 text-rose-400 border border-rose-900/40'
                                }`}>
                                  {doc.inStock ? 'Em estoque' : 'Esgotado'}
                                </span>
                              </div>

                              <h5 className="font-heading text-sm font-bold text-white mb-2 pr-6">
                                {doc.title}
                              </h5>

                              {/* Tags */}
                              <div className="flex flex-wrap gap-1 mb-4">
                                {doc.tags.map((tag, i) => (
                                  <span key={i} className="text-[9px] bg-slate-900 border border-slate-850 px-1.5 py-0.5 rounded-md text-slate-400">
                                    #{tag}
                                  </span>
                                ))}
                              </div>
                            </div>

                            <div className="border-t border-slate-900/80 pt-3 mt-3 flex items-center justify-between">
                              <span className="font-mono text-emerald-400 font-semibold text-sm">
                                R$ {doc.price.toFixed(2)}
                              </span>
                              <div className="text-[10px] text-slate-500 font-mono">
                                Views: {doc.metadata.views} • ★ {doc.metadata.rating}
                              </div>
                            </div>
                          </motion.div>
                        ))
                      ) : (
                        <div className="col-span-2 py-16 text-center text-slate-500 font-light text-sm bg-slate-950 rounded-2xl border border-slate-800">
                          Nenhum documento atende aos filtros de pesquisa atuais.
                        </div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ==================== 2. KEY-VALUE PLAYGROUND ==================== */}
          {paradigm === 'keyvalue' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
              {/* Context bar */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
                <div>
                  <h3 className="font-heading text-lg font-bold text-indigo-400 flex items-center gap-2">
                    <KeyRound className="w-5 h-5" /> Redis Key-Value Store
                  </h3>
                  <p className="text-xs text-slate-400 font-light">Armazenamento em memória RAM super veloz. Toda pesquisa é feita por chaves exatas.</p>
                </div>
                <div className="text-xs text-indigo-300/80 font-mono bg-indigo-950/40 px-3 py-1 rounded-lg border border-indigo-900/40">
                  Dicionário ativo: {keyValues.length} chaves
                </div>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                {/* Left Column: Command CLI & Write Form */}
                <div className="xl:col-span-5 space-y-6">
                  {/* CLI Terminal Simulator */}
                  <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
                    <div className="bg-slate-900 px-4 py-2 border-b border-slate-800 flex items-center justify-between text-xs font-mono font-bold text-slate-400">
                      <span className="flex items-center gap-1.5">
                        <Terminal className="w-3.5 h-3.5 text-indigo-500" /> redis-cli - NoSQL_IMD
                      </span>
                      <span className="text-[10px] text-indigo-400">port: 6379</span>
                    </div>

                    <div className="p-4 font-mono text-xs space-y-3">
                      <p className="text-slate-500">// Simule comandos Redis como SET, GET ou DEL:</p>
                      
                      {/* Interactive log display */}
                      <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-850 min-h-[80px] flex items-center text-indigo-300">
                        {cliFeedback}
                      </div>

                      {/* Commands prompt form */}
                      <div className="flex gap-2">
                        <span className="text-indigo-500 font-bold">127.0.0.1:6379&gt;</span>
                        <input
                          type="text"
                          value={cliCommand}
                          onChange={(e) => setCliCommand(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              executeRedisCommand(cliCommand);
                              setCliCommand('');
                            }
                          }}
                          placeholder="Ex: SET config:maintenance true"
                          className="flex-1 bg-transparent border-none outline-none text-white text-xs select-text"
                        />
                        <button
                          onClick={() => {
                            executeRedisCommand(cliCommand);
                            setCliCommand('');
                          }}
                          className="p-1 bg-indigo-950 hover:bg-indigo-900 border border-indigo-800 rounded-md"
                          title="Executar Comando"
                        >
                          <Play className="w-3.5 h-3.5 text-indigo-400" />
                        </button>
                      </div>
                    </div>

                    {/* Quick presets buttons panel */}
                    <div className="bg-slate-900/40 p-3 border-t border-slate-800/80">
                      <span className="text-[9px] font-bold text-slate-500 uppercase block mb-2">Comandos Rápidos de Teste:</span>
                      <div className="flex flex-wrap gap-1.5">
                        <button 
                          onClick={() => executeRedisCommand('GET session:user:1024')}
                          className="text-[10px] px-2 py-1 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 rounded font-mono"
                        >
                          GET user:1024
                        </button>
                        <button 
                          onClick={() => executeRedisCommand('SET rate_limit:ip:192.168.1.1 99')}
                          className="text-[10px] px-2 py-1 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 rounded font-mono"
                        >
                          SET rate_limit 99
                        </button>
                        <button 
                          onClick={() => executeRedisCommand('KEYS *')}
                          className="text-[10px] px-2 py-1 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 rounded font-mono"
                        >
                          KEYS *
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Form Panel to SET */}
                  <form onSubmit={handleKvFormSubmit} className="bg-slate-900/50 p-5 rounded-2xl border border-slate-800 space-y-4">
                    <h4 className="font-heading text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                      <Plus className="w-4 h-4 text-indigo-500" /> Inserir Par Chave-Valor
                    </h4>

                    <div className="space-y-1">
                      <label className="text-xs text-slate-400">Chave Única (Key)</label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: session:user:1024"
                        value={kvKey}
                        onChange={(e) => setKvKey(e.target.value)}
                        className="w-full text-xs px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs text-slate-400">Valor (Value)</label>
                        <input
                          type="text"
                          required
                          placeholder="Ex: {'admin': true}"
                          value={kvVal}
                          onChange={(e) => setKvVal(e.target.value)}
                          className="w-full text-xs px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 outline-none focus:border-indigo-500"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs text-slate-400">Tipo de Dado</label>
                        <select
                          value={kvType}
                          onChange={(e) => setKvType(e.target.value)}
                          className="w-full text-xs px-2.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 outline-none"
                        >
                          <option value="String">String (Texto)</option>
                          <option value="String/JSON">JSON</option>
                          <option value="Integer">Inteiro</option>
                          <option value="List/Array">Lista (Array)</option>
                          <option value="Boolean">Booleano</option>
                        </select>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-heading font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Inserir no Redis</span>
                    </button>
                  </form>
                </div>

                {/* Right Column: Live Memory Dictionary Table */}
                <div className="xl:col-span-7 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <h4 className="font-heading text-sm font-bold text-slate-400 uppercase tracking-wider">
                      Espaço de Endereçamento em Memória
                    </h4>

                    {/* Search box within memory */}
                    <div className="relative max-w-xs">
                      <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input 
                        type="text"
                        placeholder="Pesquisar chave..."
                        value={searchKVTerm}
                        onChange={(e) => setSearchKVTerm(e.target.value)}
                        className="text-xs bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="overflow-x-auto border border-slate-800 rounded-2xl shadow-xl bg-slate-950">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-900 border-b border-slate-800 text-slate-400 font-bold font-heading">
                          <th className="p-4">Chave (Key)</th>
                          <th className="p-4">Valor (Value)</th>
                          <th className="p-4">Tipo</th>
                          <th className="p-4">Última Escrita</th>
                          <th className="p-4 text-center">Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {keyValues
                          .filter(kv => kv.key.toLowerCase().includes(searchKVTerm.toLowerCase()))
                          .map((kv, i) => (
                            <tr key={kv.key} className="border-b border-slate-900 hover:bg-slate-900/40 transition-colors">
                              <td className="p-4 font-mono font-bold text-indigo-400 select-all">{kv.key}</td>
                              <td className="p-4 font-mono text-slate-300 max-w-xs truncate" title={kv.value}>{kv.value}</td>
                              <td className="p-4">
                                <span className="px-2 py-0.5 rounded-full bg-slate-850 text-slate-400 font-mono text-[10px]">
                                  {kv.type}
                                </span>
                              </td>
                              <td className="p-4 text-[10px] text-slate-500 font-mono">{kv.updatedAt}</td>
                              <td className="p-4 text-center">
                                <div className="flex justify-center gap-1.5">
                                  <button
                                    onClick={() => executeRedisCommand(`GET ${kv.key}`)}
                                    className="px-2 py-1 bg-slate-900 hover:bg-indigo-950 border border-slate-800 text-indigo-400 rounded-md font-bold transition-all text-[10px]"
                                    title="GET"
                                  >
                                    GET
                                  </button>
                                  <button
                                    onClick={() => executeRedisCommand(`DEL ${kv.key}`)}
                                    className="p-1 bg-slate-900 hover:bg-rose-950 border border-slate-800 text-rose-500 rounded-md transition-all"
                                    title="DEL"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        {keyValues.filter(kv => kv.key.toLowerCase().includes(searchKVTerm.toLowerCase())).length === 0 && (
                          <tr>
                            <td colSpan={5} className="p-8 text-center text-slate-500 font-light text-xs font-mono">
                              (empty list or set)
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ==================== 3. WIDE-COLUMN PLAYGROUND ==================== */}
          {paradigm === 'widecolumn' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
              {/* Context bar */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
                <div>
                  <h3 className="font-heading text-lg font-bold text-pink-400 flex items-center gap-2">
                    <Columns4 className="w-5 h-5" /> Banco de Família de Colunas (Wide-Column)
                  </h3>
                  <p className="text-xs text-slate-400 font-light">
                    Otimizado para colunas esparsas e grande escala. Linhas distintas no mesmo espaço de chaves podem possuir colunas completamente diferentes.
                  </p>
                </div>
                <div className="text-xs text-pink-300/80 font-mono bg-pink-950/40 px-3 py-1 rounded-lg border border-pink-900/40">
                  Espaço de Chaves: <code>ufrn_academic_keyspace</code>
                </div>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                {/* Left side: Insertion form */}
                <div className="xl:col-span-4 space-y-6">
                  <form onSubmit={handleAddColumnValue} className="bg-slate-900/50 p-5 rounded-2xl border border-slate-800 space-y-4">
                    <h4 className="font-heading text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                      <Plus className="w-4 h-4 text-pink-500" /> Atualizar / Inserir Coluna
                    </h4>

                    <div className="space-y-1">
                      <label className="text-xs text-slate-400">Row Key (Identificador da Linha)</label>
                      <select
                        value={newRowKey}
                        onChange={(e) => setNewRowKey(e.target.value)}
                        className="w-full text-xs px-2.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 outline-none"
                      >
                        <option value="">Selecione ou crie uma linha...</option>
                        {columns.map(c => (
                          <option key={c.rowKey} value={c.rowKey}>{c.rowKey}</option>
                        ))}
                        <option value="usr_ufrn_nova">usr_ufrn_nova (Criar nova linha)</option>
                        <option value="usr_ufrn_externo">usr_ufrn_externo (Criar nova linha)</option>
                      </select>
                      
                      {/* Manual text backup row key if they select "usr_ufrn_nova" */}
                      {(newRowKey.includes('nova') || newRowKey.includes('externo')) && (
                        <input
                          type="text"
                          placeholder="Digite o Row Key personalizado"
                          value={newRowKey}
                          onChange={(e) => setNewRowKey(e.target.value)}
                          className="w-full text-xs px-3 py-2 mt-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 outline-none focus:border-pink-500 font-mono"
                        />
                      )}
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs text-slate-400">Column Family (Família de Colunas)</label>
                      <select
                        value={colFamily}
                        onChange={(e) => setColFamily(e.target.value as any)}
                        className="w-full text-xs px-2.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 outline-none"
                      >
                        <option value="personal">personal (Dados Pessoais)</option>
                        <option value="activity">activity (Métricas de Acesso)</option>
                        <option value="preferences">preferences (Preferências do Usuário)</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs text-slate-400">Coluna (Column)</label>
                        <input
                          type="text"
                          required
                          placeholder="Ex: matricula, cargo"
                          value={colKey}
                          onChange={(e) => setColKey(e.target.value)}
                          className="w-full text-xs px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 outline-none focus:border-pink-500"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs text-slate-400">Valor (Value)</label>
                        <input
                          type="text"
                          required
                          placeholder="Ex: 202612345, Admin"
                          value={colVal}
                          onChange={(e) => setColVal(e.target.value)}
                          className="w-full text-xs px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 outline-none focus:border-pink-500"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={!newRowKey}
                      className="w-full py-2.5 bg-pink-600 hover:bg-pink-500 disabled:opacity-50 disabled:hover:bg-pink-600 text-white font-heading font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Inserir Coluna na Linha</span>
                    </button>
                  </form>

                  <div className="p-4 bg-slate-950 border border-slate-850 rounded-2xl flex gap-2 text-xs text-slate-400">
                    <HelpCircle className="w-4 h-4 shrink-0 text-pink-400 mt-0.5" />
                    <p className="leading-relaxed">
                      <strong>Dica didática:</strong> Repare que, diferente de uma tabela SQL tradicional onde uma coluna em branco ocupa espaço e exige estrutura de esquema rígida, em bancos NoSQL colunares as colunas só existem fisicamente se tiverem valores gravados.
                    </p>
                  </div>
                </div>

                {/* Right side: Interactive Column Visualizer */}
                <div className="xl:col-span-8 space-y-4">
                  <h4 className="font-heading text-sm font-bold text-slate-400 uppercase tracking-wider">
                    Famílias de Colunas em Cassandra / Bigtable
                  </h4>

                  <div className="space-y-5 max-h-[500px] overflow-y-auto pr-1">
                    {columns.map((row) => (
                      <div 
                        key={row.rowKey} 
                        className="bg-slate-950 rounded-2xl border border-slate-800 p-5 shadow-lg space-y-4"
                      >
                        {/* Row Key Badge */}
                        <div className="flex items-center justify-between border-b border-slate-900 pb-3">
                          <span className="font-mono text-xs text-pink-400 font-bold">
                            RowKey: <span className="text-white underline decoration-pink-500">{row.rowKey}</span>
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">
                            Cassandra Partition Key
                          </span>
                        </div>

                        {/* Column Families Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          
                          {/* 1. Personal Family */}
                          <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-850 space-y-2">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block border-b border-slate-850 pb-1 mb-1 text-pink-400">
                              col_family: personal
                            </span>
                            <div className="space-y-1.5 font-mono text-xs">
                              {Object.entries(row.families.personal).map(([col, val]) => val && (
                                <div key={col} className="flex justify-between gap-2 border-b border-slate-950 pb-1">
                                  <span className="text-slate-500 text-[10px]">{col}:</span>
                                  <span className="text-slate-200 font-medium truncate" title={val}>{val}</span>
                                </div>
                              ))}
                              {Object.values(row.families.personal).every(v => !v) && (
                                <span className="text-[10px] text-slate-600 block italic">Sem colunas gravadas</span>
                              )}
                            </div>
                          </div>

                          {/* 2. Activity Family */}
                          <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-850 space-y-2">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block border-b border-slate-850 pb-1 mb-1 text-purple-400">
                              col_family: activity
                            </span>
                            <div className="space-y-1.5 font-mono text-xs">
                              {Object.entries(row.families.activity).map(([col, val]) => val && (
                                <div key={col} className="flex justify-between gap-2 border-b border-slate-950 pb-1">
                                  <span className="text-slate-500 text-[10px]">{col}:</span>
                                  <span className="text-slate-200 font-medium truncate" title={val}>{val}</span>
                                </div>
                              ))}
                              {Object.values(row.families.activity).every(v => !v) && (
                                <span className="text-[10px] text-slate-600 block italic">Sem colunas gravadas</span>
                              )}
                            </div>
                          </div>

                          {/* 3. Preferences Family */}
                          <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-850 space-y-2">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block border-b border-slate-850 pb-1 mb-1 text-teal-400">
                              col_family: preferences
                            </span>
                            <div className="space-y-1.5 font-mono text-xs">
                              {Object.entries(row.families.preferences).map(([col, val]) => val && (
                                <div key={col} className="flex justify-between gap-2 border-b border-slate-950 pb-1">
                                  <span className="text-slate-500 text-[10px]">{col}:</span>
                                  <span className="text-slate-200 font-medium truncate" title={val}>{val}</span>
                                </div>
                              ))}
                              {Object.values(row.families.preferences).every(v => !v) && (
                                <span className="text-[10px] text-slate-600 block italic">Sem colunas gravadas</span>
                              )}
                            </div>
                          </div>

                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ==================== 4. GRAPH PLAYGROUND ==================== */}
          {paradigm === 'graph' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
              {/* Context bar */}
              <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
                <div>
                  <h3 className="font-heading text-lg font-bold text-teal-400 flex items-center gap-2">
                    <Network className="w-5 h-5" /> Banco de Dados de Grafos (Nós e Arestas)
                  </h3>
                  <p className="text-xs text-slate-400 font-light">
                    Mapeie conexões diretas. Excelente para modelar redes sociais, relações de turmas, conselhos e fluxos do IMD/UFRN.
                  </p>
                </div>
                <div className="text-xs text-teal-300/80 font-mono bg-teal-950/40 px-3 py-1 rounded-lg border border-teal-900/40">
                  Total: {nodes.length} nós • {edges.length} relações
                </div>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                {/* Left side: Node / Edge Creators */}
                <div className="xl:col-span-4 space-y-6">
                  {/* Create Node Form */}
                  <form onSubmit={handleAddNode} className="bg-slate-900/50 p-5 rounded-2xl border border-slate-800 space-y-4">
                    <h4 className="font-heading text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                      <Plus className="w-4 h-4 text-teal-400" /> Criar Vértice (Nó)
                    </h4>
                    
                    <div className="space-y-1">
                      <label className="text-xs text-slate-400">Nome / Rótulo do Nó</label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: Disciplina NoSQL, Prof. Álvaro"
                        value={nodeLabel}
                        onChange={(e) => setNodeLabel(e.target.value)}
                        className="w-full text-xs px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 outline-none focus:border-teal-500"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs text-slate-400">Tipo de Nó</label>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { id: 'student', name: 'Estudante', color: 'border-indigo-500 text-indigo-400' },
                          { id: 'professor', name: 'Professor', color: 'border-purple-500 text-purple-400' },
                          { id: 'course', name: 'Disciplina', color: 'border-pink-500 text-pink-400' },
                          { id: 'department', name: 'Instituto/Depto', color: 'border-teal-500 text-teal-400' }
                        ].map(t => (
                          <button
                            key={t.id}
                            type="button"
                            onClick={() => setNodeType(t.id as any)}
                            className={`px-3 py-1.5 text-xs border rounded-xl font-heading text-center transition-all ${
                              nodeType === t.id 
                                ? 'bg-slate-800 font-bold scale-[1.02] ' + t.color 
                                : 'border-slate-800 hover:bg-slate-900 text-slate-400'
                            }`}
                          >
                            {t.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-heading font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Adicionar Nó</span>
                    </button>
                  </form>

                  {/* Create Edge Relationship Form */}
                  <form onSubmit={handleAddEdge} className="bg-slate-900/50 p-5 rounded-2xl border border-slate-800 space-y-4">
                    <h4 className="font-heading text-sm font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                      <Share2 className="w-4 h-4 text-teal-400" /> Conectar Nós (Aresta)
                    </h4>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs text-slate-400">Origem (De)</label>
                        <select
                          required
                          value={edgeSource}
                          onChange={(e) => setEdgeSource(e.target.value)}
                          className="w-full text-xs px-2.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 outline-none"
                        >
                          <option value="">Origem...</option>
                          {nodes.map(n => (
                            <option key={n.id} value={n.id}>{n.label}</option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs text-slate-400">Destino (Para)</label>
                        <select
                          required
                          value={edgeTarget}
                          onChange={(e) => setEdgeTarget(e.target.value)}
                          className="w-full text-xs px-2.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 outline-none"
                        >
                          <option value="">Destino...</option>
                          {nodes.map(n => (
                            <option key={n.id} value={n.id}>{n.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs text-slate-400">Nome do Relacionamento (Label)</label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: ESTUDA_NO, MINISTRA, CURSA"
                        value={edgeLabel}
                        onChange={(e) => setEdgeLabel(e.target.value)}
                        className="w-full text-xs px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 outline-none focus:border-teal-500 font-mono"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={!edgeSource || !edgeTarget}
                      className="w-full py-2.5 bg-teal-600 hover:bg-teal-500 disabled:opacity-50 disabled:hover:bg-teal-600 text-white font-heading font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors shadow-lg"
                    >
                      <Share2 className="w-4 h-4" />
                      <span>Criar Relacionamento</span>
                    </button>
                  </form>
                </div>

                {/* Right side: Graph Traversal Viewer */}
                <div className="xl:col-span-8 space-y-4">
                  <h4 className="font-heading text-sm font-bold text-slate-400 uppercase tracking-wider">
                    Visualizador de Relacionamentos (Graph Traversal Engine)
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Node List with Selection */}
                    <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800 space-y-3">
                      <span className="text-[10px] font-bold text-slate-500 uppercase block border-b border-slate-900 pb-2">
                        Selecione um Nó para Consultar Vizinhança
                      </span>
                      <div className="space-y-1.5 max-h-[350px] overflow-y-auto pr-1">
                        {nodes.map(node => (
                          <div
                            key={node.id}
                            onClick={() => setSelectedGraphNode(node.id)}
                            className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl border cursor-pointer transition-all ${
                              selectedGraphNode === node.id 
                                ? 'bg-teal-950/60 border-teal-500 text-white shadow-md' 
                                : 'bg-slate-900/50 border-slate-850 hover:border-slate-800 hover:bg-slate-900 text-slate-300'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <div className={`w-2.5 h-2.5 rounded-full ${
                                node.type === 'student' ? 'bg-indigo-500' :
                                node.type === 'professor' ? 'bg-purple-500' :
                                node.type === 'course' ? 'bg-pink-500' : 'bg-teal-500'
                              }`} />
                              <span className="text-xs font-semibold">{node.label}</span>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteNode(node.id);
                              }}
                              className="p-1 bg-slate-900 hover:bg-rose-950 text-slate-500 hover:text-rose-400 rounded-md"
                              title="Deletar Nó"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Neighborhood Visual Board (Node relationships traversal) */}
                    <div className="bg-slate-950 rounded-2xl p-5 border border-slate-800 flex flex-col justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase block border-b border-slate-900 pb-2 mb-4">
                          Relações diretas (Traversal local)
                        </span>

                        {currentNodeInfo ? (
                          <div className="space-y-4">
                            {/* Current selected node badge */}
                            <div className="flex justify-center">
                              <div className="bg-slate-900 border border-slate-800 px-5 py-3 rounded-2xl flex flex-col items-center text-center shadow-md border-t-4 border-t-teal-500 max-w-[200px] w-full">
                                <span className="text-[9px] text-slate-400 uppercase font-mono font-bold tracking-wider">{currentNodeInfo.type}</span>
                                <span className="text-xs font-bold text-white mt-1">{currentNodeInfo.label}</span>
                              </div>
                            </div>

                            {/* Connected Nodes List */}
                            <div className="space-y-2 pt-2">
                              <span className="text-[10px] font-bold text-slate-500 block">Conexões Ativas:</span>
                              <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
                                {connectedEdges.map(edge => {
                                  const isSource = edge.source === currentNodeInfo.id;
                                  const targetNode = nodes.find(n => n.id === (isSource ? edge.target : edge.source));
                                  return targetNode ? (
                                    <div key={edge.id} className="flex items-center gap-2 bg-slate-900 p-2 rounded-xl border border-slate-850">
                                      <span className="text-[10px] font-mono text-teal-400 bg-teal-950/30 border border-teal-900/40 px-2 py-0.5 rounded-md">
                                        {isSource ? '➔' : '🠴'} {edge.label}
                                      </span>
                                      <span className="text-[11px] text-slate-300 font-medium">
                                        {targetNode.label}
                                      </span>
                                    </div>
                                  ) : null;
                                })}
                                {connectedEdges.length === 0 && (
                                  <p className="text-xs text-slate-600 italic py-4 text-center">Nenhum relacionamento criado para este nó.</p>
                                )}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="py-20 text-center text-slate-600 text-xs italic">
                            Selecione um nó ao lado para ver sua rede de conexões.
                          </div>
                        )}
                      </div>

                      {/* Technical footnote */}
                      <div className="text-[9px] text-slate-600 border-t border-slate-900/80 pt-3 mt-4 text-center">
                        Queries de grafos buscam conexões sem usar junções SQL lentas (Index-free adjacency).
                      </div>
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
