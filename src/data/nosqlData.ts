/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { NoSQLTypeInfo, DocumentData, KeyValueData, ColumnFamilyData, GraphNode, GraphEdge } from '../types';

export const NOSQL_TYPES: NoSQLTypeInfo[] = [
  {
    id: 'document',
    name: 'Banco de Documentos',
    description: 'Armazena dados em formatos de documentos semirregulados, como JSON, BSON ou XML. Cada documento contém pares de chave-valor autoexplicativos que podem variar estruturalmente de registro para registro.',
    structure: 'Documentos JSON aninhados com esquemas flexíveis (Schema-less).',
    pros: [
      'Esquema altamente flexível e dinâmico',
      'Escalabilidade horizontal robusta',
      'Excelente desempenho para leituras e escritas rápidas',
      'Mapeamento natural para objetos na programação moderna'
    ],
    cons: [
      'Falta de consistência estrita ACID completa em múltiplos documentos',
      'Consultas complexas com junções (joins) são difíceis e custosas',
      'Duplicação de dados comum devido à desnormalização'
    ],
    bestUseCases: [
      'Gerenciadores de Conteúdo (CMS)',
      'Plataformas de E-commerce (Catálogo de produtos)',
      'Perfis de Usuários dinâmicos',
      'Registros de eventos com estruturas mutáveis'
    ],
    databases: ['MongoDB', 'CouchDB', 'Firebase Firestore', 'Amazon DocumentDB'],
    icon: 'FileJson'
  },
  {
    id: 'keyvalue',
    name: 'Banco Chave-Valor',
    description: 'O modelo NoSQL mais simples e de melhor desempenho. Os dados são armazenados como uma coleção de pares de chaves exclusivas e valores opacos. Ideal para buscas ultrarrápidas de latência sub-milissegundo.',
    structure: 'Dicionário global indexado onde uma chave única aponta para um valor arbitrário (texto, objeto, binário).',
    pros: [
      'Latência extremamente baixa (leituras e escritas instantâneas)',
      'Simplicidade máxima de implementação',
      'Escalabilidade horizontal massiva e automática',
      'Excelente para cache de dados temporários'
    ],
    cons: [
      'Incapaz de consultar o conteúdo interno do valor sem recuperar a chave',
      'Sem suporte a relacionamentos ou chaves secundárias nativas',
      'Toda a lógica de filtragem complexa é delegada para o cliente'
    ],
    bestUseCases: [
      'Gerenciamento de Sessão de Usuários',
      'Carrinhos de Compra em tempo real',
      'Cache de banco de dados e APIs (ex: Redis)',
      'Preferências e configurações rápidas de apps'
    ],
    databases: ['Redis', 'Amazon DynamoDB', 'Memcached', 'Riak'],
    icon: 'KeyRound'
  },
  {
    id: 'widecolumn',
    name: 'Banco de Família de Colunas',
    description: 'Armazena dados em tabelas com linhas que podem conter um número variável de colunas de forma dinâmica. As colunas são agrupadas em famílias lógicas, otimizando o armazenamento e a leitura de trilhões de registros.',
    structure: 'Espaço de chaves bidimensional de tabelas estruturadas com famílias de colunas dinâmicas (Wide-Column).',
    pros: [
      'Lida com volumes de petabytes e exabytes de dados',
      'Altamente otimizado para escritas de alta frequência e velocidade',
      'Compressão de dados ultra eficiente por coluna',
      'Excelente tolerância a falhas distribuídas'
    ],
    cons: [
      'Esquema de indexação complexo focado em padrões de acesso rígidos',
      'Nenhum suporte para junções ad-hoc',
      'Curva de aprendizado íngreme para modelagem de tabelas'
    ],
    bestUseCases: [
      'Sistemas de Telemetria e IoT',
      'Análise de dados temporais e séries históricas (Logística)',
      'Sistemas de recomendação de anúncios em larga escala',
      'Armazenamento de histórico de cliques (Clickstream)'
    ],
    databases: ['Apache Cassandra', 'HBase', 'Google Cloud Bigtable', 'ScyllaDB'],
    icon: 'Columns4'
  },
  {
    id: 'graph',
    name: 'Banco de Grafos',
    description: 'Usa estruturas de grafos com vértices (nós), arestas (relacionamentos) e propriedades para armazenar dados. Perfeito para cenários onde as conexões entre os dados são tão ou mais importantes que os dados em si.',
    structure: 'Rede de Nós conectados por Relações direcionadas e tipadas, ambos contendo atributos próprios.',
    pros: [
      'Navegação ultrarrápida por relacionamentos (traversal)',
      'Flexibilidade absoluta para adicionar novas conexões',
      'Perfeito para modelar dados interconectados complexos',
      'Respostas de consultas em tempo real para redes sociais'
    ],
    cons: [
      'Difícil de escalonar horizontalmente de forma distribuída (particionamento de grafos)',
      'Baixo desempenho para agregações globais ou relatórios analíticos massivos',
      'Linguagens de consulta especializadas necessárias (Cypher, Gremlin)'
    ],
    bestUseCases: [
      'Redes Sociais (amigos, seguidores, interações)',
      'Motores de Recomendação personalizada',
      'Sistemas de Detecção de Fraude financeira',
      'Gerenciamento de Redes e Grafos de Conhecimento'
    ],
    databases: ['Neo4j', 'JanusGraph', 'Amazon Neptune', 'ArangoDB'],
    icon: 'Network'
  }
];

