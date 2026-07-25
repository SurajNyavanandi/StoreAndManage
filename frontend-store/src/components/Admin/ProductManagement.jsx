import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AppContext from '../../services/AppContext';
import {
  FiSearch, FiFilter, FiPlus, FiCopy, FiTrash2, FiEdit2, FiCheckSquare,
  FiSquare, FiRefreshCw, FiImage, FiX, FiCheck, FiMoreVertical, FiAlertCircle
} from 'react-icons/fi';

const initialProductForm = {
  name: '',
  category: 'mens',
  subcategory: 'Topwear',
  brand: 'UrbanStyle',
  price: '',
  originalPrice: '',
  stock: 20,
  sku: '',
  description: '',
  image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80',
  status: 'active'
};

const ProductManagement = () => {
  const { state, fetchProducts, addToast } = useContext(AppContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStockStatus, setSelectedStockStatus] = useState('all');
  const [selectedIds, setSelectedIds] = useState([]);

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form, setForm] = useState(initialProductForm);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Filter products locally
  const filteredProducts = state.products.filter(p => {
    const matchesSearch =
      p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;

    let matchesStock = true;
    if (selectedStockStatus === 'in_stock') matchesStock = p.stock > 5;
    if (selectedStockStatus === 'low_stock') matchesStock = p.stock > 0 && p.stock <= 5;
    if (selectedStockStatus === 'out_of_stock') matchesStock = p.stock === 0;

    return matchesSearch && matchesCategory && matchesStock;
  });

  const handleSelectAll = () => {
    if (selectedIds.length === filteredProducts.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredProducts.map(p => p._id));
    }
  };

  const handleToggleSelect = (id) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // Duplicate product
  const handleDuplicate = async (id) => {
    try {
      const res = await axios.post(`/api/products/${id}/duplicate`);
      if (res.data.success) {
        addToast('success', 'Product Duplicated', 'Duplicated product saved as draft');
        fetchProducts();
      }
    } catch (e) {
      addToast('error', 'Action Failed', e.response?.data?.message || e.message);
    }
  };

  // Delete product
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      const res = await axios.delete(`/api/products/${id}`);
      if (res.data.success) {
        addToast('success', 'Product Deleted', 'Product removed successfully');
        fetchProducts();
      }
    } catch (e) {
      addToast('error', 'Delete Failed', e.response?.data?.message || e.message);
    }
  };

  // Bulk actions
  const handleBulkAction = async (action, value) => {
    if (selectedIds.length === 0) return;
    if (action === 'delete' && !window.confirm(`Delete ${selectedIds.length} selected products?`)) return;

    try {
      const res = await axios.post('/api/products/bulk', {
        action,
        value,
        productIds: selectedIds
      });

      if (res.data.success) {
        addToast('success', 'Bulk Action Completed', res.data.message);
        setSelectedIds([]);
        fetchProducts();
      }
    } catch (e) {
      addToast('error', 'Bulk Action Failed', e.message);
    }
  };

  // Submit Add / Edit Form
  const handleSubmitForm = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = {
        ...form,
        price: Number(form.price),
        originalPrice: form.originalPrice ? Number(form.originalPrice) : Number(form.price) * 1.2,
        stock: Number(form.stock)
      };

      if (editingProduct) {
        const res = await axios.put(`/api/products/${editingProduct._id}`, payload);
        if (res.data.success) {
          addToast('success', 'Product Updated', 'Product changes saved successfully');
        }
      } else {
        const res = await axios.post('/api/products', payload);
        if (res.data.success) {
          addToast('success', 'Product Created', 'New product added to catalog');
        }
      }

      setIsAddModalOpen(false);
      setEditingProduct(null);
      setForm(initialProductForm);
      fetchProducts();
    } catch (err) {
      addToast('error', 'Error Saving Product', err.response?.data?.message || err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setForm({
      name: product.name || '',
      category: product.category || 'mens',
      subcategory: product.subcategory || 'Topwear',
      brand: product.brand || 'UrbanStyle',
      price: product.price || '',
      originalPrice: product.originalPrice || '',
      stock: product.stock !== undefined ? product.stock : 20,
      sku: product.sku || '',
      description: product.description || '',
      image: product.image || '',
      status: product.status || 'active'
    });
    setIsAddModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Product Catalog Management</h2>
          <p className="text-xs text-slate-500 mt-1">
            Total {state.products.length} products in database • {filteredProducts.length} showing
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchProducts()}
            className="p-2.5 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
            title="Refresh product list"
          >
            <FiRefreshCw size={18} />
          </button>
          <button
            onClick={() => {
              setEditingProduct(null);
              setForm(initialProductForm);
              setIsAddModalOpen(true);
            }}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-lg shadow-blue-600/20 transition-all"
          >
            <FiPlus size={18} /> Add New Product
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row gap-3 justify-between items-center">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search by name, SKU, brand..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Categories</option>
            <option value="mens">Men's Wear</option>
            <option value="womens">Women's Wear</option>
            <option value="kids">Kids Wear</option>
          </select>

          <select
            value={selectedStockStatus}
            onChange={(e) => setSelectedStockStatus(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Stock Status</option>
            <option value="in_stock">In Stock (&gt;5)</option>
            <option value="low_stock">Low Stock (&lt;=5)</option>
            <option value="out_of_stock">Out of Stock (0)</option>
          </select>

          {/* Bulk Action Controls */}
          {selectedIds.length > 0 && (
            <div className="flex items-center gap-2 bg-indigo-50 border border-indigo-200 px-3 py-1.5 rounded-xl animate-fade-in">
              <span className="text-xs font-bold text-indigo-900">{selectedIds.length} Selected</span>
              <button
                onClick={() => handleBulkAction('status', 'active')}
                className="px-2 py-1 bg-white hover:bg-indigo-100 text-indigo-700 text-xs font-medium rounded-lg border border-indigo-200"
              >
                Set Active
              </button>
              <button
                onClick={() => handleBulkAction('status', 'draft')}
                className="px-2 py-1 bg-white hover:bg-indigo-100 text-indigo-700 text-xs font-medium rounded-lg border border-indigo-200"
              >
                Set Draft
              </button>
              <button
                onClick={() => handleBulkAction('delete')}
                className="p-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg"
                title="Bulk Delete"
              >
                <FiTrash2 size={14} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Product Data Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 text-xs font-bold uppercase tracking-wider">
                <th className="p-4 w-10 text-center">
                  <button onClick={handleSelectAll} className="text-slate-500 hover:text-slate-900">
                    {selectedIds.length > 0 && selectedIds.length === filteredProducts.length ? (
                      <FiCheckSquare size={18} className="text-blue-600" />
                    ) : (
                      <FiSquare size={18} />
                    )}
                  </button>
                </th>
                <th className="p-4">Product Details</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price</th>
                <th className="p-4">Stock</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-12 text-center text-slate-500 italic">
                    No products found matching your current filter criteria.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => {
                  const isSelected = selectedIds.includes(product._id);
                  return (
                    <tr
                      key={product._id}
                      className={`hover:bg-slate-50/80 transition-colors ${isSelected ? 'bg-blue-50/40' : ''}`}
                    >
                      <td className="p-4 text-center">
                        <button onClick={() => handleToggleSelect(product._id)} className="text-slate-400 hover:text-slate-900">
                          {isSelected ? (
                            <FiCheckSquare size={18} className="text-blue-600" />
                          ) : (
                            <FiSquare size={18} />
                          )}
                        </button>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-12 h-12 object-cover rounded-xl border border-slate-200 bg-slate-100"
                          />
                          <div>
                            <p className="font-semibold text-slate-900 line-clamp-1">{product.name}</p>
                            <p className="text-xs text-slate-500">
                              Brand: <span className="font-medium">{product.brand || 'N/A'}</span> • SKU:{' '}
                              <span className="font-mono">{product.sku || 'N/A'}</span>
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="capitalize px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg">
                          {product.category}
                        </span>
                      </td>
                      <td className="p-4 font-bold text-slate-900">
                        ₹{Number(product.price).toLocaleString('en-IN')}
                        {product.originalPrice > product.price && (
                          <span className="text-xs text-slate-400 line-through block font-normal">
                            ₹{Number(product.originalPrice).toLocaleString('en-IN')}
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        {product.stock === 0 ? (
                          <span className="px-2.5 py-1 bg-rose-100 text-rose-700 text-xs font-bold rounded-full">
                            Out of Stock
                          </span>
                        ) : product.stock <= 5 ? (
                          <span className="px-2.5 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full">
                            Low Stock ({product.stock})
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full">
                            {product.stock} units
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                            product.status === 'draft'
                              ? 'bg-slate-100 text-slate-600 border border-slate-200'
                              : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          }`}
                        >
                          {product.status || 'active'}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => openEditModal(product)}
                            className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit Product"
                          >
                            <FiEdit2 size={16} />
                          </button>
                          <button
                            onClick={() => handleDuplicate(product._id)}
                            className="p-2 text-slate-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                            title="Duplicate Product"
                          >
                            <FiCopy size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(product._id)}
                            className="p-2 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Delete Product"
                          >
                            <FiTrash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Add or Edit Product */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-slate-200 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h3 className="text-xl font-bold text-slate-900">
                {editingProduct ? 'Edit Product Details' : 'Add New Product to Store'}
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-900 rounded-xl transition-colors"
              >
                <FiX size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="p-6 space-y-4 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Product Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mens Casual Premium Cotton Shirt"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Category *</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="mens">Men's Wear</option>
                    <option value="womens">Women's Wear</option>
                    <option value="kids">Kids Wear</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Subcategory</label>
                  <input
                    type="text"
                    placeholder="e.g. Topwear / Shirts"
                    value={form.subcategory}
                    onChange={(e) => setForm({ ...form, subcategory: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Selling Price (₹) *</label>
                  <input
                    type="number"
                    required
                    placeholder="899"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Original Price (₹)</label>
                  <input
                    type="number"
                    placeholder="1299"
                    value={form.originalPrice}
                    onChange={(e) => setForm({ ...form, originalPrice: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Brand</label>
                  <input
                    type="text"
                    placeholder="UrbanStyle"
                    value={form.brand}
                    onChange={(e) => setForm({ ...form, brand: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">SKU Code</label>
                  <input
                    type="text"
                    placeholder="SKU-MEN-001"
                    value={form.sku}
                    onChange={(e) => setForm({ ...form, sku: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="active">Active (Published)</option>
                    <option value="draft">Draft (Hidden)</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Image URL</label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={form.image}
                    onChange={(e) => setForm({ ...form, image: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
                  />
                  {form.image && (
                    <div className="mt-2 flex items-center gap-3 p-2 bg-slate-50 rounded-xl border">
                      <img src={form.image} alt="Preview" className="w-12 h-12 object-cover rounded-lg border" />
                      <span className="text-xs text-slate-500">Live image preview</span>
                    </div>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Description</label>
                  <textarea
                    rows={3}
                    placeholder="Detailed product features, materials, and sizing guide..."
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
                  ></textarea>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-5 py-2.5 text-slate-600 hover:text-slate-900 text-sm font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-600/20 transition-all disabled:opacity-50"
                >
                  {submitting ? 'Saving...' : editingProduct ? 'Save Product Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductManagement;
