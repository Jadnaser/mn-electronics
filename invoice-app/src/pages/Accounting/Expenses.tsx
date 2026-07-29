import { useState } from 'react';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Header from '@/components/layout/Header';
import { useApp } from '@/contexts/AppContext';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

const incomeCategories = ['مبيعات', 'خدمات', 'استشارات', 'أخرى'];
const expenseCategories = ['رواتب', 'مصاريف عامة', 'تسويق', 'استضافة', 'تدريب', 'أخرى'];

export default function ExpensesPage() {
  const { transactions, addTransaction, updateTransaction, deleteTransaction, language } = useApp();
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    type: 'expense' as 'income' | 'expense',
    category: '',
    amount: 0,
    date: '',
    description: '',
    reference: '',
  });
  const isRTL = language === 'ar';

  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = t.description.toLowerCase().includes(search.toLowerCase()) || t.reference.toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType === 'all' || t.type === filterType;
    return matchesSearch && matchesType;
  });

  const sortedTransactions = [...filteredTransactions].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const openAddDialog = () => {
    setEditingTransaction(null);
    setFormData({
      type: 'expense',
      category: '',
      amount: 0,
      date: format(new Date(), 'yyyy-MM-dd'),
      description: '',
      reference: '',
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (transaction: typeof transactions[0]) => {
    setEditingTransaction(transaction.id);
    setFormData({
      type: transaction.type,
      category: transaction.category,
      amount: transaction.amount,
      date: transaction.date,
      description: transaction.description,
      reference: transaction.reference,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = () => {
    if (!formData.category || !formData.amount || !formData.description) return;
    if (editingTransaction) {
      updateTransaction(editingTransaction, formData);
    } else {
      addTransaction(formData);
    }
    setIsDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذه المعاملة؟')) {
      deleteTransaction(id);
    }
  };

  return (
    <div className="min-h-screen">
      <Header title="المعاملات المالية" />
      <div className="p-6 space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="flex flex-1 gap-3 w-full sm:w-auto">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="بحث..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pr-9"
                dir={isRTL ? 'rtl' : 'ltr'}
              />
            </div>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as 'all' | 'income' | 'expense')}
              className="h-9 rounded-md border border-input bg-transparent px-3 text-sm"
            >
              <option value="all">الكل</option>
              <option value="income">إيرادات</option>
              <option value="expense">مصروفات</option>
            </select>
          </div>
          <Button onClick={openAddDialog}><Plus className="h-4 w-4 ml-2" /> إضافة معاملة</Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-right py-3 px-4 font-medium text-muted-foreground">النوع</th>
                <th className="text-right py-3 px-4 font-medium text-muted-foreground">الفئة</th>
                <th className="text-right py-3 px-4 font-medium text-muted-foreground">الوصف</th>
                <th className="text-right py-3 px-4 font-medium text-muted-foreground">المرجع</th>
                <th className="text-right py-3 px-4 font-medium text-muted-foreground">التاريخ</th>
                <th className="text-right py-3 px-4 font-medium text-muted-foreground">المبلغ</th>
                <th className="text-right py-3 px-4 font-medium text-muted-foreground">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {sortedTransactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-muted-foreground">لا توجد معاملات</td>
                </tr>
              ) : (
                sortedTransactions.map((transaction) => (
                  <tr key={transaction.id} className="border-b hover:bg-muted/50 transition-colors">
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${transaction.type === 'income' ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'}`}>
                        {transaction.type === 'income' ? 'إيراد' : 'مصروف'}
                      </span>
                    </td>
                    <td className="py-3 px-4">{transaction.category}</td>
                    <td className="py-3 px-4">{transaction.description}</td>
                    <td className="py-3 px-4 font-mono text-xs">{transaction.reference}</td>
                    <td className="py-3 px-4">{format(new Date(transaction.date), 'dd/MM/yyyy', { locale: isRTL ? ar : undefined })}</td>
                    <td className={`py-3 px-4 font-medium ${transaction.type === 'income' ? 'text-success' : 'text-destructive'}`}>
                      {transaction.type === 'income' ? '+' : '-'} {transaction.amount.toLocaleString()} ر.س
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" onClick={() => openEditDialog(transaction)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(transaction.id)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingTransaction ? 'تعديل المعاملة' : 'إضافة معاملة جديدة'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>النوع</Label>
                <Select value={formData.type} onValueChange={(val) => setFormData({ ...formData, type: val as 'income' | 'expense' })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="income">إيراد</SelectItem>
                    <SelectItem value="expense">مصروف</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>الفئة</Label>
                <Select value={formData.category} onValueChange={(val) => setFormData({ ...formData, category: val })}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الفئة" />
                  </SelectTrigger>
                  <SelectContent>
                    {(formData.type === 'income' ? incomeCategories : expenseCategories).map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>المبلغ</Label>
                <Input type="number" min="0" step="0.01" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })} />
              </div>
              <div className="space-y-2">
                <Label>التاريخ</Label>
                <Input type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>الوصف</Label>
                <Input value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} dir={isRTL ? 'rtl' : 'ltr'} />
              </div>
              <div className="space-y-2">
                <Label>المرجع</Label>
                <Input value={formData.reference} onChange={(e) => setFormData({ ...formData, reference: e.target.value })} dir="ltr" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>إلغاء</Button>
              <Button onClick={handleSubmit}>{editingTransaction ? 'تحديث' : 'إضافة'}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
