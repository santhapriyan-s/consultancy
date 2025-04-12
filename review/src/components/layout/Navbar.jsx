import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ShoppingCart, Heart, User, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useShop } from '../../context/ShopContext';

const Navbar = () => {
  const { user, isAdmin, logout } = useAuth();
  const { cart, wishlist } = useShop();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleProfileDropdown = () => {
    setShowProfileDropdown(!showProfileDropdown);
  };

  const closeDropdown = () => {
    setShowProfileDropdown(false);
  };

  const handleLogout = () => {
    logout();
    closeDropdown();
  };

  const profileOptions = [
    { name: 'My Orders', path: '/profile/orders' },
    { name: 'Profile Information', path: '/profile/information' },
    { name: 'Manage Addresses', path: '/profile/addresses' },
    { name: 'Gift Cards', path: '/profile/gift-cards' },
    { name: 'Saved UPI', path: '/profile/upi' },
    { name: 'Saved Cards', path: '/profile/cards' },
    { name: 'My Reviews & Ratings', path: '/profile/reviews' },
    { name: 'My Coupons', path: '/profile/coupons' },
    { name: 'My Wishlist', path: '/wishlist' },
  ];

  return (
    <nav className="bg-white shadow-md py-4 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold text-brand-purple">SR</span>
            <span className="ml-1 text-xl font-semibold">Electricals</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-brand-purple font-medium">
              Home
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-brand-purple font-medium">
              About
            </Link>
            <Link to="/products" className="text-gray-700 hover:text-brand-purple font-medium">
              Products
            </Link>
            {isAdmin && (
              <Link to="/admin" className="text-gray-700 hover:text-brand-purple font-medium">
                Admin
              </Link>
            )}
          </div>

          {/* Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/wishlist" className="relative p-2 text-gray-700 hover:text-brand-purple">
              <Heart size={24} />
              {wishlist.length > 0 && (
                <span className="absolute top-0 right-0 bg-brand-purple text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {wishlist.length}
                </span>
              )}
            </Link>
            <Link to="/cart" className="relative p-2 text-gray-700 hover:text-brand-purple">
              <ShoppingCart size={24} />
              {cart.length > 0 && (
                <span className="absolute top-0 right-0 bg-brand-purple text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                  {cart.length}
                </span>
              )}
            </Link>

            {user ? (
              <div className="relative">
                <button
                  className="flex items-center space-x-1 p-2 text-gray-700 hover:text-brand-purple"
                  onClick={toggleProfileDropdown}
                >
                  <User size={24} />
                  <ChevronDown size={16} />
                </button>

                {showProfileDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md overflow-hidden z-50">
                    <div className="p-2 bg-brand-purple text-white font-medium">
                      Hi, {user.name}
                    </div>
                    <div className="py-1">
                      {profileOptions.map((option) => (
                        <Link
                          key={option.path}
                          to={option.path}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-brand-soft-gray hover:text-brand-purple"
                          onClick={closeDropdown}
                        >
                          {option.name}
                        </Link>
                      ))}
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="px-4 py-2 bg-brand-purple text-white rounded-md hover:bg-brand-deep-purple transition-colors"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={toggleMenu}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 bg-white rounded-lg shadow-lg p-4">
            <div className="flex flex-col space-y-4">
              <Link to="/" className="text-gray-700 hover:text-brand-purple font-medium" onClick={toggleMenu}>
                Home
              </Link>
              <Link to="/about" className="text-gray-700 hover:text-brand-purple font-medium" onClick={toggleMenu}>
                About
              </Link>
              <Link to="/products" className="text-gray-700 hover:text-brand-purple font-medium" onClick={toggleMenu}>
                Products
              </Link>
              {isAdmin && (
                <Link to="/admin" className="text-gray-700 hover:text-brand-purple font-medium" onClick={toggleMenu}>
                  Admin
                </Link>
              )}
              <Link to="/wishlist" className="text-gray-700 hover:text-brand-purple font-medium" onClick={toggleMenu}>
                Wishlist ({wishlist.length})
              </Link>
              <Link to="/cart" className="text-gray-700 hover:text-brand-purple font-medium" onClick={toggleMenu}>
                Cart ({cart.length})
              </Link>
              
              {user ? (
                <>
                  <div className="border-t border-gray-200 pt-2">
                    <p className="text-sm text-gray-500">Logged in as: {user.name}</p>
                    <div className="mt-2 space-y-2">
                      {profileOptions.map((option) => (
                        <Link
                          key={option.path}
                          to={option.path}
                          className="block text-sm text-gray-700 hover:text-brand-purple"
                          onClick={toggleMenu}
                        >
                          {option.name}
                        </Link>
                      ))}
                    </div>
                    <button
                      onClick={() => {
                        handleLogout();
                        toggleMenu();
                      }}
                      className="mt-2 px-4 py-2 bg-red-100 text-red-600 rounded-md text-sm w-full"
                    >
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <Link
                  to="/login"
                  className="px-4 py-2 bg-brand-purple text-white rounded-md text-center"
                  onClick={toggleMenu}
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
