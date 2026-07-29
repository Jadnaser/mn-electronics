import { NavLink } from 'react-router-dom';
import { LayoutDashboard, FileText, Users, Package, Calculator, Settings, Moon, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useApp } from '@/contexts/AppContext';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'لوحة التحكم' },
  { to: '/invoices', icon: FileText, label: 'الفواتير' },
  { to: '/clients', icon: Users, label: 'العملاء' },
  { to: '/products', icon: Package, label: 'المنتجات' },
  { to: '/accounting', icon: Calculator, label: 'المحاسبة' },
  { to: '/settings', icon: Settings, label: 'الإعدادات' },
];

export default function Sidebar() {
  const { language, setLanguage, theme, setTheme } = useApp();
  const isRTL = language === 'ar';

  return (
    <aside className="fixed top-0 right-0 z-40 h-screen w-64 border-r bg-card transition-transform" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="flex h-full flex-col">
        <div className="flex h-16 items-center border-b px-6">
          <FileText className="h-6 w-6 text-primary ml-2" />
          <span className="text-lg font-bold">فواتيري</span>
        </div>

        <nav className="flex-1 space-y-1 p-3">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )
              }
            >
              <item.icon className={cn("h-4 w-4", isRTL ? 'ml-2' : 'mr-2')} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t p-3 space-y-2">
          <button
            onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
            className="flex w-full items-center rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            {isRTL ? 'English' : 'العربية'}
          </button>
          <button
            onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            className="flex w-full items-center rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
          >
            {theme === 'light' ? <Moon className={cn("h-4 w-4", isRTL ? 'ml-2' : 'mr-2')} /> : <Sun className={cn("h-4 w-4", isRTL ? 'ml-2' : 'mr-2')} />}
            {theme === 'light' ? 'الوضع الداكن' : 'الوضع الفاتح'}
          </button>
        </div>
      </div>
    </aside>
  );
}
