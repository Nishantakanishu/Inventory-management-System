import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { OrderService } from '../services/api';
import { useApp } from '../context/AppContext';
import {
  ArrowLeft,
  Calendar,
  User,
  Mail,
  Phone,
  FileText,
  Trash2,
  AlertTriangle
} from 'lucide-react';

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { cancelOrder, showToast } = useApp();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancelConfirm, setCancelConfirm] = useState(false);

  const fetchOrderDetails = async () => {
    setLoading(true);
    try {
      const res = await OrderService.getById(id);
      setOrder(res.data);
      setError(null);
    } catch (err) {
      setError(err.customMessage || 'Failed to load order details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  const handleCancelOrder = async () => {
    const success = await cancelOrder(order.id);
    if (success) {
      navigate('/orders');
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-500 animate-pulse bg-slate-900 border border-slate-800 rounded-2xl">
        Loading invoice summary...
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-2xl space-y-4">
        <p className="text-rose-400 font-semibold">{error || 'Order invoice not found'}</p>
        <Link to="/orders" className="inline-flex items-center gap-2 text-brand-400 font-semibold text-sm hover:underline">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Orders List</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Navigation Row */}
      <div className="flex items-center justify-between">
        <Link
          to="/orders"
          className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Orders</span>
        </Link>
        <button
          onClick={() => setCancelConfirm(true)}
          className="flex items-center gap-2 bg-rose-955/20 hover:bg-rose-900/30 text-rose-400 border border-rose-800/50 px-4 py-2 rounded-xl text-xs font-semibold transition-all"
        >
          <Trash2 className="w-4 h-4" />
          <span>Cancel & Refund Order</span>
        </button>
      </div>

      {/* Invoice Page Body */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Main Details (Products and Calculation) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
            {/* Header info */}
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-6 mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-brand-500/10 text-brand-400 rounded-xl">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Order Details</h2>
                  <p className="text-xs text-slate-400 mt-0.5">Invoice ID: #{order.id}</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-slate-400 block">Date Placed</span>
                <span className="text-sm font-semibold text-slate-200 mt-1 inline-flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  {new Date(order.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Items Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-800 text-xs font-bold uppercase tracking-wider text-slate-450">
                    <th className="pb-4">Product Catalog Item</th>
                    <th className="pb-4 text-right">Unit Price</th>
                    <th className="pb-4 text-right">Qty Ordered</th>
                    <th className="pb-4 text-right">Line Cost</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850 text-sm">
                  {order.items?.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-850/10">
                      <td className="py-4">
                        <div className="font-semibold text-white">
                          {item.product?.name || `Product ID: ${item.product_id}`}
                        </div>
                        <div className="text-xs font-mono text-slate-500 mt-0.5">
                          SKU: {item.product?.sku || 'N/A'}
                        </div>
                      </td>
                      <td className="py-4 text-right text-slate-300">
                        ${parseFloat(item.unit_price).toFixed(2)}
                      </td>
                      <td className="py-4 text-right text-slate-200">
                        {item.quantity}
                      </td>
                      <td className="py-4 text-right text-white font-semibold">
                        ${(parseFloat(item.unit_price) * item.quantity).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Invoice Footer total summary */}
            <div className="border-t border-slate-800/80 mt-6 pt-6 flex justify-end">
              <div className="w-full sm:w-64 space-y-3">
                <div className="flex justify-between text-sm text-slate-400 font-medium">
                  <span>Subtotal:</span>
                  <span className="text-slate-200">${parseFloat(order.total_amount).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm text-slate-400 font-medium">
                  <span>Tax & Fees:</span>
                  <span className="text-slate-200">$0.00</span>
                </div>
                <div className="h-px bg-slate-850 w-full" />
                <div className="flex justify-between text-base font-extrabold text-white">
                  <span>Total Amount Paid:</span>
                  <span className="text-brand-400">${parseFloat(order.total_amount).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Information Column */}
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">Client Information</h3>
            
            {order.customer ? (
              <div className="space-y-4 pt-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand-500/10 text-brand-400 flex items-center justify-center font-bold text-base shadow-sm">
                    {order.customer.full_name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-semibold text-white">{order.customer.full_name}</div>
                    <span className="text-xs text-slate-500 font-medium">Customer Profile</span>
                  </div>
                </div>

                <div className="h-px bg-slate-850" />

                <div className="space-y-3">
                  <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-350">
                    <Mail className="w-4 h-4 text-slate-550 shrink-0" />
                    <span className="break-all">{order.customer.email}</span>
                  </div>
                  {order.customer.phone_number && (
                    <div className="flex items-center gap-2.5 text-xs font-semibold text-slate-350">
                      <Phone className="w-4 h-4 text-slate-550 shrink-0" />
                      <span>{order.customer.phone_number}</span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-amber-500 text-xs py-2 bg-amber-500/5 px-3 rounded-lg border border-amber-500/10">
                <User className="w-4 h-4" />
                <span>Customer record could not be loaded or was deleted.</span>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Cancel Order Dialog */}
      {cancelConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setCancelConfirm(false)} />
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-sm p-6 relative z-10 shadow-2xl">
            <div className="flex flex-col items-center text-center">
              <div className="p-3 bg-rose-500/10 text-rose-400 rounded-full mb-4">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Cancel & Delete Order</h3>
              <p className="text-sm text-slate-400 mb-6">
                Are you sure you want to cancel order #{order.id}? This will delete the order record permanently and restore the inventory stock of all items in this order.
              </p>
              <div className="flex gap-3 w-full">
                <button
                  onClick={() => setCancelConfirm(false)}
                  className="flex-1 bg-slate-850 hover:bg-slate-800 border border-slate-800 text-slate-300 py-2.5 rounded-xl text-sm font-semibold transition-all"
                >
                  Keep Order
                </button>
                <button
                  onClick={handleCancelOrder}
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

export default OrderDetails;
