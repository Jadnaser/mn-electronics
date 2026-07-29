import { Link } from 'react-router-dom';
import { DollarSign, TrendingUp, TrendingDown, FileText, Plus, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/layout/Header';
import { useApp } from '@/contexts/AppContext';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

const statusColors: Record<string, string> = {
  paid: 'bg-success text-white',
  sent: 'bg-primary text-primary-foreground',
  draft: 'bg-secondary text-secondary-foreground',
  overdue: 'bg-destructive text-destructive-foreground',
  cancelled: 'bg-muted text-muted-foreground',
};

const statusLabels: Record<string, string> = {
  paid: 'مدفوعة',
  sent: 'مرسلة',
  draft: 'مسودة',
  overdue: 'متأخرة',
  cancelled: 'ملغاة',
};

export default function Dashboard() {
  const { invoices, transactions, company, language } = useApp();
  const isRTL = language === 'ar';

  const totalRevenue = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const netProfit = totalRevenue - totalExpenses;
  const outstandingInvoices = invoices
    .filter(i => i.status === 'sent' || i.status === 'overdue')
    .reduce((sum, i) => sum + i.grandTotal, 0);

  const recentInvoices = [...invoices].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);

  const revenueByMonth = [
    { name: 'يناير', revenue: 45000, expenses: 32000 },
    { name: 'فبراير', revenue: 52000, expenses: 28000 },
    { name: 'مارس', revenue: 48000, expenses: 35000 },
    { name: 'أبريل', revenue: 61000, expenses: 30000 },
    { name: 'مايو', revenue: 55000, expenses: 38000 },
    { name: 'يونيو', revenue: 67000, expenses: 34000 },
  ];

  const expenseByCategory = [
    { name: 'رواتب', value: 15000, color: '#2563eb' },
    { name: 'مصاريف عامة', value: 4000, color: '#22c55e' },
    { name: 'تسويق', value: 3000, color: '#f59e0b' },
    { name: 'استضافة', value: 1200, color: '#ef4444' },
    { name: 'أخرى', value: 1500, color: '#8b5cf6' },
  ];

  return (
    <div className="min-h-screen">
      <Header title="لوحة التحكم" />
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">إجمالي الإيرادات</p>
                  <p className="text-2xl font-bold mt-1">{company.currencySymbol} {totalRevenue.toLocaleString()}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-primary" />
                </div>
              </div>
              <div className="flex items-center mt-4 text-sm">
                <ArrowUpRight className="h-4 w-4 text-success ml-1" />
                <span className="text-success font-medium">+12.5%</span>
                <span className="text-muted-foreground mr-1">من الشهر الماضي</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">إجمالي المصروفات</p>
                  <p className="text-2xl font-bold mt-1">{company.currencySymbol} {totalExpenses.toLocaleString()}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center">
                  <TrendingDown className="h-6 w-6 text-destructive" />
                </div>
              </div>
              <div className="flex items-center mt-4 text-sm">
                <ArrowDownRight className="h-4 w-4 text-destructive ml-1" />
                <span className="text-destructive font-medium">+8.2%</span>
                <span className="text-muted-foreground mr-1">من الشهر الماضي</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">صافي الربح</p>
                  <p className="text-2xl font-bold mt-1">{company.currencySymbol} {netProfit.toLocaleString()}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-success/10 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-success" />
                </div>
              </div>
              <div className="flex items-center mt-4 text-sm">
                <ArrowUpRight className="h-4 w-4 text-success ml-1" />
                <span className="text-success font-medium">+15.3%</span>
                <span className="text-muted-foreground mr-1">من الشهر الماضي</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">فواتير مستحقة</p>
                  <p className="text-2xl font-bold mt-1">{company.currencySymbol} {outstandingInvoices.toLocaleString()}</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-warning/10 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-warning" />
                </div>
              </div>
              <div className="flex items-center mt-4 text-sm">
                <span className="text-muted-foreground">
                  {invoices.filter(i => i.status === 'overdue').length} فاتورة متأخرة
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex gap-3">
          <Link to="/invoices/create">
            <Button><Plus className="h-4 w-4 ml-2" /> فاتورة جديدة</Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>الإيرادات والمصروفات</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={revenueByMonth}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="name" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip />
                  <Area type="monotone" dataKey="revenue" stackId="1" stroke="#2563eb" fill="#2563eb" fillOpacity={0.2} />
                  <Area type="monotone" dataKey="expenses" stackId="1" stroke="#ef4444" fill="#ef4444" fillOpacity={0.2} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>المصروفات حسب الفئة</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={expenseByCategory} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={2} dataKey="value">
                    {expenseByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 space-y-2">
                {expenseByCategory.map((item) => (
                  <div key={item.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full ml-2" style={{ backgroundColor: item.color }} />
                      <span>{item.name}</span>
                    </div>
                    <span className="font-medium">{company.currencySymbol} {item.value.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>أحدث الفواتير</CardTitle>
            <Link to="/invoices">
              <Button variant="ghost" size="sm">عرض الكل</Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">رقم الفاتورة</th>
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">العميل</th>
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">التاريخ</th>
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">المبلغ</th>
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">الحالة</th>
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">الإجراء</th>
                  </tr>
                </thead>
                <tbody>
                  {recentInvoices.map((invoice) => {
                    const clientName = invoice.clientId;
                    return (
                      <tr key={invoice.id} className="border-b hover:bg-muted/50 transition-colors">
                        <td className="py-3 px-4 font-mono">{invoice.invoiceNumber}</td>
                        <td className="py-3 px-4">{clientName}</td>
                        <td className="py-3 px-4">{format(new Date(invoice.date), 'dd/MM/yyyy', { locale: isRTL ? ar : undefined })}</td>
                        <td className="py-3 px-4 font-medium">{company.currencySymbol} {invoice.grandTotal.toLocaleString()}</td>
                        <td className="py-3 px-4">
                          <Badge className={statusColors[invoice.status]}>{statusLabels[invoice.status]}</Badge>
                        </td>
                        <td className="py-3 px-4">
                          <Link to={`/invoices/${invoice.id}`} className="text-primary hover:underline text-sm">عرض</Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
