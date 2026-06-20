import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  AlertTriangle,
  Package,
  ArrowUpDown
} from 'lucide-react';

const Products = () => {
  const { products, loading, addProduct, updateProduct, deleteProduct } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  
  // Form states
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    price: '',
    quantity_in_stock: ''
  });
  const [formErrors, setFormErrors] = useState({});

  // Delete Confirmation state
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Search filter
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setFormData({ name: '', sku: '', price: '', quantity_in_stock: '' });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      sku: product.sku,
      price: product.price,
      quantity_in_stock: product.quantity_in_stock
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = 'Product name is required';
    
    if (!formData.sku.trim()) {
      errors.sku = 'SKU is required';
    } else if (!/^[a-zA-Z0-9_-]+$/.test(formData.sku)) {
      errors.sku = 'SKU must contain only letters, numbers, hyphens, and underscores';
    }

    const priceNum = parseFloat(formData.price);
    if (isNaN(priceNum) || priceNum <= 0) {
      errors.price = 'Price must be a valid number greater than 0';
    }

    const qtyNum = parseInt(formData.quantity_in_stock);
    if (isNaN(qtyNum) || qtyNum < 0) {
      errors.quantity_in_stock = 'Stock quantity cannot be negative';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = {
      name: formData.name.trim(),
      sku: formData.sku.trim().toUpperCase(),
      price: parseFloat(formData.price),
      quantity_in_stock: parseInt(formData.quantity_in_stock)
    };

    let success;
    if (editingProduct) {
      success = await updateProduct(editingProduct.id, payload);
    } else {
      success = await addProduct(payload);
    }

    if (success) {
      setIsModalOpen(false);
    }
  };

  const handleDelete = async (id) => {
    const success = await deleteProduct(id);
    if (success) {
      setDeleteConfirmId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Products</h1>
          <p className="text-slate-400 mt-1">Manage items, tracking status, pricing, and stock levels.</p>
        </div>
        <button
          onClick={handleOpenAddModal}
          className="flex items-center justify-center gap-2 bg-brand-600 hover:bg-brand-700 text-white px-4 py-2.5 rounded-xl font-semibold shadow-lg shadow-brand-500/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-5 h-5" />
          <span>Add Product</span>
        </button>
      </div>

      {/* Search & Statistics Bar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          <input
            type="text"
            placeholder="Search products by name or SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-12 pr-4 py-3 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all text-sm"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white text-xs"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Catalog Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        {loading.products && products.length === 0 ? (
          <div className="p-12 text-center text-slate-500 animate-pulse">
            Loading catalog list...
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <Package className="w-12 h-12 mx-auto text-slate-700 mb-3" />
            <p className="font-semibold text-slate-400">No products found</p>
            <p className="text-xs text-slate-600 mt-1">Try tweaking your search term or add a new product.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-850 border-b border-slate-800 text-xs font-semibold uppercase tracking-wider text-slate-400">
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">SKU</th>
                  <th className="px-6 py-4 text-right">Price</th>
                  <th className="px-6 py-4 text-right">Stock</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-850 text-sm font-medium">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-850/20 transition-colors">
                    <td className="px-6 py-4 text-white font-semibold">
                      {product.name}
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-slate-400">
                      {product.sku}
                    </td>
                    <td className="px-6 py-4 text-right text-slate-200">
                      ${parseFloat(product.price).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                        product.quantity_in_stock < 10 
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' 
                          : 'bg-slate-850 text-slate-300'
                      }`}>
                        {product.quantity_in_stock}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center items-center gap-2">
                        <button
                          onClick={() => handleOpenEditModal(product)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(product.id)}
                          className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 transition-colors"
                          title="Delete"
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

      {/* Add / Edit Product Modal */}
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

            <h2 className="text-xl font-bold text-white mb-6">
              {editingProduct ? 'Edit Catalog Product' : 'Add New Product'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-450 uppercase tracking-wider mb-2">Product Name</label>
                <input
                  type="text"
                  placeholder="e.g. Wireless Mouse"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full bg-slate-800 border rounded-xl px-4 py-2.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 ${
                    formErrors.name ? 'border-rose-500' : 'border-slate-700'
                  }`}
                />
                {formErrors.name && <p className="text-xs text-rose-450 mt-1 font-semibold">{formErrors.name}</p>}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-450 uppercase tracking-wider mb-2">SKU Code</label>
                <input
                  type="text"
                  placeholder="e.g. MOUSE-001"
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  disabled={!!editingProduct} // SKU cannot be modified on edit (standard constraint)
                  className={`w-full bg-slate-800 border rounded-xl px-4 py-2.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 ${
                    editingProduct ? 'opacity-50 cursor-not-allowed border-slate-700' : formErrors.sku ? 'border-rose-500' : 'border-slate-700'
                  }`}
                />
                {formErrors.sku && <p className="text-xs text-rose-450 mt-1 font-semibold">{formErrors.sku}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-450 uppercase tracking-wider mb-2">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className={`w-full bg-slate-800 border rounded-xl px-4 py-2.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 ${
                      formErrors.price ? 'border-rose-500' : 'border-slate-700'
                    }`}
                  />
                  {formErrors.price && <p className="text-xs text-rose-450 mt-1 font-semibold">{formErrors.price}</p>}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-450 uppercase tracking-wider mb-2">Stock Level</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={formData.quantity_in_stock}
                    onChange={(e) => setFormData({ ...formData, quantity_in_stock: e.target.value })}
                    className={`w-full bg-slate-800 border rounded-xl px-4 py-2.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 ${
                      formErrors.quantity_in_stock ? 'border-rose-500' : 'border-slate-700'
                    }`}
                  />
                  {formErrors.quantity_in_stock && <p className="text-xs text-rose-450 mt-1 font-semibold">{formErrors.quantity_in_stock}</p>}
                </div>
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
                  {editingProduct ? 'Save Changes' : 'Create Product'}
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
              <h3 className="text-lg font-bold text-white mb-2">Delete Product</h3>
              <p className="text-sm text-slate-400 mb-6">
                Are you sure you want to delete this product? This action cannot be undone and may fail if referenced in order records.
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

export default Products;
