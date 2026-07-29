import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, Plus, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import Header from '@/components/layout/Header';
import { useApp } from '@/contexts/AppContext';
import type { InvoiceItem } from '@/types';
import { format } from 'date-fns';

export default function CreateInvoice() {
  const navigate = useNavigate();
  const { clients, products, addInvoice, getNextInvoiceNumber, company, language } = useApp();
  const isRTL = language === 'ar';

  const [clientId, setClientId] = useState('');
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [dueDate, setDueDate] = useState(format(new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'));
  const [status, setStatus] = useState<'draft' | 'sent'>('draft');
  const [notes, setNotes] = useState('');
  const [terms, setTerms] = useState(company.invoiceFooter);
  const [items, setItems] = useState<InvoiceItem[]>([
    { id: '1', description: '', quantity: 1, price: 0, discount: 0, taxRate: company.defaultTaxRate, total: 0 },
  ]);

  const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
  const discountTotal = items.reduce((sum, item) => sum + item.discount, 0);
  const afterDiscount = subtotal - discountTotal;
  const taxTotal = items.reduce((sum, item) => sum + (afterDiscount * item.taxRate / 100), 0);
  const grandTotal = afterDiscount + taxTotal;

  const addItem = () => {
    setItems([...items, { id: Date.now().toString(), description: '', quantity: 1, price: 0, discount: 0, taxRate: company.defaultTaxRate, total: 0 }]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: string | number) => {
    setItems(items.map(item => {
      if (item.id !== id) return item;
      const updated = { ...item, [field]: value };
      if (field === 'quantity' || field === 'price' || field === 'discount') {
        updated.total = updated.quantity * updated.price - updated.discount;
      }
      return updated;
    }));
  };

  const selectProduct = (id: string, productId: string) => {
    const product = products.find(p => p.id === productId);
    if (product) {
      setItems(items.map(item => {
        if (item.id !== id) return item;
        return {
          ...item,
          productId: product.id,
          description: product.name,
          price: product.price,
          taxRate: product.taxRate,
          total: item.quantity * product.price - item.discount,
        };
      }));
    }
  };

  const handleSubmit = () => {
    if (!clientId || items.length === 0 || !items.some(i => i.description)) {
      alert('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    addInvoice({
      invoiceNumber: getNextInvoiceNumber(),
      clientId,
      date,
      dueDate,
      items: items.filter(i => i.description),
      subtotal,
      taxTotal,
      discountTotal,
      grandTotal,
      notes,
      terms,
      status,
    });

    navigate('/invoices');
  };

  return (
    <div className="min-h-screen">
      <Header title="إنشاء فاتورة جديدة" />
      <div className="p-6 max-w-5xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <Button onClick={handleSubmit}><Save className="h-4 w-4 ml-2" /> حفظ</Button>
            <Button variant="outline" onClick={() => navigate('/invoices')}>إلغاء</Button>
          </div>
          <div className="flex gap-2">
            <Button variant={status === 'draft' ? 'default' : 'outline'} onClick={() => setStatus('draft')}>مسودة</Button>
            <Button variant={status === 'sent' ? 'default' : 'outline'} onClick={() => setStatus('sent')}>إرسال</Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>معلومات الفاتورة</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>العميل</Label>
                <Select value={clientId} onValueChange={setClientId}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر العميل" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map(client => (
                      <SelectItem key={client.id} value={client.id}>{client.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>رقم الفاتورة</Label>
                <Input value={getNextInvoiceNumber()} disabled />
              </div>
              <div className="space-y-2">
                <Label>تاريخ الفاتورة</Label>
                <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>تاريخ الاستحقاق</Label>
                <Input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>عناصر الفاتورة</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-right py-2 px-2 font-medium text-muted-foreground">المنتج/الوصف</th>
                    <th className="text-right py-2 px-2 font-medium text-muted-foreground w-20">الكمية</th>
                    <th className="text-right py-2 px-2 font-medium text-muted-foreground w-32">السعر</th>
                    <th className="text-right py-2 px-2 font-medium text-muted-foreground w-32">الخصم</th>
                    <th className="text-right py-2 px-2 font-medium text-muted-foreground w-28">الضريبة %</th>
                    <th className="text-right py-2 px-2 font-medium text-muted-foreground w-32">الإجمالي</th>
                    <th className="py-2 px-2 w-10"></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.id} className="border-b">
                      <td className="py-2 px-2">
                        <Select value={item.productId} onValueChange={(val) => selectProduct(item.id, val)}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="اختر منتج" />
                          </SelectTrigger>
                          <SelectContent>
                            {products.map(p => (
                              <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Input
                          placeholder="أو أدخل وصف..."
                          value={item.description}
                          onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                          className="mt-1"
                          dir={isRTL ? 'rtl' : 'ltr'}
                        />
                      </td>
                      <td className="py-2 px-2">
                        <Input type="number" min="1" value={item.quantity} onChange={(e) => updateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)} />
                      </td>
                      <td className="py-2 px-2">
                        <Input type="number" min="0" step="0.01" value={item.price} onChange={(e) => updateItem(item.id, 'price', parseFloat(e.target.value) || 0)} />
                      </td>
                      <td className="py-2 px-2">
                        <Input type="number" min="0" step="0.01" value={item.discount} onChange={(e) => updateItem(item.id, 'discount', parseFloat(e.target.value) || 0)} />
                      </td>
                      <td className="py-2 px-2">
                        <Input type="number" min="0" max="100" value={item.taxRate} onChange={(e) => updateItem(item.id, 'taxRate', parseFloat(e.target.value) || 0)} />
                      </td>
                      <td className="py-2 px-2 font-medium">
                        {company.currencySymbol} {(item.quantity * item.price - item.discount).toLocaleString()}
                      </td>
                      <td className="py-2 px-2">
                        <Button variant="ghost" size="icon" onClick={() => removeItem(item.id)} disabled={items.length === 1}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Button variant="outline" onClick={addItem} className="w-full">
              <Plus className="h-4 w-4 ml-2" /> إضافة عنصر
            </Button>

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">المجموع الفرعي</span>
                <span>{company.currencySymbol} {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">إجمالي الخصومات</span>
                <span>- {company.currencySymbol} {discountTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">إجمالي الضريبة</span>
                <span>+ {company.currencySymbol} {taxTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t pt-2">
                <span>الإجمالي</span>
                <span>{company.currencySymbol} {grandTotal.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>ملاحظات وشروط</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>ملاحظات</Label>
              <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="ملاحظات إضافية..." dir={isRTL ? 'rtl' : 'ltr'} />
            </div>
            <div className="space-y-2">
              <Label>شروط الدفع</Label>
              <Textarea value={terms} onChange={(e) => setTerms(e.target.value)} placeholder="شروط الدفع..." dir={isRTL ? 'rtl' : 'ltr'} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
