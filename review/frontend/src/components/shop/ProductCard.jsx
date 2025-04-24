import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, ExternalLink } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { useAuth } from '../../context/AuthContext';
import { toast } from '../../components/ui/use-toast';

const ProductCard = ({ product }) => {
  const { addToCart, toggleFavorite } = useShop();
  const { user } = useAuth();

  console.log('ProductCard product:', product);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to add items to your cart.",
        variant: "destructive",
      });
      return;
    }
    
    addToCart(product.id);
  };

  const handleToggleFavorite = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to add items to your wishlist.",
        variant: "destructive",
      });
      return;
    }
    
    toggleFavorite(product.id);
  };

  return (
    <Link to={`/products/${product.id}`} className="group">
      <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow card-hover">
        <div className="relative">
          <img
            src={product.image || "https://via.placeholder.com/300x300?text=Product+Image"}
            alt={product.name}
            className="w-full h-48 object-cover"
          />
          <div className="absolute top-2 right-2 flex flex-col space-y-2">
            <button
              onClick={handleToggleFavorite}
              className={`p-2 rounded-full ${
                product.isFavorite
                  ? 'bg-brand-purple text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              } shadow-sm transition-colors`}
              aria-label={product.isFavorite ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart size={18} fill={product.isFavorite ? 'white' : 'none'} />
            </button>
          </div>
        </div>
        
        <div className="p-4">
          <div className="mb-2">
            <span className="text-xs font-medium px-2 py-1 bg-brand-soft-gray text-brand-purple rounded-full capitalize">
              {product.category}
            </span>
          </div>
          <h2 className="text-lg font-semibold text-gray-800 mb-1 group-hover:text-brand-purple transition-colors">
            {product.name}
          </h2>
          <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>
          <div className="flex justify-between items-center mt-4">
            <span className="text-xl font-bold text-gray-900">
              ₹ {(typeof product.price === 'number' && !isNaN(product.price) ? product.price : 0).toFixed(2)}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleAddToCart}
                className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-brand-purple hover:text-white transition-colors"
                aria-label="Add to cart"
              >
                <ShoppingCart size={18} />
              </button>
              <Link 
                to={`/products/${product.id}`}
                className="p-2 rounded-full bg-brand-purple text-white hover:bg-brand-deep-purple transition-colors"
                aria-label="View details"
              >
                <ExternalLink size={18} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;