// Document Sandbox Initial Data
export const INITIAL_DOCUMENTS: DocumentData[] = [
  {
    id: 'doc_1',
    title: 'Monitor Gamer 144Hz IPS',
    category: 'Eletrônicos',
    price: 1299.90,
    tags: ['Gamer', 'Monitor', 'Hardware'],
    inStock: true,
    metadata: { views: 1240, rating: 4.8 }
  },
  {
    id: 'doc_2',
    title: 'Teclado Mecânico RGB Switch Blue',
    category: 'Periféricos',
    price: 349.90,
    tags: ['Gamer', 'Teclado', 'RGB'],
    inStock: true,
    metadata: { views: 850, rating: 4.5 }
  },
  {
    id: 'doc_3',
    title: 'Cadeira Ergonômica Pro',
    category: 'Móveis',
    price: 899.00,
    tags: ['Ergonomia', 'Escritório', 'Premium'],
    inStock: false,
    metadata: { views: 2310, rating: 4.9 }
  },
  {
    id: 'doc_4',
    title: 'Mouse Sem Fio UltraLight',
    category: 'Periféricos',
    price: 249.99,
    tags: ['Mouse', 'Wireless', 'Gamer'],
    inStock: true,
    metadata: { views: 610, rating: 4.3 }
  }
];

// Key-Value Sandbox Initial Data
export const INITIAL_KEY_VALUES: KeyValueData[] = [
  { key: 'session:user:1024', value: '{"id": 1024, "username": "antognani", "role": "admin"}', type: 'String/JSON', updatedAt: '2026-06-27 18:30:11' },
  { key: 'rate_limit:ip:192.168.1.1', value: '42', type: 'Integer', updatedAt: '2026-06-27 19:01:45' },
  { key: 'active_users_list', value: '[1024, 2048, 5096]', type: 'List/Array', updatedAt: '2026-06-27 19:02:59' },
  { key: 'config:site_maintenance', value: 'false', type: 'Boolean', updatedAt: '2026-06-27 12:00:00' }
];

