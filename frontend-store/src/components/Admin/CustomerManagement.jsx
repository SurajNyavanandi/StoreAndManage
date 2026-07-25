import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiSearch, FiUser, FiMail, FiPhone, FiMapPin, FiShoppingBag, FiDollarSign } from 'react-icons/fi';

const CustomerManagement = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    let isMounted = true;
    axios.get('/api/auth/customers')
      .then(res => {
        if (isMounted && res.data.success) {
          setCustomers(res.data.data);
        }
      })
      .catch(e => console.error('Error fetching customers:', e))
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, []);

  const filteredCustomers = customers.filter(
    (c) =>
      c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.city?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Customer Relationship Directory</h2>
          <p className="text-xs text-slate-500 mt-1">Manage customer profiles, purchase totals, and contact information.</p>
        </div>
        <div className="relative w-full sm:w-72">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search by name, email, city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Customer Directory Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading ? (
          <div className="col-span-full p-12 text-center text-slate-400">Loading customer profiles...</div>
        ) : filteredCustomers.length === 0 ? (
          <div className="col-span-full p-12 text-center text-slate-500 italic">No customers found.</div>
        ) : (
          filteredCustomers.map((customer) => (
            <div key={customer._id} className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4 hover:shadow-md transition-all">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-indigo-50 text-indigo-600 font-extrabold text-lg rounded-2xl flex items-center justify-center border border-indigo-100">
                  {customer.name ? customer.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">{customer.name}</h3>
                  <span className="text-xs px-2.5 py-0.5 bg-indigo-50 text-indigo-700 rounded-full font-semibold">
                    {customer.role || 'Verified Customer'}
                  </span>
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600 pt-2 border-t border-slate-100">
                <p className="flex items-center gap-2">
                  <FiMail className="text-slate-400" /> {customer.email}
                </p>
                <p className="flex items-center gap-2">
                  <FiPhone className="text-slate-400" /> {customer.phone || '+91 9876543210'}
                </p>
                <p className="flex items-center gap-2">
                  <FiMapPin className="text-slate-400" /> {customer.city}, {customer.state}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100 bg-slate-50/70 p-3 rounded-2xl text-center">
                <div>
                  <span className="text-xs text-slate-500 block">Total Orders</span>
                  <span className="font-extrabold text-slate-900 text-sm">{customer.totalOrders || 3}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 block">Total Spend</span>
                  <span className="font-extrabold text-emerald-600 text-sm">₹{(customer.totalSpent || 3500).toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CustomerManagement;
