import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingCart,
  Settings,
  LogOut,
  ChevronDown,
  Menu,
  X,
} from 'lucide-react';

const AdminDashboard = () => {
  const { isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Redirect if not admin
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <h1 className="text-2xl font-bold mb-4">Admin Access Required</h1>
        <p className="text-gray-600 mb-6 text-center">
          You need administrator privileges to access this page.
        </p>
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 bg-brand-purple text-white rounded-md hover:bg-brand-deep-purple transition-colors"
        >
          Go to Home Page
        </button>
      </div>
    );
  }
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  const sidebarItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Products', path: '/admin/products', icon: Package },
    { name: 'Customers', path: '/admin/customers', icon: Users },
    { name: 'Orders', path: '/admin/orders', icon: ShoppingCart },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];
  
  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Mobile Header */}
      <div className="md:hidden bg-white shadow-sm p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-md hover:bg-gray-100"
            >
              {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <span className="ml-2 font-semibold">SR Admin</span>
          </div>
          <button
            onClick={handleLogout}
            className="text-red-500 p-2 rounded-md hover:bg-red-50"
          >
            <LogOut size={20} />
          </button>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row">
        {/* Sidebar */}
        <aside
          className={`${
            isSidebarOpen ? 'block' : 'hidden'
          } md:block bg-white shadow-sm w-full md:w-64 min-h-screen fixed md:sticky top-0 z-10`}
        >
          <div className="p-4 h-full flex flex-col">
            {/* Logo */}
            <div className="hidden md:flex items-center mb-8">
              <span className="text-2xl font-bold text-brand-purple">SR</span>
              <span className="ml-1 text-xl font-semibold">Admin</span>
            </div>
            
            {/* Nav Items */}
            <nav className="flex-1">
              <ul className="space-y-2">
                {sidebarItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  const Icon = item.icon;
                  
                  return (
                    <li key={item.path}>
                      <Link
                        to={item.path}
                        className={`flex items-center px-4 py-3 rounded-md transition-colors ${
                          isActive
                            ? 'bg-brand-purple text-white'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                        onClick={() => setIsSidebarOpen(false)}
                      >
                        <Icon size={20} className="mr-3" />
                        {item.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
            
            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center px-4 py-3 text-red-500 hover:bg-red-50 rounded-md transition-colors mt-4"
            >
              <LogOut size={20} className="mr-3" />
              Logout
            </button>
          </div>
        </aside>
        
        {/* Main Content */}
        <main className="flex-1 p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
