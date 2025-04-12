import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Shield, ThumbsUp, TrendingUp } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { motion } from 'framer-motion';
import ProductCard from '../components/shop/ProductCard';

const HomePage = () => {
  const { products } = useShop();
  
  // Get featured products
  const featuredProducts = products.slice(0, 4);
  
  // Get products by category
  const lightingProducts = products.filter(product => product.category === 'lighting');
  const safetyProducts = products.filter(product => product.category === 'safety');

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section 
  className="hero-section flex items-center justify-center min-h-screen bg-cover bg-center bg-no-repeat relative"
  style={{
    backgroundImage: "url('/p.jpg')", // or use an external URL
  }}
>
  {/* Dark overlay for better text contrast */}
  <div className="absolute inset-0 bg-black/50"></div>
  
  {/* Content container (z-10 brings it above the overlay) */}
  <div className="container mx-auto px-4 py-24 text-center relative z-10">
    <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
      Power Your World with Quality Electricals
    </h1>
    <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
      Reliable electrical products for your home and business needs
    </p>
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <Link
        to="/products"
        className="px-6 py-3 bg-brand-purple text-white font-medium rounded-md hover:bg-brand-deep-purple transition-colors"
      >
        Shop Now
      </Link>
      <Link
        to="/about"
        className="px-6 py-3 bg-white text-gray-900 font-medium rounded-md hover:bg-gray-100 transition-colors"
      >
        Learn More
      </Link>
    </div>
  </div>
</section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose SR Electricals?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg text-center hover:shadow-md transition-shadow">
              <div className="bg-brand-soft-gray p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Zap size={28} className="text-brand-purple" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Quality Products</h3>
              <p className="text-gray-600">
                All our products are sourced from trusted manufacturers and undergo rigorous quality checks.
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg text-center hover:shadow-md transition-shadow">
              <div className="bg-brand-soft-gray p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <ThumbsUp size={28} className="text-brand-purple" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Expert Advice</h3>
              <p className="text-gray-600">
                Our team of electrical experts is always ready to help you make the right choices.
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg text-center hover:shadow-md transition-shadow">
              <div className="bg-brand-soft-gray p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Shield size={28} className="text-brand-purple" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Warranty Coverage</h3>
              <p className="text-gray-600">
                All products come with manufacturer warranty and our satisfaction guarantee.
              </p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg text-center hover:shadow-md transition-shadow">
              <div className="bg-brand-soft-gray p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <TrendingUp size={28} className="text-brand-purple" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Best Prices</h3>
              <p className="text-gray-600">
                We offer competitive pricing without compromising on quality or service.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Featured Products</h2>
            <Link to="/products" className="flex items-center text-brand-purple hover:underline">
              View All <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Browse by Category</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <Link to="/products?category=lighting" className="group">
              <div className="bg-gray-100 p-6 rounded-lg text-center hover:bg-brand-soft-gray transition-colors">
                <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:bg-brand-purple transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-800 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="font-medium group-hover:text-brand-purple transition-colors">Lighting</h3>
              </div>
            </Link>
            
            <Link to="/products?category=wiring" className="group">
              <div className="bg-gray-100 p-6 rounded-lg text-center hover:bg-brand-soft-gray transition-colors">
                <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:bg-brand-purple transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-800 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="font-medium group-hover:text-brand-purple transition-colors">Wiring</h3>
              </div>
            </Link>
            
            <Link to="/products?category=switches" className="group">
              <div className="bg-gray-100 p-6 rounded-lg text-center hover:bg-brand-soft-gray transition-colors">
                <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:bg-brand-purple transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-800 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                </div>
                <h3 className="font-medium group-hover:text-brand-purple transition-colors">Switches</h3>
              </div>
            </Link>
            
            <Link to="/products?category=safety" className="group">
              <div className="bg-gray-100 p-6 rounded-lg text-center hover:bg-brand-soft-gray transition-colors">
                <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:bg-brand-purple transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-800 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="font-medium group-hover:text-brand-purple transition-colors">Safety</h3>
              </div>
            </Link>
            
            <Link to="/products?category=tools" className="group">
              <div className="bg-gray-100 p-6 rounded-lg text-center hover:bg-brand-soft-gray transition-colors">
                <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:bg-brand-purple transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-800 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="font-medium group-hover:text-brand-purple transition-colors">Tools</h3>
              </div>
            </Link>
            
            <Link to="/products?category=solar" className="group">
              <div className="bg-gray-100 p-6 rounded-lg text-center hover:bg-brand-soft-gray transition-colors">
                <div className="bg-white rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:bg-brand-purple transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-800 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h3 className="font-medium group-hover:text-brand-purple transition-colors">Solar</h3>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Special Offers Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h2 className="text-3xl font-bold mb-4">Special Offers</h2>
              <p className="text-gray-300 mb-6 text-lg">
                Get up to 25% off on selected lighting products this month. Upgrade to energy-efficient LEDs and save on your electricity bills.
              </p>
              <Link
                to="/products?category=lighting"
                className="inline-block px-6 py-3 bg-brand-purple text-white font-medium rounded-md hover:bg-brand-deep-purple transition-colors"
              >
                Shop Offers
              </Link>
            </div>
            <div className="md:w-1/2 grid grid-cols-2 gap-4">
              {lightingProducts.slice(0, 2).map(product => (
                <div key={product.id} className="bg-gray-800 rounded-lg overflow-hidden">
                  <img 
                    src={product.image || "https://via.placeholder.com/300x200"} 
                    alt={product.name} 
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-medium text-lg mb-1">{product.name}</h3>
                    <div className="flex items-center justify-between">
                      <p className="text-gray-300">${product.price.toFixed(2)}</p>
                      <div className="bg-brand-purple text-white text-xs px-2 py-1 rounded">25% OFF</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-brand-soft-gray">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="text-gray-600 mb-8 max-w-xl mx-auto">
            Subscribe to our newsletter to receive updates on new products, special offers, and electrical safety tips.
          </p>
          <form className="max-w-md mx-auto flex flex-col sm:flex-row gap-2">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-purple"
              required
            />
            <button
              type="submit"
              className="px-6 py-3 bg-brand-purple text-white font-medium rounded-md hover:bg-brand-deep-purple transition-colors whitespace-nowrap"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
