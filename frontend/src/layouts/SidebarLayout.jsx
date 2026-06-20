import React, { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingCart,
  Menu,
  X,
  Bell,
  AlertTriangle,
  XCircle,
  CheckCircle,
  Info,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon
} from 'lucide-react';

const SidebarLayout = () => {
  const { summary, toasts, removeToast, theme, toggleTheme } = useApp();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Products', href: '/products', icon: Package, badge: summary.low_stock_products > 0 ? summary.low_stock_products : null },
    { name: 'Customers', href: '/customers', icon: Users },
    { name: 'Orders', href: '/orders', icon: ShoppingCart },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-transparent text-slate-900 dark:text-slate-100 selection:bg-brand-500/30 selection:text-brand-900 dark:selection:text-brand-100">
      
      {/* Sidebar - Desktop */}
      <aside className={`hidden md:flex flex-col bg-brand-50/90 dark:bg-slate-900/60 backdrop-blur-xl border-r border-brand-100 dark:border-slate-800/80 shrink-0 transition-all duration-300 relative z-30 ${isCollapsed ? 'w-20' : 'w-56'}`}>
        
        {/* Toggle Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-6 bg-white dark:bg-slate-800 border border-brand-200 dark:border-slate-700 text-brand-600 dark:text-slate-300 rounded-full p-1 hover:text-brand-700 dark:hover:text-white z-50 shadow-lg transition-colors"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>

        {/* Brand */}
        <div className={`h-16 flex items-center border-b border-brand-100 dark:border-slate-800/80 overflow-hidden transition-all duration-300 ${isCollapsed ? 'justify-center px-0' : 'px-6 gap-3'}`}>
          <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 bg-white rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden">
            <img src="/inventorySystem.png" alt="Logo" className="w-full h-full object-contain p-1" />
          </div>
          {!isCollapsed && (
            <span className="font-extrabold text-lg tracking-wider bg-gradient-to-r from-slate-800 to-slate-500 dark:from-white dark:to-slate-400 bg-clip-text text-transparent truncate">
              Inventory System
            </span>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 space-y-2 overflow-y-auto">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href || location.pathname.startsWith(item.href + '/');
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`relative flex items-center rounded-xl transition-all duration-200 group ${
                  isCollapsed ? 'justify-center py-3' : 'justify-between px-4 py-3'
                } ${
                  isActive
                    ? 'bg-gradient-to-r from-brand-600 to-brand-500 text-white font-medium shadow-lg shadow-brand-500/20'
                    : 'text-brand-900/70 dark:text-slate-400 hover:bg-brand-100/50 dark:hover:bg-slate-800/50 hover:text-brand-900 dark:hover:text-white'
                }`}
                title={isCollapsed ? item.name : undefined}
              >
                <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
                  <Icon className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 ${isActive ? 'text-white' : 'text-brand-500/70 dark:text-slate-400 group-hover:text-brand-700 dark:group-hover:text-white'}`} />
                  {!isCollapsed && <span className="truncate">{item.name}</span>}
                </div>
                
                {/* Badge for Desktop */}
                {item.badge !== null && (
                  isCollapsed ? (
                    <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-accent-500 animate-pulse border-2 border-white dark:border-slate-900" />
                  ) : (
                    <span className={`px-2 py-0.5 text-xs font-semibold rounded-full shadow-sm ${
                      isActive ? 'bg-white/20 text-white' : 'bg-accent-100 dark:bg-accent-500/10 border border-accent-200 dark:border-accent-500/20 text-accent-700 dark:text-accent-400'
                    }`}>
                      {item.badge}
                    </span>
                  )
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className={`p-4 border-t border-brand-100 dark:border-slate-800/80 transition-all duration-300 ${isCollapsed ? 'opacity-0 h-0 p-0 overflow-hidden border-none' : 'opacity-100'}`}>
          <div className="bg-brand-100/50 dark:bg-slate-800/30 rounded-xl p-3 flex flex-col items-center justify-center backdrop-blur-sm border border-brand-200/50 dark:border-slate-700/50 shadow-sm text-center">
            <span className="font-semibold text-slate-700 dark:text-slate-300 text-sm">v1.0.0</span>
            <span className="text-[10px] text-slate-500">Production Ready</span>
          </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden h-16 flex items-center justify-between px-6 bg-slate-900 border-b border-slate-800 shrink-0 sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 bg-white rounded-lg shadow-sm overflow-hidden">
            <img src="/inventorySystem.png" alt="Logo" className="w-full h-full object-contain p-1" />
          </div>
          <span className="font-bold text-base tracking-wider text-white">Inventory System</span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </header>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-30 flex">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <nav className="relative flex flex-col w-72 max-w-xs bg-slate-900 h-full p-6 shadow-2xl border-r border-slate-800">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-10 h-10 bg-white rounded-xl shadow-sm overflow-hidden">
                  <img src="/inventorySystem.png" alt="Logo" className="w-full h-full object-contain p-1.5" />
                </div>
                <span className="font-extrabold text-lg text-white">Inventory System</span>
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-1">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href || location.pathname.startsWith(item.href + '/');
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                      isActive
                        ? 'bg-brand-600 text-white font-medium'
                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5" />
                      <span>{item.name}</span>
                    </div>
                    {item.badge !== null && (
                      <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-accent-500/20 text-accent-600 dark:text-accent-400">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </nav>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        {/* Top Header - Desktop */}
        <header className="hidden md:flex h-16 items-center justify-between px-8 bg-white/80 dark:bg-slate-900/60 border-b border-slate-200 dark:border-slate-800/80 backdrop-blur-xl sticky top-0 z-20">
          <div className="text-sm text-slate-500 dark:text-slate-400 font-medium">
            System Dashboard
          </div>
          <div className="flex items-center gap-4">
            {summary.low_stock_products > 0 && (
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-50 dark:bg-accent-500/10 text-accent-600 dark:text-accent-400 text-xs font-medium border border-accent-200 dark:border-accent-500/20">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>{summary.low_stock_products} Low Stock Items</span>
              </div>
            )}
            <div className="h-8 w-px bg-slate-200 dark:bg-slate-800" />
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 shadow-sm hover:text-brand-600 dark:hover:text-white transition-colors"
              title="Toggle Theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <div className="h-8 w-px bg-slate-200 dark:bg-slate-800" />
            <div className="text-slate-700 dark:text-slate-300 text-sm font-semibold flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              Production Mode
            </div>
          </div>
        </header>

        {/* Inner Content */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>

      {/* Toast Notification Container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`p-4 rounded-xl shadow-xl flex items-start gap-3 border pointer-events-auto transition-all duration-300 transform translate-y-0 animate-slide-in ${
              toast.type === 'error'
                ? 'bg-rose-950/90 text-rose-200 border-rose-800/50'
                : 'bg-emerald-950/90 text-emerald-200 border-emerald-800/50'
            }`}
          >
            <div className="mt-0.5">
              {toast.type === 'error' ? (
                <XCircle className="w-5 h-5 text-rose-400" />
              ) : (
                <CheckCircle className="w-5 h-5 text-emerald-400" />
              )}
            </div>
            <div className="flex-1 text-sm font-medium">
              {toast.message}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

    </div>
  );
};

export default SidebarLayout;
