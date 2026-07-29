import { Link } from 'react-router-dom';
import { DollarSign, TrendingUp, TrendingDown, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Header from '@/components/layout/Header';
import { useApp } from '@/contexts/AppContext';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';

export default function AccountingPage() {
  const { transactions, language } = useApp();
  const isRTL = language === 'ar';

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const netProfit = totalIncome - totalExpenses;

  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="min-h-screen">
      <Header title="المحاسبة" />
      <div className="p-6 space-y-6">
        <div className="flex justify-end">
          <Link to="/accounting/expenses">
            <Button><Plus className="h-4 w-4 ml-2" /> إضافة معاملة</Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">إجمالي الإيرادات</p>
                  <p className="text-2xl font-bold text-success mt-1">{totalIncome.toLocaleString()} ر.س</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-success/10 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">إجمالي المصروفات</p>
                  <p className="text-2xl font-bold text-destructive mt-1">{totalExpenses.toLocaleString()} ر.س</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center">
                  <TrendingDown className="h-6 w-6 text-destructive" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">صافي الربح</p>
                  <p className="text-2xl font-bold text-primary mt-1">{netProfit.toLocaleString()} ر.س</p>
                </div>
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>أحدث المعاملات</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTransactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center ${transaction.type === 'income' ? 'bg-success/10' : 'bg-destructive/10'}`}>
                        {transaction.type === 'income' ? (
                          <TrendingUp className={`h-5 w-5 text-success ${isRTL ? 'flip-rtl' : ''}`} />
                        ) : (
                          <TrendingDown className={`h-5 w-5 text-destructive ${isRTL ? 'flip-rtl' : ''}`} />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{transaction.description}</p>
                        <p className="text-sm text-muted-foreground">{transaction.category} - {format(new Date(transaction.date), 'dd/MM/yyyy', { locale: isRTL ? ar : undefined })}</p>
                      </div>
                    </div>
                    <span className={`font-bold ${transaction.type === 'income' ? 'text-success' : 'text-destructive'}`}>
                      {transaction.type === 'income' ? '+' : '-'} {transaction.amount.toLocaleString()} ر.س
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>الملخص المالي</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>الإيرادات</span>
                    <span className="font-medium">{totalIncome.toLocaleString()} ر.س</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-success rounded-full" style={{ width: `${totalIncome > 0 ? 100 : 0}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>المصروفات</span>
                    <span className="font-medium">{totalExpenses.toLocaleString()} ر.س</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-destructive rounded-full" style={{ width: `${totalIncome > 0 ? (totalExpenses / totalIncome) * 100 : 0}%` }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>صافي الربح</span>
                    <span className="font-medium">{netProfit.toLocaleString()} ر.س</span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${totalIncome > 0 ? (netProfit / totalIncome) * 100 : 0}%` }} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Link to="/accounting/reports">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-2">التقارير المالية</h3>
                <p className="text-sm text-muted-foreground">عرض التقارير والرسوم البيانية التفصيلية</p>
              </CardContent>
            </Card>
          </Link>
          <Link to="/accounting/expenses">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-2">إدارة المعاملات</h3>
                <p className="text-sm text-muted-foreground">إضافة وتعديل وحذف المعاملات المالية</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
