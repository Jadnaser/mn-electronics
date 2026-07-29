import { useState } from 'react';
import { Save, Building2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Header from '@/components/layout/Header';
import { useApp } from '@/contexts/AppContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function SettingsPage() {
  const { company, updateCompany, language } = useApp();
  const isRTL = language === 'ar';

  const [companyData, setCompanyData] = useState({
    name: company.name,
    email: company.email,
    phone: company.phone,
    address: company.address,
    taxNumber: company.taxNumber,
    currency: company.currency,
    currencySymbol: company.currencySymbol,
    invoicePrefix: company.invoicePrefix,
    invoiceStartNumber: company.invoiceStartNumber,
    defaultTaxRate: company.defaultTaxRate,
    invoiceFooter: company.invoiceFooter,
  });

  const handleSave = () => {
    updateCompany(companyData);
    alert('تم حفظ الإعدادات بنجاح');
  };

  return (
    <div className="min-h-screen">
      <Header title="الإعدادات" />
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        <Tabs defaultValue="company" dir={isRTL ? 'rtl' : 'ltr'}>
          <TabsList>
            <TabsTrigger value="company">معلومات الشركة</TabsTrigger>
            <TabsTrigger value="invoice">إعدادات الفواتير</TabsTrigger>
          </TabsList>

          <TabsContent value="company" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  معلومات الشركة
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>اسم الشركة</Label>
                  <Input value={companyData.name} onChange={(e) => setCompanyData({ ...companyData, name: e.target.value })} dir={isRTL ? 'rtl' : 'ltr'} />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>البريد الإلكتروني</Label>
                    <Input type="email" value={companyData.email} onChange={(e) => setCompanyData({ ...companyData, email: e.target.value })} dir="ltr" />
                  </div>
                  <div className="space-y-2">
                    <Label>الهاتف</Label>
                    <Input value={companyData.phone} onChange={(e) => setCompanyData({ ...companyData, phone: e.target.value })} dir="ltr" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>العنوان</Label>
                  <Input value={companyData.address} onChange={(e) => setCompanyData({ ...companyData, address: e.target.value })} dir={isRTL ? 'rtl' : 'ltr'} />
                </div>
                <div className="space-y-2">
                  <Label>الرقم الضريبي</Label>
                  <Input value={companyData.taxNumber} onChange={(e) => setCompanyData({ ...companyData, taxNumber: e.target.value })} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="invoice" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>إعدادات الفواتير</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>العملة</Label>
                    <select
                      value={companyData.currency}
                      onChange={(e) => setCompanyData({ ...companyData, currency: e.target.value, currencySymbol: e.target.value === 'USD' ? '$' : e.target.value === 'EUR' ? '€' : 'ر.س' })}
                      className="h-9 rounded-md border border-input bg-transparent px-3 text-sm w-full"
                    >
                      <option value="SAR">ريال سعودي (SAR)</option>
                      <option value="USD">دولار أمريكي (USD)</option>
                      <option value="EUR">يورو (EUR)</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <Label>رمز العملة</Label>
                    <Input value={companyData.currencySymbol} onChange={(e) => setCompanyData({ ...companyData, currencySymbol: e.target.value })} />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>بادئ رقم الفاتورة</Label>
                    <Input value={companyData.invoicePrefix} onChange={(e) => setCompanyData({ ...companyData, invoicePrefix: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <Label>الرقم الابتدائي</Label>
                    <Input type="number" min="1" value={companyData.invoiceStartNumber} onChange={(e) => setCompanyData({ ...companyData, invoiceStartNumber: parseInt(e.target.value) || 1 })} />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>نسبة الضريبة الافتراضية %</Label>
                    <Input type="number" min="0" max="100" value={companyData.defaultTaxRate} onChange={(e) => setCompanyData({ ...companyData, defaultTaxRate: parseFloat(e.target.value) || 0 })} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>نص تذييل الفاتورة</Label>
                  <Input value={companyData.invoiceFooter} onChange={(e) => setCompanyData({ ...companyData, invoiceFooter: e.target.value })} dir={isRTL ? 'rtl' : 'ltr'} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end">
          <Button onClick={handleSave} size="lg"><Save className="h-4 w-4 ml-2" /> حفظ الإعدادات</Button>
        </div>
      </div>
    </div>
  );
}
