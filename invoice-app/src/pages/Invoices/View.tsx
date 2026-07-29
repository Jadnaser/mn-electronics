import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Download, Printer, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/layout/Header';
import { Separator } from '@/components/ui/separator';
import { useApp } from '@/contexts/AppContext';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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

export default function ViewInvoice() {
  const { id } = useParams();
  const { getInvoice, getClientById, company, language } = useApp();
  const isRTL = language === 'ar';
  const invoice = getInvoice(id || '');

  if (!invoice) {
    return (
      <div className="min-h-screen">
        <Header title="عرض الفاتورة" />
        <div className="p-6 text-center">
          <p className="text-muted-foreground">الفاتورة غير موجودة</p>
          <Button className="mt-4" asChild><Link to="/invoices">عودة للفواتير</Link></Button>
        </div>
      </div>
    );
  }

  const client = getClientById(invoice.clientId);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen">
      <Header title={`فاتورة ${invoice.invoiceNumber}`} />
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div className="flex gap-2">
            <Button variant="outline" asChild><Link to="/invoices"><ArrowLeft className="h-4 w-4 ml-2" /> عودة</Link></Button>
            <Button variant="outline" asChild><Link to={`/invoices/${invoice.id}/edit`}><Edit className="h-4 w-4 ml-2" /> تعديل</Link></Button>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handlePrint}><Printer className="h-4 w-4 ml-2" /> طباعة</Button>
            <Button onClick={() => alert('ميزة تحميل PDF - يمكن تنفيذها باستخدام jsPDF')}><Download className="h-4 w-4 ml-2" /> تحميل PDF</Button>
          </div>
        </div>

        <Card className="print:shadow-none" id="invoice-content">
          <CardContent className="p-8 space-y-8">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-primary">{company.name}</h1>
                <p className="text-muted-foreground mt-1">{company.address}</p>
                <p className="text-muted-foreground">{company.phone}</p>
                <p className="text-muted-foreground">{company.email}</p>
                {company.taxNumber && <p className="text-muted-foreground">الرقم الضريبي: {company.taxNumber}</p>}
              </div>
              <div className="text-left">
                <h2 className="text-2xl font-bold">فاتورة</h2>
                <p className="text-muted-foreground">#{invoice.invoiceNumber}</p>
                <Badge className={`${statusColors[invoice.status]} mt-2`}>{statusLabels[invoice.status]}</Badge>
              </div>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-muted-foreground mb-2">فاتورة إلى:</h3>
                <p className="font-medium text-lg">{client?.name || 'غير معروف'}</p>
                {client?.address && <p className="text-muted-foreground">{client.address}</p>}
                {client?.phone && <p className="text-muted-foreground">{client.phone}</p>}
                {client?.email && <p className="text-muted-foreground">{client.email}</p>}
                {client?.taxId && <p className="text-muted-foreground">الرقم الضريبي: {client.taxId}</p>}
              </div>
              <div className="text-left">
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">تاريخ الفاتورة:</span>
                    <span className="font-medium">{format(new Date(invoice.date), 'dd MMMM yyyy', { locale: isRTL ? ar : undefined })}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">تاريخ الاستحقاق:</span>
                    <span className="font-medium">{format(new Date(invoice.dueDate), 'dd MMMM yyyy', { locale: isRTL ? ar : undefined })}</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-primary">
                    <th className="text-right py-3 px-2 font-semibold">الوصف</th>
                    <th className="text-right py-3 px-2 font-semibold w-20">الكمية</th>
                    <th className="text-right py-3 px-2 font-semibold w-32">السعر</th>
                    <th className="text-right py-3 px-2 font-semibold w-28">الضريبة %</th>
                    <th className="text-right py-3 px-2 font-semibold w-32">الإجمالي</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.items.map((item) => (
                    <tr key={item.id} className="border-b">
                      <td className="py-3 px-2">{item.description}</td>
                      <td className="py-3 px-2">{item.quantity}</td>
                      <td className="py-3 px-2">{company.currencySymbol} {item.price.toLocaleString()}</td>
                      <td className="py-3 px-2">{item.taxRate}%</td>
                      <td className="py-3 px-2 font-medium">{company.currencySymbol} {(item.quantity * item.price - item.discount).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex justify-end">
              <div className="w-64 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">المجموع الفرعي</span>
                  <span>{company.currencySymbol} {invoice.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">الخصومات</span>
                  <span>- {company.currencySymbol} {invoice.discountTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">الضريبة</span>
                  <span>+ {company.currencySymbol} {invoice.taxTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xl font-bold border-t-2 border-primary pt-2">
                  <span>الإجمالي</span>
                  <span className="text-primary">{company.currencySymbol} {invoice.grandTotal.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {invoice.notes && (
              <div>
                <h3 className="font-semibold mb-2">ملاحظات:</h3>
                <p className="text-muted-foreground text-sm">{invoice.notes}</p>
              </div>
            )}

            <div className="border-t pt-4 text-center">
              <p className="text-muted-foreground text-sm">{invoice.terms || company.invoiceFooter}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
