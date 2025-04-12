import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link, Outlet, useLocation } from 'react-router-dom';
import {
  User,
  ShoppingBag,
  MapPin,
  Gift,
  CreditCard,
  Star,
  Tag,
  Heart,
  LogOut,
} from 'lucide-react';

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  
  const profileLinks = [
    { name: 'My Orders', path: '/profile/orders', icon: ShoppingBag },
    { name: 'Profile Information', path: '/profile/information', icon: User },
    { name: 'Manage Addresses', path: '/profile/addresses', icon: MapPin },
    { name: 'Gift Cards', path: '/profile/gift-cards', icon: Gift },
    { name: 'Saved UPI', path: '/profile/upi', icon: CreditCard },
    { name: 'Saved Cards', path: '/profile/cards', icon: CreditCard },
    { name: 'My Reviews & Ratings', path: '/profile/reviews', icon: Star },
    { name: 'My Coupons', path: '/profile/coupons', icon: Tag },
    { name: 'My Wishlist', path: '/wishlist', icon: Heart },
  ];
  
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold mb-4">Please Login</h1>
          <p className="text-gray-600 mb-6">
            You need to be logged in to view your profile.
          </p>
          <Link
            to="/login"
            className="px-6 py-3 bg-brand-purple text-white rounded-md hover:bg-brand-deep-purple transition-colors"
          >
            Login
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-1/4 xl:w-1/5">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 rounded-full bg-brand-soft-gray flex items-center justify-center text-brand-purple">
                  <User size={24} />
                </div>
                <div>
                  <p className="font-semibold">{user.name}</p>
                  <p className="text-gray-500 text-sm">{user.email}</p>
                </div>
              </div>
              
              <nav>
                <ul className="space-y-1">
                  {profileLinks.map((link) => {
                    const isActive = location.pathname === link.path;
                    const IconComponent = link.icon;
                    
                    return (
                      <li key={link.path}>
                        <Link
                          to={link.path}
                          className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                            isActive
                              ? 'bg-brand-purple text-white'
                              : 'hover:bg-gray-100'
                          }`}
                        >
                          <IconComponent size={18} className="mr-2" />
                          {link.name}
                        </Link>
                      </li>
                    );
                  })}
                  
                  <li>
                    <button
                      onClick={logout}
                      className="flex items-center px-4 py-2 rounded-md text-red-500 hover:bg-red-50 transition-colors w-full text-left"
                    >
                      <LogOut size={18} className="mr-2" />
                      Logout
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
          
          {/* Content */}
          <div className="lg:w-3/4 xl:w-4/5">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
