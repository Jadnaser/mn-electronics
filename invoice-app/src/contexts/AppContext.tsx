import { createContext, useContext, useCallback, type ReactNode } from 'react';
import type { Client, Product, Invoice, Transaction, Company, Language } from '../types';
import { mockClients, mockProducts, mockInvoices, mockTransactions, defaultCompany } from '../data/mockData';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface AppState {
  clients: Client[];
  products: Product[];
  invoices: Invoice[];
  transactions: Transaction[];
  company: Company;
  language: Language;
  theme: 'light' | 'dark';
}

interface AppContextValue extends AppState {
  addClient: (client: Omit<Client, 'id' | 'createdAt'>) => void;
  updateClient: (id: string, client: Partial<Client>) => void;
  deleteClient: (id: string) => void;
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addInvoice: (invoice: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateInvoice: (id: string, invoice: Partial<Invoice>) => void;
  deleteInvoice: (id: string) => void;
  getInvoice: (id: string) => Invoice | undefined;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'createdAt'>) => void;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  updateCompany: (company: Partial<Company>) => void;
  setLanguage: (lang: Language) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  getNextInvoiceNumber: () => string;
  getClientById: (id: string) => Client | undefined;
  getProductById: (id: string) => Product | undefined;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [clients, setClients] = useLocalStorage<Client[]>('invoice_clients', mockClients);
  const [products, setProducts] = useLocalStorage<Product[]>('invoice_products', mockProducts);
  const [invoices, setInvoices] = useLocalStorage<Invoice[]>('invoice_invoices', mockInvoices);
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>('invoice_transactions', mockTransactions);
  const [company, setCompany] = useLocalStorage<Company>('invoice_company', defaultCompany);
  const [language, setLanguage] = useLocalStorage<Language>('invoice_language', 'ar');
  const [theme, setTheme] = useLocalStorage<'light' | 'dark'>('invoice_theme', 'light');

  const addClient = useCallback((client: Omit<Client, 'id' | 'createdAt'>) => {
    const newClient: Client = {
      ...client,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setClients(prev => [...prev, newClient]);
  }, [setClients]);

  const updateClient = useCallback((id: string, data: Partial<Client>) => {
    setClients(prev => prev.map(c => c.id === id ? { ...c, ...data } : c));
  }, [setClients]);

  const deleteClient = useCallback((id: string) => {
    setClients(prev => prev.filter(c => c.id !== id));
  }, [setClients]);

  const addProduct = useCallback((product: Omit<Product, 'id' | 'createdAt'>) => {
    const newProduct: Product = {
      ...product,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setProducts(prev => [...prev, newProduct]);
  }, [setProducts]);

  const updateProduct = useCallback((id: string, data: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...data } : p));
  }, [setProducts]);

  const deleteProduct = useCallback((id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  }, [setProducts]);

  const addInvoice = useCallback((invoice: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>) => {
    const now = new Date().toISOString();
    const newInvoice: Invoice = {
      ...invoice,
      id: Date.now().toString(),
      createdAt: now,
      updatedAt: now,
    };
    setInvoices(prev => [...prev, newInvoice]);
  }, [setInvoices]);

  const updateInvoice = useCallback((id: string, data: Partial<Invoice>) => {
    setInvoices(prev => prev.map(inv => inv.id === id ? { ...inv, ...data, updatedAt: new Date().toISOString() } : inv));
  }, [setInvoices]);

  const deleteInvoice = useCallback((id: string) => {
    setInvoices(prev => prev.filter(inv => inv.id !== id));
  }, [setInvoices]);

  const getInvoice = useCallback((id: string) => {
    return invoices.find(inv => inv.id === id);
  }, [invoices]);

  const addTransaction = useCallback((transaction: Omit<Transaction, 'id' | 'createdAt'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setTransactions(prev => [...prev, newTransaction]);
  }, [setTransactions]);

  const updateTransaction = useCallback((id: string, data: Partial<Transaction>) => {
    setTransactions(prev => prev.map(t => t.id === id ? { ...t, ...data } : t));
  }, [setTransactions]);

  const deleteTransaction = useCallback((id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  }, [setTransactions]);

  const updateCompany = useCallback((data: Partial<Company>) => {
    setCompany(prev => ({ ...prev, ...data }));
  }, [setCompany]);

  const getNextInvoiceNumber = useCallback(() => {
    const currentNumbers = invoices.map(inv => parseInt(inv.invoiceNumber.replace(company.invoicePrefix, ''), 10) || 0);
    const maxNumber = currentNumbers.length > 0 ? Math.max(...currentNumbers) : company.invoiceStartNumber - 1;
    return `${company.invoicePrefix}${maxNumber + 1}`;
  }, [invoices, company.invoicePrefix, company.invoiceStartNumber]);

  const getClientById = useCallback((id: string) => {
    return clients.find(c => c.id === id);
  }, [clients]);

  const getProductById = useCallback((id: string) => {
    return products.find(p => p.id === id);
  }, [products]);

  const value: AppContextValue = {
    clients, products, invoices, transactions, company, language, theme,
    addClient, updateClient, deleteClient,
    addProduct, updateProduct, deleteProduct,
    addInvoice, updateInvoice, deleteInvoice, getInvoice,
    addTransaction, updateTransaction, deleteTransaction,
    updateCompany,
    setLanguage, setTheme,
    getNextInvoiceNumber, getClientById, getProductById,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
