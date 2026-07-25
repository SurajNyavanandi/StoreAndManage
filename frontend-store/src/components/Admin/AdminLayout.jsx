import React, { useState, useContext } from 'react';
import AppContext from '../../services/AppContext';
import AdminHeader from './AdminHeader';
import AdminSidebar from './AdminSidebar';
import DashboardOverview from './DashboardOverview';
import ProductManagement from './ProductManagement';
import OrderManagement from './OrderManagement';
import CustomerManagement from './CustomerManagement';
import InventoryManagement from './InventoryManagement';
import CouponsManagement from './CouponsManagement';

const AdminLayout = () => {
  const { setViewMode } = useContext(AppContext);
  const [activeTab, setActiveTab] = useState('overview');
  const [collapsed, setCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <DashboardOverview setActiveTab={setActiveTab} />;
      case 'products':
        return <ProductManagement />;
      case 'orders':
        return <OrderManagement />;
      case 'customers':
        return <CustomerManagement />;
      case 'inventory':
        return <InventoryManagement />;
      case 'coupons':
        return <CouponsManagement />;
      default:
        return <DashboardOverview setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/80 flex font-sans text-slate-800 antialiased">
      {/* Redesigned Fixed & Collapsible Sidebar */}
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileSidebarOpen={mobileSidebarOpen}
        setMobileSidebarOpen={setMobileSidebarOpen}
        setViewMode={setViewMode}
      />

      {/* Main Right Content Section */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top Header Bar with Live Search & Breadcrumbs */}
        <AdminHeader
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          setMobileSidebarOpen={setMobileSidebarOpen}
        />

        {/* Dynamic Tab Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-[1600px] w-full mx-auto space-y-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
