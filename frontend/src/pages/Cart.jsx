
import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useProduct } from '@/context/ProductContext';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/button';
import { Trash2, ShoppingBag, ArrowRight } from 'lucide-react';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, getCartTotal, isLoggedIn, storeSettings } = useProduct();
  const { t } = useLanguage();

  const handleQuantityChange = (productId, newQuantity) => {
    // Don't allow quantities less than 1
    if (newQuantity < 1) return;
    updateQuantity(productId, newQuantity);
  };

  // Check if there are any payment methods enabled
  const anyPaymentMethodEnabled = storeSettings.enableCod || storeSettings.enableRazorpay || storeSettings.enableUpi;

  // Redirect to login if not logged in
  if (!isLoggedIn) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md mx-auto">
          <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-6" />
          <h2 className="text-2xl font-bold mb-4">{t('pleaseLoginFirst')}</h2>
          <p className="text-gray-600 mb-8">{t('needLoginForCart')}</p>
          <Link to="/login">
            <Button className="bg-srblue hover:bg-blue-700">
              {t('login')}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!cart || cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md mx-auto">
          <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-6" />
          <h2 className="text-2xl font-bold mb-4">{t('emptyCart')}</h2>
          <p className="text-gray-600 mb-8">{t('emptyCartMessage')}</p>
          <Link to="/products">
            <Button className="bg-srblue hover:bg-blue-700">
              {t('browseProducts')}
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">{t('yourCart')}</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">{t('cartItems')} ({cart.length})</h2>
            </div>
            
            <div className="divide-y">
              {cart.map((item) => (
                <div key={item.id} className="p-6 flex flex-col sm:flex-row items-center">
                  {/* Item Image */}
                  <div className="w-24 h-24 flex-shrink-0 mr-6 mb-4 sm:mb-0">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover rounded"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://placehold.co/200/e2e8f0/1e293b?text=SR+Electricals';
                      }}
                    />
                  </div>
                  
                  {/* Item Details */}
                  <div className="flex-grow">
                    <Link to={`/products/${item.id}`}>
                      <h3 className="text-lg font-medium mb-1 hover:text-srblue transition-colors">{item.name}</h3>
                    </Link>
                    <p className="text-gray-500 text-sm mb-2 capitalize">{t(item.category)}</p>
                    <div className="flex flex-wrap justify-between items-center">
                      <span className="font-semibold">₹{item.price.toFixed(2)}</span>
                      
                      <div className="flex items-center mt-2 sm:mt-0">
                        <button 
                          className="bg-gray-200 px-3 py-1 rounded-l-md hover:bg-gray-300"
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        >
                          -
                        </button>
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}
                          className="w-12 text-center border-y border-gray-200 py-1"
                        />
                        <button 
                          className="bg-gray-200 px-3 py-1 rounded-r-md hover:bg-gray-300"
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        >
                          +
                        </button>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromCart(item.id)}
                          className="ml-4 text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
            <h2 className="text-xl font-semibold mb-6">{t('orderSummary')}</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between border-b pb-4">
                <span className="text-gray-600">{t('subtotal')}</span>
                <span className="font-semibold">₹{getCartTotal().toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between border-b pb-4">
                <span className="text-gray-600">{t('shipping')}</span>
                <span className="font-semibold">
                  {getCartTotal() >= 1000 ? 'Free' : '₹100.00'}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-lg font-bold">{t('total')}</span>
                <span className="text-lg font-bold">
                  ₹{(getCartTotal() + (getCartTotal() >= 1000 ? 0 : 100)).toFixed(2)}
                </span>
              </div>
              
              {anyPaymentMethodEnabled ? (
                <Link to="/checkout" className="block">
                  <Button className="w-full bg-srblue hover:bg-blue-700 mt-6">
                    {t('proceedToCheckout')}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              ) : (
                <div className="mt-6 p-3 bg-yellow-50 border border-yellow-200 rounded text-yellow-800">
                  <p className="text-sm font-medium">{t('checkoutUnavailable')}</p>
                </div>
              )}

              {/* Available Payment Methods */}
              {anyPaymentMethodEnabled && (
                <div className="mt-4 text-sm text-gray-600">
                  <p className="mb-2 font-medium">{t('availablePaymentMethods')}</p>
                  <ul className="space-y-1">
                    {storeSettings.enableCod && (
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        {t('cashOnDelivery')}
                      </li>
                    )}
                    {storeSettings.enableRazorpay && (
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        {t('cards')}
                      </li>
                    )}
                    {storeSettings.enableUpi && (
                      <li className="flex items-center">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        {t('upiPayment')}
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;