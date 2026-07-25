import React from 'react';
import {
  FiGrid, FiPackage, FiShoppingBag, FiUsers, FiLayers, FiTag,
  FiChevronLeft, FiChevronRight, FiShield, FiSliders, FiLogOut, FiTrendingUp, FiSettings
} from 'react-icons/fi';

const AdminSidebar = ({
  activeTab,
  setActiveTab,
  collapsed,
  setCollapsed,
  mobileSidebarOpen,
  setMobileSidebarOpen,
  setViewMode
}) => {
  const menuGroups = [
    {
      title: 'Main Overview',
      items: [
        { id: 'overview', label: 'Executive Overview', icon: FiGrid }
      ]
    },
    {
      title: 'Catalog & Stock',
      items: [
        { id: 'products', label: 'Product Catalog', icon: FiPackage },
        { id: 'inventory', label: 'Inventory Restock', icon: FiLayers }
      ]
    },
    {
      title: 'Sales & Fulfillment',
      items: [
        { id: 'orders', label: 'Orders & Shipping', icon: FiShoppingBag },
        { id: 'coupons', label: 'Coupons & Vouchers', icon: FiTag }
      ]
    },
    {
      title: 'CRM & Insights',
      items: [
        { id: 'customers', label: 'Customer Directory', icon: FiUsers }
      ]
    }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileSidebarOpen && (
        <div
          onClick={() => setMobileSidebarOpen(false)}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 bg-slate-900 text-slate-300 flex flex-col justify-between border-r border-slate-800/80 transition-all duration-300 shadow-2xl ${
          collapsed ? 'lg:w-20' : 'lg:w-64'
        } ${mobileSidebarOpen ? 'w-64 translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* Top Branding Bar */}
        <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center font-black text-white text-xl shadow-lg shadow-blue-500/30 flex-shrink-0">
              <FiShield size={20} />
            </div>
            {(!collapsed || mobileSidebarOpen) && (
              <div className="min-w-0">
                <h1 className="font-extrabold text-sm text-white truncate leading-tight">StoreCentral</h1>
                <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest block truncate">
                  Enterprise v2.5
                </span>
              </div>
            )}
          </div>

          {/* Desktop Collapse Toggle */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex p-1.5 hover:bg-slate-800 rounded-xl text-slate-400 hover:text-white transition-colors"
            title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {collapsed ? <FiChevronRight size={18} /> : <FiChevronLeft size={18} />}
          </button>
        </div>

        {/* Navigation Group Items */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6 custom-scrollbar">
          {menuGroups.map((group, idx) => (
            <div key={idx} className="space-y-1.5">
              {(!collapsed || mobileSidebarOpen) && (
                <div className="px-3 pb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">
                    {group.title}
                  </span>
                </div>
              )}

              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setMobileSidebarOpen(false);
                    }}
                    title={collapsed ? item.label : ''}
                    className={`w-full flex items-center gap-3.5 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all relative group ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 font-extrabold'
                        : 'hover:bg-slate-800/80 text-slate-400 hover:text-slate-100'
                    }`}
                  >
                    {/* Active Indicator Bar */}
                    {isActive && (
                      <span className="absolute left-0 top-2 bottom-2 w-1 bg-white rounded-r-full shadow-sm" />
                    )}

                    <Icon size={18} className="flex-shrink-0" />

                    {(!collapsed || mobileSidebarOpen) && (
                      <span className="truncate">{item.label}</span>
                    )}

                    {/* Tooltip on Collapsed Mode */}
                    {collapsed && !mobileSidebarOpen && (
                      <div className="absolute left-full ml-3 px-3 py-1.5 bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                        {item.label}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Bottom User Profile Section */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/50 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white font-black text-xs flex items-center justify-center border border-indigo-400/30 flex-shrink-0">
              KV
            </div>

            {(!collapsed || mobileSidebarOpen) && (
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-slate-100 truncate">Kunal Verma</p>
                <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Super Admin
                </span>
              </div>
            )}
          </div>

          {(!collapsed || mobileSidebarOpen) && (
            <button
              onClick={() => setViewMode('store')}
              className="w-full flex items-center justify-center gap-2 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition-all border border-slate-700/60"
            >
              <FiLogOut size={14} /> Exit Admin
            </button>
          )}
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