// Wide-Column Sandbox Initial Data
export const INITIAL_WIDE_COLUMNS: ColumnFamilyData[] = [
  {
    rowKey: 'usr_ufrn_01',
    families: {
      personal: { name: 'Antonio Gabriel', email: 'antognani67@gmail.com', role: 'Estudante IMD' },
      activity: { lastLogin: '2026-06-27 19:03:00', loginCount: '67' },
      preferences: { theme: 'dark', notifications: 'true' }
    }
  },
  {
    rowKey: 'usr_ufrn_02',
    families: {
      personal: { name: 'Prof. Lobo Depósito', email: 'lobo.deposito@imd.ufrn.br', role: 'Professor' },
      activity: { lastLogin: '2026-06-26 15:42:10', loginCount: '24' },
      preferences: { theme: 'light', notifications: 'false' }
    }
  },
  {
    rowKey: 'usr_ufrn_03',
    families: {
      personal: { name: 'Saori Kido', email: 'saori.kido@scat.br', role: 'Coordenadora' },
      activity: { lastLogin: '2026-06-27 10:15:30', loginCount: '69' },
      preferences: { theme: 'system', notifications: 'true' }
    }
  }
];

// Graph Sandbox Initial Data
export const INITIAL_GRAPH_NODES: GraphNode[] = [
  { id: '1', label: 'Antonio Gabriel (@antognani)', type: 'student' },
  { id: '2', label: 'IMD (Instituto Metrópole Digital)', type: 'department' },
  { id: '3', label: 'UFRN', type: 'department' },
  { id: '4', label: 'Prof. Lobo Depósito (NoSQL)', type: 'professor' },
  { id: '5', label: 'Banco de Dados II', type: 'course' },
  { id: '6', label: 'Desenvolvimento Web II', type: 'course' }
];

export const INITIAL_GRAPH_EDGES: GraphEdge[] = [
  { id: 'e1', source: '1', target: '2', label: 'ESTUDA_NO' },
  { id: 'e2', source: '2', target: '3', label: 'INTEGRA' },
  { id: 'e3', source: '4', target: '2', label: 'LECIONA_NO' },
  { id: 'e4', source: '4', target: '5', label: 'MINISTRA' },
  { id: 'e5', source: '1', target: '5', label: 'CURSA' },
  { id: 'e6', source: '1', target: '6', label: 'CURSA' },
  { id: 'e7', source: '2', target: '6', label: 'OFERECE' },
  { id: 'e8', source: '2', target: '5', label: 'OFERECE' }
];

// Benchmark and comparison charts data
export const LATENCY_BENCHMARK = [
  { name: 'Chave-Valor (Redis)', read: 0.8, write: 1.1, label: 'Latência (ms) - Menor é melhor' },
  { name: 'Documento (MongoDB)', read: 4.5, write: 5.2, label: 'Latência (ms) - Menor é melhor' },
  { name: 'Família Coluna (Cassandra)', read: 8.2, write: 3.4, label: 'Latência (ms) - Menor é melhor' },
  { name: 'Grafo (Neo4j)', read: 12.1, write: 14.3, label: 'Latência (ms) - Menor é melhor' }
];

export const THROUGHPUT_SCALABILITY = [
  { name: '1 Nó', KeyValue: 80, Document: 45, WideColumn: 35, Graph: 15 },
  { name: '4 Nós', KeyValue: 310, Document: 170, WideColumn: 150, Graph: 50 },
  { name: '8 Nós', KeyValue: 615, Document: 330, WideColumn: 315, Graph: 90 },
  { name: '16 Nós', KeyValue: 1210, Document: 640, WideColumn: 620, Graph: 160 },
  { name: '32 Nós', KeyValue: 2380, Document: 1210, WideColumn: 1220, Graph: 280 }
];

export const RADAR_COMPARATIVE = [
  { subject: 'Flexibilidade', A: 95, B: 85, C: 60, D: 90, fullMark: 100 },
  { subject: 'Velocidade de Busca', A: 100, B: 85, C: 75, D: 60, fullMark: 100 },
  { subject: 'Volume de Dados', A: 85, B: 80, C: 100, D: 70, fullMark: 100 },
  { subject: 'Complexidade de Query', A: 50, B: 85, C: 65, D: 100, fullMark: 100 },
  { subject: 'Relacionamento', A: 20, B: 40, C: 45, D: 100, fullMark: 100 },
  { subject: 'Consistência ACID', A: 60, B: 70, C: 65, D: 80, fullMark: 100 }
];
// Key mapping for Radar: A=KeyValue, B=Document, C=WideColumn, D=Graph
