import React, { useState, useContext } from 'react';
import axios from 'axios';
import AppContext from '../../services/AppContext';
import { FiPackage, FiAlertTriangle, FiPlus, FiMinus, FiRefreshCw, FiSearch } from 'react-icons/fi';

const InventoryManagement = () => {
  const { state, fetchProducts, addToast } = useContext(AppContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStock, setFilterStock] = useState('all'); // 'all', 'low', 'out'

  const handleStockAdjust = async (product, delta) => {
    const newStock = Math.max(0, (product.stock || 0) + delta);
    try {
      const res = await axios.put(`/api/products/${product._id}`, {
        stock: newStock
      });

      if (res.data.success) {
        addToast('success', 'Stock Updated', `${product.name} stock set to ${newStock}`);
        fetchProducts();
      }
    } catch (e) {
      addToast('error', 'Update Failed', e.message);
    }
  };

  const filtered = state.products.filter(p => {
    const matchesSearch = p.name?.toLowerCase().includes(searchTerm.toLowerCase()) || p.sku?.toLowerCase().includes(searchTerm.toLowerCase());
    if (filterStock === 'low') return matchesSearch && p.stock <= 5 && p.stock > 0;
    if (filterStock === 'out') return matchesSearch && p.stock === 0;
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Inventory & Restock Controls</h2>
          <p className="text-xs text-slate-500 mt-1">Adjust product stock quantities in real time to prevent overselling.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterStock('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold ${filterStock === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-700'}`}
          >
            All Stock
          </button>
          <button
            onClick={() => setFilterStock('low')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold ${filterStock === 'low' ? 'bg-amber-600 text-white' : 'bg-amber-50 text-amber-800 border border-amber-200'}`}
          >
            Low Stock (&lt;=5)
          </button>
          <button
            onClick={() => setFilterStock('out')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold ${filterStock === 'out' ? 'bg-rose-600 text-white' : 'bg-rose-50 text-rose-800 border border-rose-200'}`}
          >
            Out of Stock (0)
          </button>
        </div>
      </div>

      {/* Stock Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 relative max-w-md">
          <FiSearch className="absolute left-7 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search item or SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b text-xs font-bold uppercase text-slate-500">
                <th className="p-4">Item & SKU</th>
                <th className="p-4">Category</th>
                <th className="p-4">Current Stock</th>
                <th className="p-4">Stock Status</th>
                <th className="p-4 text-right">Adjust Quantity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filtered.map((prod) => (
                <tr key={prod._id} className="hover:bg-slate-50">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <img src={prod.image} alt={prod.name} className="w-10 h-10 object-cover rounded-xl border" />
                      <div>
                        <p className="font-semibold text-slate-900">{prod.name}</p>
                        <p className="text-xs text-slate-500 font-mono">SKU: {prod.sku || 'N/A'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 capitalize text-xs font-semibold text-slate-700">{prod.category}</td>
                  <td className="p-4 font-bold text-slate-900">{prod.stock} units</td>
                  <td className="p-4">
                    {prod.stock === 0 ? (
                      <span className="px-2.5 py-1 bg-rose-100 text-rose-700 text-xs font-bold rounded-full">Out of Stock</span>
                    ) : prod.stock <= 5 ? (
                      <span className="px-2.5 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full">Low Stock</span>
                    ) : (
                      <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full">In Stock</span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleStockAdjust(prod, -5)}
                        className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold"
                        title="Subtract 5"
                      >
                        -5
                      </button>
                      <button
                        onClick={() => handleStockAdjust(prod, -1)}
                        className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg"
                      >
                        <FiMinus size={14} />
                      </button>
                      <span className="w-10 text-center font-bold text-slate-900">{prod.stock}</span>
                      <button
                        onClick={() => handleStockAdjust(prod, 1)}
                        className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg"
                      >
                        <FiPlus size={14} />
                      </button>
                      <button
                        onClick={() => handleStockAdjust(prod, 10)}
                        className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-bold"
                        title="Add 10"
                      >
                        +10
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InventoryManagement;
