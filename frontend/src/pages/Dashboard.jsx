import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Link } from 'react-router-dom';
import {
  Package,
  Users,
  ShoppingCart,
  AlertTriangle,
  ArrowRight,
  TrendingUp
} from 'lucide-react';

const Dashboard = () => {
  const { summary, loading, errors, fetchSummary, products } = useApp();

  useEffect(() => {
    fetchSummary();
  }, []);

  const stats = [
    {
      name: 'Total Products',
      value: summary.total_products,
      icon: Package,
      color: 'from-blue-600 to-indigo-600',
      shadow: 'shadow-blue-500/10',
      link: '/products',
      desc: 'Items managed in catalog'
    },
    {
      name: 'Total Customers',
      value: summary.total_customers,
      icon: Users,
      color: 'from-purple-600 to-pink-600',
      shadow: 'shadow-purple-500/10',
      link: '/customers',
      desc: 'Registered business accounts'
    },
    {
      name: 'Total Orders',
      value: summary.total_orders,
      icon: ShoppingCart,
      color: 'from-emerald-600 to-teal-600',
      shadow: 'shadow-emerald-500/10',
      link: '/orders',
      desc: 'Sales transactions completed'
    },
    {
      name: 'Low Stock Products',
      value: summary.low_stock_products,
      icon: AlertTriangle,
      color: summary.low_stock_products > 0 ? 'from-accent-500 to-accent-600' : 'from-slate-600 to-slate-700',
      shadow: summary.low_stock_products > 0 ? 'shadow-accent-500/10' : 'shadow-slate-500/10',
      link: '/products',
      desc: 'Stock level under 10 items'
    }
  ];

  const lowStockItems = products.filter(p => p.quantity_in_stock < 10);

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Dashboard</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Real-time overview of catalog, stock levels, and order transactions.</p>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.name}
              className={`glass-panel rounded-2xl p-6 relative overflow-hidden transition-all duration-300 hover:shadow-lg ${stat.shadow}`}
            >
              {/* Decorative Gradient Background */}
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.color} opacity-[0.03] rounded-full blur-2xl`} />

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">{stat.name}</p>
                  {loading.summary ? (
                    <div className="h-9 w-16 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-lg mt-2" />
                  ) : (
                    <h3 className="text-3xl font-extrabold text-slate-800 dark:text-white mt-1 tracking-tight">
                      {stat.value}
                    </h3>
                  )}
                </div>
                <div className={`p-3.5 rounded-xl bg-gradient-to-br ${stat.color} text-white shadow-md`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
              <p className="text-xs text-slate-500 mt-4 font-medium">{stat.desc}</p>
              <div className="mt-4 pt-4 border-t border-slate-800/60 flex items-center justify-between">
                <Link to={stat.link} className="text-xs font-semibold text-brand-400 hover:text-brand-300 flex items-center gap-1">
                  <span>View Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Warning/Alert Low Stock Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Low Stock Alerts */}
        <div className="lg:col-span-2 glass-panel rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-accent-500" />
                <span>Low Stock Alerts</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Catalog items requiring immediate replenishment.</p>
            </div>
            <Link to="/products" className="text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
              Manage Products
            </Link>
          </div>

          {loading.products ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-14 bg-slate-850 animate-pulse rounded-xl" />
              ))}
            </div>
          ) : lowStockItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-slate-500">
              <span className="text-3xl">🎉</span>
              <p className="text-sm font-medium mt-2">All stock levels are optimal.</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden rounded-xl border border-slate-100 dark:border-slate-800">
              {lowStockItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 bg-white/50 dark:bg-slate-900/50 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                  <div>
                    <h4 className="font-semibold text-slate-800 dark:text-slate-200 text-sm">{item.name}</h4>
                    <span className="text-xs font-mono text-slate-500">SKU: {item.sku}</span>
                  </div>
                  <div className="text-right">
                    <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                      item.quantity_in_stock === 0 
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' 
                        : 'bg-accent-500/20 text-accent-600 dark:text-accent-400 border border-accent-500/30'
                    }`}>
                      {item.quantity_in_stock} remaining
                    </span>
                    <p className="text-xs text-slate-500 mt-1">${parseFloat(item.price).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Business summary details */}
        <div className="glass-panel rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-brand-400" />
              <span>Quick Actions</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Frequently used workflows for staff.</p>
            
            <div className="space-y-3 mt-6">
              <Link
                to="/orders"
                className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-all font-semibold text-sm text-slate-700 dark:text-slate-200"
              >
                <span>Place New Order</span>
                <ShoppingCart className="w-4 h-4 text-brand-500 dark:text-brand-400" />
              </Link>
              <Link
                to="/products"
                className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-all font-semibold text-sm text-slate-700 dark:text-slate-200"
              >
                <span>Add Catalog Product</span>
                <Package className="w-4 h-4 text-blue-500 dark:text-blue-400" />
              </Link>
              <Link
                to="/customers"
                className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-all font-semibold text-sm text-slate-700 dark:text-slate-200"
              >
                <span>Register Customer</span>
                <Users className="w-4 h-4 text-purple-500 dark:text-purple-400" />
              </Link>
            </div>
          </div>

          <div className="bg-brand-50 dark:bg-brand-950/20 border border-brand-200 dark:border-brand-850/50 p-4 rounded-xl mt-6 text-xs text-slate-900 dark:text-brand-300">
            <strong className="text-brand-700 dark:text-brand-400">System Settings:</strong> Data matches database transaction record. Stock calculations occur automatically on backend.
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
