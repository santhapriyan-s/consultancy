import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "./components/ui/toaster";
import { Toaster as Sonner } from "./components/ui/sonner";
import { AuthProvider } from "./context/AuthContext";
import { ShopProvider } from "./context/ShopContext";

// Layout
import Layout from "./components/layout/Layout";

// Main Pages
import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartPage from "./pages/CartPage";
import WishlistPage from "./pages/WishlistPage";
import CheckoutPage from "./pages/CheckoutPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import NotFound from "./pages/NotFound";

// Profile Pages
import ProfilePage from "./pages/profile/ProfilePage";
import OrdersPage from "./pages/profile/OrdersPage";
import ProfileInformation from "./pages/profile/ProfileInformation";
import ManageAddresses from "./pages/profile/ManageAddresses";
import GiftCards from "./pages/profile/GiftCards";
import SavedUPI from "./pages/profile/SavedUPI";
import MyCoupons from "./pages/profile/MyCoupons";
// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminHome from "./pages/admin/AdminHome";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminOrders from "./pages/admin/AdminOrders";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
  <BrowserRouter>
    <AuthProvider>
      <ShopProvider>
       
          <Routes>
            {/* Main Routes with Layout */}
            <Route path="/" element={<Layout><HomePage /></Layout>} />
            <Route path="/about" element={<Layout><AboutPage /></Layout>} />
            <Route path="/products" element={<Layout><ProductsPage /></Layout>} />
            <Route path="/products/:productId" element={<Layout><ProductDetailPage /></Layout>} />
            <Route path="/cart" element={<Layout><CartPage /></Layout>} />
            <Route path="/wishlist" element={<Layout><WishlistPage /></Layout>} />
            <Route path="/checkout" element={<Layout><CheckoutPage /></Layout>} />
            <Route path="/login" element={<Layout><LoginPage /></Layout>} />
            <Route path="/register" element={<Layout><RegisterPage /></Layout>} />

            {/* Profile Routes */}
            <Route path="/profile" element={<Layout><ProfilePage /></Layout>}>
              <Route index element={<OrdersPage />} />
              <Route path="orders" element={<OrdersPage />} />
              <Route path="addresses" element={<ManageAddresses />} />
              <Route path="gift-cards" element={<GiftCards />} />
              <Route path="information" element={<ProfileInformation />} />
              <Route path="upi" element={<SavedUPI />} />
              <Route path="coupons" element={<MyCoupons />} />
              
              <Route path="cards" element={<div className="bg-white p-8 rounded-lg shadow-sm"><h2 className="text-2xl font-semibold mb-4">Saved Cards</h2><p>This section is under development.</p></div>} />
              <Route path="reviews" element={<div className="bg-white p-8 rounded-lg shadow-sm"><h2 className="text-2xl font-semibold mb-4">My Reviews & Ratings</h2><p>This section is under development.</p></div>} />
              
            </Route>

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminDashboard />}>
              <Route index element={<AdminHome />} />
              <Route path="dashboard" element={<AdminHome />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="customers" element={<div className="p-8"><h2 className="text-2xl font-semibold mb-4">Customers</h2><p>This section is under development.</p></div>} />
              <Route path="settings" element={<div className="p-8"><h2 className="text-2xl font-semibold mb-4">Settings</h2><p>This section is under development.</p></div>} />
            </Route>

            {/* 404 Route */}
            <Route path="*" element={<Layout><NotFound /></Layout>} />
          </Routes>
        
        <Toaster />
        <Sonner />
      </ShopProvider>
    </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
