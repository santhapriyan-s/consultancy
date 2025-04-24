import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import ProductCard from '../components/shop/ProductCard';
import { Search, Filter, X } from 'lucide-react';

const ProductsPage = () => {
  const { products } = useShop();
  const location = useLocation();
  
  // Get category from URL query parameter
  const queryParams = new URLSearchParams(location.search);
  const categoryParam = queryParams.get('category');
  
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState(categoryParam || 'all');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 }); // Increased max for electrical products
  const [sortOrder, setSortOrder] = useState('featured');
  const [showFilters, setShowFilters] = useState(false);
  
  // Extract unique categories from products
  const categories = ['all', ...new Set(products.map(product => product.category))];
  
  // Filter products based on category, search query, and price range
  useEffect(() => {
    let result = [...products];
    
    // Filter by category
    if (activeCategory !== 'all') {
      result = result.filter(product => product.category === activeCategory);
    }
    
    // Filter by search query
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        product =>
          product.name.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query) ||
          product.category.toLowerCase().includes(query)
      );
    }
    
    // Filter by price range
    result = result.filter(
      product => product.price >= priceRange.min && product.price <= priceRange.max
    );
    
    // Sort products
    switch (sortOrder) {
      case 'price_asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'name_asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name_desc':
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        // 'featured' - keep original order
        break;
    }
    
    setFilteredProducts(result);
  }, [products, activeCategory, searchQuery, priceRange, sortOrder]);
  
  // Update URL when category changes
  useEffect(() => {
    if (activeCategory === 'all') {
      window.history.replaceState(null, '', '/products');
    } else {
      window.history.replaceState(null, '', `/products?category=${activeCategory}`);
    }
  }, [activeCategory]);

  // Handle category change
  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    setShowFilters(false);
  };
  
  // Reset filters
  const resetFilters = () => {
    setActiveCategory('all');
    setSearchQuery('');
    setPriceRange({ min: 0, max: 10000 });
    setSortOrder('featured');
  };
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">Electrical Products</h1>
        
        {/* Mobile filters toggle */}
        <div className="md:hidden mb-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm"
          >
            <Filter size={18} />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>
        
        <div className="flex flex-col md:flex-row gap-6">
          {/* Filters sidebar */}
          <div
            className={`${
              showFilters ? 'block' : 'hidden md:block'
            } w-full md:w-1/4 lg:w-1/5 bg-white p-6 rounded-lg shadow-sm`}
          >
            <div className="flex justify-between items-center md:hidden mb-4">
              <h2 className="font-semibold text-lg">Filters</h2>
              <button onClick={() => setShowFilters(false)}>
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-6">
              {/* Search */}
              <div>
                <h3 className="font-semibold mb-2">Search</h3>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-purple"
                  />
                  <Search className="absolute right-3 top-2.5 text-gray-400" size={18} />
                </div>
              </div>
              
              {/* Categories */}
              <div>
                <h3 className="font-semibold mb-2">Categories</h3>
                <div className="space-y-1">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => handleCategoryChange(category)}
                      className={`w-full text-left px-3 py-2 rounded-md capitalize ${
                        activeCategory === category
                          ? 'bg-brand-purple text-white'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Price Range */}
              <div>
                <h3 className="font-semibold mb-2">Price Range (₹)</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>₹{priceRange.min}</span>
                    <span>₹{priceRange.max}</span>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      min="0"
                      max="10000"
                      value={priceRange.min}
                      onChange={(e) =>
                        setPriceRange({ ...priceRange, min: parseInt(e.target.value) || 0 })
                      }
                      className="w-1/2 px-2 py-1 border border-gray-300 rounded-md"
                    />
                    <input
                      type="number"
                      min="0"
                      max="10000"
                      value={priceRange.max}
                      onChange={(e) =>
                        setPriceRange({ ...priceRange, max: parseInt(e.target.value) || 10000 })
                      }
                      className="w-1/2 px-2 py-1 border border-gray-300 rounded-md"
                    />
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="10000"
                    step="100"
                    value={priceRange.max}
                    onChange={(e) =>
                      setPriceRange({ ...priceRange, max: parseInt(e.target.value) })
                    }
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>
              
              {/* Sort Options */}
              <div>
                <h3 className="font-semibold mb-2">Sort By</h3>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-purple"
                >
                  <option value="featured">Featured</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="name_asc">Name: A to Z</option>
                  <option value="name_desc">Name: Z to A</option>
                </select>
              </div>
              
              {/* Reset Filters */}
              <button
                onClick={resetFilters}
                className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
              >
                Reset Filters
              </button>
            </div>
          </div>
          
          {/* Product grid */}
          <div className="w-full md:w-3/4 lg:w-4/5">
            {/* Results count */}
            <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-lg shadow-sm">
              <p className="text-gray-600">
                Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
                {activeCategory !== 'all' && ` in ${activeCategory}`}
              </p>
            </div>
            
            {/* Products grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white p-8 rounded-lg shadow-sm text-center">
                <h3 className="text-xl font-semibold mb-2">No Products Found</h3>
                <p className="text-gray-600 mb-4">
                  We couldn't find any products matching your current filters.
                </p>
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 bg-brand-purple text-white rounded-md hover:bg-brand-deep-purple transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;