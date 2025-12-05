'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  LayoutDashboard,
  CreditCard,
  User,
  BookOpen,
  GraduationCap,
  ShoppingCart,
  Inbox,
  LogOut,
  Sparkles,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { signOut } from '@/app/(auth)/actions';
import { useState } from 'react';
import { toast } from 'sonner';

interface DashboardSidebarProps {
  user: any;
  profile: { name: string; email: string } | null;
}

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Billing', href: '/billing', icon: CreditCard },
  { name: 'My Human Design', href: '/my-chart', icon: Sparkles },
  { name: 'FREE Resources', href: '/resources', icon: BookOpen },
  { name: 'Classes', href: '/classes', icon: GraduationCap },
  { name: 'Cart', href: '/cart', icon: ShoppingCart },
  { name: 'Inbox', href: '/inbox', icon: Inbox },
];

export default function DashboardSidebar({ user, profile }: DashboardSidebarProps) {
  const pathname = usePathname();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await signOut();
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Error logging out');
      setIsLoggingOut(false);
    }
  };

  // Get first name from profile
  const firstName = profile?.name?.split(' ')[0] || 'Student';
  const initials = profile?.name
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'ST';

  return (
    <aside
      className={cn(
        "relative z-20 bg-gradient-to-b from-primary/95 to-primary/90 backdrop-blur-sm text-white flex flex-col shadow-2xl border-r border-primary/20 transition-all duration-300",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      {/* Collapse Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-3 top-8 w-6 h-6 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white shadow-lg hover:shadow-xl transition-all hover:scale-110 z-30"
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {isCollapsed ? (
          <ChevronRight className="w-4 h-4" />
        ) : (
          <ChevronLeft className="w-4 h-4" />
        )}
      </button>

      {/* User Profile Section */}
      <div className={cn(
        "p-6 border-b border-white/10 transition-all duration-300",
        isCollapsed && "p-4"
      )}>
        <div className={cn(
          "flex items-center gap-3",
          isCollapsed && "flex-col gap-2"
        )}>
          <Avatar className={cn(
            "bg-white/20 border-2 border-white/30 transition-all duration-300",
            isCollapsed ? "h-10 w-10" : "h-12 w-12"
          )}>
            <AvatarFallback className="bg-gradient-to-br from-accent to-primary text-white font-bold">
              {initials}
            </AvatarFallback>
          </Avatar>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm truncate text-white">
                {firstName}
              </p>
              <p className="text-xs text-white/70 truncate">
                Student
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200',
                'hover:bg-white/10 hover:translate-x-1',
                isActive
                  ? 'bg-white/20 text-white font-medium shadow-lg'
                  : 'text-white/80 hover:text-white',
                isCollapsed && 'justify-center px-2'
              )}
              title={isCollapsed ? item.name : undefined}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {!isCollapsed && <span className="text-sm">{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-white/10">
        <Button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className={cn(
            'w-full flex items-center gap-3 px-4 py-3',
            'bg-white/10 hover:bg-white/20 text-white border border-white/20',
            'transition-all duration-200 hover:translate-x-1',
            isCollapsed && 'justify-center px-2'
          )}
          variant="ghost"
          title={isCollapsed ? 'Logout' : undefined}
        >
          <LogOut className="h-5 w-5" />
          {!isCollapsed && (
            <span className="text-sm font-medium">
              {isLoggingOut ? 'Logging out...' : 'Logout'}
            </span>
          )}
        </Button>
      </div>
    </aside>
  );
}
