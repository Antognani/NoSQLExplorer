/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface NoSQLTypeInfo {
  id: string;
  name: string;
  description: string;
  structure: string;
  pros: string[];
  cons: string[];
  bestUseCases: string[];
  databases: string[];
  icon: string;
}

export interface DocumentData {
  id: string;
  title: string;
  category: string;
  price: number;
  tags: string[];
  inStock: boolean;
  metadata: {
    views: number;
    rating: number;
  };
}

export interface KeyValueData {
  key: string;
  value: string;
  type: string;
  updatedAt: string;
}

export interface ColumnFamilyData {
  rowKey: string;
  families: {
    personal: {
      name: string;
      email: string;
      role: string;
    };
    activity: {
      lastLogin: string;
      loginCount: string;
    };
    preferences: {
      theme: string;
      notifications: string;
    };
  };
}

export interface GraphNode {
  id: string;
  label: string;
  type: 'student' | 'professor' | 'course' | 'department';
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  label: string;
}

export interface BenchmarkMetric {
  name: string;
  KeyValue: number; // e.g., Redis
  Document: number; // e.g., MongoDB
  WideColumn: number; // e.g., Cassandra
  Graph: number; // e.g., Neo4j
}
