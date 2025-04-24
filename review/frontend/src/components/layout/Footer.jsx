import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h2 className="text-2xl font-bold mb-4">
              <span className="text-brand-purple">SR</span> Electricals
            </h2>
            <p className="text-gray-400 mb-4">
              Your trusted partner for all electrical needs. Quality products, competitive prices, and exceptional service.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-brand-purple">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-brand-purple">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-brand-purple">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-brand-purple">Home</Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-brand-purple">About Us</Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-400 hover:text-brand-purple">Products</Link>
              </li>
              <li>
                <Link to="/cart" className="text-gray-400 hover:text-brand-purple">My Cart</Link>
              </li>
              <li>
                <Link to="/wishlist" className="text-gray-400 hover:text-brand-purple">Wishlist</Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/products?category=lighting" className="text-gray-400 hover:text-brand-purple">Lighting</Link>
              </li>
              <li>
                <Link to="/products?category=wiring" className="text-gray-400 hover:text-brand-purple">Wiring</Link>
              </li>
              <li>
                <Link to="/products?category=switches" className="text-gray-400 hover:text-brand-purple">Switches</Link>
              </li>
              <li>
                <Link to="/products?category=safety" className="text-gray-400 hover:text-brand-purple">Safety Equipment</Link>
              </li>
              <li>
                <Link to="/products?category=tools" className="text-gray-400 hover:text-brand-purple">Tools</Link>
              </li>
              <li>
                <Link to="/products?category=solar" className="text-gray-400 hover:text-brand-purple">Solar</Link>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <MapPin size={20} className="mr-2 text-brand-purple flex-shrink-0 mt-1" />
                <span className="text-gray-400">Sri Pavun Complex,High School road,Chinnalapatti,Dindigul-624301</span>
              </li>
              <li className="flex items-center">
                <Phone size={20} className="mr-2 text-brand-purple flex-shrink-0" />
                <a href="tel:+1234567890" className="text-gray-400 hover:text-brand-purple">+91 9150532902</a>
              </li>
              <li className="flex items-center">
                <Mail size={20} className="mr-2 text-brand-purple flex-shrink-0" />
                <a href="mailto:info@srelectricals.com" className="text-gray-400 hover:text-brand-purple">srisrelectrical@gmail.com</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} SR Electricals. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0">
              <ul className="flex space-x-6">
                <li>
                  <a href="#" className="text-gray-400 hover:text-brand-purple text-sm">Privacy Policy</a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-brand-purple text-sm">Terms of Service</a>
                </li>
                <li>
                  <a href="#" className="text-gray-400 hover:text-brand-purple text-sm">Shipping Info</a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
