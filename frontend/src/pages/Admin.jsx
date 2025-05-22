import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProduct } from '@/context/ProductContext';
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer
} from 'recharts';
import {
  User,
  Package,
  ShoppingBag,
  DollarSign,
  Search,
  LogOut,
  Edit,
  Trash2,
  PlusCircle,
  BarChart3,
  FileText,
  LayoutDashboard,
  Settings,
  Mail,
  Phone,
  Sun,
  Moon,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { API_BASE_URL } from '@/config/api';

// AdminNavbar component with dark mode toggle
const AdminNavbar = ({ logout, user, darkMode, setDarkMode }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="bg-gray-800 text-white p-4 sticky top-0 z-10">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-xl font-bold">SR Electricals Admin</h1>
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => setDarkMode(!darkMode)}
            className="text-white hover:bg-gray-700"
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
              {user?.name ? user.name[0].toUpperCase() : 'A'}
            </div>
            <span className="hidden md:block">{user?.name || 'Admin'}</span>
          </div>
          <Button variant="ghost" onClick={handleLogout} className="text-white hover:bg-gray-700">
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
};

const Admin = () => {
  const {
    user,
    logout,
    products,
    orders: contextOrders,
    setOrders,
    users,
    storeSettings,
    updateStoreSettings,
    addProduct,
    updateProduct,
    deleteProduct,
    fetchProducts
  } = useProduct();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddProductDialogOpen, setIsAddProductDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isStatusDialogOpen, setIsStatusDialogOpen] = useState(false);
  const [statusOrder, setStatusOrder] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    category: '',
    description: '',
    image: '',
    brand: '',
    countInStock: ''
  });
  const [adminOperationInProgress, setAdminOperationInProgress] = useState(false);
  const [settings, setSettings] = useState({
    storeName: storeSettings?.storeName || "SR Electricals",
    storeEmail: storeSettings?.storeEmail || "info@srelectricals.com",
    storePhone: storeSettings?.storePhone || "+91 9876543210",
    enableCod: storeSettings?.enableCod ?? true,
    enableRazorpay: storeSettings?.enableRazorpay ?? true,
    razorpayKey: storeSettings?.razorpayKey || "rzp_test_pYO1RxhwzDCppY"
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [orders, setLocalOrders] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [topCustomers, setTopCustomers] = useState([]);
  const [darkMode, setDarkMode] = useState(false);

  // Dark mode effect
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Check if user is admin and redirect if not
  useEffect(() => {
    if (!user || !user.isAdmin) {
      navigate('/login');
    } else {
      // Fetch orders when component mounts if user is admin
      fetchOrders();
    }
  }, [user, navigate]);

  // Update settings from context when storeSettings change
  useEffect(() => {
    if (storeSettings) {
      setSettings({
        storeName: storeSettings.storeName || "SR Electricals",
        storeEmail: storeSettings.storeEmail || "info@srelectricals.com",
        storePhone: storeSettings.storePhone || "+91 9876543210",
        enableCod: storeSettings.enableCod ?? true,
        enableRazorpay: storeSettings.enableRazorpay ?? true,
        razorpayKey: storeSettings.razorpayKey || "rzp_test_pYO1RxhwzDCppY"
      });
    }
  }, [storeSettings]);

  // Function to fetch orders from API
  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/api/orders`, {
        
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      
      const data = await response.json();
      setLocalOrders(data);
      // Also update orders in context
      setOrders(data);
      
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(err.message || 'Error fetching orders');
      toast({
        title: "Error",
        description: "Failed to load orders. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch monthly sales data
  const fetchSalesData = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/sales/monthly`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
  
      if (!response.ok) {
        throw new Error('Failed to fetch sales data');
      }
  
      const data = await response.json();
      const months = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
      ];
  
      // Format data for the chart
      const formattedData = data.map((item) => ({
        name: months[item.month - 1],
        sales: item.sales,
      }));
  
      setSalesData(formattedData);
    } catch (error) {
      console.error('Error fetching sales data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load sales data. Please try again.',
        variant: 'destructive',
      });
    }
  };
  
  // Fetch sales data when the component mounts
  useEffect(() => {
    fetchSalesData();
  }, []);

  // Fetch recent activities
  const fetchRecentActivities = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/activities`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch recent activities: ${response.statusText}`);
      }

      const data = await response.json();
      setRecentActivities(data);
    } catch (error) {
      console.error('Error fetching recent activities:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to load recent activities. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Fetch top customers
  const fetchTopCustomers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/customers/top`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch top customers: ${response.statusText}`);
      }

      const data = await response.json();
      setTopCustomers(data);
    } catch (error) {
      console.error('Error fetching top customers:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to load top customers. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Fetch additional data when the component mounts
  useEffect(() => {
    fetchRecentActivities();
    fetchTopCustomers();
  }, []);

  // Stats for dashboard
  const totalUsers = users?.length || 0;
  const totalOrders = orders.length;
  const totalProductsSold = orders.reduce((total, order) => 
    total + order.items.reduce((sum, item) => sum + item.quantity, 0), 0);
  const totalRevenue = orders.reduce((total, order) => total + order.total, 0);

  // Format price to 2 decimal places with ₹ symbol
  const formatPrice = (price) => {
    return `₹${parseFloat(price).toFixed(2)}`;
  };

  // Handle product form changes
  const handleProductChange = (e) => {
    const { name, value } = e.target;
    
    // If the field is price, ensure it's a valid number
    if (name === 'price') {
      const numValue = value === '' ? '' : parseFloat(value);
      setNewProduct({
        ...newProduct,
        [name]: numValue
      });
    } else {
      setNewProduct({
        ...newProduct,
        [name]: value
      });
    }
  };

  // Handle settings change
  const handleSettingChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings({
      ...settings,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Save settings
  const handleSaveSettings = () => {
    setAdminOperationInProgress(true);
    
    // Update settings in context
    updateStoreSettings(settings);
    
    toast({
      title: "Settings saved",
      description: "Your store settings have been updated successfully."
    });
    
    setTimeout(() => {
      setAdminOperationInProgress(false);
    }, 500);
  };

  // Add or update product
  const handleSaveProduct = async () => {
    setAdminOperationInProgress(true);
    
    // Ensure price is a number and apply defaults
    const productData = {
      name: newProduct.name,
      price: parseFloat(newProduct.price),
      description: newProduct.description,
      image: newProduct.image || 'https://placehold.co/400x300/e2e8f0/1e293b?text=No+Image',
      category: newProduct.category,
      brand: newProduct.brand || 'SR Electricals',
      countInStock: parseInt(newProduct.countInStock || '10'), // Ensure it's a number
      reviews: []
    };

    try {
      console.log('Sending product data:', productData); // Debug logging
      
      if (editingProduct) {
        // Update existing product
        const productId = editingProduct._id || editingProduct.id;
        console.log(`Updating product with ID: ${productId}`);
        await updateProduct(productId, productData);
      } else {
        // Add new product
        console.log('Adding new product');
        await addProduct(productData);
      }

      // Refresh products list
      await fetchProducts();

      setEditingProduct(null);
      setNewProduct({
        name: '',
        price: '',
        category: '',
        description: '',
        image: '',
        brand: '',
        countInStock: ''
      });
      setIsAddProductDialogOpen(false);
      
      toast({
        title: editingProduct ? "Product updated" : "Product added",
        description: editingProduct 
          ? "Product has been updated successfully" 
          : "New product has been added successfully"
      });
    } catch (error) {
      console.error('Product operation error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save product",
        variant: "destructive"
      });
    } finally {
      setAdminOperationInProgress(false);
    }
  };

  // Delete product
  const handleDeleteProduct = async () => {
    setAdminOperationInProgress(true);
    
    try {
      if (productToDelete) {
        await deleteProduct(productToDelete._id || productToDelete.id);
        
        // Refresh product list
        await fetchProducts();
        
        toast({
          title: "Product deleted",
          description: "Product has been deleted successfully."
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete product",
        variant: "destructive"
      });
    } finally {
      setProductToDelete(null);
      setIsDeleteDialogOpen(false);
      setAdminOperationInProgress(false);
    }
  };

  // Edit product
  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setNewProduct({
      name: product.name,
      price: product.price,
      category: product.category,
      description: product.description,
      image: product.image,
      brand: product.brand,
      countInStock: product.countInStock
    });
    setIsAddProductDialogOpen(true);
  };

  // Confirm delete product
  const confirmDeleteProduct = (product) => {
    setProductToDelete(product);
    setIsDeleteDialogOpen(true);
  };

  // Open status update dialog
  const openStatusDialog = (order) => {
    setStatusOrder(order);
    setNewStatus(order.status);
    setIsStatusDialogOpen(true);
  };

  // Update order status and send to API
  const updateOrderStatus = async () => {
    setAdminOperationInProgress(true);
    
    if (statusOrder && newStatus) {
      try {
        // Get the order ID, using _id from MongoDB if available, otherwise use id
        const orderId = statusOrder._id || statusOrder.id;
        
        // Check if we have a valid order ID
        if (!orderId) {
          throw new Error('No valid order ID found');
        }
        
        console.log(`Updating order ${orderId} status to ${newStatus}`, { 
          statusOrder,
          orderIdType: typeof orderId,
          orderIdValue: orderId
        });
        
        // Test the API first with a basic check
        const checkResponse = await fetch(`${API_BASE_URL}/api/system-check`);
        if (!checkResponse.ok) {
          console.error('API system check failed:', checkResponse.status);
        } else {
          console.log('API system check passed');
        }
        
        // Get a fresh token in case it's expired
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Authentication token missing, please login again');
        }
        
        // Create the request URL
        const requestUrl = `${API_BASE_URL}/api/orders/${orderId}/status`;
        console.log('Sending request to:', requestUrl);
        
        // Make sure API_BASE_URL is defined correctly
        if (!API_BASE_URL) {
          console.error('API_BASE_URL is not defined');
          throw new Error('API configuration error');
        }
        
        // Send the request with detailed debugging
        const response = await fetch(requestUrl, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ 
            status: newStatus
          })
        });
        
        console.log('Status update response status:', response.status);
        
        // Try to get response body regardless of status code
        let responseData = {};
        let responseText = '';
        
        try {
          responseText = await response.text();
          if (responseText) {
            try {
              responseData = JSON.parse(responseText);
              console.log('Response data:', responseData);
            } catch (parseError) {
              console.error('Response is not valid JSON:', responseText.substring(0, 100) + '...');
            }
          }
        } catch (textError) {
          console.error('Could not get response text:', textError);
        }
        
        if (!response.ok) {
          throw new Error(`Failed to update order status: ${response.status} ${response.statusText}`);
        }
        
        // Update local state
        const updatedOrders = orders.map(order => 
          (order._id === orderId || order.id === orderId) 
            ? { ...order, status: newStatus } 
            : order
        );
        setLocalOrders(updatedOrders);
        setOrders(updatedOrders);
        
        toast({
          title: "Order status updated",
          description: `Order status changed to ${newStatus}`
        });
      } catch (err) {
        console.error('Error updating order status:', err);
        toast({
          title: "Error",
          description: err.message || "Failed to update order status",
          variant: "destructive"
        });
      }
    }
    
    // Always clean up state after attempt
    setStatusOrder(null);
    setNewStatus('');
    setIsStatusDialogOpen(false);
    
    setTimeout(() => {
      setAdminOperationInProgress(false);
    }, 500);
  };

  // Get filtered users/orders based on search term
  const getFilteredData = (data) => {
    if (!searchTerm) return data;
    
    const term = searchTerm.toLowerCase();
    
    if (activeTab === 'users') {
      return users?.filter(user => 
        user.name?.toLowerCase().includes(term) || 
        user.email?.toLowerCase().includes(term)
      ) || [];
    }
    
    if (activeTab === 'orders') {
      return orders.filter(order => 
        order.id.toString().includes(term) || 
        (order.address && order.address.name.toLowerCase().includes(term))
      );
    }
    
    return data;
  };
  
  // Sales data for charts
  // const salesData = [
  //   { name: 'Jan', sales: 4000 },
  //   { name: 'Feb', sales: 3000 },
  //   { name: 'Mar', sales: 2000 },
  //   { name: 'Apr', sales: 2780 },
  //   { name: 'May', sales: 1890 },
  //   { name: 'Jun', sales: 2390 },
  //   { name: 'Jul', sales: 3490 },
  // ];

  // Product category data
  const categoryData = products.reduce((acc, product) => {
    const existingCategory = acc.find(item => item.name === product.category);
    if (existingCategory) {
      existingCategory.value += 1;
    } else {
      acc.push({ name: product.category, value: 1 });
    }
    return acc;
  }, []);

  // Colors for pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#FF6B6B'];

  // Generate order PDF
  const downloadOrderPDF = (orderId) => {
    setAdminOperationInProgress(true);
    
    toast({
      title: "Downloading PDF",
      description: `Order #${orderId} PDF is being generated.`
    });
    
    setTimeout(() => {
      setAdminOperationInProgress(false);
    }, 500);
  };

  // Calculate sales by category
  const salesByCategory = products.reduce((acc, product) => {
    const category = product.category || 'Uncategorized';
    const totalSales = orders.reduce((sum, order) => {
      const orderItem = order.items.find(item => item.id === product.id);
      return sum + (orderItem ? orderItem.quantity * product.price : 0);
    }, 0);

    if (acc[category]) {
      acc[category] += totalSales;
    } else {
      acc[category] = totalSales;
    }

    return acc;
  }, {});

  const salesByCategoryData = Object.entries(salesByCategory).map(([name, value]) => ({ name, value }));

  // Calculate order count for each user
  const userOrderCounts = orders.reduce((acc, order) => {
    const userId = order.userId || (order.address && order.address.email);
    if (userId) {
      acc[userId] = (acc[userId] || 0) + 1;
    }
    return acc;
  }, {});

  // Export users as CSV
  const exportToCSV = (data, filename) => {
    if (!data || !data.length) return;
    const csvRows = [];
    const headers = Object.keys(data[0]);
    csvRows.push(headers.join(','));
    for (const row of data) {
      csvRows.push(headers.map(field => JSON.stringify(row[field] ?? '')).join(','));
    }
    const csv = csvRows.join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <AdminNavbar logout={logout} user={user} darkMode={darkMode} setDarkMode={setDarkMode} />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-64 flex-shrink-0">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-4 flex flex-col h-full border border-blue-100 dark:border-gray-800">
              <h2 className="font-semibold text-lg mb-6 px-2 text-srblue tracking-wide">Admin Dashboard</h2>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="bg-blue-50 dark:bg-gray-800 rounded-lg p-2 text-center">
                  <div className="text-xs text-blue-600">Users</div>
                  <div className="font-bold text-blue-900 dark:text-blue-300">{totalUsers}</div>
                </div>
                <div className="bg-orange-50 dark:bg-gray-800 rounded-lg p-2 text-center">
                  <div className="text-xs text-orange-600">Orders</div>
                  <div className="font-bold text-orange-900 dark:text-orange-300">{totalOrders}</div>
                </div>
              </div>
              
              {/* Admin Profile Summary */}
              <div className="bg-gradient-to-r from-blue-100 via-white to-blue-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 p-4 rounded-xl mb-6 shadow-sm border border-blue-200 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-semibold shadow-lg border-2 border-white">
                    {user?.name ? user.name[0].toUpperCase() : 'A'}
                  </div>
                  <div>
                    <h3 className="font-medium text-blue-900 dark:text-blue-200">{user?.name || 'Admin'}</h3>
                    <p className="text-sm text-blue-500 dark:text-blue-300">{user?.email || 'admin@example.com'}</p>
                  </div>
                </div>
                <div className="text-xs text-blue-400 mt-2">
                  <p>Last login: {new Date().toLocaleString()}</p>
                </div>
              </div>
              
              {/* Sidebar nav */}
              <nav className="space-y-1">
                <button
                  className={`flex items-center px-2 py-2 rounded-lg text-sm font-medium w-full text-left transition-all duration-150 ${
                    activeTab === 'dashboard'
                      ? 'bg-gradient-to-r from-blue-500 to-blue-700 text-white shadow'
                      : 'text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-800 hover:text-blue-700'
                  }`}
                  onClick={() => setActiveTab('dashboard')}
                >
                  <LayoutDashboard className="h-5 w-5 mr-3" />
                  Dashboard
                </button>
                
                <button
                  className={`flex items-center px-2 py-2 rounded-lg text-sm font-medium w-full text-left transition-all duration-150 ${
                    activeTab === 'analytics'
                      ? 'bg-gradient-to-r from-blue-500 to-blue-700 text-white shadow'
                      : 'text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-800 hover:text-blue-700'
                  }`}
                  onClick={() => setActiveTab('analytics')}
                >
                  <BarChart3 className="h-5 w-5 mr-3" />
                  Analytics
                </button>
                
                <button
                  className={`flex items-center px-2 py-2 rounded-lg text-sm font-medium w-full text-left transition-all duration-150 ${
                    activeTab === 'users'
                      ? 'bg-gradient-to-r from-blue-500 to-blue-700 text-white shadow'
                      : 'text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-800 hover:text-blue-700'
                  }`}
                  onClick={() => setActiveTab('users')}
                >
                  <User className="h-5 w-5 mr-3" />
                  Users
                </button>
                
                <button
                  className={`flex items-center px-2 py-2 rounded-lg text-sm font-medium w-full text-left transition-all duration-150 ${
                    activeTab === 'orders'
                      ? 'bg-gradient-to-r from-blue-500 to-blue-700 text-white shadow'
                      : 'text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-800 hover:text-blue-700'
                  }`}
                  onClick={() => setActiveTab('orders')}
                >
                  <Package className="h-5 w-5 mr-3" />
                  Orders
                </button>
                
                <button
                  className={`flex items-center px-2 py-2 rounded-lg text-sm font-medium w-full text-left transition-all duration-150 ${
                    activeTab === 'products'
                      ? 'bg-gradient-to-r from-blue-500 to-blue-700 text-white shadow'
                      : 'text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-800 hover:text-blue-700'
                  }`}
                  onClick={() => setActiveTab('products')}
                >
                  <ShoppingBag className="h-5 w-5 mr-3" />
                  Products
                </button>
                
                <button
                  className={`flex items-center px-2 py-2 rounded-lg text-sm font-medium w-full text-left transition-all duration-150 ${
                    activeTab === 'settings'
                      ? 'bg-gradient-to-r from-blue-500 to-blue-700 text-white shadow'
                      : 'text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-800 hover:text-blue-700'
                  }`}
                  onClick={() => setActiveTab('settings')}
                >
                  <Settings className="h-5 w-5 mr-3" />
                  Settings
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Dashboard */}
            {activeTab === 'dashboard' && (
              <div>
                <h2 className="text-2xl font-bold mb-6 text-srblue tracking-tight">Dashboard Overview</h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  {/* Card with gradient and hover effect */}
                  <div className="bg-gradient-to-br from-blue-100 to-white dark:from-gray-800 dark:to-gray-900 p-6 rounded-2xl shadow-lg border border-blue-200 dark:border-gray-800 hover:scale-[1.03] transition-transform">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium text-blue-700">Total Users</h3>
                      <User className="h-6 w-6 text-blue-500" />
                    </div>
                    <p className="text-3xl font-bold text-blue-900">{totalUsers}</p>
                  </div>
                  <div className="bg-gradient-to-br from-orange-100 to-white dark:from-gray-800 dark:to-gray-900 p-6 rounded-2xl shadow-lg border border-orange-200 dark:border-gray-800 hover:scale-[1.03] transition-transform">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium text-orange-700">Orders</h3>
                      <Package className="h-6 w-6 text-orange-500" />
                    </div>
                    <p className="text-3xl font-bold text-orange-900">{totalOrders}</p>
                  </div>
                  <div className="bg-gradient-to-br from-green-100 to-white dark:from-gray-800 dark:to-gray-900 p-6 rounded-2xl shadow-lg border border-green-200 dark:border-gray-800 hover:scale-[1.03] transition-transform">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium text-green-700">Products Sold</h3>
                      <ShoppingBag className="h-6 w-6 text-green-500" />
                    </div>
                    <p className="text-3xl font-bold text-green-900">{totalProductsSold}</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-100 to-white dark:from-gray-800 dark:to-gray-900 p-6 rounded-2xl shadow-lg border border-purple-200 dark:border-gray-800 hover:scale-[1.03] transition-transform">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-medium text-purple-700">Revenue</h3>
                      <DollarSign className="h-6 w-6 text-purple-500" />
                    </div>
                    <p className="text-3xl font-bold text-purple-900">₹{totalRevenue.toFixed(2)}</p>
                  </div>
                </div>
                
                {/* Recent Activity Feed */}
                <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md mb-8">
                  <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
                  <ul className="divide-y divide-blue-50 dark:divide-gray-800">
                    {recentActivities.length > 0 ? recentActivities.slice(0, 5).map((activity, idx) => (
                      <li key={idx} className="py-2 text-sm text-gray-700 dark:text-gray-200 flex items-center gap-2">
                        <span className="text-blue-500 font-bold">{activity.user}</span>
                        <span>{activity.action}</span>
                        <span className="ml-auto text-xs text-gray-400">{new Date(activity.date).toLocaleString()}</span>
                      </li>
                    )) : (
                      <li className="py-2 text-gray-400">No recent activity</li>
                    )}
                  </ul>
                </div>
                
                {/* Admin activity overview */}
                <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                  <h3 className="text-lg font-semibold mb-4">Admin Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="mb-4">
                        <label className="text-sm text-gray-500">Name</label>
                        <p className="font-medium">{user?.name || 'Admin User'}</p>
                      </div>
                      <div className="mb-4">
                        <label className="text-sm text-gray-500">Email</label>
                        <p className="font-medium">{user?.email || 'admin@example.com'}</p>
                      </div>
                      <div className="mb-4">
                        <label className="text-sm text-gray-500">Role</label>
                        <p className="font-medium">Administrator</p>
                      </div>
                    </div>
                    <div>
                      <div className="mb-4">
                        <label className="text-sm text-gray-500">Store Settings</label>
                        <p className="font-medium">{settings.storeName}</p>
                      </div>
                      <div className="mb-4">
                        <label className="text-sm text-gray-500">Contact</label>
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-gray-500" />
                          <p>{settings.storeEmail}</p>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Phone className="h-4 w-4 text-gray-500" />
                          <p>{settings.storePhone}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold mb-4">Recent Orders</h3>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Order ID</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Total</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {orders.slice(0, 5).map((order) => (
                            <TableRow key={order._id || order.id}>
                              <TableCell>#{order._id || order.id}</TableCell>
                              <TableCell>{order.address ? order.address.name : 'N/A'}</TableCell>
                              <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                              <TableCell>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium
                                  ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' : ''}
                                  ${order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' : ''}
                                  ${order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' : ''}
                                  ${order.status === 'Pending' ? 'bg-gray-100 text-gray-800' : ''}
                                  ${order.status === 'Cancelled' ? 'bg-red-100 text-red-800' : ''}
                                `}>
                                  {order.status}
                                </span>
                              </TableCell>
                              <TableCell>₹{order.total.toFixed(2)}</TableCell>
                            </TableRow>
                          ))}
                          {orders.length === 0 && (
                            <TableRow>
                              <TableCell colSpan={5} className="text-center py-4 text-gray-500">No orders yet</TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                  
                  <div className="bg-white p-6 rounded-lg shadow-md">
                    <h3 className="text-lg font-semibold mb-4">Product Categories</h3>
                    <div className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={categoryData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          >
                            {categoryData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                  <h3 className="text-lg font-semibold mb-4">Monthly Sales</h3>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        width={500}
                        height={300}
                        data={salesData}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="sales" fill="#1E88E5" name="Sales (₹)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}

            {/* Analytics */}
            {activeTab === 'analytics' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Sales Analytics</h2>
                
                <div className="grid grid-cols-1 gap-6">
                  <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                    <h3 className="text-lg font-semibold mb-4">Monthly Sales Trend</h3>
                    <div className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          width={500}
                          height={300}
                          data={salesData}
                          margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line 
                            type="monotone" 
                            dataKey="sales" 
                            stroke="#1E88E5" 
                            activeDot={{ r: 8 }} 
                            name="Sales (₹)"
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  
                  <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                    <h3 className="text-lg font-semibold mb-4">Sales by Category</h3>
                    <div className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={salesByCategoryData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          >
                            {salesByCategoryData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Users */}
            {activeTab === 'users' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Users Management</h2>
                
                <div className="bg-blue-50 p-4 rounded-lg mb-6 border border-blue-200">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <User className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-blue-900">Total Registered Users</h3>
                      <p className="text-3xl font-bold text-blue-700">{totalUsers}</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white dark:bg-gray-900 rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-center mb-6">
                    <div className="relative w-64">
                      <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <Input
                        type="text"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Total Orders</TableHead> {/* Updated column header */}
                          <TableHead>Date Joined</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {users && users.length > 0 ? (
                          getFilteredData(users).map((user, index) => {
                            // Count orders for this user
                            const userOrders = orders.filter(order => 
                              order.userId === user.id || 
                              (order.address && order.address.email === user.email)
                            ).length;
                            
                            return (
                              <TableRow key={user.id || index}>
                                <TableCell className="font-medium">{user.id || index + 1}</TableCell>
                                <TableCell>{user.name}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{userOrders}</TableCell> {/* Correctly display total orders */}
                                <TableCell>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</TableCell>
                              </TableRow>
                            );
                          })
                        ) : (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center py-8 text-gray-500">No users found</TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>

                {/* New Top Customers Section */}
                <div className="bg-white rounded-lg shadow-md p-6 mt-8">
                  <h3 className="text-lg font-semibold mb-4">Top Customers</h3>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Total Orders</TableHead>
                          <TableHead>Total Spent</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {topCustomers.map((customer) => (
                          <TableRow key={customer.id}>
                            <TableCell>{customer.name}</TableCell>
                            <TableCell>{customer.email}</TableCell>
                            <TableCell>{customer.totalOrders}</TableCell>
                            <TableCell>₹{customer.totalSpent.toFixed(2)}</TableCell>
                          </TableRow>
                        ))}
                        {topCustomers.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={4} className="text-center py-8 text-gray-500">No top customers found</TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>
            )}
            
            {/* Orders */}
            {activeTab === 'orders' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Orders Management</h2>
                
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-center mb-6">
                    <div className="relative w-64">
                      <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <Input
                        type="text"
                        placeholder="Search orders..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                    <Button onClick={fetchOrders} disabled={isLoading}>
                      {isLoading ? "Loading..." : "Refresh Orders"}
                    </Button>
                  </div>
                  
                  {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6">
                      {error}
                    </div>
                  )}
                  
                  <div className="overflow-x-auto">
                    {isLoading ? (
                      <div className="text-center py-8">Loading orders...</div>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Order ID</TableHead>
                            <TableHead>Customer</TableHead>
                            <TableHead>Orders Count</TableHead> {/* New column */}
                            <TableHead>Date</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Total</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {getFilteredData(orders).map((order) => (
                            <TableRow key={order._id || order.id}>
                              <TableCell>#{order._id || order.id}</TableCell>
                              <TableCell>{order.address ? order.address.name : 'N/A'}</TableCell>
                              <TableCell>
                                {userOrderCounts[order.userId] || 0} {/* Display order count */}
                              </TableCell>
                              <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                              <TableCell>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium
                                  ${order.status === 'Delivered' ? 'bg-green-100 text-green-800' : ''}
                                  ${order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' : ''}
                                  ${order.status === 'Processing' ? 'bg-yellow-100 text-yellow-800' : ''}
                                  ${order.status === 'Pending' ? 'bg-gray-100 text-gray-800' : ''}
                                  ${order.status === 'Cancelled' ? 'bg-red-100 text-red-800' : ''}
                                `}>
                                  {order.status}
                                </span>
                              </TableCell>
                              <TableCell>
                                {formatPrice(order.total)}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Button variant="outline" size="sm" onClick={() => openStatusDialog(order)}>
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button variant="outline" size="sm" onClick={() => downloadOrderPDF(order._id || order.id)}>
                                    <FileText className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                          {orders.length === 0 && (
                            <TableRow>
                              <TableCell colSpan={7} className="text-center py-8 text-gray-500">No orders found</TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            {/* Products */}
            {activeTab === 'products' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Products Management</h2>
                
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-center mb-6">
                    <div className="relative w-64">
                      <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                      <Input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                    <Button onClick={() => {
                      setEditingProduct(null);
                      setNewProduct({
                        name: '',
                        price: '',
                        category: '',
                        description: '',
                        image: '',
                        brand: 'SR Electricals',
                        countInStock: 10
                      });
                      setIsAddProductDialogOpen(true);
                    }}>
                      <PlusCircle className="h-4 w-4 mr-2" />
                      Add Product
                    </Button>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>ID</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Price</TableHead>
                          <TableHead>Stock</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {products.filter(product => 
                          !searchTerm || 
                          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.category.toLowerCase().includes(searchTerm.toLowerCase())
                        ).map((product) => (
                          <TableRow key={product._id || product.id}>
                            <TableCell>{product._id || product.id}</TableCell>
                            <TableCell>{product.name}</TableCell>
                            <TableCell className="capitalize">{product.category}</TableCell>
                            <TableCell>{formatPrice(product.price)}</TableCell>
                            <TableCell>{product.countInStock || 'N/A'}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Button variant="outline" size="sm" onClick={() => handleEditProduct(product)}>
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="outline" size="sm" className="text-red-500" onClick={() => confirmDeleteProduct(product)}>
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                        {products.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-8 text-gray-500">No products found</TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>
            )}
            
            {/* Settings */}
            {activeTab === 'settings' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Store Settings</h2>
                
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-medium mb-6">General Settings</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div>
                      <Label htmlFor="storeName">Store Name</Label>
                      <Input
                        id="storeName"
                        name="storeName"
                        value={settings.storeName}
                        onChange={handleSettingChange}
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="storeEmail">Store Email</Label>
                      <Input
                        id="storeEmail"
                        name="storeEmail"
                        type="email"
                        value={settings.storeEmail}
                        onChange={handleSettingChange}
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="storePhone">Store Phone</Label>
                      <Input
                        id="storePhone"
                        name="storePhone"
                        value={settings.storePhone}
                        onChange={handleSettingChange}
                        className="mt-1"
                      />
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-medium mb-6">Payment Settings</h3>
                  
                  <div className="space-y-4 mb-8">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="enableCod"
                        name="enableCod"
                        checked={settings.enableCod}
                        onChange={handleSettingChange}
                        className="h-4 w-4"
                      />
                      <Label htmlFor="enableCod">Enable Cash on Delivery</Label>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="enableRazorpay"
                        name="enableRazorpay"
                        checked={settings.enableRazorpay}
                        onChange={handleSettingChange}
                        className="h-4 w-4"
                      />
                      <Label htmlFor="enableRazorpay">Enable Razorpay</Label>
                    </div>
                    
                   
                    
                    <div className="mt-4">
                      <Label htmlFor="razorpayKey">Razorpay API Key</Label>
                      <Input
                        id="razorpayKey"
                        name="razorpayKey"
                        value={settings.razorpayKey}
                        onChange={handleSettingChange}
                        disabled={!settings.enableRazorpay}
                        className="mt-1"
                      />
                    </div>
                  </div>
                  
                  <Button
                    onClick={handleSaveSettings}
                    disabled={adminOperationInProgress}
                  >
                    Save Settings
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Add/Edit Product Dialog */}
      <Dialog open={isAddProductDialogOpen} onOpenChange={setIsAddProductDialogOpen}>
        <DialogContent className="sm:max-w-[500px] rounded-2xl shadow-2xl border border-blue-200 bg-gradient-to-br from-white via-blue-50 to-white">
          <DialogHeader>
            <DialogTitle className="text-srblue">{editingProduct ? 'Edit Product' : 'Add New Product'}</DialogTitle>
            <DialogDescription>
              {editingProduct 
                ? 'Update the product information below.'
                : 'Fill in the product details to add a new product.'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div>
              <Label htmlFor="name">Product Name</Label>
              <Input 
                id="name" 
                name="name"
                value={newProduct.name}
                onChange={handleProductChange}
                placeholder="Enter product name"
              />
            </div>
            
            <div>
              <Label htmlFor="category">Category</Label>
              <Input 
                id="category" 
                name="category"
                value={newProduct.category}
                onChange={handleProductChange}
                placeholder="Enter category"
              />
            </div>
            
            <div>
              <Label htmlFor="brand">Brand</Label>
              <Input 
                id="brand" 
                name="brand"
                value={newProduct.brand}
                onChange={handleProductChange}
                placeholder="Enter brand name"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">Price (₹)</Label>
                <Input 
                  id="price" 
                  name="price"
                  type="number"
                  value={newProduct.price}
                  onChange={handleProductChange}
                  placeholder="Enter price"
                />
              </div>
              <div>
                <Label htmlFor="countInStock">Stock Quantity</Label>
                <Input 
                  id="countInStock" 
                  name="countInStock"
                  type="number"
                  value={newProduct.countInStock}
                  onChange={handleProductChange}
                  placeholder="Enter stock"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="image">Image URL</Label>
              <Input 
                id="image" 
                name="image"
                value={newProduct.image}
                onChange={handleProductChange}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea 
                id="description" 
                name="description"
                value={newProduct.description}
                onChange={handleProductChange}
                placeholder="Enter product description"
                className="min-h-[100px]"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              className="rounded-lg border-blue-300 hover:bg-blue-50"
              onClick={() => setIsAddProductDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="rounded-lg bg-gradient-to-r from-blue-500 to-blue-700 text-white hover:from-blue-600 hover:to-blue-800"
              onClick={handleSaveProduct}
              disabled={adminOperationInProgress}
            >
              {editingProduct ? 'Update Product' : 'Add Product'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-2xl shadow-2xl border border-red-200 bg-gradient-to-br from-white via-red-50 to-white">
          <DialogHeader>
            <DialogTitle className="text-red-600">Delete Product</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this product? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            {productToDelete && (
              <p className="font-medium text-red-700">{productToDelete.name}</p>
            )}
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              className="rounded-lg border-red-300 hover:bg-red-50"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              className="rounded-lg bg-gradient-to-r from-red-500 to-red-700 text-white hover:from-red-600 hover:to-red-800"
              onClick={handleDeleteProduct}
              disabled={adminOperationInProgress}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Order Status Update Dialog */}
      <Dialog open={isStatusDialogOpen} onOpenChange={setIsStatusDialogOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-2xl shadow-2xl border border-blue-200 bg-gradient-to-br from-white via-blue-50 to-white">
          <DialogHeader>
            <DialogTitle className="text-blue-700">Update Order Status</DialogTitle>
            <DialogDescription>
              Change the status of order #{statusOrder?._id || statusOrder?.id}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
            <div>
              <Label htmlFor="orderStatus">Status</Label>
              <select
                id="orderStatus"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Pending">Pending</option>
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              className="rounded-lg border-blue-300 hover:bg-blue-50"
              onClick={() => setIsStatusDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="rounded-lg bg-gradient-to-r from-blue-500 to-blue-700 text-white hover:from-blue-600 hover:to-blue-800"
              onClick={updateOrderStatus}
              disabled={adminOperationInProgress}
            >
              Update Status
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin;