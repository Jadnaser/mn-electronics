import { useState } from 'react';
import { Plus, Search, Edit, Trash2, Mail, Phone, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { Textarea } from '@/components/ui/textarea';

export default function ClientsPage() {
  const { clients, addClient, updateClient, deleteClient, language } = useApp();
  const [search, setSearch] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', address: '', taxId: '', notes: ''
  });
  const isRTL = language === 'ar';

  const filteredClients = clients.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.includes(search)
  );

  const openAddDialog = () => {
    setEditingClient(null);
    setFormData({ name: '', email: '', phone: '', address: '', taxId: '', notes: '' });
    setIsDialogOpen(true);
  };

  const openEditDialog = (client: typeof clients[0]) => {
    setEditingClient(client.id);
    setFormData({
      name: client.name,
      email: client.email,
      phone: client.phone,
      address: client.address,
      taxId: client.taxId,
      notes: client.notes,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = () => {
    if (!formData.name) return;
    if (editingClient) {
      updateClient(editingClient, formData);
    } else {
      addClient(formData);
    }
    setIsDialogOpen(false);
    setFormData({ name: '', email: '', phone: '', address: '', taxId: '', notes: '' });
  };

  const handleDelete = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا العميل؟')) {
      deleteClient(id);
    }
  };

  return (
    <div className="min-h-screen">
      <Header title="العملاء" />
      <div className="p-6 space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="بحث عن عميل..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pr-9"
              dir={isRTL ? 'rtl' : 'ltr'}
            />
          </div>
          <Button onClick={openAddDialog}><Plus className="h-4 w-4 ml-2" /> عميل جديد</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredClients.map((client) => (
            <Card key={client.id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">{client.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(client.createdAt), 'dd MMMM yyyy', { locale: isRTL ? ar : undefined })}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => openEditDialog(client)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(client.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
                <div className="space-y-2 text-sm text-muted-foreground">
                  {client.email && (
                    <div className="flex items-center">
                      <Mail className="h-4 w-4 ml-2" />
                      <span>{client.email}</span>
                    </div>
                  )}
                  {client.phone && (
                    <div className="flex items-center">
                      <Phone className="h-4 w-4 ml-2" />
                      <span>{client.phone}</span>
                    </div>
                  )}
                  {client.address && (
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 ml-2" />
                      <span>{client.address}</span>
                    </div>
                  )}
                </div>
                {client.notes && <p className="text-sm text-muted-foreground mt-3 pt-3 border-t">{client.notes}</p>}
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredClients.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">لا يوجد عملاء</p>
          </div>
        )}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingClient ? 'تعديل العميل' : 'إضافة عميل جديد'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>الاسم</Label>
                <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} dir={isRTL ? 'rtl' : 'ltr'} />
              </div>
              <div className="space-y-2">
                <Label>البريد الإلكتروني</Label>
                <Input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} dir="ltr" />
              </div>
              <div className="space-y-2">
                <Label>الهاتف</Label>
                <Input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} dir="ltr" />
              </div>
              <div className="space-y-2">
                <Label>العنوان</Label>
                <Input value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} dir={isRTL ? 'rtl' : 'ltr'} />
              </div>
              <div className="space-y-2">
                <Label>الرقم الضريبي</Label>
                <Input value={formData.taxId} onChange={(e) => setFormData({ ...formData, taxId: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>ملاحظات</Label>
                <Textarea value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} dir={isRTL ? 'rtl' : 'ltr'} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>إلغاء</Button>
              <Button onClick={handleSubmit}>{editingClient ? 'تحديث' : 'إضافة'}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
