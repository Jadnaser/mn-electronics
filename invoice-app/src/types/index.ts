export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  taxId: string;
  notes: string;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  unit: string;
  category: string;
  taxRate: number;
  createdAt: string;
}

export interface InvoiceItem {
  id: string;
  productId?: string;
  description: string;
  quantity: number;
  price: number;
  discount: number;
  taxRate: number;
  total: number;
}

export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';

export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientId: string;
  date: string;
  dueDate: string;
  items: InvoiceItem[];
  subtotal: number;
  taxTotal: number;
  discountTotal: number;
  grandTotal: number;
  notes: string;
  terms: string;
  status: InvoiceStatus;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  date: string;
  description: string;
  reference: string;
  createdAt: string;
}

export interface Company {
  name: string;
  email: string;
  phone: string;
  address: string;
  logo: string;
  taxNumber: string;
  currency: string;
  currencySymbol: string;
  invoicePrefix: string;
  invoiceStartNumber: number;
  defaultTaxRate: number;
  invoiceFooter: string;
}

export type Language = 'ar' | 'en';
