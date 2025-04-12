import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { useAuth } from '../context/AuthContext';
import { Star, Heart, ShoppingCart, Minus, Plus, ChevronLeft, Edit, Trash2 } from 'lucide-react';
import { toast } from '../components/ui/use-toast';

const ProductDetailPage = () => {
  const { productId } = useParams();
  const { products, addToCart, toggleFavorite, addReview, editReview, deleteReview } = useShop();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(5);
  const [editingReview, setEditingReview] = useState(null);
  
  // Find product based on productId
  useEffect(() => {
    const foundProduct = products.find(p => p.id === parseInt(productId));
    
    if (foundProduct) {
      setProduct(foundProduct);
    } else {
      toast({
        title: "Product Not Found",
        description: "The requested product could not be found.",
        variant: "destructive",
      });
      navigate('/products');
    }
  }, [productId, products, navigate]);
  
  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-purple"></div>
      </div>
    );
  }
  
  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };
  
  const handleAddToCart = () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to add items to your cart.",
        variant: "destructive",
      });
      return;
    }
    
    for (let i = 0; i < quantity; i++) {
      addToCart(product.id);
    }
  };
  
  const handleToggleFavorite = () => {
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
  
  const handleBuyNow = () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to proceed with purchase.",
        variant: "destructive",
      });
      return;
    }
    
    for (let i = 0; i < quantity; i++) {
      addToCart(product.id);
    }
    
    navigate('/checkout');
  };
  
  const handleReviewSubmit = (e) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to submit a review.",
        variant: "destructive",
      });
      return;
    }
    
    if (editingReview) {
      // Edit existing review
      editReview(product.id, editingReview.id, {
        rating,
        text: reviewText,
        updatedAt: new Date().toISOString(),
      });
      
      setEditingReview(null);
    } else {
      // Add new review
      addReview(product.id, {
        id: Date.now().toString(),
        userId: user.id,
        userName: user.name,
        rating,
        text: reviewText,
        createdAt: new Date().toISOString(),
      });
    }
    
    setReviewText('');
    setRating(5);
  };
  
  const handleEditReview = (review) => {
    setEditingReview(review);
    setReviewText(review.text);
    setRating(review.rating);
  };
  
  const handleDeleteReview = (reviewId) => {
    deleteReview(product.id, reviewId);
  };
  
  const handleCancelEdit = () => {
    setEditingReview(null);
    setReviewText('');
    setRating(5);
  };
  
  // Calculate average rating
  const averageRating = product.reviews.length > 0
    ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
    : 0;
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Breadcrumbs */}
        <div className="mb-6">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <Link to="/" className="text-sm text-gray-500 hover:text-brand-purple">
                  Home
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <span className="text-gray-400 mx-2">/</span>
                  <Link to="/products" className="text-sm text-gray-500 hover:text-brand-purple">
                    Products
                  </Link>
                </div>
              </li>
              <li>
                <div className="flex items-center">
                  <span className="text-gray-400 mx-2">/</span>
                  <span className="text-sm text-gray-700 font-medium">{product.name}</span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
        
        {/* Product Details */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Product Image */}
            <div className="p-6 flex items-center justify-center">
              <img
                src={product.image || "https://via.placeholder.com/500x500?text=Product+Image"}
                alt={product.name}
                className="max-w-full h-auto rounded-lg"
              />
            </div>
            
            {/* Product Info */}
            <div className="p-6">
              <div className="mb-2">
                <span className="text-sm font-medium px-3 py-1 bg-brand-soft-gray text-brand-purple rounded-full capitalize">
                  {product.category}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              
              {/* Rating */}
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400 mr-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={18}
                      fill={star <= Math.round(averageRating) ? 'currentColor' : 'none'}
                    />
                  ))}
                </div>
                <span className="text-gray-600 text-sm">
                  {product.reviews.length > 0
                    ? `${averageRating.toFixed(1)} (${product.reviews.length} reviews)`
                    : 'No reviews yet'}
                </span>
              </div>
              
              <p className="text-2xl font-bold text-gray-900 mb-4">${product.price.toFixed(2)}</p>
              <p className="text-gray-700 mb-6">{product.description}</p>
              
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">Quantity</label>
                <div className="flex items-center">
                  <button
                    onClick={() => handleQuantityChange(quantity - 1)}
                    className="p-2 border border-gray-300 rounded-l-md hover:bg-gray-100"
                    disabled={quantity <= 1}
                  >
                    <Minus size={16} />
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                    min="1"
                    className="w-16 text-center border-y border-gray-300 py-2"
                  />
                  <button
                    onClick={() => handleQuantityChange(quantity + 1)}
                    className="p-2 border border-gray-300 rounded-r-md hover:bg-gray-100"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={handleAddToCart}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-colors"
                >
                  <ShoppingCart size={20} />
                  Add to Cart
                </button>
                
                <button
                  onClick={handleToggleFavorite}
                  className={`flex items-center justify-center gap-2 px-6 py-3 rounded-md transition-colors ${
                    product.isFavorite
                      ? 'bg-brand-purple text-white hover:bg-brand-deep-purple'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  <Heart size={20} fill={product.isFavorite ? 'currentColor' : 'none'} />
                  {product.isFavorite ? 'Wishlisted' : 'Add to Wishlist'}
                </button>
                
                <button
                  onClick={handleBuyNow}
                  className="flex-1 px-6 py-3 bg-brand-purple text-white rounded-md hover:bg-brand-deep-purple transition-colors"
                >
                  Buy Now
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Reviews Section */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
            
            {/* Review Form */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">
                {editingReview ? 'Edit Your Review' : 'Write a Review'}
              </h3>
              
              <form onSubmit={handleReviewSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700 font-medium mb-2">Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="text-yellow-400 focus:outline-none"
                      >
                        <Star size={24} fill={star <= rating ? 'currentColor' : 'none'} />
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="review" className="block text-gray-700 font-medium mb-2">
                    Your Review
                  </label>
                  <textarea
                    id="review"
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-purple"
                    required
                  ></textarea>
                </div>
                
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-brand-purple text-white rounded-md hover:bg-brand-deep-purple transition-colors"
                  >
                    {editingReview ? 'Update Review' : 'Submit Review'}
                  </button>
                  
                  {editingReview && (
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="px-6 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
            
            {/* Reviews List */}
            <div className="space-y-6">
              {product.reviews.length > 0 ? (
                product.reviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-800">{review.userName}</p>
                        <div className="flex text-yellow-400 my-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              size={16}
                              fill={star <= review.rating ? 'currentColor' : 'none'}
                            />
                          ))}
                        </div>
                        <p className="text-gray-500 text-sm">
                          {new Date(review.createdAt).toLocaleDateString()}
                          {review.updatedAt && ' (edited)'}
                        </p>
                      </div>
                      
                      {/* Edit/Delete buttons for user's own reviews */}
                      {user && user.id === review.userId && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditReview(review)}
                            className="p-1 text-gray-500 hover:text-brand-purple"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteReview(review.id)}
                            className="p-1 text-gray-500 hover:text-red-500"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      )}
                    </div>
                    <p className="text-gray-700 mt-2">{review.text}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
