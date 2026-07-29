import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Toaster } from '@/components/ui/toaster';
import { useApp } from '@/contexts/AppContext';
import { cn } from '@/lib/utils';

export default function Layout() {
  const { language } = useApp();
  const isRTL = language === 'ar';

  return (
    <div className={cn("min-h-screen bg-muted/30", isRTL ? "rtl" : "ltr")} dir={isRTL ? 'rtl' : 'ltr'}>
      <Sidebar />
      <div className={cn("min-h-screen transition-all", isRTL ? "mr-64 ml-0" : "ml-64 mr-0")}>
        <Outlet />
      </div>
      <Toaster />
    </div>
  );
}
