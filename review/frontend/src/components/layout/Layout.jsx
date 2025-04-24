import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { Toaster } from '../../components/ui/toaster';
import { Toaster as Sonner } from '../../components/ui/sonner';

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <Toaster />
      <Sonner />
    </div>
  );
};

export default Layout;
