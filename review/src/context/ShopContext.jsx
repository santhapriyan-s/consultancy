import React, { createContext, useState, useContext, useEffect } from 'react';
import { toast } from '../components/ui/use-toast';
import * as db from '../services/mongodb';

export const ShopContext = createContext();

export const ShopProvider = ({ children }) => {
  // Product data
  const [products, setProducts] = useState([
    { id: 1, name: "LED Bulb", price: 10, category: "lighting", description: "Energy-efficient LED bulb.", image: "/a.jpg", isFavorite: false, reviews: [] },
    { id: 2, name: "Extension Cord", price: 15, category: "wiring", description: "5-meter extension cord.", image: "/b.jpg", isFavorite: false, reviews: [] },
    { id: 3, name: "Smart Plug", price: 25, category: "switches", description: "Wi-Fi-enabled smart plug.", image: "/c.jpg", isFavorite: false, reviews: [] },
    { id: 4, name: "Circuit Breaker", price: 30, category: "safety", description: "High-quality circuit breaker for safety.", image: "/d.jpg", isFavorite: false, reviews: [] },
    { id: 5, name: "Solar Panel", price: 200, category: "solar", description: "Eco-friendly solar panel for renewable energy.", image: "/e.jpg", isFavorite: false, reviews: [] },
    { id: 6, name: "Battery Backup", price: 150, category: "safety", description: "Reliable battery backup for power outages.", image: "/f.jpg", isFavorite: false, reviews: [] },
    { id: 7, name: "Voltage Stabilizer", price: 80, category: "safety", description: "Stabilizes voltage to protect appliances.", image: "/g.jpg", isFavorite: false, reviews: [] },
    { id: 8, name: "Electric Drill", price: 50, category: "tools", description: "Powerful electric drill for DIY projects.", image: "/h.jpg", isFavorite: false, reviews: [] },
    { id: 9, name: "Cable Tester", price: 40, category: "tools", description: "Tests electrical cables for faults.", image: "/i.jpg", isFavorite: false, reviews: [] },
    { id: 10, name: "LED Strip Lights", price: 20, category: "lighting", description: "Flexible LED strip lights for decoration.", image: "/j.jpg", isFavorite: false, reviews: [] },
  ]);
  
  // Shopping cart state
  const [cart, setCart] = useState([]);
  
  // Wishlist state
  const [wishlist, setWishlist] = useState([]);
  
  // Orders state
  const [orders, setOrders] = useState([]);

  // MongoDB Integration - Fetch products from MongoDB
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Check if we have products in MongoDB
        const mongoProducts = await db.getAll('products');
        
        // If no products in MongoDB, initialize with default products
        if (mongoProducts.length === 0) {
          await db.insertMany('products', products);
        } else {
          setProducts(mongoProducts);
        }
      } catch (error) {
        console.error('Failed to fetch products from MongoDB:', error);
        // Continue with local state if MongoDB fails
      }
    };

    fetchProducts();
    
    // Load cart and wishlist from localStorage as fallback
    const storedCart = localStorage.getItem('cart');
    const storedWishlist = localStorage.getItem('wishlist');
    const storedOrders = localStorage.getItem('orders');
    
    if (storedCart) setCart(JSON.parse(storedCart));
    if (storedWishlist) setWishlist(JSON.parse(storedWishlist));
    if (storedOrders) setOrders(JSON.parse(storedOrders));
    
    // Try to fetch cart, wishlist, and orders from MongoDB
    const fetchUserData = async () => {
      try {
        const carts = await db.getAll('carts');
        const wishlists = await db.getAll('wishlists');
        const ordersList = await db.getAll('orders');
        
        // Use MongoDB data if available, otherwise keep using localStorage data
        if (carts.length > 0) setCart(carts);
        if (wishlists.length > 0) setWishlist(wishlists);
        if (ordersList.length > 0) setOrders(ordersList);
      } catch (error) {
        console.error('Failed to fetch user data from MongoDB:', error);
        // Continue with localStorage data if MongoDB fails
      }
    };
    
    fetchUserData();
  }, []);

  // Save cart items to localStorage and MongoDB whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    localStorage.setItem('orders', JSON.stringify(orders));
    
    // Update MongoDB
    const updateMongoDB = async () => {
      try {
        // For simplicity, we just replace all documents
        // In a real app, you'd want to associate these with user IDs
        await db.deleteOne('carts', {});
        await db.deleteOne('wishlists', {});
        await db.deleteOne('orders', {});
        
        if (cart.length > 0) await db.insertMany('carts', cart);
        if (wishlist.length > 0) await db.insertMany('wishlists', wishlist);
        if (orders.length > 0) await db.insertMany('orders', orders);
      } catch (error) {
        console.error('Failed to update MongoDB:', error);
        // Continue with localStorage even if MongoDB fails
      }
    };
    
    updateMongoDB();
  }, [cart, wishlist, orders]);

  // Add item to cart
  const addToCart = (productId) => {
    const product = products.find((p) => p.id === productId);
    
    // Check if product is already in cart
    const existingItem = cart.find((item) => item.id === productId);
    
    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    
    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  // Remove item from cart
  const removeFromCart = (productId) => {
    const product = products.find((p) => p.id === productId);
    setCart(cart.filter((item) => item.id !== productId));
    
    toast({
      title: "Removed from Cart",
      description: `${product.name} has been removed from your cart.`,
    });
  };

  // Update cart item quantity
  const updateCartQuantity = (productId, quantity) => {
    if (quantity < 1) return;
    
    setCart(
      cart.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  // Toggle favorite status
  const toggleFavorite = (productId) => {
    const product = products.find((p) => p.id === productId);
    
    // Check if product is already in wishlist
    const isInWishlist = wishlist.some((item) => item.id === productId);
    
    if (isInWishlist) {
      setWishlist(wishlist.filter((item) => item.id !== productId));
      toast({
        title: "Removed from Wishlist",
        description: `${product.name} has been removed from your wishlist.`,
      });
    } else {
      setWishlist([...wishlist, product]);
      toast({
        title: "Added to Wishlist",
        description: `${product.name} has been added to your wishlist.`,
      });
    }
    
    // Update product isFavorite status
    setProducts(
      products.map((p) =>
        p.id === productId ? { ...p, isFavorite: !p.isFavorite } : p
      )
    );
  };

  // Add review to product
  const addReview = (productId, review) => {
    const updatedProducts = products.map((p) =>
      p.id === productId
        ? { ...p, reviews: [...p.reviews, review] }
        : p
    );
    
    setProducts(updatedProducts);
    
    // Update product in MongoDB
    const updateProductInDB = async () => {
      try {
        const product = updatedProducts.find(p => p.id === productId);
        if (product) {
          await db.updateOne('products', { id: productId }, product);
        }
      } catch (error) {
        console.error('Failed to update product review in MongoDB:', error);
      }
    };
    
    updateProductInDB();
    
    toast({
      title: "Review Added",
      description: "Your review has been added successfully.",
    });
  };

  // Edit review
  const editReview = (productId, reviewId, updatedReview) => {
    setProducts(
      products.map((p) =>
        p.id === productId
          ? {
              ...p,
              reviews: p.reviews.map((r) =>
                r.id === reviewId ? { ...r, ...updatedReview } : r
              ),
            }
          : p
      )
    );
    
    toast({
      title: "Review Updated",
      description: "Your review has been updated successfully.",
    });
  };

  // Delete review
  const deleteReview = (productId, reviewId) => {
    setProducts(
      products.map((p) =>
        p.id === productId
          ? {
              ...p,
              reviews: p.reviews.filter((r) => r.id !== reviewId),
            }
          : p
      )
    );
    
    toast({
      title: "Review Deleted",
      description: "Your review has been deleted successfully.",
    });
  };

  // Calculate total amount in cart
  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };
  
  // Place order
  const placeOrder = (orderDetails) => {
    const newOrder = {
      id: Date.now().toString(),
      items: [...cart],
      total: getCartTotal(),
      ...orderDetails,
      status: "Pending",
      date: new Date().toISOString(),
    };
    
    const updatedOrders = [...orders, newOrder];
    setOrders(updatedOrders);
    setCart([]); // Clear cart after order is placed
    
    // Save order to MongoDB
    const saveOrderToDB = async () => {
      try {
        await db.insertOne('orders', newOrder);
      } catch (error) {
        console.error('Failed to save order to MongoDB:', error);
      }
    };
    
    saveOrderToDB();
    
    toast({
      title: "Order Placed!",
      description: "Your order has been placed successfully.",
    });
    
    return newOrder.id; // Return order ID
  };

  // Update order status (for admin)
  const updateOrderStatus = (orderId, status) => {
    setOrders(
      orders.map((order) =>
        order.id === orderId ? { ...order, status } : order
      )
    );
    
    toast({
      title: "Order Updated",
      description: `Order #${orderId} status updated to ${status}.`,
    });
  };

  return (
    <ShopContext.Provider
      value={{
        products,
        setProducts,
        cart,
        wishlist,
        orders,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        toggleFavorite,
        addReview,
        editReview,
        deleteReview,
        getCartTotal,
        placeOrder,
        updateOrderStatus,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => useContext(ShopContext);
