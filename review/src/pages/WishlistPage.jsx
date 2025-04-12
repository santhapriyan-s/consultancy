import React from 'react';
import { Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { Heart, ShoppingCart, Trash2, ExternalLink } from 'lucide-react';

const WishlistPage = () => {
  const { wishlist, toggleFavorite, addToCart } = useShop();

  const handleRemoveFromWishlist = (productId) => {
    toggleFavorite(productId);
  };

  const handleAddToCart = (productId) => {
    addToCart(productId);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Your Wishlist</h1>
        
        {wishlist.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlist.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="relative">
                  <img
                    src={product.image || "https://via.placeholder.com/300x300?text=Product+Image"}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                  <button
                    onClick={() => handleRemoveFromWishlist(product.id)}
                    className="absolute top-2 right-2 p-2 rounded-full bg-white text-red-500 hover:bg-red-50 shadow-sm"
                    aria-label="Remove from wishlist"
                  >
                    <Heart size={18} fill="currentColor" />
                  </button>
                </div>
                
                <div className="p-4">
                  <Link to={`/products/${product.id}`} className="block">
                    <h2 className="text-lg font-semibold text-gray-800 mb-1 hover:text-brand-purple transition-colors">
                      {product.name}
                    </h2>
                    <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>
                    <div className="mb-4">
                      <span className="text-xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
                    </div>
                  </Link>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAddToCart(product.id)}
                      className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-brand-purple text-white rounded-md hover:bg-brand-deep-purple transition-colors text-sm"
                    >
                      <ShoppingCart size={16} />
                      Add to Cart
                    </button>
                    
                    <Link
                      to={`/products/${product.id}`}
                      className="px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                    >
                      <ExternalLink size={16} />
                    </Link>
                    
                    <button
                      onClick={() => handleRemoveFromWishlist(product.id)}
                      className="px-3 py-2 bg-gray-100 text-red-500 rounded-md hover:bg-gray-200 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <div className="flex justify-center mb-4">
              <Heart size={64} className="text-gray-300" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">Your wishlist is empty</h2>
            <p className="text-gray-600 mb-6">
              Start adding products you love to your wishlist!
            </p>
            <Link
              to="/products"
              className="px-6 py-3 bg-brand-purple text-white rounded-md hover:bg-brand-deep-purple transition-colors inline-block"
            >
              Browse Products
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default WishlistPage;
