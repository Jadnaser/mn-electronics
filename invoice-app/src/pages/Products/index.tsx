import { useState } from 'react';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Header from '@/components/layout/Header';
import { useApp } from '@/contexts/AppContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

export default function ProductsPage() {
  const { products, addProduct, updateProduct, deleteProduct, language } = useApp();
  const [search, setSearch] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '', description: '', price: 0, unit: '', category: '', taxRate: 15
  });
  const isRTL = language === 'ar';

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const openAddDialog = () => {
    setEditingProduct(null);
    setFormData({ name: '', description: '', price: 0, unit: '', category: '', taxRate: 15 });
    setIsDialogOpen(true);
  };

  const openEditDialog = (product: typeof products[0]) => {
    setEditingProduct(product.id);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      unit: product.unit,
      category: product.category,
      taxRate: product.taxRate,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = () => {
    if (!formData.name) return;
    if (editingProduct) {
      updateProduct(editingProduct, formData);
    } else {
      addProduct(formData);
    }
    setIsDialogOpen(false);
    setFormData({ name: '', description: '', price: 0, unit: '', category: '', taxRate: 15 });
  };

  const handleDelete = (id: string) => {
    if (confirm('هل أنت متأكد من حذف هذا المنتج؟')) {
      deleteProduct(id);
    }
  };

  return (
    <div className="min-h-screen">
      <Header title="المنتجات والخدمات" />
      <div className="p-6 space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="بحث عن منتج..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pr-9"
              dir={isRTL ? 'rtl' : 'ltr'}
            />
          </div>
          <Button onClick={openAddDialog}><Plus className="h-4 w-4 ml-2" /> منتج جديد</Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map((product) => (
            <Card key={product.id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-lg">{product.name}</h3>
                    <p className="text-sm text-muted-foreground">{product.category}</p>
                  </div>
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={() => openEditDialog(product)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(product.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-4">{product.description}</p>
                <div className="flex justify-between items-center pt-3 border-t">
                  <div>
                    <p className="text-2xl font-bold text-primary">
                      {product.price.toLocaleString()} <span className="text-sm font-normal text-muted-foreground">ر.س</span>
                    </p>
                    <p className="text-xs text-muted-foreground">{product.unit}</p>
                  </div>
                  <Badge variant="secondary">ضريبة {product.taxRate}%</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">لا توجد منتجات</p>
          </div>
        )}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>{editingProduct ? 'تعديل المنتج' : 'إضافة منتج جديد'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>اسم المنتج</Label>
                <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} dir={isRTL ? 'rtl' : 'ltr'} />
              </div>
              <div className="space-y-2">
                <Label>الوصف</Label>
                <Input value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} dir={isRTL ? 'rtl' : 'ltr'} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>السعر</Label>
                  <Input type="number" min="0" step="0.01" value={formData.price} onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })} />
                </div>
                <div className="space-y-2">
                  <Label>الوحدة</Label>
                  <Input value={formData.unit} onChange={(e) => setFormData({ ...formData, unit: e.target.value })} dir={isRTL ? 'rtl' : 'ltr'} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>الفئة</Label>
                  <Input value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} dir={isRTL ? 'rtl' : 'ltr'} />
                </div>
                <div className="space-y-2">
                  <Label>نسبة الضريبة %</Label>
                  <Input type="number" min="0" max="100" value={formData.taxRate} onChange={(e) => setFormData({ ...formData, taxRate: parseFloat(e.target.value) || 0 })} />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>إلغاء</Button>
              <Button onClick={handleSubmit}>{editingProduct ? 'تحديث' : 'إضافة'}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
