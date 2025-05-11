
import React from 'react';
import { Link } from 'react-router-dom';
import { useProduct } from '@/context/ProductContext';
import { Button } from '@/components/ui/button';
import { Heart, ShoppingCart } from 'lucide-react';

const Favorites = () => {
  const { favorites, toggleFavorite, addToCart, isLoggedIn } = useProduct();

  if (!isLoggedIn) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md mx-auto">
          <Heart className="h-16 w-16 text-gray-400 mx-auto mb-6" />
          <h2 className="text-2xl font-bold mb-4">Please login first</h2>
          <p className="text-gray-600 mb-8">You need to login to view your wishlist.</p>
          <Link to="/login">
            <Button className="bg-srblue hover:bg-blue-700">
              Login
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md mx-auto">
          <Heart className="h-16 w-16 text-gray-400 mx-auto mb-6" />
          <h2 className="text-2xl font-bold mb-4">Your wishlist is empty</h2>
          <p className="text-gray-600 mb-8">You haven't added any products to your wishlist yet.</p>
          <Link to="/products">
            <Button className="bg-srblue hover:bg-blue-700">
              Browse Products
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">My Wishlist</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {favorites.map(product => (
          <div key={product.id} className="product-card bg-white rounded-lg overflow-hidden shadow-md">
            <Link to={`/products/${product.id}`}>
              <div className="h-48 overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover transition-transform hover:scale-105"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://placehold.co/400x300/e2e8f0/1e293b?text=SR+Electricals';
                  }}
                />
              </div>
            </Link>
            
            <div className="p-4">
              <Link to={`/products/${product.id}`}>
                <h3 className="text-lg font-semibold mb-2 hover:text-srblue transition-colors">{product.name}</h3>
              </Link>
              <p className="text-gray-600 text-sm mb-3 capitalize">{product.category}</p>
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold">₹{product.price.toFixed(2)}</span>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => toggleFavorite(product.id)}
                    className="text-red-500 border-red-500"
                  >
                    <Heart className="h-4 w-4 fill-current text-red-500" />
                  </Button>
                  
                  <Button
                    size="icon"
                    onClick={() => addToCart(product)}
                  >
                    <ShoppingCart className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Favorites;