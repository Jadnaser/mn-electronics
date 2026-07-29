import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from '@/contexts/AppContext';
import Layout from '@/components/layout/Layout';
import Dashboard from '@/pages/Dashboard';
import InvoicesList from '@/pages/Invoices';
import CreateInvoice from '@/pages/Invoices/Create';
import EditInvoice from '@/pages/Invoices/Edit';
import ViewInvoice from '@/pages/Invoices/View';
import ClientsPage from '@/pages/Clients';
import ProductsPage from '@/pages/Products';
import AccountingPage from '@/pages/Accounting';
import ExpensesPage from '@/pages/Accounting/Expenses';
import ReportsPage from '@/pages/Accounting/Reports';
import SettingsPage from '@/pages/Settings';
import { Toaster } from '@/components/ui/toaster';
import { useApp } from '@/contexts/AppContext';
import { useEffect } from 'react';

function ThemeHandler() {
  const { theme } = useApp();
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);
  return null;
}

export default function App() {
  return (
    <AppProvider>
      <ThemeHandler />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="invoices" element={<InvoicesList />} />
            <Route path="invoices/create" element={<CreateInvoice />} />
            <Route path="invoices/:id" element={<ViewInvoice />} />
            <Route path="invoices/:id/edit" element={<EditInvoice />} />
            <Route path="clients" element={<ClientsPage />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="accounting" element={<AccountingPage />} />
            <Route path="accounting/expenses" element={<ExpensesPage />} />
            <Route path="accounting/reports" element={<ReportsPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster />
    </AppProvider>
  );
}
