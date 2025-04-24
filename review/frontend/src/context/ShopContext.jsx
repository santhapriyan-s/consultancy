import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { toast } from '../components/ui/use-toast';
import * as db from '../services/mongodb';

// Create context outside the provider to ensure stable reference
const ShopContext = createContext();

export const ShopProvider = ({ children }) => {
  // Product data
  const [products, setProducts] = useState([]);
  
  // Shopping cart state
  const [cart, setCart] = useState([]);
  
  // Wishlist state
  const [wishlist, setWishlist] = useState([]);
  
  // Orders state
  const [orders, setOrders] = useState([]);

  // Initialize with default products if none exist
  const defaultProducts = [
    { id: 1, name: "LED Bulb", price: 124.00, category: "lighting", description: "Energy-efficient LED bulb.", image: "/a.jpg", isFavorite: false, reviews: [] },
    { id: 2, name: "Extension Cord", price: 299.00, category: "wiring", description: "5-meter extension cord.", image: "/b.jpg", isFavorite: false, reviews: [] },
    { id: 3, name: "Smart Plug", price: 799.00, category: "switches", description: "Wi-Fi-enabled smart plug.", image: "/c.jpg", isFavorite: false, reviews: [] },
    { id: 4, name: "Circuit Breaker", price: 621.00, category: "safety", description: "High-quality circuit breaker for safety.", image: "/d.jpg", isFavorite: false, reviews: [] },
    { id: 5, name: "Solar Panel", price: 8999.00, category: "solar", description: "Eco-friendly solar panel for renewable energy.", image: "/e.jpg", isFavorite: false, reviews: [] },
    { id: 6, name: "Battery Backup", price: 1999.00, category: "safety", description: "Reliable battery backup for power outages.", image: "/f.jpg", isFavorite: false, reviews: [] },
    { id: 7, name: "Voltage Stabilizer", price: 2300.00, category: "safety", description: "Stabilizes voltage to protect appliances.", image: "/g.jpg", isFavorite: false, reviews: [] },
    { id: 8, name: "Electric Drill", price: 1300.00, category: "tools", description: "Powerful electric drill for DIY projects.", image: "/h.jpg", isFavorite: false, reviews: [] },
    { id: 9, name: "Cable Tester", price: 1575.00, category: "tools", description: "Tests electrical cables for faults.", image: "/i.jpg", isFavorite: false, reviews: [] },
    { id: 10, name: "LED Strip Lights", price: 1099.00, category: "lighting", description: "Flexible LED strip lights for decoration.", image: "/j.jpg", isFavorite: false, reviews: [] },
  ];

  // MongoDB Integration - Fetch products from localStorage DB
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Try to load products from localStorage DB
        const mongoProducts = await db.getAll('products');
        
        if (mongoProducts.length === 0) {
          // If no products exist, initialize with defaults
          await db.insertMany('products', defaultProducts);
          setProducts(defaultProducts);
        } else {
          // Ensure prices are numbers
          const normalizedProducts = mongoProducts.map(product => ({
            ...product,
            price: typeof product.price === 'string' ? parseFloat(product.price) : Number(product.price),
          }));
          setProducts(normalizedProducts);
        }

        // Load user data
        const [carts, wishlists, ordersList] = await Promise.all([
          db.getAll('carts'),
          db.getAll('wishlists'),
          db.getAll('orders')
        ]);

        if (carts.length > 0) setCart(carts);
        if (wishlists.length > 0) setWishlist(wishlists);
        if (ordersList.length > 0) setOrders(ordersList);

      } catch (error) {
        console.error('Failed to fetch data:', error);
        // Fallback to localStorage directly if DB operations fail
        const storedCart = localStorage.getItem('cart');
        const storedWishlist = localStorage.getItem('wishlist');
        const storedOrders = localStorage.getItem('orders');
        
        if (storedCart) setCart(JSON.parse(storedCart));
        if (storedWishlist) setWishlist(JSON.parse(storedWishlist));
        if (storedOrders) setOrders(JSON.parse(storedOrders));
        
        // Set default products if none loaded
        if (products.length === 0) {
          setProducts(defaultProducts);
        }
      }
    };

    fetchData();
  }, []);

  // Save data to localStorage and localStorage DB
  useEffect(() => {
    const saveData = async () => {
      try {
        // Save to localStorage as fallback
        const cartToSave = cart.map(({ id, quantity }) => ({ id, quantity }));
        const wishlistToSave = wishlist.map(({ id }) => id);
        
        localStorage.setItem('cart', JSON.stringify(cartToSave));
        localStorage.setItem('wishlist', JSON.stringify(wishlistToSave));
        localStorage.setItem('orders', JSON.stringify(orders));

        // Save to localStorage DB
        await Promise.all([
          db.deleteMany('carts', {}).then(() => {
            if (cart.length > 0) return db.insertMany('carts', cart);
          }),
          db.deleteMany('wishlists', {}).then(() => {
            if (wishlist.length > 0) return db.insertMany('wishlists', wishlist);
          }),
          db.deleteMany('orders', {}).then(() => {
            if (orders.length > 0) return db.insertMany('orders', orders);
          })
        ]);
      } catch (error) {
        console.error('Failed to save data:', error);
      }
    };

    saveData();
  }, [cart, wishlist, orders]);

  // Memoized context functions
  const addToCart = useCallback((productId) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;
    
    setCart(prevCart => {
      const existingItem = prevCart.find((item) => item.id === productId);
      
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });
    
    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart.`,
    });
  }, [products]);

  const removeFromCart = useCallback((productId) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;
    
    setCart(prevCart => prevCart.filter((item) => item.id !== productId));
    
    toast({
      title: "Removed from Cart",
      description: `${product.name} has been removed from your cart.`,
    });
  }, [products]);

  const updateCartQuantity = useCallback((productId, quantity) => {
    if (quantity < 1) return;
    
    setCart(prevCart =>
      prevCart.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  }, []);

  const toggleFavorite = useCallback((productId) => {
    const product = products.find((p) => p.id === productId);
    if (!product) return;
    
    setWishlist(prevWishlist => {
      const isInWishlist = prevWishlist.some((item) => item.id === productId);
      
      if (isInWishlist) {
        toast({
          title: "Removed from Wishlist",
          description: `${product.name} has been removed from your wishlist.`,
        });
        return prevWishlist.filter((item) => item.id !== productId);
      } else {
        toast({
          title: "Added to Wishlist",
          description: `${product.name} has been added to your wishlist.`,
        });
        return [...prevWishlist, product];
      }
    });
    
    setProducts(prevProducts =>
      prevProducts.map((p) =>
        p.id === productId ? { ...p, isFavorite: !p.isFavorite } : p
      )
    );
  }, [products]);

  const addReview = useCallback(async (productId, review) => {
    setProducts(prevProducts => {
      const updatedProducts = prevProducts.map((p) =>
        p.id === productId
          ? { ...p, reviews: [...p.reviews, review] }
          : p
      );
      
      // Update in localStorage DB
      db.updateOne('products', { id: productId }, updatedProducts.find(p => p.id === productId))
        .catch(error => console.error('Failed to update product review:', error));
      
      return updatedProducts;
    });
    
    toast({
      title: "Review Added",
      description: "Your review has been added successfully.",
    });
  }, []);

  const getCartTotal = useCallback(() => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  }, [cart]);

  const placeOrder = useCallback(async (orderDetails) => {
    const newOrder = {
      id: Date.now().toString(),
      items: [...cart],
      total: getCartTotal(),
      ...orderDetails,
      status: "Pending",
      date: new Date().toISOString(),
    };
    
    setOrders(prevOrders => [...prevOrders, newOrder]);
    setCart([]);
    
    try {
      await db.insertOne('orders', newOrder);
    } catch (error) {
      console.error('Failed to save order:', error);
    }
    
    toast({
      title: "Order Placed!",
      description: "Your order has been placed successfully.",
    });
    
    return newOrder.id;
  }, [cart, getCartTotal]);

  const updateOrderStatus = useCallback(async (orderId, status) => {
    setOrders(prevOrders =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, status } : order
      )
    );
    
    try {
      await db.updateOne('orders', { id: orderId }, { status });
    } catch (error) {
      console.error('Failed to update order status:', error);
    }
    
    toast({
      title: "Order Updated",
      description: `Order #${orderId} status updated to ${status}.`,
    });
  }, []);

  // Create the context value object
  const contextValue = {
    products,
    cart,
    wishlist,
    orders,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    toggleFavorite,
    addReview,
    getCartTotal,
    placeOrder,
    updateOrderStatus,
  };

  return (
    <ShopContext.Provider value={contextValue}>
      {children}
    </ShopContext.Provider>
  );
};

// Export the context and hook
export { ShopContext };
export const useShop = () => useContext(ShopContext);