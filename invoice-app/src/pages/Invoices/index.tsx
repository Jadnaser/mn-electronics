import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Eye, Edit, Trash2, MoreVertical } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/layout/Header';
import { useApp } from '@/contexts/AppContext';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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

export default function InvoicesList() {
  const { invoices, deleteInvoice, language, getClientById, company } = useApp();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const isRTL = language === 'ar';

  const filteredInvoices = invoices.filter(inv => {
    const client = getClientById(inv.clientId);
    const matchesSearch = !search || 
      inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      (client?.name || '').toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === 'all' || inv.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const sortedInvoices = [...filteredInvoices].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const handleDelete = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذه الفاتورة؟')) {
      deleteInvoice(id);
    }
  };

  return (
    <div className="min-h-screen">
      <Header title="الفواتير" />
      <div className="p-6 space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="flex flex-1 gap-3 w-full sm:w-auto">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="بحث برقم الفاتورة أو اسم العميل..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pr-9"
                dir={isRTL ? 'rtl' : 'ltr'}
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="h-9 rounded-md border border-input bg-transparent px-3 text-sm"
              dir={isRTL ? 'rtl' : 'ltr'}
            >
              <option value="all">جميع الحالات</option>
              <option value="draft">مسودة</option>
              <option value="sent">مرسلة</option>
              <option value="paid">مدفوعة</option>
              <option value="overdue">متأخرة</option>
              <option value="cancelled">ملغاة</option>
            </select>
          </div>
          <Link to="/invoices/create">
            <Button><Plus className="h-4 w-4 ml-2" /> فاتورة جديدة</Button>
          </Link>
        </div>

        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">رقم الفاتورة</th>
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">العميل</th>
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">التاريخ</th>
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">تاريخ الاستحقاق</th>
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">المبلغ</th>
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">الحالة</th>
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">الإجراءات</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedInvoices.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-muted-foreground">
                        لا توجد فواتير
                      </td>
                    </tr>
                  ) : (
                    sortedInvoices.map((invoice) => {
                      const client = getClientById(invoice.clientId);
                      return (
                        <tr key={invoice.id} className="border-b hover:bg-muted/50 transition-colors">
                          <td className="py-3 px-4 font-mono">{invoice.invoiceNumber}</td>
                          <td className="py-3 px-4">{client?.name || 'غير معروف'}</td>
                          <td className="py-3 px-4">{format(new Date(invoice.date), 'dd/MM/yyyy', { locale: isRTL ? ar : undefined })}</td>
                          <td className="py-3 px-4">{format(new Date(invoice.dueDate), 'dd/MM/yyyy', { locale: isRTL ? ar : undefined })}</td>
                          <td className="py-3 px-4 font-medium">{company.currencySymbol} {invoice.grandTotal.toLocaleString()}</td>
                          <td className="py-3 px-4">
                            <Badge className={statusColors[invoice.status]}>{statusLabels[invoice.status]}</Badge>
                          </td>
                          <td className="py-3 px-4">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem asChild>
                                  <Link to={`/invoices/${invoice.id}`} className="flex items-center cursor-pointer">
                                    <Eye className="h-4 w-4 ml-2" /> عرض
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                  <Link to={`/invoices/${invoice.id}/edit`} className="flex items-center cursor-pointer">
                                    <Edit className="h-4 w-4 ml-2" /> تعديل
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive cursor-pointer" onClick={() => handleDelete(invoice.id)}>
                                  <Trash2 className="h-4 w-4 ml-2" /> حذف
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
