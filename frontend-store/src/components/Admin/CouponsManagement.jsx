import React, { useState, useContext } from 'react';
import AppContext from '../../services/AppContext';
import { FiDollarSign, FiPlus, FiTag, FiCheckCircle } from 'react-icons/fi';

const CouponsManagement = () => {
  const { addToast } = useContext(AppContext);
  const [coupons, setCoupons] = useState([
    { code: 'WELCOME10', discountType: 'percentage', value: 10, minOrder: 400, description: '10% off on your order' },
    { code: 'SUMMER20', discountType: 'percentage', value: 20, minOrder: 999, description: '20% off on orders above ₹999' },
    { code: 'VIRATTOM50', discountType: 'fixed', value: 150, minOrder: 500, description: 'Flat ₹150 off on orders above ₹500' },
    { code: 'FREESHIP', discountType: 'fixed', value: 100, minOrder: 300, description: 'Free shipping discount (₹100 value)' }
  ]);

  const [newCoupon, setNewCoupon] = useState({
    code: '',
    discountType: 'percentage',
    value: '',
    minOrder: '',
    description: ''
  });

  const handleCreateCoupon = (e) => {
    e.preventDefault();
    if (!newCoupon.code || !newCoupon.value) return;

    const created = {
      code: newCoupon.code.toUpperCase(),
      discountType: newCoupon.discountType,
      value: Number(newCoupon.value),
      minOrder: Number(newCoupon.minOrder) || 0,
      description: newCoupon.description || 'Promotional Discount'
    };

    setCoupons([created, ...coupons]);
    addToast('success', 'Coupon Created', `Discount code ${created.code} is now active!`);
    setNewCoupon({ code: '', discountType: 'percentage', value: '', minOrder: '', description: '' });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Promotions & Coupons Center</h2>
          <p className="text-xs text-slate-500 mt-1">Configure active discount codes and promotional vouchers for checkout.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Create Coupon Form */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <FiPlus className="text-emerald-600" /> Create New Promo Code
          </h3>

          <form onSubmit={handleCreateCoupon} className="space-y-3">
            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Coupon Code *</label>
              <input
                type="text"
                required
                placeholder="e.g. FESTIVE30"
                value={newCoupon.code}
                onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                className="w-full px-3.5 py-2 bg-slate-50 border rounded-xl text-sm font-mono uppercase focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Discount Type</label>
                <select
                  value={newCoupon.discountType}
                  onChange={(e) => setNewCoupon({ ...newCoupon, discountType: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border rounded-xl text-xs focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Flat (₹)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Value *</label>
                <input
                  type="number"
                  required
                  placeholder="15 or 100"
                  value={newCoupon.value}
                  onChange={(e) => setNewCoupon({ ...newCoupon, value: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border rounded-xl text-sm focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Min. Cart Threshold (₹)</label>
              <input
                type="number"
                placeholder="500"
                value={newCoupon.minOrder}
                onChange={(e) => setNewCoupon({ ...newCoupon, minOrder: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 border rounded-xl text-sm focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase text-slate-600 mb-1">Description</label>
              <input
                type="text"
                placeholder="30% off on all summer styles"
                value={newCoupon.description}
                onChange={(e) => setNewCoupon({ ...newCoupon, description: e.target.value })}
                className="w-full px-3.5 py-2 bg-slate-50 border rounded-xl text-sm focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md shadow-emerald-600/20 transition-all mt-2"
            >
              Activate Coupon
            </button>
          </form>
        </div>

        {/* Active Coupons List */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <FiTag className="text-blue-600" /> Active Promotional Coupons ({coupons.length})
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {coupons.map((c) => (
              <div key={c.code} className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm space-y-3 relative overflow-hidden">
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono font-extrabold text-sm rounded-xl">
                    {c.code}
                  </span>
                  <span className="text-xs font-bold text-slate-500 uppercase">
                    {c.discountType === 'percentage' ? `${c.value}% OFF` : `₹${c.value} FLAT`}
                  </span>
                </div>

                <p className="text-xs text-slate-600 font-medium">{c.description}</p>

                <div className="pt-2 border-t border-slate-100 text-xs text-slate-500 flex justify-between items-center">
                  <span>Min order: ₹{c.minOrder}</span>
                  <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                    <FiCheckCircle size={12} /> Active
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CouponsManagement;
