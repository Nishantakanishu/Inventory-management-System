import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Plus,
  Users,
  Mail,
  Phone,
  Trash2,
  AlertTriangle,
  X
} from 'lucide-react';

const Customers = () => {
  const { customers, loading, addCustomer, deleteCustomer } = useApp();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone_number: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const handleOpenModal = () => {
    setFormData({ full_name: '', email: '', phone_number: '' });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.full_name.trim()) errors.full_name = 'Full name is required';
    
    if (!formData.email.trim()) {
      errors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Provide a valid email address';
    }

    if (formData.phone_number.trim() && !/^\+?[0-9\s-]{7,20}$/.test(formData.phone_number)) {
      errors.phone_number = 'Provide a valid phone number (min 7 digits)';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = {
      full_name: formData.full_name.trim(),
      email: formData.email.trim(),
      phone_number: formData.phone_number.trim() || null
    };

    const success = await addCustomer(payload);
    if (success) {
      setIsModalOpen(false);
    }
  };

  const handleDelete = async (id) => {
    const success = await deleteCustomer(id);
    if (success) {
      setDeleteConfirmId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Customers</h1>
          <p className="text-slate-400 mt-1">Register new client accounts and view order relationship contacts.</p>
        </div>
        <button
          onClick={handleOpenModal}
          className="flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-4 py-2.5 rounded-xl font-semibold shadow-lg shadow-brand-500/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-5 h-5" />
          <span>Add Customer</span>
        </button>
      </div>

      {/* Customer List Display */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        {loading.customers && customers.length === 0 ? (
          <div className="p-12 text-center text-slate-500 animate-pulse">
            Loading customers list...
          </div>
        ) : customers.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <Users className="w-12 h-12 mx-auto text-slate-700 mb-3" />
            <p className="font-semibold text-slate-400">No registered customers</p>
            <p className="text-xs text-slate-600 mt-1 font-medium">Add a customer to begin processing orders.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-850 border-b border-slate-800 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Email Address</th>
                  <th className="px-6 py-4">Phone Number</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850 text-sm font-medium">
                {customers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-slate-850/20 transition-colors">
                    <td className="px-6 py-4 text-white font-semibold flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-brand-500/10 text-brand-400 flex items-center justify-center font-bold text-sm">
                        {customer.full_name.charAt(0).toUpperCase()}
                      </div>
                      <span>{customer.full_name}</span>
                    </td>
                    <td className="px-6 py-4 text-slate-300">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-slate-550" />
                        <span>{customer.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-350">
                      {customer.phone_number ? (
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-slate-550" />
                          <span>{customer.phone_number}</span>
                        </div>
                      ) : (
                        <span className="text-slate-600 text-xs italic">Not Provided</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => setDeleteConfirmId(customer.id)}
                        className="p-1.5 rounded-lg text-rose-450 hover:text-rose-350 hover:bg-rose-950/30 transition-colors"
                        title="Remove Customer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Customer Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 relative z-10 shadow-2xl">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute right-4 top-4 p-1.5 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-bold text-white mb-6">Register Customer</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-450 uppercase tracking-wider mb-2">Customer Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. John Doe"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  className={`w-full bg-slate-800 border rounded-xl px-4 py-2.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 ${
                    formErrors.full_name ? 'border-rose-500' : 'border-slate-700'
                  }`}
                />
                {formErrors.full_name && <p className="text-xs text-rose-450 mt-1 font-semibold">{formErrors.full_name}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-450 uppercase tracking-wider mb-2">Email Address</label>
                <input
                  type="email"
                  placeholder="e.g. john@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`w-full bg-slate-800 border rounded-xl px-4 py-2.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 ${
                    formErrors.email ? 'border-rose-500' : 'border-slate-700'
                  }`}
                />
                {formErrors.email && <p className="text-xs text-rose-450 mt-1 font-semibold">{formErrors.email}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-450 uppercase tracking-wider mb-2">Phone Number (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. 9999999999"
                  value={formData.phone_number}
                  onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                  className={`w-full bg-slate-800 border rounded-xl px-4 py-2.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 ${
                    formErrors.phone_number ? 'border-rose-500' : 'border-slate-700'
                  }`}
                />
                {formErrors.phone_number && <p className="text-xs text-rose-450 mt-1 font-semibold">{formErrors.phone_number}</p>}
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-slate-800/60 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-slate-800 hover:bg-slate-750 text-slate-350 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-brand-600 hover:bg-brand-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
                >
                  Register Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setDeleteConfirmId(null)} />
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-sm p-6 relative z-10 shadow-2xl">
            <div className="flex flex-col items-center text-center">
              <div className="p-3 bg-rose-500/10 text-rose-400 rounded-full mb-4">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Remove Customer</h3>
              <p className="text-sm text-slate-400 mb-6">
                Are you sure you want to remove this customer profile? This will delete all order histories associated with them due to database constraints.
              </p>
              <div className="flex gap-3 w-full">
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  className="flex-1 bg-slate-850 hover:bg-slate-800 border border-slate-800 text-slate-300 py-2.5 rounded-xl text-sm font-semibold transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirmId)}
                  className="flex-1 bg-rose-600 hover:bg-rose-700 text-white py-2.5 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-rose-600/10"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Customers;
