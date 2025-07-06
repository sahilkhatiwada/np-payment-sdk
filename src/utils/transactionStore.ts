import { PaymentResult } from '../types';

export interface TransactionRecord extends PaymentResult {
  transactionId: string;
  createdAt: Date;
  updatedAt: Date;
}

const transactions: TransactionRecord[] = [];

export function addTransaction(record: TransactionRecord) {
  transactions.push(record);
}

export function updateTransaction(transactionId: string, updates: Partial<TransactionRecord>) {
  const tx = transactions.find(t => t.transactionId === transactionId);
  if (tx) {
    Object.assign(tx, updates);
    tx.updatedAt = new Date();
  }
}

export function getTransaction(transactionId: string): TransactionRecord | undefined {
  return transactions.find(t => t.transactionId === transactionId);
}

export function listTransactions(): TransactionRecord[] {
  return transactions;
} 