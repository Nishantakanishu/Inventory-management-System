import React, { createContext, useContext, useState, useEffect } from 'react';
import { ProductService, CustomerService, OrderService, DashboardService } from '../services/api';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [summary, setSummary] = useState({
    total_products: 0,
    total_customers: 0,
    total_orders: 0,
    low_stock_products: 0
  });

  const [loading, setLoading] = useState({
    products: false,
    customers: false,
    orders: false,
    summary: false
  });

  const [errors, setErrors] = useState({
    products: null,
    customers: null,
    orders: null,
    summary: null
  });

  const [toasts, setToasts] = useState([]);

  // Toast helper
  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Actions
  const fetchSummary = async () => {
    setLoading(prev => ({ ...prev, summary: true }));
    try {
      const res = await DashboardService.getSummary();
      setSummary(res.data);
      setErrors(prev => ({ ...prev, summary: null }));
    } catch (err) {
      setErrors(prev => ({ ...prev, summary: err.customMessage || 'Failed to fetch summary' }));
    } finally {
      setLoading(prev => ({ ...prev, summary: false }));
    }
  };

  const fetchProducts = async () => {
    setLoading(prev => ({ ...prev, products: true }));
    try {
      const res = await ProductService.getAll();
      setProducts(res.data);
      setErrors(prev => ({ ...prev, products: null }));
    } catch (err) {
      setErrors(prev => ({ ...prev, products: err.customMessage || 'Failed to fetch products' }));
    } finally {
      setLoading(prev => ({ ...prev, products: false }));
    }
  };

  const fetchCustomers = async () => {
    setLoading(prev => ({ ...prev, customers: true }));
    try {
      const res = await CustomerService.getAll();
      setCustomers(res.data);
      setErrors(prev => ({ ...prev, customers: null }));
    } catch (err) {
      setErrors(prev => ({ ...prev, customers: err.customMessage || 'Failed to fetch customers' }));
    } finally {
      setLoading(prev => ({ ...prev, customers: false }));
    }
  };

  const fetchOrders = async () => {
    setLoading(prev => ({ ...prev, orders: true }));
    try {
      const res = await OrderService.getAll();
      setOrders(res.data);
      setErrors(prev => ({ ...prev, orders: null }));
    } catch (err) {
      setErrors(prev => ({ ...prev, orders: err.customMessage || 'Failed to fetch orders' }));
    } finally {
      setLoading(prev => ({ ...prev, orders: false }));
    }
  };

  // CRUD actions with automatic summary & dependent lists refreshing
  const addProduct = async (productData) => {
    try {
      const res = await ProductService.create(productData);
      setProducts(prev => [...prev, res.data]);
      showToast(`Product "${res.data.name}" added successfully.`);
      fetchSummary();
      return true;
    } catch (err) {
      showToast(err.customMessage || 'Failed to add product', 'error');
      return false;
    }
  };

  const updateProduct = async (id, productData) => {
    try {
      const res = await ProductService.update(id, productData);
      setProducts(prev => prev.map(p => p.id === id ? res.data : p));
      showToast(`Product "${res.data.name}" updated successfully.`);
      fetchSummary();
      return true;
    } catch (err) {
      showToast(err.customMessage || 'Failed to update product', 'error');
      return false;
    }
  };

  const deleteProduct = async (id) => {
    try {
      await ProductService.delete(id);
      setProducts(prev => prev.filter(p => p.id !== id));
      showToast('Product deleted successfully.');
      fetchSummary();
      return true;
    } catch (err) {
      showToast(err.customMessage || 'Failed to delete product', 'error');
      return false;
    }
  };

  const addCustomer = async (customerData) => {
    try {
      const res = await CustomerService.create(customerData);
      setCustomers(prev => [...prev, res.data]);
      showToast(`Customer "${res.data.full_name}" registered.`);
      fetchSummary();
      return true;
    } catch (err) {
      showToast(err.customMessage || 'Failed to add customer', 'error');
      return false;
    }
  };

  const deleteCustomer = async (id) => {
    try {
      await CustomerService.delete(id);
      setCustomers(prev => prev.filter(c => c.id !== id));
      showToast('Customer deleted successfully.');
      fetchSummary();
      return true;
    } catch (err) {
      showToast(err.customMessage || 'Failed to delete customer', 'error');
      return false;
    }
  };

  const createOrder = async (orderData) => {
    try {
      const res = await OrderService.create(orderData);
      setOrders(prev => [res.data, ...prev]);
      showToast(`Order #${res.data.id} placed successfully.`);
      // Refresh inventory and summary counters
      fetchProducts();
      fetchSummary();
      return res.data;
    } catch (err) {
      showToast(err.customMessage || 'Failed to create order', 'error');
      return null;
    }
  };

  const cancelOrder = async (id) => {
    try {
      await OrderService.delete(id);
      setOrders(prev => prev.filter(o => o.id !== id));
      showToast(`Order #${id} cancelled. Restored product stock.`);
      // Refresh inventory and summary counters
      fetchProducts();
      fetchSummary();
      return true;
    } catch (err) {
      showToast(err.customMessage || 'Failed to cancel order', 'error');
      return false;
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchSummary();
    fetchProducts();
    fetchCustomers();
    fetchOrders();
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <AppContext.Provider value={{
      products,
      customers,
      orders,
      summary,
      theme,
      loading,
      errors,
      toasts,
      showToast,
      removeToast,
      toggleTheme,
      fetchSummary,
      fetchProducts,
      fetchCustomers,
      fetchOrders,
      addProduct,
      updateProduct,
      deleteProduct,
      addCustomer,
      deleteCustomer,
      createOrder,
      cancelOrder
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
