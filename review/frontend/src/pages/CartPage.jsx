import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { useAuth } from '../context/AuthContext';
import { X, Minus, Plus, ArrowRight, ShoppingCart } from 'lucide-react';
import { toast } from '../components/ui/use-toast';

const CartPage = () => {
  const { cart, removeFromCart, updateCartQuantity, getCartTotal } = useShop();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const handleRemoveFromCart = (productId) => {
    removeFromCart(productId);
    toast({
      title: "Item removed",
      description: "The item has been removed from your cart",
    });
  };
  
  const handleQuantityChange = (productId, quantity) => {
    if (quantity < 1) return;
    updateCartQuantity(productId, quantity);
  };
  
  const handleCheckout = () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to proceed to checkout.",
        variant: "destructive",
      });
      return;
    }
    
    if (cart.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Your cart is empty",
        variant: "destructive",
      });
      return;
    }
    
    navigate('/checkout');
  };

  // Generate truly unique keys for each cart item
  const getItemKey = (item, index) => {
    // Combine product ID, quantity, and array index to ensure uniqueness
    return `cart-item-${item.id}-${item.quantity}-${index}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
        
        {cart.length > 0 ? (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Items */}
            <div className="lg:w-2/3">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="divide-y divide-gray-200">
                  {cart.map((item, index) => (
                    <div key={getItemKey(item, index)} className="p-6 flex flex-col sm:flex-row items-center">
                      <div className="sm:w-24 sm:h-24 mb-4 sm:mb-0">
                        <img
                          src={item.image || "https://via.placeholder.com/100x100?text=Product+Image"}
                          alt={item.name}
                          className="w-full h-full object-cover rounded-md"
                          loading="lazy"
                        />
                      </div>
                      
                      <div className="flex-1 sm:ml-6">
                        <div className="flex flex-col sm:flex-row justify-between mb-4">
                          <div>
                            <Link 
                              to={`/products/${item.id}`} 
                              className="text-lg font-semibold hover:text-brand-purple line-clamp-1"
                            >
                              {item.name}
                            </Link>
                            <p className="text-gray-500 text-sm capitalize">{item.category}</p>
                          </div>
                          
                          <div className="text-lg font-semibold mt-2 sm:mt-0">
                            ₹{(item.price * item.quantity).toFixed(2)}
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <button
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                              className="p-1 border border-gray-300 rounded-l-md hover:bg-gray-100 disabled:opacity-50"
                              disabled={item.quantity <= 1}
                              aria-label="Decrease quantity"
                            >
                              <Minus size={16} />
                            </button>
                            <input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 1)}
                              min="1"
                              className="w-12 text-center border-y border-gray-300 py-1"
                              aria-label="Quantity"
                            />
                            <button
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                              className="p-1 border border-gray-300 rounded-r-md hover:bg-gray-100"
                              aria-label="Increase quantity"
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                          
                          <button
                            onClick={() => handleRemoveFromCart(item.id)}
                            className="text-red-500 hover:text-red-700"
                            aria-label="Remove item"
                          >
                            <X size={20} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Order Summary */}
            <div className="lg:w-1/3">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal ({cart.length} {cart.length === 1 ? 'item' : 'items'})</span>
                    <span className="font-medium">₹{getCartTotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">Free</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3 flex justify-between">
                    <span className="text-lg font-semibold">Total</span>
                    <span className="text-lg font-semibold">₹{getCartTotal().toFixed(2)}</span>
                  </div>
                </div>
                
                <button
                  onClick={handleCheckout}
                  className="w-full px-6 py-3 bg-brand-purple text-white rounded-md hover:bg-brand-deep-purple transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                  disabled={cart.length === 0}
                  aria-label="Proceed to checkout"
                >
                  Proceed to Checkout
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center max-w-md mx-auto">
            <div className="flex justify-center mb-4">
              <ShoppingCart size={64} className="text-gray-300" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">
              Looks like you haven't added any products to your cart yet.
            </p>
            <Link
              to="/products"
              className="px-6 py-3 bg-brand-purple text-white rounded-md hover:bg-brand-deep-purple transition-colors inline-block"
              aria-label="Browse products"
            >
              Browse Products
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;