import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Link } from 'react-router-dom';
import {
  Plus,
  ShoppingCart,
  Calendar,
  DollarSign,
  User,
  Trash2,
  Eye,
  PlusCircle,
  MinusCircle,
  X,
  AlertTriangle
} from 'lucide-react';

const Orders = () => {
  const { orders, customers, products, createOrder, cancelOrder, loading } = useApp();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [selectedItems, setSelectedItems] = useState([
    { product_id: '', quantity: 1 }
  ]);
  const [formErrors, setFormErrors] = useState({});
  const [cancelConfirmId, setCancelConfirmId] = useState(null);

  const handleOpenModal = () => {
    setSelectedCustomerId('');
    setSelectedItems([{ product_id: '', quantity: 1 }]);
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleAddItemRow = () => {
    setSelectedItems([...selectedItems, { product_id: '', quantity: 1 }]);
  };

  const handleRemoveItemRow = (index) => {
    const items = [...selectedItems];
    items.splice(index, 1);
    setSelectedItems(items);
  };

  const handleItemChange = (index, field, value) => {
    const items = [...selectedItems];
    items[index][field] = value;
    setSelectedItems(items);
  };

  const calculateLiveTotal = () => {
    return selectedItems.reduce((sum, item) => {
      const prod = products.find(p => p.id === parseInt(item.product_id));
      if (prod) {
        return sum + (parseFloat(prod.price) * (parseInt(item.quantity) || 0));
      }
      return sum;
    }, 0);
  };

  const validateForm = () => {
    const errors = {};
    if (!selectedCustomerId) errors.customer = 'Please select a customer';

    const itemErrors = [];
    selectedItems.forEach((item, index) => {
      const idxErrors = {};
      if (!item.product_id) {
        idxErrors.product_id = 'Select product';
      }
      
      const qty = parseInt(item.quantity);
      if (isNaN(qty) || qty <= 0) {
        idxErrors.quantity = 'Must be > 0';
      } else {
        const prod = products.find(p => p.id === parseInt(item.product_id));
        if (prod && prod.quantity_in_stock < qty) {
          idxErrors.quantity = `Max: ${prod.quantity_in_stock}`;
        }
      }
      if (Object.keys(idxErrors).length > 0) {
        itemErrors[index] = idxErrors;
      }
    });

    if (itemErrors.length > 0) {
      errors.items = itemErrors;
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = {
      customer_id: parseInt(selectedCustomerId),
      items: selectedItems.map(item => ({
        product_id: parseInt(item.product_id),
        quantity: parseInt(item.quantity)
      }))
    };

    const result = await createOrder(payload);
    if (result) {
      setIsModalOpen(false);
    }
  };

  const handleCancelOrder = async (id) => {
    const success = await cancelOrder(id);
    if (success) {
      setCancelConfirmId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Orders</h1>
          <p className="text-slate-400 mt-1">Place new transactions, track stock changes, and inspect invoices.</p>
        </div>
        <button
          onClick={handleOpenModal}
          className="flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-4 py-2.5 rounded-xl font-semibold shadow-lg shadow-brand-500/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-5 h-5" />
          <span>New Order</span>
        </button>
      </div>

      {/* Orders List Display */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        {loading.orders && orders.length === 0 ? (
          <div className="p-12 text-center text-slate-500 animate-pulse">
            Loading orders log...
          </div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <ShoppingCart className="w-12 h-12 mx-auto text-slate-700 mb-3" />
            <p className="font-semibold text-slate-400">No orders placed yet</p>
            <p className="text-xs text-slate-600 mt-1 font-medium">Click "New Order" to process a transaction.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-850 border-b border-slate-800 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">Customer</th>
                  <th className="px-6 py-4 text-right">Total Amount</th>
                  <th className="px-6 py-4 text-center">Date Placed</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850 text-sm font-medium">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-850/20 transition-colors">
                    <td className="px-6 py-4 text-brand-400 font-mono font-bold">
                      #{order.id}
                    </td>
                    <td className="px-6 py-4 text-white">
                      {order.customer?.full_name || `Customer ID: ${order.customer_id}`}
                    </td>
                    <td className="px-6 py-4 text-right text-slate-200 font-semibold">
                      ${parseFloat(order.total_amount).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-center text-slate-400 text-xs">
                      <div className="flex items-center justify-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-650" />
                        <span>{new Date(order.created_at).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center items-center gap-2">
                        <Link
                          to={`/orders/${order.id}`}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                          title="View Invoice"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => setCancelConfirmId(order.id)}
                          className="p-1.5 rounded-lg text-rose-450 hover:text-rose-350 hover:bg-rose-950/30 transition-colors"
                          title="Cancel/Refund Order"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* New Order Wizard Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="glass-panel rounded-2xl w-full max-w-2xl p-6 relative z-10 shadow-2xl flex flex-col max-h-[90vh]">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-4 top-4 p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-brand-500" />
              <span>Create New Order</span>
            </h2>

            <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden space-y-4">
              {/* Customer selection */}
              <div>
                <label className="block text-xs font-bold text-slate-500 dark:text-slate-450 uppercase tracking-wider mb-2">Select Customer</label>
                <select
                  value={selectedCustomerId}
                  onChange={(e) => setSelectedCustomerId(e.target.value)}
                  className={`w-full bg-white dark:bg-slate-800 border rounded-xl px-4 py-2.5 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 ${
                    formErrors.customer ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <option value="" className="text-slate-900 dark:text-white">-- Select Registered Client --</option>
                  {customers.map(c => (
                    <option key={c.id} value={c.id} className="text-slate-900 dark:text-white">{c.full_name} ({c.email})</option>
                  ))}
                </select>
                {formErrors.customer && <p className="text-xs text-rose-450 mt-1 font-semibold">{formErrors.customer}</p>}
              </div>

              {/* Items row list */}
              <div className="flex-1 overflow-y-auto space-y-3 pr-1 py-1">
                <div className="flex justify-between items-center">
                  <label className="block text-xs font-bold text-slate-450 uppercase tracking-wider">Order Line Items</label>
                  <button
                    type="button"
                    onClick={handleAddItemRow}
                    className="text-xs font-bold text-brand-400 hover:text-brand-300 flex items-center gap-1"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Add Item</span>
                  </button>
                </div>

                {selectedItems.map((item, index) => {
                  const itemErr = formErrors.items?.[index] || {};
                  const selectedProd = products.find(p => p.id === parseInt(item.product_id));
                  return (
                    <div key={index} className="flex items-start gap-3 bg-slate-50/50 dark:bg-slate-850/40 p-3 rounded-xl border border-slate-100 dark:border-slate-800/60">
                      {/* Product selection */}
                      <div className="flex-1">
                        <select
                          value={item.product_id}
                          onChange={(e) => handleItemChange(index, 'product_id', e.target.value)}
                          className={`w-full bg-white dark:bg-slate-900 border rounded-lg px-3 py-2 text-slate-900 dark:text-white text-xs focus:outline-none focus:border-brand-500 ${
                            itemErr.product_id ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
                          }`}
                        >
                          <option value="" className="text-slate-900 dark:text-white">-- Choose Product --</option>
                          {products.map(p => (
                            <option key={p.id} value={p.id} disabled={p.quantity_in_stock === 0} className="text-slate-900 dark:text-white">
                              {p.name} (SKU: {p.sku}) — ${parseFloat(p.price).toFixed(2)} [Qty: {p.quantity_in_stock}]
                            </option>
                          ))}
                        </select>
                        {itemErr.product_id && <p className="text-[10px] text-rose-500 mt-1 font-semibold">{itemErr.product_id}</p>}
                      </div>

                      {/* Quantity Input */}
                      <div className="w-24">
                        <input
                          type="number"
                          placeholder="Qty"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                          className={`w-full bg-white dark:bg-slate-900 border rounded-lg px-3 py-2 text-slate-900 dark:text-white text-xs text-center focus:outline-none focus:border-brand-500 ${
                            itemErr.quantity ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
                          }`}
                        />
                        {itemErr.quantity && <p className="text-[10px] text-rose-500 mt-1 font-semibold">{itemErr.quantity}</p>}
                      </div>

                      {/* Line Subtotal */}
                      <div className="w-24 pt-2.5 text-right text-xs font-semibold text-slate-350">
                        {selectedProd ? `$${(parseFloat(selectedProd.price) * (parseInt(item.quantity) || 0)).toFixed(2)}` : '$0.00'}
                      </div>

                      {/* Row Delete Button */}
                      {selectedItems.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveItemRow(index)}
                          className="pt-2 text-slate-500 hover:text-rose-450 transition-colors"
                        >
                          <MinusCircle className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Order total calculation summary & buttons */}
              <div className="pt-4 border-t border-slate-200 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                  Est. Total: <span className="text-xl font-extrabold text-slate-900 dark:text-white ml-1">${calculateLiveTotal().toFixed(2)}</span>
                </div>
                <div className="flex gap-3 w-full sm:w-auto justify-end">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-750 text-slate-600 dark:text-slate-350 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-brand-600 hover:bg-brand-700 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-brand-500/20"
                  >
                    Place Order
                  </button>
                </div>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Cancel Confirmation Dialog */}
      {cancelConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setCancelConfirmId(null)} />
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-sm p-6 relative z-10 shadow-2xl">
            <div className="flex flex-col items-center text-center">
              <div className="p-3 bg-rose-500/10 text-rose-400 rounded-full mb-4">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Cancel & Delete Order</h3>
              <p className="text-sm text-slate-400 mb-6">
                Are you sure you want to cancel order #{cancelConfirmId}? This will delete the order record permanently and restore the inventory stock of all items in this order.
              </p>
              <div className="flex gap-3 w-full">
                <button
                  onClick={() => setCancelConfirmId(null)}
                  className="flex-1 bg-slate-850 hover:bg-slate-800 border border-slate-800 text-slate-300 py-2.5 rounded-xl text-sm font-semibold transition-all"
                >
                  Keep Order
                </button>
                <button
                  onClick={() => handleCancelOrder(cancelConfirmId)}
                  className="flex-1 bg-rose-600 hover:bg-rose-700 text-white py-2.5 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-rose-600/10"
                >
                  Cancel Order
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Orders;
